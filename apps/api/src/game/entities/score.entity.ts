import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ScoreEntity {
  @PrimaryColumn()
  player: string;

  @Column({ type: 'bigint', default: 0 })
  scoreSingle: bigint;

  @Column({ type: 'bigint', default: 0 })
  scoreMulti: bigint;
}
