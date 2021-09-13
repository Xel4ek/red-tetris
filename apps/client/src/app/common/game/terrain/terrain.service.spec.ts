import { TestBed } from '@angular/core/testing';

import { GameStatus, TerrainService } from './terrain.service';
import { WebsocketService } from '../../../core/services/websocket/websocket.service';
import { BehaviorSubject } from 'rxjs';

describe('TerrainService', () => {
  let service: TerrainService;
  let webSocket: Partial<WebsocketService>;
  const server = new BehaviorSubject<{ terrain: string[]; data: GameStatus }>({
    terrain: [],
    data: GameStatus.ACTIVE,
  });
  beforeEach(() => {
    webSocket = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      on: jest.fn().mockImplementation(() => server.asObservable()),
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
    service = TestBed.inject(TerrainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('terrain create', () => {
    service.subscribe('Test Name');
    expect(service.terrain()).toBeDefined();
  });
  it('terrain status', () => {
    service.subscribe('TestName');
    service
      .status()
      .subscribe((data) => expect(data).toEqual(GameStatus.ACTIVE));
  });

  it('terrain throw error', () => {
    expect(service.terrain).toThrow(Error);
  });
});
