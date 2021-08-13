import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Server } from 'ws';
import { RegisterGameDto } from './dto/register-game.dto';
import { WsMessage } from './dto/message.dto';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly destroy$ = new Subject<void>();
  constructor(private readonly gameService: GameService) {}

  // @SubscribeMessage('startGame')
  // startGame() {
  //   this.gameService.startGame();
  // }

  @SubscribeMessage('stopGame')
  stopGame() {
    this.gameService.stopGame();
  }

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
  @SubscribeMessage('playerTerrain')
  playerTerrain(): Observable<WsResponse> {
    return this.gameService
      .terrain()
      .pipe(map((data) => ({ event: 'playerTerrain', data })));
  }
  @SubscribeMessage('startGame')
  startGame(
    @MessageBody() { player }: { player: string },
    @ConnectedSocket() client: WebSocket
  ) {
    this.gameService.startGame(client, player);
  }
  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @SubscribeMessage('findAllGame')
  findAll() {
    console.log(this.server.constructor.name);
    return timer(0, 2000).pipe(
      map(() => ({ event: 'playerTerrain', data: this.gameService.spam() }))
    );
    // return this.gameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gameService.remove(id);
  }

  handleDisconnect(client: WebSocket): void {
    this.gameService.disconnect(client);
  }
}
