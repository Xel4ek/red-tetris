import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepositoryService } from './player-repository.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { PlayerDto } from '../dto/player.dto';
import { Terrain } from '../terrain/terrain';
import { PieceGenerator } from '../../terrain/piece';

describe('PlayerRepositoryService', () => {
  let service: PlayerRepositoryService;
  let adminPlayer: PlayerDto;
  let channel: WebSocket;
  let terrain: Terrain;
  let pieceGenerator: PieceGenerator;
  let eventEmitter2: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerRepositoryService,
        EventEmitter2,
        PieceGenerator,
        PlayerDto,
      ],
    }).compile();

    service = module.get<PlayerRepositoryService>(PlayerRepositoryService);
    pieceGenerator = module.get<PieceGenerator>(PieceGenerator);
    eventEmitter2 = module.get<EventEmitter2>(EventEmitter2);
    const mock = createMock<ExecutionContext>();
    channel = mock.switchToWs().getClient<WebSocket>();
    // adminPlayer = new PlayerDto('testRoom', 'testPlayer', Role.ADMIN, channel, eventEmitter2);
    service.push(adminPlayer);
    terrain = new Terrain(eventEmitter2, pieceGenerator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add Player', function () {
    expect(service.push(adminPlayer)).toBeUndefined();
  });

  it('functions should be defined', function () {
    expect(service.findByRoom('')).toBeDefined();
  });

  it('should ', function () {
    expect(service.findByName('')).not.toBeDefined();
  });

  it('should ', function () {
    expect(service.removeByChannel(channel)).toBeUndefined();
  });

  it('push test user', function () {
    expect(service.push(adminPlayer)).toBeUndefined();
  });

  it('should return user by terrain', function () {
    expect(service.push(adminPlayer)).toBeUndefined();
    expect(service.findByTerrain(adminPlayer._terrain)).toBe(adminPlayer);
  });

  it('should overflowTerrain', function () {
    adminPlayer.gameStart(pieceGenerator);
    expect(service.terrainOverflow(adminPlayer._terrain)).toBeUndefined();
  });

  it('should pieceSerialUpdate', function () {
    expect(service.pieceSerialUpdate(adminPlayer._terrain, [])).toBeUndefined();
  });
});
