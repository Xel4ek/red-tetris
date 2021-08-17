import { Piece, Pieces } from '../../terrain/piece';
import { Observable, Subject, timer } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class RoomDto {
  name: string;
  get adminTerrain(): string[] {
    return this._adminTerrain.merge();
  }
  get otherTerrain(): string[] {
    return this._otherTerrain.merge();
  }
  _adminTerrain: Terrain;
  _otherTerrain: Terrain;
  inGame: boolean;
  constructor(name: string) {
    this.name = name;
    this.inGame = false;
  }
}
export class Terrain {
  private static empty = '#ffffff';
  private static border = '#300144';
  private static width = 12;
  private static height = 21;
  private destroy$ = new Subject<void>();
  private updateTime = 1000;
  private pieceColor = Terrain.randomColor();
  id = Date.now();
  terrain: string[];
  piece: Piece;
  position: number;
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.terrain = Terrain.generateTerrain();
    this.piece = Terrain.getRandomPiece();
    this.position = Math.trunc((Terrain.width - this.piece.size + 1) / 2);
  }
  private resetPiece(): void {
    this.terrain = this.merge();
    this.pieceColor = Terrain.randomColor();
    this.piece = Terrain.getRandomPiece();
    this.position = Math.trunc((Terrain.width - this.piece.size + 1) / 2);
    if (!this.validate()) {
      this.stop();
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
  private static getRandomPiece(): Piece {
    const keys = Object.keys(Pieces);
    return new Piece(Pieces[keys[Math.floor(Math.random() * keys.length)]]);
  }
  rotate(direction: 'r' | 'l'): Terrain {
    this.piece.rotate(direction);
    if (!this.validate()) {
      this.piece.rotate(direction === 'r' ? 'l' : 'r');
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
      this.position += 12;
    }
    if (!this.validate()) {
      this.position = positionHolder;

      if (direction === 'd') {
        this.resetPiece();
      }
    }
    return this;
  }
  private validate(): boolean {
    return this.terrain
      .map((el, index) => {
        const row = Math.trunc(index / Terrain.width);
        const col = index % Terrain.width;
        const positionRow = Math.trunc(this.position / Terrain.width);
        const positionCol = this.position % Terrain.width;
        if (
          row >= positionRow &&
          row < positionRow + this.piece.size &&
          col >= positionCol &&
          col < positionCol + this.piece.size
        ) {
          if (
            this.piece.piece[
              (row - positionRow) * this.piece.size + (col - positionCol)
            ] &&
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
    return this.terrain.map((el, index) => {
      const row = Math.trunc(index / Terrain.width);
      const col = index % Terrain.width;
      const positionRow = Math.trunc(this.position / Terrain.width);
      const positionCol = this.position % Terrain.width;
      if (
        row >= positionRow &&
        row < positionRow + this.piece.size &&
        col >= positionCol &&
        col < positionCol + this.piece.size
      ) {
        return this.piece.piece[
          (row - positionRow) * this.piece.size + (col - positionCol)
        ]
          ? this.pieceColor
          : el;
      }
      return el;
    });
  }
  start() {
    console.log('start activated');
    timer(0, this.updateTime)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          // console.log('event emitted');
          this.move('d');
          this.eventEmitter.emit('piece.update', this);
        })
      )
      .subscribe();
  }
  stop() {
    console.log('game stop');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
