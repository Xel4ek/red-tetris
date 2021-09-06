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

describe('BackButtonDirective', () => {
  let fixture: ComponentFixture<AboutComponent>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [BackButtonDirective, AboutComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).createComponent(AboutComponent);
    fixture.detectChanges();
  });
  it('should create an instance', () => {
    const el = fixture.debugElement.query(By.directive(BackButtonDirective));
    expect(el).toBeTruthy();
  });
});
