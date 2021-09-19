import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TerrainComponent } from './terrain.component';
import { TerrainService } from './terrain.service';
import { config } from '../../core/services/websocket/websocket.token';

describe('TerrainComponent', () => {
  let fixture: ComponentFixture<TerrainComponent>;
  let component: TerrainComponent;
  let terrainService: Partial<TerrainService>;
  beforeEach(async () => {
    terrainService = {
      status: jest.fn(),
      terrain: jest.fn(),
      subscribe: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [TerrainComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: TerrainService, useValue: terrainService },
        {
          provide: config,
          useValue: {
            url: 'ws',
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TerrainComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #trackFn()', async () => {
    expect(component.trackFn(5)).toEqual(5);
  });

  it('should run #drag()', async () => {
    expect(component.drag()).toEqual(false);
  });

  it('should run #ngAfterViewInit()', async () => {
    component.ngAfterViewInit();
  });

  it('should input', () => {
    component.player = 'test';
    fixture.detectChanges();
    expect(component.terrain$).toBeTruthy();
  });
});
