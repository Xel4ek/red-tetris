import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { GameModule } from '../game/game.module';
import { AuthModule } from "../auth/auth.module";
import { Connection, getManager } from "typeorm";
import { UsersModule } from "../users/users.module";
import { UserEntity } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { UserController } from "../users/user.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GameModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {
    const manager = getManager();
    const user = new UserEntity()
    user.username = 'Bob'
    const test = manager.create(UserEntity, user);
    manager.save(user);
    console.log(test)
    const test2 = manager.findOne(UserEntity, 50);
    test2.then(console.log)
  }

}
