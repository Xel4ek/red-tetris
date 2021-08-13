import { Component, OnInit } from '@angular/core';
import { TerrainService } from '../terrain/terrain.service';
import { TERRAIN_SOURCE } from '../terrain/token/terrain.token';

@Component({
  selector: 'red-tetris-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  providers: [
    TerrainService,
    {
      provide: TERRAIN_SOURCE,
      useValue: 'adminTerrain',
    },
  ],
})
export class MainViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
