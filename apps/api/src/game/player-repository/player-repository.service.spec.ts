import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepositoryService } from './player-repository.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { PlayerDto, Role } from "../dto/player.dto";
import { channel } from "diagnostics_channel";

describe('PlayerRepositoryService', () => {
  let service: PlayerRepositoryService;
  let adminPlayer: PlayerDto;
  let channel: WebSocket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRepositoryService, EventEmitter2],
    }).compile();

    service = module.get<PlayerRepositoryService>(PlayerRepositoryService);
    const mock = createMock<ExecutionContext>();
    channel = mock.switchToWs().getClient<WebSocket>()
    adminPlayer = new PlayerDto('testRoom', 'testPlayer', Role.ADMIN, channel, new EventEmitter2());
    service.push(adminPlayer);
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
    expect(service.push(adminPlayer)).toBeDefined()
  });
});
