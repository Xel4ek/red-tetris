import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardsComponent } from './leaderboards.component';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import { Observable, of } from 'rxjs';

describe('LeaderboardsComponent', () => {
  let webService: Partial<WebsocketService>;
  let component: LeaderboardsComponent;
  let fixture: ComponentFixture<LeaderboardsComponent>;
  beforeEach(async () => {
    webService = {
      on(event: string): Observable<any> {
        return of([
          {
            name: 'test',
            pvp: 0,
            score: 1,
          },
        ]);
      },
      send: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [LeaderboardsComponent],
      providers: [
        {
          provide: WebsocketService,
          useValue: webService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LeaderboardsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
