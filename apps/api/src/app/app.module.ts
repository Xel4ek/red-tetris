import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreEntity } from '../game/entities/score.entity';

@Module({
  imports: [
    GameModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'dist/apps/client'),
    }),
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env["TYPEORM_HOST"],
        port: Number(process.env["TYPEORM_PORT"]),
        username: process.env["TYPEORM_USERNAME"],
        password: process.env["TYPEORM_PASSWORD"],
        database: process.env["TYPEORM_DATABASE"],
        entities: [ScoreEntity],
        synchronize: true,
        autoLoadEntities: true,
      }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
