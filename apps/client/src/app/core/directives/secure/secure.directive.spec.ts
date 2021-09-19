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
import { GameControlService } from '../../services/game-control/game-control.service';
import { ProfileService } from '../../services/profile/profile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Role } from '../../interfaces/role';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';

describe('SecureDirective', () => {
  let fixture: ComponentFixture<InitGameComponent>;
  let viewContainerRef: Partial<ViewContainerRef>;
  let profileService: Partial<ProfileService>;
  beforeEach(() => {
    viewContainerRef = {
      createEmbeddedView: jest.fn(),
      clear: jest.fn(),
    };
    profileService = {
      profile: jest.fn().mockImplementation(() =>
        of({
          role: Role.ADMIN,
          inGame: false,
          name: 'testName',
          room: 'testRoom',
        })
      ),
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SecureDirective, InitGameComponent],
      providers: [
        {
          provide: GameControlService,
          useValue: {
            playersList: () => of(['test']),
          },
        },
        { provide: ProfileService, useValue: profileService },
        ViewContainerRef,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
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
