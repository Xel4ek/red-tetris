import { Injectable } from '@nestjs/common';
import { RegisterGameDto } from './dto/register-game.dto';
import { PlayerDto, Role } from './dto/player.dto';
import { WsMessage } from './dto/message.dto';
import { RoomDto } from './dto/room.dto';
import { ProfileDto } from './dto/profile.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';
import { Terrain } from './terrain/terrain';

@Injectable()
export class GameService {
  // private roomStore: RoomDto[] = [];
  // private playersStore: PlayerDto[] = [];
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly roomRepository: RoomRepositoryService,
    private readonly playerRepository: PlayerRepositoryService
  ) {}

  startGame(client: WebSocket) {
    const roomName = this.playerRepository.findByChannel(client).room;
    this.roomRepository.gameStart(roomName);
    // const roomName = this.playersStore.find((p) => p.channel === client).room;
    // const enemy = this.playersStore.find(
    //   (p) => p.name === player && p.room === roomName
    // );
    // const room = this.roomStore.find((r) => r.name === roomName);
    // // TODO move logic in event
    // this.eventEmitter.emit('terrain.create', room);
    // // error handling
    // if (!room.inGame) {
    //   enemy.role = Role.PLAYER;
    //   room.inGame = true;
    //   room._adminTerrain = new Terrain(this.eventEmitter);
    //   room._otherTerrain = new Terrain(this.eventEmitter);
    //   room._adminTerrain.start();
    //   room._otherTerrain.start();
    //   this.multiCastRoomUpdateProfile(room);
    //   this.multiCastRoomTerrain(room);
    // }
  }

  // multiCastRoomUpdateProfile(room: RoomDto): void {
  //   this.playersStore
  //     .filter((p) => p.room === room.name)
  //     .map((pl) =>
  //       pl.channels.map((channel) =>
  //         channel.send(
  //           JSON.stringify({
  //             event: 'profile',
  //             data: {
  //               name: pl.name,
  //               role: pl.role,
  //               inGame: room.inGame,
  //               room: room.name,
  //             },
  //           })
  //         )
  //       )
  //     );
  // }
  // multiCastRoomTerrain(
  //   room: RoomDto,
  //   target: 'admin' | 'other' | 'both' = 'both'
  // ) {
  //   // this.playersStore
  //   //   .filter((pl) => pl.room === room.name)
  //   //   .map((pl) => {
  //   //     if (target === 'both' || target === 'admin') {
  //   //       pl.channel.send(
  //   //         JSON.stringify({
  //   //           event: 'adminTerrain',
  //   //           data: room.adminTerrain,
  //   //         })
  //   //       );
  //   //     }
  //   //     if (target === 'both' || target === 'other') {
  //   //       pl.channel.send(
  //   //         JSON.stringify({
  //   //           event: 'otherTerrain',
  //   //           data: room.otherTerrain,
  //   //         })
  //   //       );
  //   //     }
  //   //   });
  // }
  // multiCastRoom(roomName: string, event: string, data: any): void {
  //   this.playersStore
  //     .filter((pl) => pl.room === roomName)
  //     .map((pl) =>
  //       pl.channels.map((channel) =>
  //         channel.send(
  //           JSON.stringify({
  //             event,
  //             data,
  //           })
  //         )
  //       )
  //     );
  // }
  registerGame(
    registerGameDto: RegisterGameDto,
    client: WebSocket
  ): WsMessage<ProfileDto> {
    const { room, player } = registerGameDto;
    let role = Role.PLAYER;
    const existRoom = this.roomRepository.findByName(room);
    if (!existRoom) {
      this.roomRepository.push(new RoomDto(room));
      role = Role.ADMIN;
    } else {
      if (existRoom.inGame) {
        role = Role.SPECTRAL;
      }
    }
    // const existPlayer = this.playersStore.find(p => p.name === player && p.room === room);
    const con = this.playerRepository.findByChannel(client);
    if (con) {
      con.name = player;
      con.role = role;
    } else {
      this.playerRepository.push(
        new PlayerDto(room, player, role, client, this.eventEmitter)
      );
      // this.playersStore.push({
      //   role,
      //   name: player,
      //   channels: [client],
      //   room,
      //   gameResult: GameResult.VACANT,
      // });
    }
    this.roomRepository.multicast(
      room,
      JSON.stringify({
        event: 'playersList',
        data: this.playerRepository.findByRoom(room).map((pl) => pl.name),
      })
    );
    return {
      event: 'profile',
      data: {
        name: player,
        room,
        role,
        inGame: this.roomRepository.findByName(room).inGame,
      },
    };
  }
  disconnect(client: WebSocket) {
    this.roomRepository.disconnect(client);
    // const disconnectedPlayer = this.playersStore.find((pl) =>
    //   pl.channels.find((channel) => channel === client)
    // );
    // this.playersStore = this.playersStore.filter((pl) =>
    //   pl.channels.find((channel) => channel !== client)
    // );
    // this.multiCastRoom()
    // if (disconnectedPlayer) {
    //   if (disconnectedPlayer.role === Role.ADMIN) {
    //     const updateAdmin = this.playersStore.find(
    //       (p) => p.room === disconnectedPlayer.room
    //     );
    //     if (updateAdmin) {
    //       updateAdmin.role = Role.ADMIN;
    //       updateAdmin.channel.send(
    //         JSON.stringify({
    //           event: 'profile',
    //           data: {
    //             name: updateAdmin.name,
    //             room: updateAdmin.room,
    //             role: updateAdmin.role,
    //             inGame: this.roomStore.find((r) => r.name === updateAdmin.room)
    //               .inGame,
    //           },
    //         })
    //       );
    //     } else {
    //       this.roomStore = this.roomStore.filter(
    //         (room) => room.name !== disconnectedPlayer.room
    //       );
    //     }
    //   }
    //   this.multiCastRoom(disconnectedPlayer.room, 'playersList', [
    //     ...new Set(
    //       this.playersStore
    //         .filter((pl) => pl.room === disconnectedPlayer.room)
    //         .map((pl) => pl.name)
    //     ),
    //   ]);
    // }
  }

  pieceRotate(client: WebSocket, direction: 'l' | 'r'): void {
    const player = this.playerRepository.findByChannel(client);
    player._terrain.rotate(direction);
  }
  pieceMove(client: WebSocket, direction: 'l' | 'r' | 'd'): void {
    const player = this.playerRepository.findByChannel(client);
    player._terrain.move(direction);
  }

  @OnEvent('game.stop')
  gameStop(player: PlayerDto) {
    console.log('stop game in room, winner: ', player);
  }
}
