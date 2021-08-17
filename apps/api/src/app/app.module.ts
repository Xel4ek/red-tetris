import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from '../game/game.module';
import { SunboxModule } from '../sunbox/sunbox.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    GameModule,
    SunboxModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
