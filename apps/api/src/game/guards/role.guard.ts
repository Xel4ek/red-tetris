import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../dto/player.dto';
import { PlayerRepositoryService } from '../player-repository/player-repository.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly playerRepositoryService: PlayerRepositoryService
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const channel = context.switchToWs().getClient<WebSocket>();
    const player = this.playerRepositoryService.findByChannel(channel);
    return player.role === Role.ADMIN;
  }
}
