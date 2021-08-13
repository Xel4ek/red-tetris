import { Component, OnInit } from '@angular/core';
import { TerrainService } from '../terrain/terrain.service';
import { TERRAIN_SOURCE } from '../terrain/token/terrain.token';

@Component({
  selector: 'red-tetris-other-view',
  templateUrl: './other-view.component.html',
  styleUrls: ['./other-view.component.css'],
  providers: [
    TerrainService,
    {
      provide: TERRAIN_SOURCE,
      useValue: 'otherTerrain',
    },
  ],
})
export class OtherViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
