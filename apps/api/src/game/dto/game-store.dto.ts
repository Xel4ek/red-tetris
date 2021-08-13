import { RoomDto } from './room.dto';

export class GameStoreDto {
  [room: string]: RoomDto;
}
