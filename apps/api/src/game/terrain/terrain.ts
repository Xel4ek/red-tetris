import { BehaviorSubject, interval, Subject } from 'rxjs';
import { Piece, PieceGenerator } from '../../terrain/piece';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

export class Terrain {
  get terrain(): string[] {
    return this._terrain;
  }

  set terrain(value: string[]) {
    this._terrain = value;
    const clone = Object.assign([], value);
    this.terrain2D = Array(Terrain.height).fill(Array(Terrain.width)).map(() => clone.splice(0, Terrain.width));
  }

  private static empty = '#ffffff';
  private static preview = '#6766669E';
  private static baseScore = 100;
  private static previewRow = 6;
  private static levelUpRows = 10;
  private static width = 10;
  private static height = 20;
  static border = '#4e4747';
  private _terrain: string[];
  terrain2D: string[][];
  piece: Piece;
  x: number;
  y: number;
  private destroy$ = new Subject<void>();
  private updateTime = new BehaviorSubject<number>(1000);
  private pieceColor = Terrain.randomColor();
  private pieceSerialNumber = 0;
  score: number;
  private level: number;
  private removedRows: number;
  private inGame = false;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly pieceGenerator: PieceGenerator
  ) {
    this.terrain = Array(Terrain.height * Terrain.width).fill(Terrain.empty);
    this.piece = this.getNextPiece();
    this.x = Math.trunc((Terrain.width - this.piece.size) / 2);
    this.y = 0;
    this.score = 0;
    this.level = 1;
    this.removedRows = 0;
  }

  public static settings() {
    return {
      width: Terrain.width,
      height: Terrain.height,
      previewRow: Terrain.previewRow,
      border: Terrain.border,
    };
  }

  private static randomColor(): string {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  updateScore(miss: number) {
    this.score += this.level * Terrain.baseScore * miss;
    this.removedRows += miss;
    const level = Math.trunc(this.removedRows / Terrain.levelUpRows) + 1;
    if (level !== this.level) {
      this.level = level;
      this.updateTime.next(this.updateTime.getValue() * 0.9);
    }
    this.eventEmitter.emit('score.update', this);
  }

  missRow(rows: number) {
    console.log("row:" + rows);
    if (
      this.terrain
        .slice(0, rows * Terrain.width)
        .every((point) => point === Terrain.empty)
    ) {
      this.terrain = [
        ...this.terrain.slice(rows * Terrain.width),
        ...Array.from({ length: rows * Terrain.width }, () => Terrain.border),
      ];

      this.share();
    } else {
      this.eventEmitter.emit('terrain.overflow', this);
    }
  }

  rotate(direction: 'r' | 'l'): Terrain {
    if (!this.inGame) return this;
    this.piece.rotate(direction);
    if (!this.validate()) {
      this.piece.rotate(direction === 'r' ? 'l' : 'r');
      this.piece.rotate(direction === 'r' ? 'l' : 'r');
      this.piece.rotate(direction === 'r' ? 'l' : 'r');
    } else {
      this.share();
    }
    return this;
  }

  move(direction: 'l' | 'r' | 'd'): Terrain {
    if (!this.inGame) return this;
    const posX = this.x;
    const posY = this.y;
    if (direction === 'r') {
      this.x += 1;
    }
    if (direction === 'l') {
      this.x -= 1;
    }
    if (direction === 'd') {
      this.y += 1;
    }
    if (!this.validate()) {
      this.x = posX;
      this.y = posY;
      if (direction === 'd') {
        this.resetPiece();
        this.share();
      }
    } else {
      this.share();
    }
    return this;
  }

  merge(): string[] {
    const positionRow = this.y;
    const positionCol = this.x;
    return this.terrain.map((el, index) => {
      const row = Math.trunc(index / Terrain.width);
      const col = index % Terrain.width;
      if (
        row >= positionRow &&
        row < positionRow + this.piece.size &&
        col >= positionCol &&
        col < positionCol + this.piece.size
      ) {
        return this.piece.show()[
        (row - positionRow) * this.piece.size + (col - positionCol)
          ]
          ? this.pieceColor
          : el;
      }
      return el;
    });
  }

  start() {
    this.inGame = true;
    this.share();
    this.updateTime
      .pipe(
        switchMap((time) => interval(time)),
        takeUntil(this.destroy$),
        tap(() => this.move('d'))
      )
      .subscribe();
  }

  stop() {
    this.inGame = false;
    this.share();
    console.log('game stop');
    this.destroy$.next();
    this.destroy$.complete();
  }

  share() {
    this.eventEmitter.emit('terrain.update', this);
  }

  status() {
    return {
      level: this.level,
      score: this.score,
      piece: this.pieceSerialNumber,
    };
  }

  private resetPiece(): void {
    this.terrain = this.merge();
    this.collapseRows();
    this.pieceColor = Terrain.randomColor();
    this.piece = this.getNextPiece();
    this.x = Math.trunc((Terrain.width - this.piece.size) / 2);
    this.y = 0;
    if (!this.validate()) {
      this.eventEmitter.emit('terrain.overflow', this);
    }
  }

  private collapseRows(): void {
    const terrain = [];
    let miss = 0;
    for (let row = 0; row < Terrain.height; ++row) {
      const terrainRow = this.terrain.slice(
        row * Terrain.width,
        (row + 1) * Terrain.width
      );
      if (terrainRow.some((point) => point === Terrain.empty || point === Terrain.border)) {
        terrain.push(...terrainRow);
      } else {
        ++miss;
      }
    }
    if (miss) {
      this.updateScore(miss);
      this.terrain = [
        ...Array.from({ length: Terrain.width * miss }, () => {
          return Terrain.empty;
        }),
        ...terrain,
      ];
      this.eventEmitter.emit('terrain.collapseRow', this, miss);
    }
  }

  private getNextPiece(): Piece {
    this.eventEmitter.emit(
      'pieceSerial.update',
      this,
      this.pieceGenerator
        .lastThree(this.pieceSerialNumber)
        .map((p) => {
          const formatted = Array.from(
            { length: Terrain.previewRow * (p.size + 1) },
            () => Terrain.empty
          );
          return formatted.map((el, index) => {
            const row = Math.trunc(index / Terrain.previewRow) - 1;
            const col = index % Terrain.previewRow;
            if (row >= 0 && row < p.size) {
              if (col > 0 && col <= p.size) {
                return p.show()[row * p.size + col - 1]
                  ? Terrain.preview
                  : Terrain.empty;
              }
            }
            return el;
          });
        })
        .flat()
    );
    return this.pieceGenerator.getByIndex(this.pieceSerialNumber++);
  }

  private validate(): boolean {
    //TODO: fix rotation at sides
    return this.piece.show().every((value, idx) => {
        const posX = this.x + idx % this.piece.size;
        const posY = this.y + Math.trunc(idx / this.piece.size);
        return value === false
          || (
            value === true
            && posX >= 0
            && posX < Terrain.width
            && posY < Terrain.height
            && this.terrain2D[posY][posX] === Terrain.empty
          );
      }
    );

  }
}
