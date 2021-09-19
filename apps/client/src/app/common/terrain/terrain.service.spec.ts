import { TestBed } from '@angular/core/testing';

import { GameStatus, TerrainService } from './terrain.service';
import { WebsocketService } from '../../core/services/websocket/websocket.service';
import { BehaviorSubject, of } from 'rxjs';

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

  it('terrain status', () => {
    service.subscribe('TestName');
    service
      .status()
      .subscribe((data) => expect(data).toEqual(GameStatus.ACTIVE));
  });

  it('terrain throw error', () => {
    expect(() => service.terrain()).toThrow('terrain$ is not initialize!');
  });

  it('terrain observer', () => {
    jest.spyOn(webSocket, 'on').mockImplementation(() =>
      of({
        terrain: ['1'],
        status: 1,
      })
    );
    service.subscribe('testName');
    service.terrain().subscribe((data) => expect(data).toEqual(['1']));
  });
});
