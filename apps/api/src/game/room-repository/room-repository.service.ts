import { Injectable } from '@nestjs/common';
import { RoomDto } from '../dto/room.dto';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Role } from '../../player/player';
import { Terrain } from '../terrain/terrain';
import { PieceGenerator } from '../../terrain/piece';

@Injectable()
export class RoomRepositoryService {
  private store: RoomDto[] = [];

  constructor(private readonly playerRepository: PlayerRepositoryService) {}

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
      .map((player) => player.send(data));
  }

  gameStart(roomName: string) {
    const room = this.getByName(roomName);
    room.inGame = true;
    this.profileMulticast(room);
    const players = this.playerRepository.findByRoom(roomName);
    const pieceGenerator = new PieceGenerator();
    players.map((pl) => pl.gameStart(pieceGenerator));
  }

  @OnEvent('game.stop')
  gameStop(roomName: string) {
    const room = this.getByName(roomName);
    room.inGame = false;
    this.playerRepository.findByRoom(room.name).map((pl) => {
      if (pl.role !== Role.ADMIN) {
        pl.role = Role.PLAYER;
      }
    });
    this.profileMulticast(room);
    // console.log('Game stopped at ', room);
  }

  getByName(roomName: string) {
    return this.store.find((room) => room.name === roomName);
  }

  @OnEvent('terrain.update')
  terrainUpdate(terrain: Terrain) {
    const player = this.playerRepository.findByTerrain(terrain);
    if (player) {
      this.multicast(
        player.room,
        JSON.stringify({
          event: 'terrain.' + player.name,
          data: {
            terrain: player.terrain,
            status: player.status,
          },
        })
      );
      player.send(
        JSON.stringify({
          event: 'game.info',
          data: player._terrain.status(),
        })
      );
    }
  }

  disconnect(channel: WebSocket): string {
    const player = this.playerRepository.findByChannel(channel);
    if (!player) return;
    const room = this.findByName(player.room);
    // if (room.inGame) {
    //   player.status = GameStatus.DISCONNECTED;
    // } else {
    this.playerRepository.removeByChannel(channel);
    // }
    const players = this.playerRepository.findByRoom(room.name);
    if (players.length) {
      players[0].role = Role.ADMIN;
    } else {
      this.store = this.store.filter((r) => r !== room);
    }
    this.profileMulticast(room);
    return room.name;
  }

  @OnEvent('terrain.collapseRow')
  collapseRow(terrain: Terrain, miss: number) {
    const player = this.playerRepository.findByTerrain(terrain);
    this.playerRepository
      .findByRoom(player.room)
      .filter((pl) => pl.role >= Role.PLAYER)
      .map((pl) => {
        if (pl !== player) {
          pl._terrain.missRow(miss);
        }
      });
  }
}
