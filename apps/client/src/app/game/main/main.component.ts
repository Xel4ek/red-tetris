import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import {
  HashLocationStrategy,
  LocationStrategy,
  Location,
} from '@angular/common';
import { GameControlService } from '../../core/services/game-control/game-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  constructor(
    private readonly ws: WebsocketService,
    private readonly location: Location,
    private readonly gameControlService: GameControlService,
    private readonly activatedRoute: ActivatedRoute
  ) {
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
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
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
}
