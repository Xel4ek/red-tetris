export enum Role {
  ANTONYMOUS,
  SPECTRAL,
  PLAYER,
  ADMIN,
}
export enum GameResult {
  LOSER,
  VACANT,
  WINNER,
}
export class PlayerDto {
  name: string;
  channel: WebSocket;
  room: string;
  role: Role;
  gameResult: GameResult;
}
