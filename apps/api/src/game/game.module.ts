import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntity } from './entities/score.entity';
import { LeaderboardsRepositoryService } from './leaderboards-repository/leaderboards-repository.service';
import { RegistrationController } from './registration/registration.controller';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreEntity])],
  providers: [
    GameGateway,
    GameService,
    RoomRepositoryService,
    PlayerRepositoryService,
    LeaderboardsRepositoryService,
    Repository,
  ],
  controllers: [RegistrationController],
})
export class GameModule {}
