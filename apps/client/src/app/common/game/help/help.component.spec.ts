import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
  let fixture: ComponentFixture<HelpComponent>;
  let component: HelpComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should we created', () => {
    expect(component).toBeTruthy();
  });
  it('warning color', () => {
    fixture.componentInstance.status = 'warning';
    expect(component.background).toEqual('#cba7a7');
  });

  it('success color', () => {
    fixture.componentInstance.status = 'success';
    expect(component.background).toEqual('#a3cba1');
  });
  it('info color', () => {
    fixture.componentInstance.status = 'info';
    expect(component.background).toEqual('#a7bbd9');
  });
  it('default color', () => {
    expect(component.background).toEqual('#a7bbd9');
  });
});
