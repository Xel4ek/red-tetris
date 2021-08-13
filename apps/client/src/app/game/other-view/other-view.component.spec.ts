import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherViewComponent } from './other-view.component';

describe('OtherViewComponent', () => {
  let component: OtherViewComponent;
  let fixture: ComponentFixture<OtherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
