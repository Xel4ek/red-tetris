import { Injectable, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';
import { takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface GameStatus {
  score: number;
  currentGame: string;
  pieceNumber: number;
  level: number;
}

export interface GameSettings {
  width: number;
  height: number;
  previewRow: number;
  border: string;
}

export interface GameInfo {
  level: number;
  score: number;
  piece: number;
}

export interface ValidateDto {
  lobby: boolean;
  name: boolean;
}

export interface ValidateQueryDto {
  lobby: string;
  name: string;
}

export interface ErrorMessage {
  message: string;
  lobby: string;
  name: string;
}

@Injectable({
  providedIn: 'any',
})
export class GameControlService implements OnDestroy {
  private readonly room$ = new ReplaySubject<string>(1);
  private readonly player$ = new ReplaySubject<string>(1);
  private readonly playersList$ = new ReplaySubject<string[]>(1);
  private readonly preview$ = new ReplaySubject<string[]>(1);
  private readonly status$ = new ReplaySubject<GameStatus>(1);
  private readonly settings$ = new ReplaySubject<GameSettings>(1);
  private readonly info$ = new Subject<GameInfo>();
  private readonly validation$ = new ReplaySubject<ValidateDto>(1);
  private destroy$ = new Subject<void>();

  constructor(
    private readonly ws: WebsocketService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly httpClient: HttpClient,
    private router: Router
  ) {
    ws.on<ErrorMessage>('error')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          this.router.navigate(['/welcome'], { state: data });
        })
      )
      .subscribe();
    ws.on<GameInfo>('game.info')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.info$.next(data))
      )
      .subscribe();
    ws.on<GameSettings>('game.setup')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.settings$.next(data))
      )
      .subscribe();
    ws.on<string[]>('playersList')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.playersList$.next(data))
      )
      .subscribe();
    ws.on<string[]>('pieceSerial.update')
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
    this.ws
      .on<ValidateDto>('game.register.validate')
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.validation$.next(data))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validate(data: ValidateQueryDto): void {
    this.ws.send('game.register.validate', data);
  }

  register(room: string, player: string): void {
    this.ws.send('game.register', { room, player });
  }

  player(): Observable<string> {
    return this.player$.asObservable();
  }

  room(): Observable<string> {
    return this.room$.asObservable();
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

  settings(): Observable<GameSettings> {
    return this.settings$.asObservable();
  }

  info(): Observable<GameInfo> {
    return this.info$.asObservable();
  }

  validation(): Observable<ValidateDto> {
    return this.validation$.asObservable();
  }

  httpValidation(data: ValidateQueryDto): Observable<ValidateDto> {
    return this.httpClient.post<ValidateDto>('/api/registration', data);
  }
}
