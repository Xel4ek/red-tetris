import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket/websocket.service';

@Injectable({
  providedIn: 'any',
})
export class TerrainService {
  private terrain$?: Observable<string[]>;
  constructor(private readonly websocketService: WebsocketService) {
    // console.log(source);
    // this.terrain$ = websocketService.on<string[]>(source);
  }
  subscribe(playerName: string): void {
    if (!this.terrain$)
      this.terrain$ = this.websocketService.on<string[]>(playerName);
  }
  terrain(): Observable<string[]> {
    if (!this.terrain$) {
      throw new Error('terrain$ is not initialize!');
    }
    return this.terrain$;
  }
}
