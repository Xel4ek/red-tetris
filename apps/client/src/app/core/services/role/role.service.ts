import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Role } from '../../interfaces/role';
import { WebsocketService } from '../websocket/websocket.service';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService implements OnDestroy {
  private role$ = new BehaviorSubject<Role>(Role.ANTONYMOUS);
  private destroy$ = new Subject<void>();
  constructor(private readonly websocketService: WebsocketService) {
    websocketService
      .on<{ role: Role }>('profile')
      .pipe(
        takeUntil(this.destroy$),
        tap(({ role }: { role: Role }) => this.role$.next(role))
      )
      .subscribe();
  }
  role(): Observable<Role> {
    return this.role$.asObservable();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
