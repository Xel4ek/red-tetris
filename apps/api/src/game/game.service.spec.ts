import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { RoomRepositoryService } from "./room-repository/room-repository.service";
import { PlayerRepositoryService } from "./player-repository/player-repository.service";
import { LeaderboardsRepositoryService } from "./leaderboards-repository/leaderboards-repository.service";
import { ScoreEntity } from "./entities/score.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { RegisterGameDto } from "./dto/register-game.dto";
import { ValidateDto } from "./dto/validate.dto";
import { PlayerDto, Role } from "./dto/player.dto";
import { RoomDto } from "./dto/room.dto";

describe('GameService', () => {
  let service: GameService;
  let roomRepositoryService: RoomRepositoryService;
  let playerRepositoryService: PlayerRepositoryService;
  let eventEmitter: EventEmitter2;
  let scoreEntityRepository: Repository<ScoreEntity>;
  let context: ExecutionContext;
  let channel: WebSocket;
  const room = 'testRoom';
  const player = 'testPlayer';

  beforeEach(async () => {

    scoreEntityRepository = createMock<Repository<ScoreEntity>>();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        EventEmitter2,
        RoomRepositoryService,
        PlayerRepositoryService,
        LeaderboardsRepositoryService,
        {
          provide: getRepositoryToken(ScoreEntity),
          useValue: scoreEntityRepository
        }
        ]
    }).compile();

    service = moduleRef.get<GameService>(GameService);
    roomRepositoryService = moduleRef.get<RoomRepositoryService>(RoomRepositoryService);
    roomRepositoryService.push(new RoomDto(room));
    playerRepositoryService = moduleRef.get<PlayerRepositoryService>(PlayerRepositoryService);
    const mock = createMock<ExecutionContext>();
    channel = mock.switchToWs().getClient<WebSocket>();
    eventEmitter = moduleRef.get<EventEmitter2>(EventEmitter2);
    playerRepositoryService.push(new PlayerDto(room, player, Role.ADMIN, channel, eventEmitter));
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
    expect(service.startGame(channel)).toBeUndefined();
    expect(service.disconnect(channel)).toBeUndefined();
    expect(service.gameStop(playerDto)).toBeUndefined();
    expect(service.pieceMove(channel, 'r')).toBeDefined();
    expect(service.pieceRotate(channel, 'l')).toBeDefined();

  });

});
