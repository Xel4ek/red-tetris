import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Subject, timer } from 'rxjs';
import { map, repeatWhen, share, takeUntil } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { RegisterGameDto } from './dto/register-game.dto';
import { PlayerDto, Role } from './dto/player.dto';
import { WsMessage } from './dto/message.dto';
import { RoomDto, Terrain } from './dto/room.dto';
import { ProfileDto } from './dto/profile.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GameService implements OnInit {
  private roomStore: RoomDto[] = [];
  private playersStore: PlayerDto[] = [];
  private readonly _stop = new Subject<void>();
  private readonly _start = new Subject<void>();
  terrain$ = timer(0, 2000).pipe(
    takeUntil(this._stop),
    repeatWhen(() => this._start),
    map(() => {
      console.log(Date.now(), 'new data send!');
      return this.spam();
    }),
    share()
  );
  constructor(private readonly eventEmitter: EventEmitter2) {
    console.log('terrain creation');
  }
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

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
      room._adminTerrain = new Terrain();
      room._otherTerrain = new Terrain();
      this.multiCastRoomUpdateProfile(roomName);
      this.multiCastRoomTerrain(roomName);
    }
  }

  stopGame() {
    this._stop.next();
  }

  terrain() {
    return this.terrain$;
  }
  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  getRandomColor(): string {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  spam(): string[] {
    return Array.from({ length: 12 * 21 }, this.getRandomColor);
  }
  multiCastRoomUpdateProfile(room: string): void {
    const inGame = this.roomStore.find((r) => (r.name = room));
    this.playersStore
      .filter((p) => p.room === room)
      .map((p) =>
        p.channel.send(
          JSON.stringify({
            event: 'profile',
            data: {
              name: p.name,
              role: p.role,
              inGame,
              room,
            },
          })
        )
      );
  }
  multiCastRoomTerrain(
    roomName: string,
    target: 'admin' | 'other' | 'both' = 'both'
  ) {
    const room = this.roomStore.find((r) => r.name === roomName);
    this.playersStore
      .filter((pl) => pl.room === roomName)
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
      });
    }
    this.multiCastRoom(room, 'playersList', [
      ...new Set(
        this.playersStore.filter((pl) => pl.room === room).map((pl) => pl.name)
      ),
    ]);
    console.log(this.playersStore);
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
  ngOnInit(): void {}
  @OnEvent('terrain.create')
  terrainCreate(room: RoomDto): void {
    console.log('Create terrain in room:', room);
  }
  @OnEvent('piece.rotate')
  pieceRotate(room: RoomDto, direction: 'L' | 'R'): void {
    console.log('Piece rotated', room, direction);
  }
  @OnEvent('piece.move')
  pieceMove(room: RoomDto, direction: 'L' | 'R' | 'D'): void {
    console.log('Piece moved', room, direction);
  }
}
