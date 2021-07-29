import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor (private usersService: UsersService) {
  }

  async validateUser (username: string): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = username;
    return await this.usersService.create(user);
  }
}
