import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { MainComponent } from './main/main.component';
import { TerrainModule } from './terrain/terrain.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, GameRoutingModule, TerrainModule],
})
export class GameModule {}
