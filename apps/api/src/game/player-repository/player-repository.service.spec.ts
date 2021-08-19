import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepositoryService } from './player-repository.service';

describe('PlayerRepositoryService', () => {
  let service: PlayerRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerRepositoryService],
    }).compile();

    service = module.get<PlayerRepositoryService>(PlayerRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
