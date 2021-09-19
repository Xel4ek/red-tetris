import { Test, TestingModule } from '@nestjs/testing';
import { Terrain } from './terrain';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Piece, PieceGenerator } from '../../terrain/piece';

describe('Terrain', () => {
  let terrain: Terrain;
  let eventEmitter2: EventEmitter2;
  let pieceGenerator: PieceGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitter2, PieceGenerator],
    }).compile();
    eventEmitter2 = module.get<EventEmitter2>(EventEmitter2);
    pieceGenerator = module.get<PieceGenerator>(PieceGenerator);
    terrain = new Terrain(eventEmitter2, pieceGenerator);
  });

  it('should drop', () => {
    terrain.drop();
    expect(
      terrain.terrain2D.slice(-1)[0].some((value) => value !== Terrain.empty)
    ).toBeTruthy();
  });

  it('should move left', () => {
    terrain.start();
    const posX = terrain.x;
    terrain.move('l');
    expect(terrain.x === posX - 1).toBeTruthy();
  });

  it('should move right', () => {
    terrain.start();
    const posX = terrain.x;
    terrain.move('r');
    expect(terrain.x === posX + 1).toBeTruthy();
  });

  it('should move down', () => {
    const posY = terrain.y;
    terrain.start();
    terrain.move('d');
    expect(terrain.y === posY + 1).toBeTruthy();
  });

  it('should rotate', () => {
    const piece = terrain.piece.show();
    terrain.start();
    terrain.rotate();

    if (
      !terrain.piece
        .show()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .every((value, idx) => value === Piece.pieceList.S[idx])
    )
      expect(
        terrain.piece.show().some((value, idx) => value != piece[idx])
      ).toBeTruthy();
    //
  });
  it('should rotate#2', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(terrain, 'validate').mockImplementation(() => false);
    const rotate = jest.spyOn(terrain.piece, 'rotate');
    terrain.start();
    terrain.rotate();
    expect(rotate).toBeCalledTimes(4);
  });

  it('should return status', function () {
    expect(terrain.status()).toBeDefined();
  });

  it('should stop', function () {
    terrain.start();
    terrain.updateScore(1);
    terrain.missRow(1);
    expect(terrain).toBeTruthy();
  });

  it('should move', function () {
    terrain.start();
    expect(terrain.move('d')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('l')).toBeDefined();
    expect(terrain.move('r')).toBeDefined();
  });

  it('should merge', function () {
    expect(terrain.merge()).toBeDefined();
  });
  afterEach(() => {
    terrain.stop();
  });
});
