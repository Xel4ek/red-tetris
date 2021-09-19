import { RoomRepositoryService } from './room-repository.service';
import { Test } from '@nestjs/testing';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';
import { RoomDto } from '../dto/room.dto';
import { GameStatus, Role } from '../../player/player';
import { Terrain } from '../terrain/terrain';

describe('RoomRepositoryService', () => {
  let service: RoomRepositoryService;
  let playerRepository: Partial<PlayerRepositoryService>;
  const player = {
    name: 'testName',
    channels: [
      {
        send: jest.fn(),
      },
    ],
    room: 'testRoom',
    role: Role.ADMIN,
    status: GameStatus.ACTIVE,
    scoreSingle: 0,
    scoreMulti: 12,
    send: jest.fn(),
    gameStart: jest.fn(),
    _terrain: {
      status: jest.fn(),
    },
  };
  beforeEach(async () => {
    playerRepository = {
      findByRoom: jest.fn().mockImplementation(() => [player]),
      findByTerrain: jest.fn().mockImplementation(() => player),
      findByChannel: jest.fn().mockImplementation(() => player),
      removeByChannel: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoomRepositoryService,
        {
          provide: PlayerRepositoryService,
          useValue: playerRepository,
        },
      ],
    }).compile();
    service = moduleRef.get<RoomRepositoryService>(RoomRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should profileMulticast method', () => {
    service.profileMulticast({
      name: 'Test Name',
      inGame: true,
      mode: 'multi',
    });
    expect(playerRepository.findByRoom).toBeCalled();
  });
  it('should findByName', () => {
    const mockStore = {
      find: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.store = mockStore;
    service.findByName('testName');
    expect(mockStore.find).toBeCalled();
  });
  it('should push method', () => {
    const mockStore = {
      push: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.store = mockStore;
    service.push({} as RoomDto);
    expect(mockStore.push).toBeCalled();
  });
  it('should multicast method', () => {
    service.multicast('testRoom', 'data');
    expect(player.send).toBeCalled();
  });
  it('should gameStart method', () => {
    jest.spyOn(service, 'getByName').mockImplementation(() => ({
      name: 'testRoom',
      inGame: false,
      mode: 'single',
    }));
    service.gameStart('testRoom');
    expect(player.gameStart).toBeCalled();
  });
  it('should gameStop method', () => {
    const room = {
      name: 'testRoom',
      inGame: true,
      mode: 'single',
    };
    jest.spyOn(service, 'getByName').mockImplementation(() => room as RoomDto);
    jest.spyOn(service, 'profileMulticast').mockImplementation(() => void 0);
    service.gameStop('testRoom');
    expect(room.inGame).toEqual(false);
    expect(service.profileMulticast).toBeCalled();
  });

  it('should getByName', () => {
    const mockStore = {
      find: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.store = mockStore;
    service.getByName('testRoom');
    expect(mockStore.find).toBeCalled();
  });

  it('should terrainUpdate', () => {
    jest.spyOn(service, 'multicast').mockImplementation(() => void 0);
    service.terrainUpdate({} as Terrain);
    expect(player.send).toBeCalled();
    expect(service.multicast).toBeCalled();
  });

  it('should disconnect method', () => {
    jest.spyOn(service, 'profileMulticast');
    jest.spyOn(service, 'findByName').mockImplementation(() => ({
      name: 'testRoom',
      inGame: false,
      mode: 'single',
    }));
    service.disconnect({} as WebSocket);
    expect(service.profileMulticast).toBeCalled();
  });

  it('should collapseRow', () => {
    const miss = jest.fn();
    jest.spyOn(playerRepository, 'findByTerrain');
    jest.spyOn(playerRepository, 'findByRoom').mockImplementation(() => [
      {
        role: Role.PLAYER,
        _terrain: {
          missRow: miss,
        },
      } as never,
    ]);
    service.collapseRow({} as Terrain, 7);
    expect(miss).toBeCalledWith(7);
  });
});
