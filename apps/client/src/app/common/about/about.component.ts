import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'red-tetris-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  constructor(private readonly title: Title) {
    this.title.setTitle('About');
  }
}
