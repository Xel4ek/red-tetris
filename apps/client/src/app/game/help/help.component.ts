import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'red-tetris-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  styles: [
    `
      .help {
        background: var(--helpColor);
      }
    `,
  ],
})
export class HelpComponent {
  @Input()
  status: 'warning' | 'info' | 'success' = 'info';
  @HostBinding('style.--helpColor')
  get background(): string {
    if (this.status === 'info') return '#a7bbd9';
    if (this.status === 'success') return '#a3cba1';
    return '#cba7a7';
  }
}
