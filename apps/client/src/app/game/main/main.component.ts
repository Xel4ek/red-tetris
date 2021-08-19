import { Component, HostListener, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';
import { GameControlService } from '../../core/services/game-control/game-control.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Role } from '../../core/interfaces/role';
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
  room?: string;
  player?: string;
  error: Observable<boolean>;
  inGame = false;
  destroy$ = new Subject<void>();
  profile$: Observable<Profile>;
  playerList$: Observable<string[]>;
  constructor(
    private readonly ws: WebsocketService,
    private readonly location: Location,
    private readonly gameControlService: GameControlService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {
    this.playerList$ = this.gameControlService.playersList();
    this.error = activatedRoute.fragment.pipe(
      map((fr) => {
        if (fr === null || !fr.endsWith(']')) {
          return true;
        }
        [this.room, this.player] = fr
          .split(/\[|]|%5B|%5D/)
          .map((name) => name.replace('%20', ' ').trim());
        if (this.player?.length && this.room?.length) {
          gameControlService.register(this.room, this.player);
          return false;
        } else {
          return true;
        }
      })
    );
    this.profile$ = profileService.profile().pipe(
      tap((profile) => {
        this.inGame = profile.inGame;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  send(): void {
    this.ws.send('findAllGame');
  }
  start(): void {
    this.ws.send('startGame');
  }
  stop(): void {
    this.ws.send('stopGame');
  }
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.inGame) {
      if (event.code === 'KeyW') {
        this.gameControlService.rotate('l');
      }
      if (event.code === 'KeyA') this.gameControlService.move('l');
      if (event.code === 'KeyD') this.gameControlService.move('r');
      if (event.code === 'KeyS') this.gameControlService.move('d');
    }
  }
}
