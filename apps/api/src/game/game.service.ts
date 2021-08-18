import { Injectable } from '@nestjs/common';
import { RegisterGameDto } from './dto/register-game.dto';
import { GameResult, PlayerDto, Role } from './dto/player.dto';
import { WsMessage } from './dto/message.dto';
import { RoomDto, Terrain } from './dto/room.dto';
import { ProfileDto } from './dto/profile.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
  private roomStore: RoomDto[] = [];
  private playersStore: PlayerDto[] = [];
  constructor(private readonly eventEmitter: EventEmitter2) {}

  startGame(client: WebSocket, player: string) {
    const roomName = this.playersStore.find((p) => p.channel === client).room;
    const enemy = this.playersStore.find(
      (p) => p.name === player && p.room === roomName
    );
    const room = this.roomStore.find((r) => r.name === roomName);
    // TODO move logic in event
    this.eventEmitter.emit('terrain.create', room);
    // error handling
    if (!room.inGame) {
      enemy.role = Role.PLAYER;
      room.inGame = true;
      room._adminTerrain = new Terrain(this.eventEmitter);
      room._otherTerrain = new Terrain(this.eventEmitter);
      room._adminTerrain.start();
      room._otherTerrain.start();
      this.multiCastRoomUpdateProfile(room);
      this.multiCastRoomTerrain(room);
    }
  }

  multiCastRoomUpdateProfile(room: RoomDto): void {
    this.playersStore
      .filter((p) => p.room === room.name)
      .map((pl) =>
        pl.channel.send(
          JSON.stringify({
            event: 'profile',
            data: {
              name: pl.name,
              role: pl.role,
              inGame: room.inGame,
              room: room.name,
            },
          })
        )
      );
  }
  multiCastRoomTerrain(
    room: RoomDto,
    target: 'admin' | 'other' | 'both' = 'both'
  ) {
    this.playersStore
      .filter((pl) => pl.room === room.name)
      .map((pl) => {
        if (target === 'both' || target === 'admin') {
          pl.channel.send(
            JSON.stringify({
              event: 'adminTerrain',
              data: room.adminTerrain,
            })
          );
        }
        if (target === 'both' || target === 'other') {
          pl.channel.send(
            JSON.stringify({
              event: 'otherTerrain',
              data: room.otherTerrain,
            })
          );
        }
      });
  }
  multiCastRoom(roomName: string, event: string, data: any): void {
    this.playersStore
      .filter((pl) => pl.room === roomName)
      .map((pl) =>
        pl.channel.send(
          JSON.stringify({
            event,
            data,
          })
        )
      );
  }
  registerGame(
    registerGameDto: RegisterGameDto,
    client: WebSocket
  ): WsMessage<ProfileDto> {
    const { room, player } = registerGameDto;
    let role = Role.SPECTRAL;
    if (!this.roomStore.find((r) => r.name === room)) {
      this.roomStore.push(new RoomDto(room));
      role = Role.ADMIN;
    }
    const con = this.playersStore.find((p) => p.channel === client);
    if (con) {
      con.name = player;
      con.role = role;
    } else {
      this.playersStore.push({
        role,
        name: player,
        channel: client,
        room,
        gameResult: GameResult.VACANT,
      });
    }
    this.multiCastRoom(room, 'playersList', [
      ...new Set(
        this.playersStore.filter((pl) => pl.room === room).map((pl) => pl.name)
      ),
    ]);
    // console.log(this.playersStore);
    return {
      event: 'profile',
      data: {
        name: player,
        room,
        role: this.playersStore.find((pl) => pl.channel === client).role,
        inGame: this.roomStore.find((r) => r.name === room).inGame,
      },
    };
  }
  disconnect(client: WebSocket) {
    const disconnectedPlayer = this.playersStore.find(
      (pl) => pl.channel === client
    );
    this.playersStore = this.playersStore.filter((pl) => pl.channel !== client);
    // this.multiCastRoom()
    if (disconnectedPlayer) {
      if (disconnectedPlayer.role === Role.ADMIN) {
        const updateAdmin = this.playersStore.find(
          (p) => p.room === disconnectedPlayer.room
        );
        if (updateAdmin) {
          updateAdmin.role = Role.ADMIN;
          updateAdmin.channel.send(
            JSON.stringify({
              event: 'profile',
              data: {
                name: updateAdmin.name,
                room: updateAdmin.room,
                role: updateAdmin.role,
                inGame: this.roomStore.find((r) => r.name === updateAdmin.room)
                  .inGame,
              },
            })
          );
        } else {
          this.roomStore = this.roomStore.filter(
            (room) => room.name !== disconnectedPlayer.room
          );
        }
      }
      this.multiCastRoom(disconnectedPlayer.room, 'playersList', [
        ...new Set(
          this.playersStore
            .filter((pl) => pl.room === disconnectedPlayer.room)
            .map((pl) => pl.name)
        ),
      ]);
    }
  }
  @OnEvent('terrain.create')
  terrainCreate(room: RoomDto): void {
    // console.log('Create terrain in room:', room);
  }
  pieceRotate(client: WebSocket, direction: 'l' | 'r'): void {
    const player = this.playersStore.find((el) => el.channel === client);
    if (player.role >= Role.PLAYER) {
      const room = this.roomStore.find((room) => room.name === player.room);
      if (player.role === Role.ADMIN) {
        room._adminTerrain.rotate(direction);
      }
      if (player.role === Role.PLAYER) {
        room._otherTerrain.rotate(direction);
      }
      this.multiCastRoomTerrain(room);
    }

    // console.log('Piece rotated', player, direction);
  }
  pieceMove(client: WebSocket, direction: 'l' | 'r' | 'd'): void {
    const player = this.playersStore.find((el) => el.channel === client);
    if (player.role >= Role.PLAYER) {
      const room = this.roomStore.find((room) => room.name === player.room);
      if (player.role === Role.ADMIN) {
        room._adminTerrain.move(direction);
      }
      if (player.role === Role.PLAYER) {
        room._otherTerrain.move(direction);
      }
      this.multiCastRoomTerrain(room);
    }
  }
  @OnEvent('piece.update')
  updatePiece(terrain: Terrain) {
    const room = this.roomStore.find(
      (room) => room._otherTerrain === terrain || room._adminTerrain === terrain
    );
    // console.log('colling method updatePiece', room.name);
    this.multiCastRoomTerrain(room);
    // console.log(room);
  }
  @OnEvent('game.stop')
  gameStop(terrain?: Terrain) {
    if (terrain) {
      const room = this.getRoomByTerrain(terrain);
      room._otherTerrain.stop();
      room._adminTerrain.stop();
      room.inGame = false;
      this.multiCastRoomUpdateProfile(room);
    }
  }
  @OnEvent('terrain.collapseRow')
  CollapseRow(terrain: Terrain, miss: number) {
    const room = this.getRoomByTerrain(terrain);
    if (room._adminTerrain === terrain) {
      room._otherTerrain.missRow(miss);
    }
    if (room._otherTerrain === terrain) {
      room._adminTerrain.missRow(miss);
    }
    this.multiCastRoomTerrain(room);
  }
  getRoomByTerrain(terrain: Terrain) {
    return this.roomStore.find(
      (room) => room._otherTerrain === terrain || room._adminTerrain === terrain
    );
  }
}
