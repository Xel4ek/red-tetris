import { TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Injectable,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InitGameComponent } from './init-game.component';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { GameControlService } from '../../../core/services/game-control/game-control.service';
import { WebsocketService } from '../../../core/services/websocket/websocket.service';

@Injectable()
class MockProfileService {
  profile = function () {};
}

@Injectable()
class MockWebsocketService {}

@Injectable()
class MockGameControlService {
  playersList = function () {};
}

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted: any;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

describe('InitGameComponent', () => {
  let fixture: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        InitGameComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        OneviewPermittedDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProfileService, useClass: MockProfileService },
        { provide: WebsocketService, useClass: MockWebsocketService },
        { provide: GameControlService, useClass: MockGameControlService },
      ],
    })
      .overrideComponent(InitGameComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(InitGameComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #startGame()', async () => {
    component.gameControlService = component.gameControlService || {};
    component.gameControlService.startGame = jest.fn();
    component.startGame();
    // expect(component.gameControlService.startGame).toHaveBeenCalled();
  });
});
