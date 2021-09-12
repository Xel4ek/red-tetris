import { FormBuilder } from '@angular/forms';
import { Navigation, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  GameControlService,
  ValidateDto,
} from '../../core/services/game-control/game-control.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { Observable, of } from 'rxjs';

describe('WelcomeComponent', () => {
  let formBuilder: FormBuilder;
  let router: Partial<Router>;
  let title: Title;
  let gameControlService: Partial<GameControlService>;
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    router = {
      getCurrentNavigation(): Navigation | null {
        return null;
      },
      navigate: jest.fn().mockImplementation((args: any) => {}),
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
  // it('destroy', () => {
  //   const destroy = jest.spyOn(component, 'destroy$');
  //   component.ngOnDestroy();
  //   fixture.detectChanges();
  //   expect(destroy).toHaveBeenCalled();
  // });
});
