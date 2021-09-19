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
import { firstValueFrom, of } from 'rxjs';
import { LeaderboardsDto } from './dto/leaderboards.dto';
import { GameStatus, Role } from '../player/player';

describe('GameService', () => {
  let service: GameService;
  let roomRepositoryService: RoomRepositoryService;
  let playerRepositoryService: PlayerRepositoryService;
  let scoreEntityRepository: Partial<Repository<ScoreEntity>>;
  let channel: WebSocket;
  const room = 'testRoom';
  const player = 'testPlayer';
  let leaderboardsRepository: Partial<LeaderboardsRepositoryService>;
  let eventEmitter: Partial<EventEmitter2>;
  beforeEach(async () => {
    scoreEntityRepository = {
      findOne: jest
        .fn()
        .mockImplementation(
          () => new Promise(() => process.nextTick(() => null))
        ),
      save: jest
        .fn()
        .mockImplementation(
          () => new Promise(() => process.nextTick(() => null))
        ),
    };
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
    leaderboardsRepository = moduleRef.get<LeaderboardsRepositoryService>(
      LeaderboardsRepositoryService
    );
    eventEmitter = moduleRef.get<EventEmitter2>(EventEmitter2);
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
    // expect(service.leaderboards()).toBeDefined();
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
    service.pieceRotate({} as WebSocket);
    expect(rotate).toBeCalled();
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
  it('pieceDrop', () => {
    const drop = jest.fn();
    jest
      .spyOn(playerRepositoryService, 'findByChannel')
      .mockImplementation(() => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _terrain: {
          drop,
        },
      }));
    service.pieceDrop({} as WebSocket);
    expect(drop).toBeCalled();
  });

  it('should leaderboards', (done) => {
    const getTop = jest
      .spyOn(leaderboardsRepository, 'getTop')
      .mockImplementation(() => of([{} as LeaderboardsDto]));
    service.leaderboards().subscribe((data) => {
      expect(data).toEqual({ data: [{}], event: 'leaderboards' });
      expect(getTop).toBeCalled();
      done();
    });
  });

  it('should gameStop', async () => {
    const send = jest.fn();
    const findByRoom = jest
      .spyOn(playerRepositoryService, 'findByRoom')
      .mockImplementation(
        () =>
          [
            {
              name: 'winner',
              status: GameStatus.WINNER,
              role: Role.ADMIN,
              send,
            },
            {
              name: 'loser',
              status: GameStatus.LOSER,
              role: Role.PLAYER,
              send,
            },
          ] as never
      );
    const findOne = jest
      .spyOn(scoreEntityRepository, 'findOne')
      .mockImplementation(() =>
        firstValueFrom(
          of({
            player: 'winner',
            scoreSingle: BigInt(42),
            scoreMulti: BigInt(21),
          })
        )
      );
    const save = jest
      .spyOn(scoreEntityRepository, 'save')
      .mockImplementation(() => firstValueFrom(of(true as never)));

    const emitter = jest.spyOn(eventEmitter, 'emit');
    jest.spyOn(leaderboardsRepository, 'getTop').mockImplementation(() =>
      of([
        {
          score: 0,
          pvp: 0,
        } as LeaderboardsDto,
      ])
    );
    await service.gameStop('testRoom');
    expect(save).toBeCalled();
    expect(findByRoom).toBeCalled();
    expect(findOne).toBeCalled();
    expect(emitter).toBeCalledWith('game.updateTop');
  });
});
