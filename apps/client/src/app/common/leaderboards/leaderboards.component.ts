import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import { map } from 'rxjs/operators';

export interface Leaderboards {
  name: string;
  pvp: number;
  score: number;
  position: number;
}

@Component({
  selector: 'red-tetris-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
})
export class LeaderboardsComponent {
  leaderboards$: Observable<Leaderboards[]>;
  constructor(private readonly ws: WebsocketService) {
    this.leaderboards$ = ws
      .on<Omit<Leaderboards, 'position'>[]>('leaderboards')
      .pipe(
        map((data) => {
          return data.map((el, index) => ({ position: index + 1, ...el }));
        })
      );
    ws.send('leaderboards');
  }
}
