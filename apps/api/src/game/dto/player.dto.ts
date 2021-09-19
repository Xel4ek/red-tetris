import { EventEmitter2 } from '@nestjs/event-emitter';
import { Terrain } from '../terrain/terrain';
import { PieceGenerator } from '../../terrain/piece';
import { Repository } from 'typeorm';
import { ScoreEntity } from '../entities/score.entity';

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
  scoreSingle: number;
  scoreMulti: number;

  constructor(
    room,
    name,
    role,
    channel,
    private readonly eventEmitter: EventEmitter2,
    private readonly repository: Repository<ScoreEntity>
  ) {
    this.name = name;
    this.channels = [channel];
    this.room = room;
    this.role = role;
  }

  async loadFromDB() {
    await this.repository.findOne(this.name).then((data) => {
      this.scoreMulti = Number(data?.scoreMulti ?? 0);
      this.scoreSingle = Number(data?.scoreSingle ?? 0);
    });
  }
  _terrain: Terrain;

  get terrain(): string[] {
    return this._terrain.merge();
  }

  gameStop(): void {
    console.log('game stop ', this);
  }

  gameStart(pieceGenerator: PieceGenerator): void {
    this.status = GameStatus.ACTIVE;
    this._terrain = new Terrain(this.eventEmitter, pieceGenerator);
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
