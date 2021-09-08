import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { RoomRepositoryService } from "./room-repository/room-repository.service";
import { PlayerRepositoryService } from "./player-repository/player-repository.service";
import { LeaderboardsRepositoryService } from "./leaderboards-repository/leaderboards-repository.service";
import { ScoreEntity } from "./entities/score.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { RegisterGameDto } from "./dto/register-game.dto";
import { ValidateDto } from "./dto/validate.dto";
import { PlayerDto, Role } from "./dto/player.dto";

describe('GameService', () => {
  let service: GameService;
  let eventEmitter: EventEmitter2;
  let context: ExecutionContext;
  let channel: WebSocket;
  const room = 'testRoom';
  const player = 'testPlayer';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        EventEmitter2,
        RoomRepositoryService,
        PlayerRepositoryService,
        LeaderboardsRepositoryService,
        {
          provide: getRepositoryToken(ScoreEntity),
          useClass: ScoreEntity
        }
        ]
    }).compile();

    service = moduleRef.get<GameService>(GameService);
    const mock = createMock<ExecutionContext>();
    channel = mock.switchToWs().getClient<WebSocket>();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.gameSetup() should be defined', function () {
    expect(service.gameSetup().data).toBeDefined();
    }
  );

  it('.registerGame() should be defined', function () {
    const registerGameDto = new RegisterGameDto()
    registerGameDto.room = room;
    registerGameDto.player = player;
    expect(service.registerGame(registerGameDto, channel)).toBeDefined();
  });

  it('.startGame should be defined', function () {
    expect(service.validate(new ValidateDto())).toBeDefined();
    expect(service.leaderboards()).toBeDefined();
  });

  it('should have side-effects', function () {
    const playerDto = new PlayerDto(room, player, Role.ADMIN, channel, new EventEmitter2());
    expect(service.startGame(channel)).toBeFalsy();
    expect(service.disconnect(channel)).toBeDefined();
    expect(service.gameStop(playerDto)).toBeCalled();
    expect(Repository.call('findOne')).toBeCalled();
    expect(service.pieceMove(channel, 'r')).toBeDefined();
    expect(service.pieceRotate(channel, 'l')).toBeDefined();

  });

});
