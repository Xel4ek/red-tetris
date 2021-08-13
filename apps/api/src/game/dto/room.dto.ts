import { PlayerDto } from './player.dto';

export class RoomDto {
  name: string;
  adminTerrain: string[];
  otherTerrain: string[];
  inGame: boolean;
}
