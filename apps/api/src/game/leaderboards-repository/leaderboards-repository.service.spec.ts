import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsRepositoryService } from "./leaderboards-repository.service";
import { Observable } from "rxjs";
import { LeaderboardsDto } from "../dto/leaderboards.dto";

describe('MyservService', () => {
  let service: LeaderboardsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderboardsRepositoryService],
    }).compile();

    service = module.get<LeaderboardsRepositoryService>(LeaderboardsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Observable', () => {
    expect(typeof service.getTop()).toBe(typeof new Observable());
  })
});
