import { GameStatus, Player, Role } from './player';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { ScoreEntity } from '../game/entities/score.entity';
import { firstValueFrom, of } from 'rxjs';
import { PieceGenerator } from '../terrain/piece';

describe('Player', () => {
  let player: Player;
  let channel: Partial<WebSocket>;
  let repository: Partial<Repository<ScoreEntity>>;
  beforeEach(() => {
    channel = {
      send: jest.fn(),
    };
    repository = {
      findOne: jest.fn().mockImplementation(() =>
        firstValueFrom(
          of({
            player: 'testPlayer',
            scoreSingle: BigInt(42),
            scoreMulti: BigInt(21),
          })
        )
      ),
    };
    player = new Player(
      'testRoom',
      'testName',
      Role.ADMIN,
      channel as WebSocket,
      new EventEmitter2(),
      repository as Repository<ScoreEntity>
    );
  });
  it('should be created ', () => {
    expect(player).toBeTruthy();
  });

  it('loadFromDB', async () => {
    await player.loadFromDB();
    expect(player.scoreMulti).toEqual(21);
    expect(player.scoreSingle).toEqual(42);
  });

  it('should be terrain ', () => {
    const merge = jest.fn().mockImplementation(() => []);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    player._terrain = {
      merge,
    };
    const terrain = player.terrain;
    expect(terrain).toBeTruthy();
    expect(merge).toBeCalled();
  });
  it('should gameStart', () => {
    player.gameStart(new PieceGenerator());
    expect(player._terrain).toBeTruthy();
    player._terrain.stop();
  });

  it('should be winner/loser', () => {
    const stop = jest.fn().mockImplementation(() => void 0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    player._terrain = {
      stop,
    };
    player.winner();
    expect(player.status).toEqual(GameStatus.WINNER);
    expect(stop).toBeCalled();
    player.loser();
    expect(player.status).toEqual(GameStatus.LOSER);
    expect(stop).toBeCalled();
  });

  it('should send by channels', () => {
    const send = jest.fn();
    player.channels = [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        send,
      },
    ];
    player.send('data');
    expect(send).toBeCalledWith('data');
  });
});
