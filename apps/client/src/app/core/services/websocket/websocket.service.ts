import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  interval,
  Observable,
  Observer,
  Subject,
  SubscriptionLike,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  share,
  takeWhile,
} from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import {
  IWebsocketService,
  IWsMessage,
  WebSocketConfig,
} from './websocket.interfaces';
import { config } from './websocket.config';

@Injectable({
  providedIn: 'any',
})
export class WebsocketService implements IWebsocketService, OnDestroy {
  public status: Observable<boolean>;
  private readonly config: WebSocketSubjectConfig<IWsMessage<unknown>>;
  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;
  private reconnection$: Observable<number> | null = null;
  private websocket$: WebSocketSubject<IWsMessage<unknown>> | null = null;
  private connection$?: Observer<boolean>;
  private wsMessages$: Subject<IWsMessage<unknown>>;
  private reconnectInterval: number;
  private readonly reconnectAttempts: number;
  private isConnected = false;

  constructor(@Inject(config) private wsConfig: WebSocketConfig) {
    this.wsMessages$ = new Subject<IWsMessage<unknown>>();

    this.reconnectInterval = wsConfig.reconnectInterval || 5000; // pause between connections
    this.reconnectAttempts = wsConfig.reconnectAttempts || 10; // number of connection attempts

    this.config = {
      url: wsConfig.url,
      closeObserver: {
        next: () => {
          this.websocket$ = null;
          this.connection$?.next(false);
        },
      },
      openObserver: {
        next: () => this.connection$?.next(true),
      },
    };
    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status.subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (!this.reconnection$ && !isConnected) {
        this.reconnect();
      }
    });

    this.websocketSub = this.wsMessages$.subscribe({
      next: () => null,
      error: () => null,
    });

    this.connect();
  }

  isConnect(): Observable<boolean> {
    return this.status;
  }

  ngOnDestroy(): void {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  /*
   * on message event
   * */

  public on<T>(event: string): Observable<T> {
    return this.wsMessages$.pipe(
      filter((message: IWsMessage<unknown>) => message.event === event),
      map((message: IWsMessage<unknown>) => message.data as T)
    );
  }

  /*
   * on message to server
   * */
  public send(event: string, data: unknown = {}): void {
    if (event && this.isConnected) {
      this.websocket$?.next({ event, data });
    } else {
      this.status.pipe(first()).subscribe({
        next: () => this.websocket$?.next({ event, data }),
        error: () => console.error('Send error'),
      });
    }
  }

  /*
   * connect to WebSocked
   * */

  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe({
      next: (message) => {
        // console.log(message);
        this.wsMessages$.next(message);
      },
      error: () => {
        if (!this.websocket$) {
          this.reconnect();
        }
      },
    });
  }

  /*
   * reconnect if not connecting or errors
   * */
  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval).pipe(
      takeWhile(
        (v, index) => index < this.reconnectAttempts && !this.websocket$
      )
    );

    this.reconnection$.subscribe({
      next: () => this.connect(),
      error: () => null,
      complete: () => {
        // Subject complete if reconnect attemts ending
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$?.complete();
        }
      },
    });
  }
}
