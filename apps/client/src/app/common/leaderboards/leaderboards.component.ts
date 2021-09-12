import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket/websocket.service';

export interface Leaderboards {
  name: string;
  pvp: number;
  score: number;
}

@Component({
  selector: 'red-tetris-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
})
export class LeaderboardsComponent {
  leaderboards$: Observable<Leaderboards[]>;
  constructor(private readonly ws: WebsocketService) {
    this.leaderboards$ = ws.on<Leaderboards[]>('leaderboards');
    ws.send('leaderboards');
  }
}
