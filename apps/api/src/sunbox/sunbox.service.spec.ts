import { Test, TestingModule } from '@nestjs/testing';
import { SunboxService } from './sunbox.service';

describe('SunboxService', () => {
  let service: SunboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SunboxService],
    }).compile();

    service = module.get<SunboxService>(SunboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
