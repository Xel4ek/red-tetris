import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';
import { LeaderboardsRepositoryService } from './leaderboards-repository/leaderboards-repository.service';
import { RegistrationController } from './registration/registration.controller';

@Module({
  providers: [
    GameGateway,
    GameService,
    RoomRepositoryService,
    PlayerRepositoryService,
    LeaderboardsRepositoryService,
  ],
  controllers: [RegistrationController],
})
export class GameModule {}
