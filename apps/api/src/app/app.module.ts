import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScoreEntity } from "../game/entities/score.entity";

@Module({
  imports: [
    GameModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'dist/apps/client'),
    }),
    TypeOrmModule.forRoot({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "63@w%j?wJQs+?M78",
        database: "red_tetris_db",
        entities: [ScoreEntity],
        synchronize: true,
        autoLoadEntities: true
      }
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
