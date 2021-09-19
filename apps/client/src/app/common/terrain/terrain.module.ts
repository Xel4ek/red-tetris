import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerrainComponent } from './terrain.component';
import { MinoComponent } from './mino/mino.component';

@NgModule({
  declarations: [TerrainComponent, MinoComponent],
  imports: [CommonModule],
  exports: [TerrainComponent],
})
export class TerrainModule {}
