import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepositoryService } from './player-repository.service';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { PlayerDto, Role } from "../dto/player.dto";

describe('PlayerRepositoryService', () => {
  let service: PlayerRepositoryService;
  let adminPlayer: PlayerDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRepositoryService],
    }).compile();

    service = module.get<PlayerRepositoryService>(PlayerRepositoryService);
    const mock = createMock<ExecutionContext>();
    const channel = mock.switchToWs().getClient()
    adminPlayer = new PlayerDto('testRoom', 'testPlayer', Role.ADMIN, channel, new EventEmitter2());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('push test user', function () {
    expect(service.push(adminPlayer)).toBeDefined()
  });
});
