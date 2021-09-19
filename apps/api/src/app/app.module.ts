import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScoreEntity } from '../game/entities/score.entity';

const getOptions = (): TypeOrmModuleOptions => {
  const connectionOptions: Partial<TypeOrmModuleOptions> = {
    type: 'postgres',
    logging: false,
    synchronize: false,
    entities: [ScoreEntity],
  };
  if (process.env.DATABASE_URL) {
    return {
      ...connectionOptions,
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        ssl: true,
      },
    };
  } else {
    return {
      ...connectionOptions,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
    };
  }
};

@Module({
  imports: [
    GameModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'dist/apps/client'),
    }),
    TypeOrmModule.forRoot(getOptions()),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
