import { Module } from '@nestjs/common';
import { SunboxService } from './sunbox.service';
import { SunboxController } from './sunbox.controller';

@Module({
  controllers: [SunboxController],
  providers: [SunboxService]
})
export class SunboxModule {}
