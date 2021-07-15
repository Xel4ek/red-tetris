import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinoComponent } from './mino.component';

describe('MinoComponent', () => {
  let component: MinoComponent;
  let fixture: ComponentFixture<MinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
