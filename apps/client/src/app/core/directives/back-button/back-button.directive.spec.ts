import { BackButtonDirective } from './back-button.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from '../../../common/about/about.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { By } from '@angular/platform-browser';

describe('BackButtonDirective', () => {
  let fixture: ComponentFixture<AboutComponent>;
  const locationBack = jest.fn;
  let location: { back: any };
  beforeEach(() => {
    location = {
      back: locationBack,
    };
    fixture = TestBed.configureTestingModule({
      declarations: [BackButtonDirective, AboutComponent],
      providers: [
        {
          provide: Location,
          useValue: location,
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
  it('should back called', () => {
    const button = fixture.debugElement.query(
      By.directive(BackButtonDirective)
    ).nativeElement;
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(locationBack).toHaveBeenCalled();
    });
  });
});
