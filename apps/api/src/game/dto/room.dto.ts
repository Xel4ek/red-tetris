import { Piece, Pieces } from '../../terrain/piece';

export class RoomDto {
  name: string;
  get adminTerrain(): string[] {
    return RoomDto.merge(this._adminTerrain);
  }
  get otherTerrain(): string[] {
    return RoomDto.merge(this._otherTerrain);
  }
  _adminTerrain: Terrain;
  _otherTerrain: Terrain;
  inGame: boolean;
  private static merge(source: Terrain): string[] {
    return source.terrain;
  }
  constructor(name: string) {
    this.name = name;
    this.inGame = false;
  }
}
export class Terrain {
  private static filler = '#FFF';
  terrain: string[];
  piece: Piece;
  position: number;
  constructor() {
    this.terrain = Array.from({ length: 12 * 21 }, () => Terrain.filler);
    this.position = 0;
    this.piece = Terrain.getRandomPiece();
  }
  private resetPiece(): void {
    this.piece = Terrain.getRandomPiece();
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
      if (direction === 'd') {
        this.resetPiece();
      } else {
        this.position = positionHolder;
      }
    }
    return this;
  }
  private validate(): boolean {
    return false;
  }
}
