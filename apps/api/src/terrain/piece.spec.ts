import { Piece, Pieces } from "./piece";

describe('Piece', () => {
  let piece: Piece;

  beforeEach(() => {
    piece = new Piece(Pieces.LL);
  })

  it('should be defined', () => {
    expect(piece).toBeDefined();
  });

  it('functions should be defined', () => {
    expect(piece.show()).toBeDefined();
  });

  it('rotate should change shape', function () {
    const oldShape = piece.show();
    piece.rotate('r');
    expect(piece.show()).not.toEqual(oldShape);
  });

  it('4 rotates should be equal to start shape', function () {
    const oldShape = piece.show();
    piece.rotate('r');
    piece.rotate('r');
    piece.rotate('r');
    piece.rotate('r');
    expect(piece.show()).toEqual(oldShape);
  });

});
