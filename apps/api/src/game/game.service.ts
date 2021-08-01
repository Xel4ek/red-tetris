import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ReplaySubject, Subject, timer } from 'rxjs';
import { map, repeatWhen, share, switchMap, takeUntil } from 'rxjs/operators';
import { OnInit } from '@angular/core';

@Injectable()
export class GameService implements OnInit {
  private readonly roomStore = [];
  private readonly _stop = new Subject<void>();
  private readonly _start = new Subject<void>();
  terrain$ = timer(0, 2000).pipe(
    takeUntil(this._stop),
    repeatWhen(() => this._start),
    map(() => {
      console.log(Date.now(), 'new data send!');
      return this.spam();
    }),
    share()
  );
  constructor() {
    console.log('terrain creation');
  }
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  startGame() {
    this._start.next();
  }

  stopGame() {
    this._stop.next();
  }

  terrain() {
    return this.terrain$;
  }
  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  getRandomColor(): string {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }
  spam(): string[] {
    return Array.from({ length: 12 * 21 }, this.getRandomColor);
  }

  ngOnInit(): void {}
}
