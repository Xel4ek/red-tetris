import { Test, TestingModule } from '@nestjs/testing';
import { TerrainService } from './terrain.service';

describe('TerrainService', () => {
  let service: TerrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerrainService],
    }).compile();

    service = module.get<TerrainService>(TerrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
