import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GameControlService,
  GameInfo,
} from '../../../core/services/game-control/game-control.service';

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
