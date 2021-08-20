import { Injectable, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Role } from '../../interfaces/role';
import { ProfileService } from '../profile/profile.service';

interface Game {
  adminTerrain: string[];
  inGame: boolean;
  name: string;
  otherTerrain: string[];
}
@Injectable({
  providedIn: 'root',
})
export class GameControlService implements OnDestroy {
  private room$ = new ReplaySubject<string>(1);
  private player$ = new ReplaySubject<string>(1);
  private playersList$ = new ReplaySubject<string[]>(1);
  private preview$ = new ReplaySubject<string[][]>(1);
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  register(room: string, player: string): void {
    console.log('registered ', { room, player });
    this.ws.send('registerGame', { room, player });
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
    this.ws.send('startGame');
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
}
