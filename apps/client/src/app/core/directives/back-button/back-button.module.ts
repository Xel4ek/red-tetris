import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonDirective } from './back-button.directive';

@NgModule({
  declarations: [BackButtonDirective],
  imports: [CommonModule],
  exports: [BackButtonDirective],
})
export class BackButtonModule {}
