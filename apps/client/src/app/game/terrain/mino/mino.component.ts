import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'red-tetris-mino',
  templateUrl: './mino.component.html',
  styleUrls: ['./mino.component.scss'],
  styles: [
    `
      .mino {
        background-color: var(--color);
      }
    `,
  ],
})
export class MinoComponent implements OnInit {
  @HostBinding('style.--color')
  @Input()
  color!: string;

  constructor() {}

  ngOnInit(): void {}
}
