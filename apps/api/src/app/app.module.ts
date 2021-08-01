import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { GameModule } from '../game/game.module';
import { AuthModule } from '../auth/auth.module';
import { SunboxModule } from '../sunbox/sunbox.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GameModule,
    AuthModule,
    SunboxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
