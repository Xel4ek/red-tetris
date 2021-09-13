import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  GameControlService,
  ValidateDto,
} from '../../core/services/game-control/game-control.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeComponent', () => {
  let router: Partial<Router>;
  let gameControlService: Partial<GameControlService>;
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    router = {
      getCurrentNavigation(): Navigation | null {
        return null;
      },
      navigate: jest.fn(),
    };
    gameControlService = {
      validation(): Observable<ValidateDto> {
        return of({
          lobby: true,
          name: true,
        });
      },
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
});
