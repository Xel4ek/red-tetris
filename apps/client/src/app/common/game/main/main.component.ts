import { Component, OnDestroy } from '@angular/core';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, NEVER, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DomSanitizer, Title } from '@angular/platform-browser';
import {
  GameControlService,
  GameSettings,
} from '../../../core/services/game-control/game-control.service';
import { Profile } from '../../../core/interfaces/profile';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { MatIconRegistry } from '@angular/material/icon';

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
  destroy$ = new Subject<void>();
  profile$: Observable<Profile>;
  playerList$: Observable<string[]>;
  settings$: Observable<GameSettings>;
  constructor(
    private readonly title: Title,
    private readonly location: Location,
    private readonly gameControlService: GameControlService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `swords`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/swords-sword-svgrepo-com.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      `single`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/ac756a3c-d97e-465a-93f1-e6bd126a3acf.svg'
      )
    );
    this.settings$ = gameControlService.settings();
    activatedRoute.fragment
      .pipe(
        takeUntil(this.destroy$),
        map((fr) => {
          if (fr === null || !fr.endsWith(']')) {
            this.title.setTitle('Red Tetris: Error');
            return true;
          }
          const index = fr.search(/\[|%5B/);
          if (index <= 0) return true;
          const lobby = fr.slice(0, index);
          const name = fr.slice(index + 1, -1);
          if (name?.length && lobby?.length) {
            gameControlService.register(lobby, name);
            this.title.setTitle('Red Tetris: ' + lobby);
            return false;
          } else {
            this.title.setTitle('Red Tetris: Error');
            return true;
          }
        }),
        tap((result) => {
          if (result) this.router.navigate(['/welcome']);
        })
      )
      .subscribe();
    this.profile$ = profileService.profile();
    this.profile$
      .pipe(
        switchMap(({ inGame }) =>
          inGame ? fromEvent<KeyboardEvent>(document, 'keydown') : NEVER
        ),
        takeUntil(this.destroy$),
        tap((event) => {
          event.preventDefault();
          this.handleKeyboardEvent(event.code);
        })
      )
      .subscribe();
    this.playerList$ = this.profile$.pipe(
      switchMap(({ name }) =>
        this.gameControlService
          .playersList()
          .pipe(
            map((data) => data.map((pl) => pl.name).filter((p) => p !== name))
          )
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleKeyboardEvent(code: string) {
    if (code === 'KeyW') {
      this.gameControlService.rotate('l');
    }
    if (code === 'KeyA') this.gameControlService.move('l');
    if (code === 'KeyD') this.gameControlService.move('r');
    if (code === 'KeyS') this.gameControlService.move('d');
    if (code === 'Space') this.gameControlService.drop();
  }
}
