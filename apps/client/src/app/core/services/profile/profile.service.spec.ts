import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { WebsocketService } from '../websocket/websocket.service';
import { of } from 'rxjs';
import { Role } from '../../interfaces/role';

describe('ProfileService', () => {
  let service: ProfileService;
  let webSocket: Partial<WebsocketService>;
  const profile = {
    role: Role.ADMIN,
    inGame: false,
    name: 'testName',
    room: 'testRoom',
  };
  beforeEach(() => {
    webSocket = {
      on: jest.fn().mockImplementation(() => of(profile)),
      send: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WebsocketService,
          useValue: webSocket,
        },
      ],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('player returned', () => {
    service.profile().subscribe((data) => expect(data).toEqual(profile));
  });
});
