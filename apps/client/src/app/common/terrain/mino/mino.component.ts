import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'red-tetris-mino',
  templateUrl: './mino.component.html',
  styleUrls: ['./mino.component.scss'],
  styles: [
    `
      :host {
        background-color: var(--color);
      }
    `,
  ],
})
export class MinoComponent {
  @HostBinding('style.--color')
  @Input()
  color!: string;
}
