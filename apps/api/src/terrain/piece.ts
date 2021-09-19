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
  private piece: boolean[];
  readonly size: number;
  static readonly pieceList: Readonly<Record<Pieces, boolean[]>> = {
    I: [
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    LL: [true, false, false, true, true, true, false, false, false],
    RL: [false, false, true, true, true, true, false, false, false],
    RZ: [false, true, true, true, true, false, false, false, false],
    LZ: [true, true, false, false, true, true, false, false, false],
    S: [true, true, true, true],
    T: [true, true, true, false, true, false, false, false, false],
  };
  constructor(piece: Pieces) {
    this.piece = Piece.pieceList[piece].slice();
    this.size = Math.sqrt(this.piece.length);
  }

  rotate() {
    const piece = new Array(this.size * this.size);
    for (let i = 0; i < this.piece.length; ++i) {
      const row = Math.trunc(i / this.size);
      const col = i % this.size;
      piece[col * this.size + this.size - row - 1] =
        this.piece[row * this.size + col];
    }
    this.piece = piece;
  }

  show(): boolean[] {
    return this.piece;
  }
}

export class PieceGenerator {
  private store: Pieces[] = [];
  private static tailSize = 4;
  private static pieceCount = Object.keys(Pieces);
  constructor() {
    for (let i = 0; i < PieceGenerator.tailSize; ++i) {
      this.store.push(PieceGenerator.generate());
    }
  }
  private static generate() {
    return Pieces[
      PieceGenerator.pieceCount[
        Math.floor(Math.random() * PieceGenerator.pieceCount.length)
      ]
    ];
  }
  getByIndex(i: number): Piece {
    if (i + PieceGenerator.tailSize === this.store.length) {
      this.store.push(PieceGenerator.generate());
    }
    return new Piece(this.store[i]);
  }

  lastThree(since: number): Pieces[] {
    return this.store.slice(since + 1, since + PieceGenerator.tailSize);
  }
}
