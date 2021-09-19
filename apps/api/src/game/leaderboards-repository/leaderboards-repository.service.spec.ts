import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsRepositoryService } from './leaderboards-repository.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Repository } from 'typeorm';
import { ScoreEntity } from '../entities/score.entity';

describe('MyservService', () => {
  let service: LeaderboardsRepositoryService;
  let repository: Partial<Repository<ScoreEntity>>;
  beforeEach(async () => {
    repository = {
      findAndCount: () =>
        firstValueFrom<[ScoreEntity[], number]>(
          of([
            [
              {
                player: 'test',
                scoreMulti: BigInt(21),
                scoreSingle: BigInt(42),
              },
            ],
            1,
          ])
        ),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsRepositoryService,
        {
          provide: 'ScoreEntityRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsRepositoryService>(
      LeaderboardsRepositoryService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Observable', () => {
    expect(typeof service.getTop()).toBe(typeof new Observable());
  });
  it('updateTop', (done) => {
    service.getTop().subscribe((data) => {
      expect(data).toEqual([{ name: 'test', pvp: 21, score: 42 }]);
      done();
    });
    service.updateTop();
  });
});
