// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TerrainComponent } from './terrain.component';
import { TerrainService } from './terrain.service';

@Injectable()
class MockTerrainService {
  status = function () {};
}

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted: any;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

describe('TerrainComponent', () => {
  let fixture: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        TerrainComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        OneviewPermittedDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [{ provide: TerrainService, useClass: MockTerrainService }],
    })
      .overrideComponent(TerrainComponent, {
        set: {
          providers: [
            { provide: TerrainService, useClass: MockTerrainService },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(TerrainComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #trackFn()', async () => {
    component.trackFn({});
  });

  it('should run #drag()', async () => {
    component.drag();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.elementRef = component.elementRef || {};
    component.elementRef.nativeElement = {
      offsetWidth: {},
    };
    component.ngAfterViewInit();
  });
});
