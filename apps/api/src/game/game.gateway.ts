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
import { Server } from 'ws';
import { RegisterGameDto } from './dto/register-game.dto';
import { WsMessage } from './dto/message.dto';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from './guards/role.guard';
import { LeaderboardsDto } from './dto/leaderboards.dto';
import { Observable } from 'rxjs';
import { ValidateDto, ValidateResponseDto } from './dto/validate.dto';
import { ProfileDto } from './dto/profile.dto';
import { ErrorDto } from './dto/error.dto';

@WebSocketGateway({ path: '/ws/' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: WebSocket) {
    client.send(JSON.stringify(this.gameService.gameSetup()));
  }
  @SubscribeMessage('game.register.validate')
  gameRegisterValidate(
    @MessageBody() validateDto: ValidateDto
  ): WsMessage<ValidateResponseDto> {
    return {
      event: 'game.register.validate',
      data: this.gameService.validate(validateDto),
    };
  }
  @SubscribeMessage('game.register')
  registerGame(
    @MessageBody() registerGameDto: RegisterGameDto,
    @ConnectedSocket() client: WebSocket
  ): WsMessage<ProfileDto | ErrorDto> {
    return this.gameService.registerGame(registerGameDto, client);
  }
  @UseGuards(RoleGuard)
  @SubscribeMessage('game.start')
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
  @SubscribeMessage('leaderboards')
  leaderboards(): Observable<WsMessage<LeaderboardsDto[]>> {
    return this.gameService.leaderboards();
  }
  handleDisconnect(client: WebSocket): void {
    this.gameService.disconnect(client);
  }
}
