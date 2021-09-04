import { RoleGuard } from './role.guard';
import { PlayerRepositoryService } from "../player-repository/player-repository.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { PlayerDto, Role } from "../dto/player.dto";

describe('RoleGuard', () => {
  let playerRepositoryService: PlayerRepositoryService;
  let context: ExecutionContext;
  let roleGuard: RoleGuard;

  beforeEach(() => {
    playerRepositoryService = new PlayerRepositoryService(new EventEmitter2());
    roleGuard = new RoleGuard(playerRepositoryService);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  it('can activate for admin user', function () {
    const testClient = { client: 'test client' };
    const mmm = createMock<ExecutionContext>();
    mmm.switchToWs().getClient.mockReturnValue(testClient);
    const channel = mmm.switchToWs().getClient()
    const adminPlayer = new PlayerDto('testRoom', 'testPlayer', Role.ADMIN, channel, new EventEmitter2());
    playerRepositoryService.push(adminPlayer);
    expect(channel).toEqual(testClient);
    expect(roleGuard.canActivate(mmm)).toBeTruthy();
  });
});
