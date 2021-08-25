import { TestBed } from '@angular/core/testing';

import { LeaderboardsRepositoryService } from './leaderboards-repository.service';

describe('LeaderboardsRepositoryService', () => {
  let service: LeaderboardsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboardsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
