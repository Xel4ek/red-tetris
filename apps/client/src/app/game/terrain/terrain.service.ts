import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class TerrainService {
  private terrain$?: Observable<string[]>;
  constructor(private readonly websocketService: WebsocketService) {}
  subscribe(playerName: string): void {
    if (!this.terrain$)
      this.terrain$ = this.websocketService
        .on<{ terrain: string[] }>(playerName)
        .pipe(map(({ terrain }) => terrain));
  }
  terrain(): Observable<string[]> {
    if (!this.terrain$) {
      throw new Error('terrain$ is not initialize!');
    }
    return this.terrain$;
  }
}
