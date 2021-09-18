import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomRepositoryService } from './room-repository/room-repository.service';
import { PlayerRepositoryService } from './player-repository/player-repository.service';
import { LeaderboardsRepositoryService } from './leaderboards-repository/leaderboards-repository.service';
import { ScoreEntity } from './entities/score.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { RegisterGameDto } from './dto/register-game.dto';
import { ValidateDto } from './dto/validate.dto';
import { RoomDto } from './dto/room.dto';

describe('GameService', () => {
  let service: GameService;
  let roomRepositoryService: RoomRepositoryService;
  let playerRepositoryService: PlayerRepositoryService;
  let scoreEntityRepository: Repository<ScoreEntity>;
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
          useValue: scoreEntityRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<GameService>(GameService);
    roomRepositoryService = moduleRef.get<RoomRepositoryService>(
      RoomRepositoryService
    );
    roomRepositoryService.push(new RoomDto(room));
    playerRepositoryService = moduleRef.get<PlayerRepositoryService>(
      PlayerRepositoryService
    );
    const mock = createMock<ExecutionContext>();
    channel = mock.switchToWs().getClient<WebSocket>();
    moduleRef.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.gameSetup() should be defined', function () {
    expect(service.gameSetup().data).toBeDefined();
  });

  it('.registerGame() should be defined', function () {
    const registerGameDto = new RegisterGameDto();
    registerGameDto.room = room;
    registerGameDto.player = player;
    expect(service.registerGame(registerGameDto, channel)).toBeDefined();
  });

  it('.startGame should be defined', function () {
    expect(service.validate(new ValidateDto())).toBeDefined();
    expect(service.leaderboards()).toBeDefined();
  });
  it('should move method', () => {
    const move = jest.fn();

    jest
      .spyOn(playerRepositoryService, 'findByChannel')
      .mockImplementation(() => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _terrain: {
          move,
        },
      }));
    service.pieceMove({} as WebSocket, 'r');
    expect(move).toBeCalledWith('r');
  });

  it('should disconnect method', () => {
    const disc = jest.spyOn(roomRepositoryService, 'disconnect');
    service.disconnect({} as WebSocket);
    expect(disc).toBeCalled();
  });

  it('should rotate method', () => {
    const rotate = jest.fn();

    jest
      .spyOn(playerRepositoryService, 'findByChannel')
      .mockImplementation(() => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _terrain: {
          rotate,
        },
      }));
    service.pieceRotate({} as WebSocket, 'r');
    expect(rotate).toBeCalledWith('r');
  });

  it('should startGame method', () => {
    jest
      .spyOn(playerRepositoryService, 'findByChannel')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        room: 'testRoom',
      }));
    const start = jest.spyOn(roomRepositoryService, 'gameStart');
    service.startGame({} as WebSocket);
    expect(start).toBeCalledWith('testRoom');
  });
  it('should registerGame method', () => {
    jest.spyOn(playerRepositoryService, 'findByChannel');

    jest.spyOn(roomRepositoryService, 'findByName');
    jest
      .spyOn(scoreEntityRepository, 'save')
      .mockImplementation(() => new Promise(() => ({ id: 0 })));
    jest
      .spyOn(roomRepositoryService, 'multicast')
      .mockImplementation(() => void 0);
    expect(
      service.registerGame(
        {
          room: 'testRoom',
          player: 'testPlayer2',
        },
        {} as WebSocket
      )
    ).toEqual({
      data: { inGame: false, name: 'testPlayer2', role: 2, room: 'testRoom' },
      event: 'profile',
    });
    expect(
      service.registerGame(
        {
          room: 'testRoom',
          player: 'testPlayer2',
        },
        {} as WebSocket
      )
    ).toEqual({
      data: {
        lobby: 'testRoom',
        message: 'Name already used in this room please choose other',
        name: 'testPlayer2',
      },
      event: 'error',
    });
  });
});
