import { Component, OnDestroy } from '@angular/core';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';
import {
  GameControlService,
  GameSettings,
} from '../../core/services/game-control/game-control.service';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, NEVER, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Profile } from '../../core/interfaces/profile';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'red-tetris-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class MainComponent implements OnDestroy {
  error: Observable<boolean>;
  destroy$ = new Subject<void>();
  profile$: Observable<Profile>;
  playerList$: Observable<string[]>;
  settings$: Observable<GameSettings>;

  constructor(
    private readonly title: Title,
    private readonly location: Location,
    private readonly gameControlService: GameControlService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {
    this.settings$ = gameControlService.settings();
    this.error = activatedRoute.fragment.pipe(
      map((fr) => {
        if (fr === null || !fr.endsWith(']')) {
          this.title.setTitle('Red Tetris: Error');
          return true;
        }
        const [room, player] = fr
          .split(/\[|]|%5B|%5D/)
          .map((name) => name.replace('%20', ' ').trim());
        if (player?.length && room?.length) {
          gameControlService.register(room, player);
          this.title.setTitle('Red Tetris: ' + room);
          return false;
        } else {
          this.title.setTitle('Red Tetris: Error');
          return true;
        }
      })
    );
    this.profile$ = profileService.profile();
    this.profile$
      .pipe(
        switchMap(({ inGame }) =>
          inGame ? fromEvent<KeyboardEvent>(document, 'keydown') : NEVER
        ),
        tap(({ code }) => this.handleKeyboardEvent(code))
      )
      .subscribe();
    this.playerList$ = this.profile$.pipe(
      switchMap(({ name }) =>
        this.gameControlService
          .playersList()
          .pipe(map((data) => data.filter((p) => p !== name)))
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleKeyboardEvent(code: string) {
    if (code === 'KeyW') {
      this.gameControlService.rotate('l');
    }
    if (code === 'KeyA') this.gameControlService.move('l');
    if (code === 'KeyD') this.gameControlService.move('r');
    if (code === 'KeyS') this.gameControlService.move('d');
  }
}
