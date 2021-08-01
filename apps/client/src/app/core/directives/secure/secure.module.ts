import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecureDirective } from './secure.directive';

@NgModule({
  declarations: [SecureDirective],
  imports: [CommonModule],
  exports: [SecureDirective],
})
export class SecureModule {}
