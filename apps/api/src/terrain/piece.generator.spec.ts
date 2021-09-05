import { Piece, PieceGenerator, Pieces } from "./piece";

describe('PieceGenerator', () => {
  let pieceGenerator: PieceGenerator;

  beforeEach(() => {
    pieceGenerator = new PieceGenerator();
  })

  it('should new', function () {
    expect(new Piece(Pieces.LL)).toBeDefined();
  });

  it('should be defined', () => {
    expect(pieceGenerator).toBeDefined();
  });

  it('functions should be defined', () => {
    expect(pieceGenerator.lastThree(0)).toBeDefined();
  });

  it('should be defined', function () {
    expect(pieceGenerator.getByIndex(0)).toBeDefined();
  });

});
