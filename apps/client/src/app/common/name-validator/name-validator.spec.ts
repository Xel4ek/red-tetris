import { NameValidator } from './name-validator';
import { GameControlService } from '../../core/services/game-control/game-control.service';
import { of } from 'rxjs';

describe('NameValidator', () => {
  let gameControl: Partial<GameControlService>;

  it('User exist', () => {
    gameControl = {
      httpValidation: jest.fn().mockImplementation((obj) => of({ name: true })),
    };
    let result;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const validator = NameValidator.occupied(gameControl)({
      get: (param) => null,
    });
    validator.subscribe((data) => (result = data));

    expect(result).toEqual(null);
  });
});
