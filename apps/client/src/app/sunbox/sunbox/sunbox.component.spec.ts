import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunboxComponent } from './sunbox.component';

describe('SunboxComponent', () => {
  let component: SunboxComponent;
  let fixture: ComponentFixture<SunboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
