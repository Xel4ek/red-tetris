import { Injectable } from '@nestjs/common';
import { RegisterGameDto } from './dto/register-game.dto';
import { GameStatus, PlayerDto, Role } from './dto/player.dto';
import { WsMessage } from './dto/message.dto';
import { RoomDto } from './dto/room.dto';
import { ProfileDto } from './dto/profile.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';
import { Terrain } from './terrain/terrain';
import { first, map, Observable } from 'rxjs';
import { LeaderboardsDto } from './dto/leaderboards.dto';
import { LeaderboardsRepositoryService } from './leaderboards-repository/leaderboards-repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreEntity } from './entities/score.entity';
import { Repository } from 'typeorm';
import { ValidateDto, ValidateResponseDto } from './dto/validate.dto';
import { ErrorDto } from './dto/error.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly roomRepository: RoomRepositoryService,
    private readonly playerRepository: PlayerRepositoryService,
    private readonly leaderboardsRepository: LeaderboardsRepositoryService,
    @InjectRepository(ScoreEntity)
    private scoreRepository: Repository<ScoreEntity>
  ) {}

  startGame(client: WebSocket) {
    const roomName = this.playerRepository.findByChannel(client).room;
    this.roomRepository.gameStart(roomName);
  }

  gameSetup() {
    return {
      event: 'game.setup',
      data: Terrain.settings(),
    };
  }

  registerGame(
    registerGameDto: RegisterGameDto,
    client: WebSocket
  ): WsMessage<ProfileDto | ErrorDto> {
    if (
      !this.validate({
        lobby: registerGameDto.room,
        name: registerGameDto.player,
      }).name
    ) {
      return {
        event: 'error',
        data: {
          message: 'Name already used in this room please choose other',
          lobby: registerGameDto.room,
          name: registerGameDto.player,
        },
      };
    }
    const { room, player } = registerGameDto;
    const existPlayer = this.playerRepository.findByChannel(client);
    if (existPlayer) {
      this.roomRepository.disconnect(client);
    }
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
    const registeredPlayer = new PlayerDto(
      room,
      player,
      role,
      client,
      this.eventEmitter,
      this.scoreRepository
    );
    this.playerRepository.push(registeredPlayer);
    registeredPlayer.loadFromDB().then(() => this.playerListMulticast(room));
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

  pieceDrop(client: WebSocket): void {
    const player = this.playerRepository.findByChannel(client);
    player._terrain.drop();
  }

  @OnEvent('game.stop')
  async gameStop(roomName: string) {
    const players = this.playerRepository
      .findByRoom(roomName)
      .filter((pl) => pl.role >= Role.PLAYER);
    const player = players.find((pl) => pl.status === GameStatus.WINNER);
    const scoreEntity = (await this.scoreRepository.findOne({
      player: player.name,
    })) ?? {
      player: player.name,
      scoreSingle: BigInt(0),
      scoreMulti: BigInt(0),
    };
    if (players.length === 1) {
      scoreEntity.scoreSingle = BigInt(
        Math.max(Number(scoreEntity.scoreSingle), player._terrain.score)
      );
      player.scoreSingle = Number(scoreEntity.scoreSingle);
    } else {
      scoreEntity.scoreMulti += BigInt(players.length);
      player.scoreMulti = Number(scoreEntity.scoreMulti);
      player.send(
        JSON.stringify({
          event: 'pvp.winner',
          data: { scorePVP: player.scoreMulti },
        })
      );
    }
    await this.scoreRepository.save(scoreEntity);
    this.playerListMulticast(player.room);
    this.leaderboardsRepository
      .getTop()
      .pipe(
        first(),
        map((top) => {
          const update = top.find(
            (el) => el.score < player.scoreSingle || el.pvp < player.scoreMulti
          );
          if (update) {
            this.eventEmitter.emit('game.updateTop');
          }
        })
      )
      .subscribe();
    console.log('stop game in room, winner: ', player);
  }

  leaderboards(): Observable<WsMessage<LeaderboardsDto[]>> {
    this.eventEmitter.emit('game.updateTop');
    return this.leaderboardsRepository.getTop().pipe(
      map((data) => ({
        event: 'leaderboards',
        data,
      }))
    );
  }

  validate(validateDto: ValidateDto): ValidateResponseDto {
    const player = this.playerRepository.findByName(validateDto.name);
    return {
      lobby: !!this.roomRepository.findByName(validateDto.lobby),
      name: player?.room !== validateDto.lobby,
    };
  }

  private playerListMulticast(room: string) {
    this.roomRepository.multicast(
      room,
      JSON.stringify({
        event: 'playersList',
        data: this.playerRepository.findByRoom(room).map((pl) => ({
          name: pl.name,
          score: pl.scoreSingle ?? 0,
          pvp: pl.scoreMulti ?? 0,
          role: pl.role,
        })),
      })
    );
  }
}
