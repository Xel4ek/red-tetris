import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { MainComponent } from './main/main.component';
import { TerrainModule } from './terrain/terrain.module';
import { InitGameComponent } from './init-game/init-game.component';
import { MatListModule } from '@angular/material/list';
import { MainViewComponent } from './main-view/main-view.component';
import { OtherViewComponent } from './other-view/other-view.component';

@NgModule({
  declarations: [MainComponent, InitGameComponent, MainViewComponent, OtherViewComponent],
  imports: [CommonModule, GameRoutingModule, TerrainModule, MatListModule],
})
export class GameModule {}
