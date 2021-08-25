import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ScoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room: string;

  @Column()
  player: string;

  @Column({ default: true })
  score: boolean;
}
