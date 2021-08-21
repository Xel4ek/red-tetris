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
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly roomRepository: RoomRepositoryService,
    private readonly playerRepository: PlayerRepositoryService
  ) {}

  startGame(client: WebSocket) {
    const roomName = this.playerRepository.findByChannel(client).room;
    this.roomRepository.gameStart(roomName);
  }

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
    const con = this.playerRepository.findByChannel(client);
    if (con) {
      con.name = player;
      con.role = role;
    } else {
      this.playerRepository.push(
        new PlayerDto(room, player, role, client, this.eventEmitter)
      );
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
