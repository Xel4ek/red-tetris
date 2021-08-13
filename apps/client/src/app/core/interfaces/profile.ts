import { Role } from './role';

export interface Profile {
  role: Role;
  inGame: boolean;
  name: string;
  room: string;
}
