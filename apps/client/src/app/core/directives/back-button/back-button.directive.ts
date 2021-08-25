import { Directive, ElementRef, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[redTetrisBackButton]',
})
export class BackButtonDirective {
  constructor(
    private readonly elementRef: ElementRef,
    private readonly location: Location
  ) {}
  @HostListener('click')
  back() {
    this.location.back();
  }
}
