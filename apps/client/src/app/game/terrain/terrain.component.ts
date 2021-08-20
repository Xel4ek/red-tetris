import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { TerrainService } from './terrain.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'red-tetris-terrain[player]',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss'],
  providers: [TerrainService],
  styles: [
    `
      .terrain {
        grid: repeat(var(--terrainRow), 1fr) / repeat(var(--terrainCol), 1fr);
      }
    `,
  ],
})
export class TerrainComponent implements OnInit {
  terrain$!: Observable<string[]>;
  @Input() player!: string;
  @HostBinding('style.--terrainRow')
  @Input()
  terrainRow = 21;
  @HostBinding('style.--terrainCol')
  @Input()
  terrainCol = 12;

  constructor(private readonly terrainService: TerrainService) {}

  trackFn(index: number, item: unknown): unknown {
    return index;
  }

  ngOnInit(): void {
    console.log('TerrainComponent ', this.player);
    this.terrainService.subscribe(this.player);
    this.terrain$ = this.terrainService.terrain();
  }
}
