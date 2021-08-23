import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import { map } from 'rxjs/operators';

export enum GameStatus {
  DISCONNECTED,
  ACTIVE,
  LOSER,
  WINNER,
}

@Injectable({
  providedIn: 'any',
})
export class TerrainService {
  private terrain$?: Observable<string[]>;
  private status$ = new ReplaySubject<GameStatus>(1);
  constructor(private readonly websocketService: WebsocketService) {}
  subscribe(playerName: string): void {
    if (!this.terrain$)
      this.terrain$ = this.websocketService
        .on<{ terrain: string[]; status: GameStatus }>(playerName)
        .pipe(
          map((data) => {
            this.status$.next(data.status);
            return data.terrain;
          })
        );
  }
  terrain(): Observable<string[]> {
    if (!this.terrain$) {
      throw new Error('terrain$ is not initialize!');
    }
    return this.terrain$;
  }
  status(): Observable<GameStatus> {
    return this.status$.asObservable();
  }
}
