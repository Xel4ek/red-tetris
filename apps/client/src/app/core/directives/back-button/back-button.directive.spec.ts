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

describe('BackButtonDirective', () => {
  let fixture: ComponentFixture<AboutComponent>;
  const back = jest.fn();
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [BackButtonDirective, AboutComponent],
      providers: [
        {
          provide: Location,
          useValue: {
            back: back,
          },
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
    const button = fixture.debugElement.query(
      By.directive(BackButtonDirective)
    ).nativeElement;
    button.click();
    tick();
    fixture.detectChanges();
    expect(back).toHaveBeenCalled();
  }));
});
