import { Test, TestingModule } from '@nestjs/testing';
import { Terrain } from "./terrain";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PieceGenerator } from "../../terrain/piece";

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

  it('updateScore should be undefined', () => {
    expect(terrain.updateScore(1)).toBeUndefined();
  });

  it('missRow should be undefined', function () {
    expect(terrain.missRow(1)).toBeUndefined();

  });

});
