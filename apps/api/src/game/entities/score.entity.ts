import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class ScoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at;

  @UpdateDateColumn()
  updated_at;

  @PrimaryColumn()
  player: string;

  @Column({ type: "bigint", default: 0 })
  scoreSingle: bigint;

  @Column({ type: "bigint", default: 0 })
  scoreMulti: bigint;
}
