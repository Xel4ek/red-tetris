import { Body, Controller, Get, Post } from '@nestjs/common';
import { ValidateDto, ValidateResponseDto } from '../dto/validate.dto';
import { GameService } from '../game.service';

@Controller('registration/')
export class RegistrationController {
  constructor(private readonly gameService: GameService) {}
  @Get()
  test() {
    return 'hello';
  }
  @Post()
  async validate(
    @Body() validateDto: ValidateDto
  ): Promise<ValidateResponseDto> {
    return this.gameService.validate(validateDto);
  }
}
