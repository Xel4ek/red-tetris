import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'red-tetris-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  constructor(
    private readonly location: Location,
    private readonly title: Title
  ) {
    this.title.setTitle('About');
  }
  back() {
    this.location.back();
  }
}
