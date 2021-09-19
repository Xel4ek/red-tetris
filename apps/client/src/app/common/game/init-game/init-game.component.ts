import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../../core/interfaces/profile';
import { Role } from '../../../core/interfaces/role';
import { ProfileService } from '../../../core/services/profile/profile.service';
import {
  GameControlService,
  PlayerDto,
} from '../../../core/services/game-control/game-control.service';

@Component({
  selector: 'red-tetris-init-game',
  templateUrl: './init-game.component.html',
  styleUrls: ['./init-game.component.scss'],
})
export class InitGameComponent {
  profile$: Observable<Profile>;
  role = Role;
  playerList$: Observable<PlayerDto[]>;
  roleName: Record<Role, string> = {
    '0': 'Anonymous',
    '1': 'Spectral',
    '2': 'Player',
    '3': 'Admin',
  };

  constructor(
    private readonly profileService: ProfileService,
    private readonly gameControlService: GameControlService
  ) {
    this.playerList$ = gameControlService.playersList();
    this.profile$ = profileService.profile();
  }

  startGame(): void {
    this.gameControlService.startGame();
  }
}
