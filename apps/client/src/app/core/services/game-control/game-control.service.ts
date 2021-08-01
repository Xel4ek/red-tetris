import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class GameControlService {
  constructor(private readonly ws: WebsocketService) {}
  register(room: string, player: string): void {
    console.log('registered ', { room, player });
    this.ws.send('registerGame', { room, player });
  }
}
