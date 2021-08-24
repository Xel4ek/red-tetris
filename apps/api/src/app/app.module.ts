import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    GameModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'dist/apps/client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
