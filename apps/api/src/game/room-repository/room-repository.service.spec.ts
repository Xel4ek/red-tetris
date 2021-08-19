import { Test, TestingModule } from '@nestjs/testing';
import { RoomRepositoryService } from './room-repository.service';

describe('RoomRepositoryService', () => {
  let service: RoomRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomRepositoryService],
    }).compile();

    service = module.get<RoomRepositoryService>(RoomRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
