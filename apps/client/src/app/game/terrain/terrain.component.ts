import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GameStatus, TerrainService } from './terrain.service';
import { Observable, timer } from 'rxjs';

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
      .status {
        font-size: var(--size);
      }
    `,
  ],
})
export class TerrainComponent implements OnInit, AfterViewInit {
  terrain$!: Observable<string[]>;
  status$: Observable<GameStatus>;
  gameStatus = GameStatus;
  @Input() title?: string;
  @Input() player!: string;
  @HostBinding('style.--terrainCol')
  @Input()
  terrainCol!: number;
  @ViewChild('container')
  private readonly elementRef!: ElementRef;
  @HostBinding('style.--size')
  private size!: string;

  constructor(private readonly terrainService: TerrainService) {
    this.status$ = terrainService.status();
  }

  trackFn(index: number): number {
    return index;
  }

  ngOnInit(): void {
    this.terrainService.subscribe(this.player);
    this.terrain$ = this.terrainService.terrain();
  }

  drag() {
    return false;
  }

  ngAfterViewInit(): void {
    timer(0).subscribe({
      complete: () =>
        (this.size =
          Math.trunc(this.elementRef.nativeElement.offsetWidth / 4) + 'px'),
    });
  }
}
