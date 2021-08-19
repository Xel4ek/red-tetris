import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { MainComponent } from './main/main.component';
import { TerrainModule } from './terrain/terrain.module';
import { InitGameComponent } from './init-game/init-game.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { SecureModule } from '../core/directives/secure/secure.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MainComponent, InitGameComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    TerrainModule,
    MatListModule,
    MatExpansionModule,
    SecureModule,
    MatButtonModule,
  ],
})
export class GameModule {}
