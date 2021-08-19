export class RoomDto {
  name: string;
  inGame: boolean;
  mode: 'single' | 'multi';

  constructor(name: string) {
    this.name = name;
    this.inGame = false;
  }
}
