import { Controller, Get, Session } from '@nestjs/common';
import { SunboxService } from './sunbox.service';

@Controller('sunbox')
export class SunboxController {
  constructor(private readonly sunboxService: SunboxService) {}
  @Get()
  sunbox(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return session;
  }
}
