import { Component, Input, OnInit } from '@angular/core';
import { TerrainService } from './terrain.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'red-tetris-terrain[player]',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss'],
  providers: [TerrainService],
})
export class TerrainComponent implements OnInit {
  terrain$!: Observable<string[]>;
  @Input() player!: string;
  constructor(private readonly terrainService: TerrainService) {}
  trackFn(index: number, item: unknown): unknown {
    return item;
  }
  ngOnInit(): void {
    console.log('TerrainComponent ', this.player);
    this.terrainService.subscribe(this.player);
    this.terrain$ = this.terrainService.terrain();
  }
}
