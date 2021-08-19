import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';

@Module({
  providers: [
    GameGateway,
    GameService,
    RoomRepositoryService,
    PlayerRepositoryService,
  ],
})
export class GameModule {}
