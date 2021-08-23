import { Component, HostListener, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
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
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Profile } from '../../core/interfaces/profile';

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
    private readonly location: Location,
    private readonly gameControlService: GameControlService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {
    this.settings$ = gameControlService.settings();
    this.playerList$ = this.gameControlService.playersList();
    this.error = activatedRoute.fragment.pipe(
      map((fr) => {
        if (fr === null || !fr.endsWith(']')) {
          return true;
        }
        const [room, player] = fr
          .split(/\[|]|%5B|%5D/)
          .map((name) => name.replace('%20', ' ').trim());
        if (player?.length && room?.length) {
          gameControlService.register(room, player);
          return false;
        } else {
          return true;
        }
      })
    );
    this.profile$ = profileService.profile();
    this.profile$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ inGame }) =>
          inGame ? fromEvent<KeyboardEvent>(document, 'keydown') : NEVER
        ),
        tap(({ code }) => this.handleKeyboardEvent(code))
      )
      .subscribe();
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
