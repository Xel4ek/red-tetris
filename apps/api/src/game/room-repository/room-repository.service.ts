import { Injectable } from '@nestjs/common';
import { RoomDto } from '../dto/room.dto';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GameStatus, Role } from '../dto/player.dto';
import { Terrain } from '../terrain/terrain';

@Injectable()
export class RoomRepositoryService {
  private store: RoomDto[] = [];
  constructor(
    private readonly playerRepository: PlayerRepositoryService,
    private readonly eventEmitter: EventEmitter2
  ) {}
  findByName(name: string): RoomDto | undefined {
    return this.store.find((room) => room.name === name);
  }

  push(room: RoomDto): void {
    this.store.push(room);
  }
  profileMulticast(room: RoomDto) {
    this.playerRepository.findByRoom(room.name).map((player) =>
      player.channels.map((c) =>
        c.send(
          JSON.stringify({
            event: 'profile',
            data: {
              name: player.name,
              role: player.role,
              inGame: room.inGame,
              room: room.name,
            },
          })
        )
      )
    );
  }
  multicast(roomName: string, data: string) {
    this.playerRepository
      .findByRoom(roomName)
      .map((player) => player.channels.map((c) => c.send(data)));
  }

  gameStart(roomName: string) {
    const room = this.getByName(roomName);
    room.inGame = true;
    this.profileMulticast(room);
    const players = this.playerRepository.findByRoom(roomName);
    players.map((pl) => pl.gameStart());
  }
  @OnEvent('game.stop')
  gameStop(roomName: string) {
    const room = this.getByName(roomName);
    room.inGame = false;
    this.profileMulticast(room);
    console.log('Game stopped at ', room);
  }
  getByName(roomName: string) {
    return this.store.find((room) => room.name === roomName);
  }
  @OnEvent('terrain.update')
  terrainUpdate(terrain: Terrain) {
    const player = this.playerRepository.findByTerrain(terrain);
    this.multicast(
      player.room,
      JSON.stringify({
        event: 'terrain.' + player.name,
        data: {
          terrain: player.terrain,
        },
      })
    );
  }
  disconnect(channel: WebSocket) {
    const player = this.playerRepository.findByChannel(channel);
    const room = this.findByName(player.room);
    if (room.inGame) {
      player.status = GameStatus.DISCONNECTED;
    } else {
      this.playerRepository.removeByChannel(channel);
    }
    const players = this.playerRepository.findByRoom(room.name);
    if (players.length) {
      players[0].role = Role.ADMIN;
      this.profileMulticast(room);
    } else {
      this.store = this.store.filter((r) => r !== room);
    }
  }
}
