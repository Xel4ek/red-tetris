import { Component, OnInit } from '@angular/core';
import { TerrainService } from './terrain.service';
import { Observable } from 'rxjs';
import { TERRAIN_SOURCE } from './token/terrain.token';

@Component({
  selector: 'red-tetris-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss'],
  providers: [
    TerrainService,
    {
      provide: TERRAIN_SOURCE,
      useValue: 'playerTerrain',
    },
  ],
})
export class TerrainComponent {
  terrain: Observable<string[]>;
  constructor(private readonly terrainService: TerrainService) {
    this.terrain = terrainService.terrain();
  }
  trackFn(index: number, item: unknown): unknown {
    return item;
  }
}
