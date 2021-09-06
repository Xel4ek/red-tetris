import { TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Injectable,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoWidgetComponent } from './info-widget.component';
import { GameControlService } from '../../../core/services/game-control/game-control.service';

@Injectable()
class MockGameControlService {
  info = function () {};
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

describe('InfoWidgetComponent', () => {
  let fixture: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        InfoWidgetComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        OneviewPermittedDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: GameControlService, useClass: MockGameControlService },
      ],
    })
      .overrideComponent(InfoWidgetComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(InfoWidgetComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
});
