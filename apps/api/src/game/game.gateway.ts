import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Server } from 'ws';
import { RegisterGameDto } from './dto/register-game.dto';
import { WsMessage } from './dto/message.dto';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: WebSocket) {
    // console.log(client);
    // this.gameService
    //   .terrain()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     client.send(JSON.stringify({ event: 'playerTerrain', data }));
    //   });
  }
  @SubscribeMessage('registerGame')
  registerGame(
    @MessageBody() registerGameDto: RegisterGameDto,
    @ConnectedSocket() client: WebSocket
  ): WsMessage<{ role: number; inGame: boolean }> {
    return this.gameService.registerGame(registerGameDto, client);
  }
  @SubscribeMessage('startGame')
  startGame(@ConnectedSocket() client: WebSocket) {
    this.gameService.startGame(client);
  }

  @SubscribeMessage('pieceRotate')
  pieceRotate(
    @MessageBody() direction: 'l' | 'r',
    @ConnectedSocket() client: WebSocket
  ) {
    this.gameService.pieceRotate(client, direction);
  }
  @SubscribeMessage('pieceMove')
  pieceMove(
    @MessageBody() direction: 'l' | 'r' | 'd',
    @ConnectedSocket() client: WebSocket
  ) {
    this.gameService.pieceMove(client, direction);
  }
  handleDisconnect(client: WebSocket): void {
    this.gameService.disconnect(client);
  }
}
