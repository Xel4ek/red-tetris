import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InitGameComponent } from './init-game.component';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { GameControlService } from '../../../core/services/game-control/game-control.service';
import { WebsocketService } from '../../../core/services/websocket/websocket.service';

describe('InitGameComponent', () => {
  let fixture: ComponentFixture<InitGameComponent>;
  let component: InitGameComponent;
  let profileService: Partial<ProfileService>;
  let websocketService: Partial<WebsocketService>;
  let gameControlService: Partial<GameControlService>;
  beforeEach(async () => {
    profileService = {
      profile: jest.fn(),
    };
    gameControlService = {
      playersList: jest.fn(),
      startGame: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [InitGameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProfileService, useValue: profileService },
        { provide: WebsocketService, useValue: websocketService },
        { provide: GameControlService, useValue: gameControlService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InitGameComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #startGame()', async () => {
    component.startGame();
    expect(gameControlService.startGame).toBeCalled();
  });
});
