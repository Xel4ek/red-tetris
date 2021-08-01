import { Injectable, Inject } from '@nestjs/common';
import { DeleteResult, Repository } from "typeorm";
import { UserEntity } from './user.entity';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
  }

  async findOne (entityLike: UserEntity): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(entityLike);
  }

  async findAll (): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create (entityLike: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(entityLike);
  }

  async remove (id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
