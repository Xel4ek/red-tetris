import { RoleGuard } from './role.guard';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Role } from '../../player/player';

describe('RoleGuard', () => {
  let playerRepositoryService: Partial<PlayerRepositoryService>;
  let roleGuard: RoleGuard;

  beforeEach(async () => {
    playerRepositoryService = {
      findByChannel: jest.fn().mockImplementation(() => ({ role: Role.ADMIN })),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roleGuard = new RoleGuard(playerRepositoryService);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it('can activate for admin user', function () {
    expect(roleGuard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
});
