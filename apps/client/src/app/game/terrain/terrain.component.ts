import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { GameStatus, TerrainService } from './terrain.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'red-tetris-terrain[player][terrainCol]',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss'],
  providers: [TerrainService],
  styles: [
    `
      .terrain {
        grid: 1fr / repeat(var(--terrainCol), 1fr);
      }
    `,
  ],
})
export class TerrainComponent implements OnInit {
  terrain$!: Observable<string[]>;
  status$: Observable<GameStatus>;
  gameStatus = GameStatus;
  @Input() player!: string;
  @HostBinding('style.--terrainCol')
  @Input()
  terrainCol!: number;

  constructor(private readonly terrainService: TerrainService) {
    this.status$ = terrainService.status();
  }

  trackFn(index: number, item: unknown): unknown {
    return index;
  }

  ngOnInit(): void {
    this.terrainService.subscribe(this.player);
    this.terrain$ = this.terrainService.terrain();
  }
  drag() {
    return false;
  }
}
