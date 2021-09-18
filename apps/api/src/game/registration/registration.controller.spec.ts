import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { ValidateDto, ValidateResponseDto } from '../dto/validate.dto';
import { GameService } from '../game.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoomRepositoryService } from '../room-repository/room-repository.service';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';
import { LeaderboardsRepositoryService } from '../leaderboards-repository/leaderboards-repository.service';
import { ScoreEntity } from '../entities/score.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';

describe('RegistrationController', () => {
  let controller: RegistrationController;
  // let gameService: GameService;
  const request = new ValidateDto();
  const response = new ValidateResponseDto();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        GameService,
        EventEmitter2,
        RoomRepositoryService,
        PlayerRepositoryService,
        LeaderboardsRepositoryService,
        {
          provide: getRepositoryToken(ScoreEntity),
          useValue: createMock<Repository<ScoreEntity>>(),
        },
      ],
    }).compile();

    // gameService = moduleRef.get<GameService>(GameService);
    controller = moduleRef.get<RegistrationController>(RegistrationController);

    request.name = 'test';
    request.lobby = 'lobby';
    response.lobby = false;
    response.name = true;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should equal to false response dto', () => {
    controller
      .validate(request)
      .then((data) =>
        expect(data).toStrictEqual({
          lobby: response.lobby,
          name: response.name,
        })
      )
      .catch();
  });
});
