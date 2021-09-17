import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { LeaderboardsDto } from '../dto/leaderboards.dto';
import { Repository } from 'typeorm';
import { ScoreEntity } from '../entities/score.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardsRepositoryService {
  store$ = new ReplaySubject<LeaderboardsDto[]>();

  constructor(
    @InjectRepository(ScoreEntity)
    private readonly repository: Repository<ScoreEntity>
  ) {
    this.updateTop();
  }
  @OnEvent('game.update_top')
  updateTop() {
    this.repository.findAndCount({ take: 10, order: {scoreSingle: "DESC", scoreMulti: "DESC"} }).then((data) => {
      this.store$.next(
        data[0].map((entry) => ({
          name: entry.player,
          pvp: Number(entry.scoreMulti),
          score: Number(entry.scoreSingle),
        }))
      );
    });
  }

  getTop(): Observable<LeaderboardsDto[]> {
    return this.store$.asObservable();
  }
}
