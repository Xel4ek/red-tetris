import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { LeaderboardsDto } from '../dto/leaderboards.dto';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardsRepositoryService {
  store$ = new ReplaySubject<LeaderboardsDto[]>();

  constructor() {
    this.store$.next([
      {
        name: 'medawdawdaaaaaaaaaaaaaaaaaa aw ad adwa ad wad aw aaaaaaaaaaaaaaaaaaaaaaaamamk madm admao dmaowd maowd maowdm aowdm aowdma aaaaaaaa',
        pvp: 10,
        score: 12000,
      },
      { name: 'me1', pvp: 11, score: 12000 },
      { name: 'me2', pvp: 13, score: 112300 },
      { name: 'me3', pvp: 19, score: 123120 },
      { name: 'me4', pvp: 18, score: 121240 },
      { name: 'me10', pvp: 17, score: 1223420 },
      { name: 'me11', pvp: 16, score: 120645 },
      { name: 'me9', pvp: 15, score: 120675 },
      { name: 'me0', pvp: 14, score: 12058 },
      { name: 'meY', pvp: 13, score: 120567 },
    ]);
  }
  getTop(): Observable<LeaderboardsDto[]> {
    return this.store$.asObservable();
  }
}
