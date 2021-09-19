import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { config } from './websocket.token';
import { of } from 'rxjs';

describe('WebsocketService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: config,
          useValue: {
            url: 'ws',
          },
        },
      ],
    });
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.on).toBeTruthy();
    expect(service.send).toBeTruthy();
  });
  it('should be connect', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.connect$.next(false);
    service.isConnect().subscribe((data) => expect(data).toEqual(false));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.connect$.next(true);
    service.isConnect().subscribe((data) => expect(data).toEqual(true));
  });

  it('should be websocket', fakeAsync(() => {
    const before = jest.fn();
    const after = jest.fn();
    const sub = service.on('some', before, after).subscribe();
    tick();
    expect(before).toBeCalled();
    sub.unsubscribe();
    tick();
    expect(after).toBeCalled();
  }));

  it('should be call native', () => {
    const send = jest.fn();
    const multiplex = jest
      .fn()
      .mockImplementation(() => of({ event: 'event', data: 'go' }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.websocket$ = {
      next: send,
      multiplex: multiplex,
    };
    service.on('event').subscribe();
    service.send<{ ms: string }>('event', {
      ms: 'lol',
    });
    expect(send).toBeCalled();
    expect(multiplex).toBeCalled();
  });
});
