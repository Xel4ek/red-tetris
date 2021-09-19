import { BackButtonDirective } from './back-button.directive';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AboutComponent } from '../../../common/about/about.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { windowToken } from '../../tokens/window.token';
import { Router } from '@angular/router';

describe('BackButtonDirective', () => {
  let fixture: ComponentFixture<AboutComponent>;
  const back = jest.fn();
  let window: { history: { length: number } };
  let router: Partial<Router>;
  beforeEach(() => {
    window = {
      history: { length: 1 },
    };
    router = {
      navigate: jest.fn(),
    };
    fixture = TestBed.configureTestingModule({
      declarations: [BackButtonDirective, AboutComponent],
      providers: [
        {
          provide: Location,
          useValue: {
            back: back,
          },
        },
        {
          provide: windowToken,
          useValue: window,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(AboutComponent);
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    const el = fixture.debugElement.query(By.directive(BackButtonDirective));
    expect(el).toBeTruthy();
  });
  it('should back called', fakeAsync(() => {
    window.history.length = 2;
    const button = fixture.debugElement.query(
      By.directive(BackButtonDirective)
    ).nativeElement;
    button.click();
    tick();
    fixture.detectChanges();
    expect(back).toHaveBeenCalled();
  }));
  it('should back called', fakeAsync(() => {
    window = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      history: { length: 1 },
    };
    const button = fixture.debugElement.query(
      By.directive(BackButtonDirective)
    ).nativeElement;
    button.click();
    tick();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  }));
});
