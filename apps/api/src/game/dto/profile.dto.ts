import { Role } from './player.dto';

export class ProfileDto {
  role: Role;
  inGame: boolean;
  name: string;
  room: string;
}
