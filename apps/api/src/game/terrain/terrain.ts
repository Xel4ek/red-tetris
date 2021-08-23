import { BehaviorSubject, interval, Subject, timer } from 'rxjs';
import { Piece, PieceGenerator } from '../../terrain/piece';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

export class Terrain {
  private static empty = '#ffffff';
  private static border = '#300144';
  private static preview = '#6766669E';
  private static baseScore = 100;
  private static previewRow = 6;
  private static levelUpRows = 10;
  private static width = 12;
  private static height = 21;
  private destroy$ = new Subject<void>();
  private updateTime = new BehaviorSubject<number>(1000);
  private pieceColor = Terrain.randomColor();
  private pieceSerialNumber = 0;
  private score: number;
  private level: number;
  private removedRows: number;
  terrain: string[];
  piece: Piece;
  position: number;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly pieceGenerator: PieceGenerator
  ) {
    this.terrain = Terrain.generateTerrain();
    this.piece = this.getNextPiece();
    this.position = Math.trunc((Terrain.width - this.piece.size + 1) / 2);
    this.score = 0;
    this.level = 1;
    this.removedRows = 0;
  }
  private resetPiece(): void {
    this.terrain = this.merge();
    this.collapseRows();
    this.pieceColor = Terrain.randomColor();
    this.piece = this.getNextPiece();
    this.position = Math.trunc((Terrain.width - this.piece.size + 1) / 2);
    if (!this.validate()) {
      this.eventEmitter.emit('terrain.overflow', this);
    }
  }
  public static settings() {
    return {
      width: Terrain.width,
      height: Terrain.height,
      previewRow: Terrain.previewRow,
      border: Terrain.border,
    };
  }
  private collapseRows(): void {
    const terrain = [];
    let miss = 0;
    for (let row = 0; row < Terrain.height; ++row) {
      const terrainRow = this.terrain.slice(
        row * Terrain.width,
        (row + 1) * Terrain.width
      );
      if (
        terrainRow.some((point) => point === Terrain.empty) ||
        terrainRow.every((point) => point === Terrain.border)
      ) {
        terrain.push(...terrainRow);
      } else {
        ++miss;
      }
    }
    if (miss) {
      this.updateScore(miss);
      this.terrain = [
        ...Array.from({ length: Terrain.width * miss }, (_, k) => {
          if (
            k % Terrain.width === 0 ||
            k % Terrain.width === Terrain.width - 1
          ) {
            return Terrain.border;
          }
          return Terrain.empty;
        }),
        ...terrain,
      ];
      this.eventEmitter.emit('terrain.collapseRow', this, miss);
    }
  }
  updateScore(miss: number) {
    this.score += this.level * Terrain.baseScore * miss;
    this.removedRows += miss;
    const level = Math.trunc(this.removedRows / 10);
    if (level !== this.level) {
      this.level = Math.trunc(this.removedRows / 10);
      const speed = this.updateTime.getValue();
      this.updateTime.next(speed * 0.9);
    }
  }
  missRow(rows: number) {
    if (
      this.terrain
        .slice(0, rows * Terrain.width)
        .every((point) => point === Terrain.empty || point === Terrain.border)
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
  private static randomColor(): string {
    return (
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }
  private static generateTerrain(): string[] {
    return Array.from({ length: Terrain.width * Terrain.height }, (v, k) => {
      if (
        Math.trunc(k / Terrain.width) === Terrain.height - 1 ||
        k % Terrain.width === 0 ||
        k % Terrain.width === Terrain.width - 1
      ) {
        return Terrain.border;
      }
      return Terrain.empty;
    });
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
  rotate(direction: 'r' | 'l'): Terrain {
    this.piece.rotate(direction);
    if (!this.validate()) {
      this.piece.rotate(direction === 'r' ? 'l' : 'r');
    } else {
      this.share();
    }
    return this;
  }
  move(direction: 'l' | 'r' | 'd'): Terrain {
    const positionHolder = this.position;
    if (direction === 'r') {
      this.position += 1;
    }
    if (direction === 'l') {
      this.position -= 1;
    }
    if (direction === 'd') {
      this.position += Terrain.width;
    }
    if (!this.validate()) {
      this.position = positionHolder;
      if (direction === 'd') {
        this.resetPiece();
        this.share();
      }
    } else {
      this.share();
    }
    return this;
  }
  private validate(): boolean {
    // todo validation broken temp solution need refactor
    const positionRow = Math.trunc(this.position / Terrain.width);
    const positionCol = this.position % Terrain.width;
    return this.terrain
      .map((el, index) => {
        const row = Math.trunc(index / Terrain.width);
        const col = index % Terrain.width;
        if (
          row >= positionRow &&
          row < positionRow + this.piece.size &&
          col >= positionCol &&
          col < positionCol + this.piece.size
        ) {
          const pos =
            (row - positionRow) * this.piece.size + (col - positionCol);
          if (
            pos >= 0 &&
            pos < this.piece.show().length &&
            this.piece.show()[pos] &&
            el !== Terrain.empty
          ) {
            return false;
          }
        }
        return true;
      })
      .every((el) => el);
  }
  merge(): string[] {
    const positionRow = Math.trunc(this.position / Terrain.width);
    const positionCol = this.position % Terrain.width;
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
    console.log('game stop');
    this.destroy$.next();
    this.destroy$.complete();
  }
  share() {
    this.eventEmitter.emit('terrain.update', this);
  }
  status() {
    return {
      score: this.score,
      level: this.level,
    };
  }
}
