import { Directive, ElementRef, HostListener, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { windowToken } from '../../tokens/window.token';

@Directive({
  selector: '[redTetrisBackButton]',
})
export class BackButtonDirective {
  constructor(
    private readonly elementRef: ElementRef,
    private readonly location: Location,
    @Inject(windowToken) private readonly window: Window,
    private readonly router: Router
  ) {}
  @HostListener('click')
  back() {
    if (this.window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['']);
    }
  }
}
