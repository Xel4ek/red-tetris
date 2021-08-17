export enum Pieces {
  I = 'I',
  LL = 'LL',
  RL = 'RL',
  LZ = 'LZ',
  RZ = 'RZ',
  S = 'S',
  T = 'T',
}
export class Piece {
  piece: boolean[];
  size: number;
  private static readonly pieceList: Readonly<Record<Pieces, boolean[]>> = {
    I: [
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
    ],
    LL: [false, true, true, false, true, false, false, true, false],
    RL: [true, true, false, false, true, false, false, true, false],
    RZ: [false, true, true, true, true, false, false, false, false],
    LZ: [true, true, false, false, true, true, false, false, false],
    S: [true, true, true, true],
    T: [true, true, true, false, true, false, false, false, false],
  };
  constructor(piece: Pieces) {
    this.piece = Piece.pieceList[piece].slice();
    this.size = Math.sqrt(this.piece.length);
  }

  rotate(direction: 'r' | 'l') {
    this.piece = this.piece.reverse();
  }
  show(): boolean[] {
    return this.piece;
  }
}
