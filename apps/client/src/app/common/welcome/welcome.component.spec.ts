import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GameControlService } from '../../core/services/game-control/game-control.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeComponent', () => {
  let router: Partial<Router>;
  let gameControlService: Partial<GameControlService>;
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    router = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getCurrentNavigation: () => ({
        extras: {
          state: {
            lobby: 'testLobby',
            name: 'testName',
          },
        },
      }),
      navigate: jest.fn(),
    };
    gameControlService = {
      validation: jest.fn().mockImplementation(() =>
        of({
          lobby: true,
          name: true,
        })
      ),
      httpValidation: jest
        .fn()
        .mockImplementation(() => of({ lobby: true, name: true })),
      validate: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [WelcomeComponent],
      providers: [
        {
          provide: GameControlService,
          useValue: gameControlService,
        },
        {
          provide: Router,
          useValue: router,
        },
        FormBuilder,
        Title,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('redirect', () => {
    component.redirect();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  });
  it('destroy', () => {
    const destroy = jest.spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    fixture.detectChanges();
    expect(destroy).toHaveBeenCalled();
  });
  it('exist ', () => {
    jest.spyOn(component.registerFormGroup, 'markAllAsTouched');
    fixture.detectChanges();
    expect(gameControlService.validation).toBeCalled();
  });
  it('should be change detect', () => {
    component.registerFormGroup.setValue({ name: 'test', lobby: 'test lobby' });
    expect(gameControlService.validate).toBeCalled();
  });
});
