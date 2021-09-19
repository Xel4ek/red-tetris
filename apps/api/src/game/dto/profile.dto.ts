import { Role } from '../../player/player';

export class ProfileDto {
  role: Role;
  inGame: boolean;
  name: string;
  room: string;
}
