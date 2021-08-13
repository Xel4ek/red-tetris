export enum Role {
  ANTONYMOUS,
  SPECTRAL,
  PLAYER,
  ADMIN,
}
export class PlayerDto {
  name: string;
  channel: WebSocket;
  room: string;
  role: Role;
}
