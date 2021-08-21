import { Injectable, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';

interface GameStatus {
  score: number;
  currentGame: string;
  pieceNumber: number;
  level: number;
}
@Injectable({
  providedIn: 'root',
})
export class GameControlService implements OnDestroy {
  private readonly room$ = new ReplaySubject<string>(1);
  private readonly player$ = new ReplaySubject<string>(1);
  private readonly playersList$ = new ReplaySubject<string[]>(1);
  private readonly preview$ = new ReplaySubject<string[][]>(1);
  private readonly status$ = new ReplaySubject<GameStatus>(1);
  private destroy$ = new Subject<void>();
  private readonly error$: Observable<boolean>;
  constructor(
    private readonly ws: WebsocketService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    ws.on<string[]>('playersList')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.playersList$.next(data))
      )
      .subscribe();
    this.error$ = activatedRoute.fragment.pipe(
      map((fr) => {
        if (fr === null || !fr.endsWith(']')) {
          return true;
        }
        const [room, player] = fr
          .split(/\[|]|%5B|%5D/)
          .map((name) => name.replace('%20', ' ').trim());
        if (player?.length && room?.length) {
          this.player$.next(player);
          this.room$.next(room);
          return false;
        } else {
          this.player$.next();
          this.room$.next();
          return true;
        }
      })
    );
    ws.on<string[][]>('pieceSerial.update')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.preview$.next(data))
      )
      .subscribe();
    ws.on<GameStatus>('game.result')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.status$.next(data))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  register(room: string, player: string): void {
    console.log('registered ', { room, player });
    this.ws.send('game.register', { room, player });
  }
  player(): Observable<string> {
    return this.player$.asObservable();
  }
  room(): Observable<string> {
    return this.room$.asObservable();
  }
  error(): Observable<boolean> {
    return this.error$;
  }
  playersList(): Observable<string[]> {
    return this.playersList$.asObservable();
  }
  startGame() {
    this.ws.send('game.start');
  }
  rotate(direction: string) {
    this.ws.send('pieceRotate', direction);
  }
  move(direction: string) {
    this.ws.send('pieceMove', direction);
  }
  piecePreview() {
    return this.preview$.asObservable();
  }
  status(): Observable<GameStatus> {
    return this.status$.asObservable();
  }
}
