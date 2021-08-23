import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { WebsocketService } from '../websocket/websocket.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Profile } from '../../interfaces/profile';

@Injectable({
  providedIn: 'any',
})
export class ProfileService implements OnDestroy {
  private profile$ = new ReplaySubject<Profile>(1);
  private destroy$ = new Subject<void>();
  constructor(private readonly websocketService: WebsocketService) {
    websocketService
      .on<Profile>('profile')
      .pipe(
        takeUntil(this.destroy$),
        tap((profile) => {
          this.profile$.next(profile);
        })
      )
      .subscribe();
  }
  profile(): Observable<Profile> {
    return this.profile$.asObservable();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
