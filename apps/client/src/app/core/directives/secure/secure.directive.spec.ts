import { SecureDirective } from './secure.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { Profile } from '../../interfaces/profile';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SecureDirective', () => {
  let fixture: ComponentFixture<InitGameComponent>;
  let component: InitGameComponent;
  let player: Profile;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SecureDirective, InitGameComponent],
      providers: [
        { provide: config, useValue: { url: 'test' } },
        WebsocketService,
        GameControlService,
        ProfileService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).createComponent(InitGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    player = {
      role: Role.ADMIN,
      inGame: false,
      name: 'testName',
      room: 'testRoom',
    };
    component.profile$ = of(player);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const el = fixture.debugElement.query(By.directive(SecureDirective));
      expect(el).toBeTruthy();
    });
  });
});
