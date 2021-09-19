import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { GameControlService } from '../../../core/services/game-control/game-control.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { from, of } from 'rxjs';
import { Role } from '../../../core/interfaces/role';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { WelcomeComponent } from '../../welcome/welcome.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('MainComponent', () => {
  let fixture: ComponentFixture<MainComponent>;
  let component: MainComponent;

  let gameService: Partial<GameControlService>;
  let profileService: Partial<ProfileService>;
  let title: Partial<Title>;
  let router: Partial<ActivatedRoute>;
  beforeEach(async () => {
    router = {
      fragment: from(['', 'dad1211', '2[2]', '2[]', '[2]']),
    };
    title = {
      setTitle: jest.fn(),
    };
    gameService = {
      settings: () =>
        of({
          width: 10,
          height: 20,
          previewRow: 2,
          border: '#fff',
        }),
      move: jest.fn(),
      rotate: jest.fn(),
      drop: jest.fn(),
    };
    profileService = {
      profile: () =>
        of({
          role: Role.ADMIN,
          inGame: true,
          name: 'testName',
          room: 'testRoom',
        }),
    };
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'welcome',
            component: WelcomeComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: GameControlService,
          useValue: gameService,
        },
        {
          provide: ProfileService,
          useValue: profileService,
        },
        {
          provide: Title,
          useValue: title,
        },
        {
          provide: ActivatedRoute,
          useValue: router,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  });
  it('should to be created', () => {
    expect(component).toBeTruthy();
  });

  it('keys pressed handleKeyboardEvent', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.handleKeyboardEvent('KeyA');
    expect(gameService.move).toBeCalledWith('l');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.handleKeyboardEvent('KeyW');
    expect(gameService.rotate).toBeCalledWith('l');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.handleKeyboardEvent('KeyD');
    expect(gameService.move).toBeCalledWith('r');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.handleKeyboardEvent('KeyS');
    expect(gameService.move).toBeCalledWith('d');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.handleKeyboardEvent('Space');
    expect(gameService.drop).toBeCalled();
  });

  it('registration', () => {
    router.fragment = of('2[2]');
    component.playerList$.subscribe((data) => expect(data).toEqual('2'));
  });
});
