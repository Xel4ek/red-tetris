import { SecureDirective } from './secure.directive';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { InitGameComponent } from '../../../common/game/init-game/init-game.component';
import { By } from '@angular/platform-browser';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { GameControlService } from '../../services/game-control/game-control.service';
import { ProfileService } from '../../services/profile/profile.service';
import { config } from '../../services/websocket/websocket.config';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Role } from '../../interfaces/role';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';

describe('SecureDirective', () => {
  let fixture: ComponentFixture<InitGameComponent>;
  let profileService: ProfileService;
  let viewContainerRef: Partial<ViewContainerRef>;
  beforeEach(() => {
    viewContainerRef = {
      createEmbeddedView: jest.fn(),
      clear: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SecureDirective, InitGameComponent],
      providers: [
        { provide: config, useValue: { url: 'test' } },
        WebsocketService,
        GameControlService,
        ProfileService,
        ViewContainerRef,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    const subject = new BehaviorSubject({
      role: Role.ADMIN,
      inGame: false,
      name: 'testName',
      room: 'testRoom',
    });
    profileService = TestBed.inject(ProfileService);
    jest
      .spyOn(profileService, 'profile')
      .mockImplementation(() => subject.asObservable());
    fixture = TestBed.createComponent(InitGameComponent);
    fixture.detectChanges();
  });
  it('should create an instance', fakeAsync(() => {
    const el = fixture.debugElement.query(By.directive(SecureDirective));
    tick();
    const profileServiceProfile = jest.spyOn(profileService, 'profile');
    expect(el).not.toBeTruthy();
    expect(viewContainerRef.clear).not.toBeCalled();
    expect(profileServiceProfile).toBeCalled();
  }));
});
