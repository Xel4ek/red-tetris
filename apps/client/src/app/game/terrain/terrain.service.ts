import { Inject, Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { TERRAIN_SOURCE } from './token/terrain.token';
import { WebsocketService } from '../../core/services/websocket/websocket.service';

@Injectable({
  providedIn: 'any',
})
export class TerrainService {
  private readonly terrain$: Observable<string[]>;
  constructor(
    @Inject(TERRAIN_SOURCE) private readonly source: string,
    private readonly websocketService: WebsocketService
  ) {
    console.log(source);
    this.terrain$ = websocketService.on<string[]>(source);
  }
  terrain(): Observable<string[]> {
    return this.terrain$;
  }
}
