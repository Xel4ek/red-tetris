import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from '../game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [GameModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
