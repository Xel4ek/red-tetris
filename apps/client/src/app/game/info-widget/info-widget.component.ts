import { Component, OnInit } from '@angular/core';
import {
  GameControlService,
  GameInfo,
} from '../../core/services/game-control/game-control.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'red-tetris-info-widget',
  templateUrl: './info-widget.component.html',
  styleUrls: ['./info-widget.component.css'],
})
export class InfoWidgetComponent {
  info$: Observable<GameInfo>;
  constructor(private readonly gameControlService: GameControlService) {
    this.info$ = gameControlService.info();
  }
}
