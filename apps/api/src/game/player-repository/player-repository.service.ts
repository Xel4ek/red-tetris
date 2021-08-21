import { Injectable } from '@nestjs/common';

import { GameStatus, PlayerDto } from '../dto/player.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Terrain } from '../terrain/terrain';

@Injectable()
export class PlayerRepositoryService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  private store: PlayerDto[] = [];
  findByName(name: string): PlayerDto | undefined {
    return this.store.find((player) => player.name === name);
  }
  findByRoom(room: string) {
    return this.store.filter((player) => player.room === room);
  }
  findByTerrain(terrain: Terrain) {
    return this.store.find((pl) => pl._terrain === terrain);
  }
  findByChannel(channel: WebSocket): PlayerDto | undefined {
    return this.store.find((player) =>
      player.channels.find((c) => c === channel)
    );
  }
  push(player: PlayerDto): void {
    this.store.push(player);
  }
  removeByChannel(channel: WebSocket) {
    const player = this.findByChannel(channel);
    if (player) {
      const channels = player.channels.filter((c) => c !== channel);
      if (channels.length) {
        player.channels = channels;
      } else {
        this.store = this.store.filter((p) => p !== player);
      }
    }
  }
  @OnEvent('terrain.overflow')
  terrainOverflow(terrain: Terrain) {
    const player = this.findByTerrain(terrain);
    const players = this.findByRoom(player.room);
    let otherPlayers = 0;
    let winner: PlayerDto;
    players.map((pl) => {
      if (pl !== player && pl.status === GameStatus.ACTIVE) {
        ++otherPlayers;
        winner = pl;
      }
    });
    if (otherPlayers <= 1) {
      winner = winner ?? player;
      winner.winner();
      this.eventEmitter.emit('game.stop', winner.room);
    }
    player.loser();
  }
  @OnEvent('pieceSerial.update', { async: true })
  pieceSerialUpdate(terrain: Terrain, lastThree: []) {
    const player = this.findByTerrain(terrain);
    player.send(
      JSON.stringify({
        event: 'pieceSerial.update',
        data: { terrain: lastThree },
      })
    );
  }
}
