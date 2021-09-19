import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MinoComponent } from './mino.component';

describe('MinoComponent', () => {
  let fixture: ComponentFixture<MinoComponent>;
  let component: MinoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();
    fixture = TestBed.createComponent(MinoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
});
