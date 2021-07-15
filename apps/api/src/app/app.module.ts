import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
