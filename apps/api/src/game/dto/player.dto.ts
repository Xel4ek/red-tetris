export enum Role {
  ANTONYMOUS,
  SPECTRAL,
  PLAYER,
  ADMIN,
}
export class PlayerDto {
  name: string;
  channel: WebSocket; // temp solution
  room: string;
  role: Role;
}
