import { TestBed } from '@angular/core/testing';

import { GameControlService } from './game-control.service';
import { WebsocketService } from '../websocket/websocket.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { WelcomeComponent } from '../../../common/welcome/welcome.component';

describe('GameControlService', () => {
  let service: GameControlService;
  let webSocket: Partial<WebsocketService>;
  beforeEach(() => {
    webSocket = {
      on: jest.fn().mockImplementation(() => of(true)),
      send: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'welcome',
            component: WelcomeComponent,
          },
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: WebsocketService,
          useValue: webSocket,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    service = TestBed.inject(GameControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(' GameControlService validate', () => {
    service.validate({ lobby: 'testLobby', name: 'testName' });
    expect(webSocket.send).toBeCalled();
  });
  it('GameControlService register', () => {
    service.register('testRoom', 'testName');
    expect(webSocket.send).toBeCalled();
  });

  it('GameControlService startGame', () => {
    service.startGame();
    expect(webSocket.send).toBeCalled();
  });
  it('GameControlService rotate', () => {
    service.rotate('r');
    expect(webSocket.send).toBeCalled();
  });
  it('GameControlService move', () => {
    service.move('r');
    expect(webSocket.send).toBeCalled();
  });
});
