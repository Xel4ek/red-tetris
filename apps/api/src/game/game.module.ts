import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TerrainService } from '../terrain/terrain.service';

@Module({
  providers: [GameGateway, GameService, TerrainService],
})
export class GameModule {}
