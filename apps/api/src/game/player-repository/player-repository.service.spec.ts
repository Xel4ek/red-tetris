import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepositoryService } from './player-repository.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameStatus, Player } from '../../player/player';
import { Terrain } from '../terrain/terrain';
import { PieceGenerator } from '../../terrain/piece';

describe('PlayerRepositoryService', () => {
  let service: PlayerRepositoryService;
  let eventEmitter2: Partial<EventEmitter2>;

  beforeEach(async () => {
    eventEmitter2 = {
      emit: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerRepositoryService,
        { provide: EventEmitter2, useValue: eventEmitter2 },
      ],
    }).compile();

    service = module.get<PlayerRepositoryService>(PlayerRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add Player', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const add = jest.spyOn(service.store, 'push');
    service.push({} as Player);
    expect(add).toBeCalled();
  });
  it('should filter Player', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filter = jest.spyOn(service.store, 'filter');
    service.findByRoom('testRoom');
    expect(filter).toBeCalled();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(service, 'findByChannel').mockImplementation(() => ({
      channels: [{} as WebSocket],
    }));
    service.removeByChannel({} as WebSocket);

    expect(filter).toBeCalled();
  });

  it('should find', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const find = jest.spyOn(service.store, 'find');
    service.findByName('testName');
    expect(find).toBeCalled();
    service.findByTerrain({} as Terrain);
    expect(find).toBeCalled();
    service.findByChannel({} as WebSocket);
    expect(find).toBeCalled();
  });

  it('should terrainOverflow', () => {
    const terrain = new Terrain(new EventEmitter2(), new PieceGenerator());
    const stop = jest.spyOn(terrain, 'stop');
    service.terrainOverflow(terrain);
    expect(stop).toBeCalled();

    const loser = jest.fn();
    jest.spyOn(service, 'findByTerrain').mockImplementation(
      () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ({
          room: 'testRoom',
          loser,
          winner: jest.fn(),
        } as Player)
    );
    jest.spyOn(service, 'findByRoom').mockImplementation(() => [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        status: GameStatus.ACTIVE,
        loser,
        winner: jest.fn(),
      } as Player,
    ]);

    service.terrainOverflow(terrain);
    expect(loser).toBeCalled();
  });

  it('pieceSerialUpdate', function () {
    const terrain = {
      stop: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.pieceSerialUpdate(terrain, []);
    expect(terrain.stop).toBeCalled();
    const player = {
      send: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(service, 'findByTerrain').mockImplementation(() => player);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.pieceSerialUpdate(terrain, []);
    expect(player.send).toBeCalled();
  });

  // it('should return user by terrain', function () {
  //   expect(service.push(adminPlayer)).toBeUndefined();
  //   expect(service.findByTerrain(adminPlayer._terrain)).toBe(adminPlayer);
  // });
  //
  // it('should overflowTerrain', function () {
  //   adminPlayer.gameStart(pieceGenerator);
  //   expect(service.terrainOverflow(adminPlayer._terrain)).toBeUndefined();
  // });
  //
  // it('should pieceSerialUpdate', function () {
  //   expect(service.pieceSerialUpdate(adminPlayer._terrain, [])).toBeUndefined();
  // });
});
