import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from "./users.service";
import { UserEntity } from "./user.entity";

@Controller('user')
export class UserController {
  constructor (private readonly usersService: UsersService) {
  }

  @Get(':username')
  async create (@Param('username') username: string) {
    const user = new UserEntity();
    user.username = username;
    this.usersService.create(user).then(_ => console.log('user created:' + _.username));
  }
}
