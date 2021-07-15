import { Component } from '@angular/core';
import { WebsocketService } from '../../core/services/websocket/websocket.service';

@Component({
  selector: 'red-tetris-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private readonly ws: WebsocketService) {
    ws.on('playerTerrain').subscribe(console.log);
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
