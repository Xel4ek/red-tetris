import { Test, TestingModule } from '@nestjs/testing';
import { SunboxController } from './sunbox.controller';
import { SunboxService } from './sunbox.service';

describe('SunboxController', () => {
  let controller: SunboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SunboxController],
      providers: [SunboxService],
    }).compile();

    controller = module.get<SunboxController>(SunboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
