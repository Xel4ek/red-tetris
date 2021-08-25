import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Terrain } from '../terrain/terrain';
import { PieceGenerator } from '../../terrain/piece';
import { InjectRepository } from "@nestjs/typeorm";
import { ScoreEntity } from "../entities/score.entity";
import { Repository } from "typeorm";

export enum Role {
  ANTONYMOUS,
  SPECTRAL,
  PLAYER,
  ADMIN,
}
export enum GameStatus {
  DISCONNECTED,
  ACTIVE,
  LOSER,
  WINNER,
}
export class PlayerDto {
  name: string;
  channels: WebSocket[];
  room: string;
  role: Role;
  status: GameStatus;
  get terrain(): string[] {
    return this._terrain.merge();
  }
  _terrain: Terrain;
  constructor(
    room,
    name,
    role,
    channel,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(ScoreEntity) private scoreRepository: Repository<ScoreEntity>
  ) {
    this.name = name;
    this.channels = [channel];
    this.room = room;
    this.role = role;
  }
  gameStop(): void {
    console.log('game stop ', this.name);
  }
  gameStart(pieceGenerator: PieceGenerator): void {
    this.status = GameStatus.ACTIVE;
    this._terrain = new Terrain(this.eventEmitter, pieceGenerator, this.room, this.name, this.scoreRepository);
    this._terrain.start();

    // console.log(this.eventEmitter);
    // console.log('game start ', this.name);
  }
  winner() {
    this.status = GameStatus.WINNER;
    this._terrain.stop();
  }
  loser() {
    this.status = GameStatus.LOSER;
    this._terrain.stop();
  }
  send(data: string) {
    this.channels.map((c) => c.send(data));
  }
}
