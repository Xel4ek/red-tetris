import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InfoWidgetComponent } from './info-widget.component';
import { GameControlService } from '../../../core/services/game-control/game-control.service';

describe('InfoWidgetComponent', () => {
  let fixture: ComponentFixture<InfoWidgetComponent>;
  let component: InfoWidgetComponent;
  let gameControlService: Partial<GameControlService>;
  beforeEach(async () => {
    gameControlService = {
      info: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [InfoWidgetComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: GameControlService, useValue: gameControlService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InfoWidgetComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
});
