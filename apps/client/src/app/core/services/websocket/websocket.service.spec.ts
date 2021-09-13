import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { config } from './websocket.config';
import { of } from 'rxjs';

describe('WebsocketService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: config,
          useValue: {
            url: 'testUrl',
          },
        },
      ],
    });
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('status', () => {
    service.isConnect().subscribe((status) => expect(status).toEqual(true));
    service.status = of(true);
  });
  it('send', () => {
    expect(service.send).toBeTruthy();
  });

  it('on', () => {
    expect(service.on).toBeTruthy();
  });
});
