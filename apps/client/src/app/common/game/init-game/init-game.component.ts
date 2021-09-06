import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../../core/interfaces/profile';
import { Role } from '../../../core/interfaces/role';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { WebsocketService } from '../../../core/services/websocket/websocket.service';
import { GameControlService } from '../../../core/services/game-control/game-control.service';

@Component({
  selector: 'red-tetris-init-game',
  templateUrl: './init-game.component.html',
  styleUrls: ['./init-game.component.css'],
})
export class InitGameComponent {
  profile$: Observable<Profile>;
  role = Role;
  playerList$: Observable<string[]>;

  constructor(
    private readonly profileService: ProfileService,
    private readonly ws: WebsocketService,
    private readonly gameControlService: GameControlService
  ) {
    this.playerList$ = gameControlService.playersList();
    this.profile$ = profileService.profile();
  }

  startGame(): void {
    this.gameControlService.startGame();
  }
}