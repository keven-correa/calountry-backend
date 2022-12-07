import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', nullable: true})
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  color: string;

  @Column()
  timed: boolean;

  @ManyToOne(() => User, (userNote) => userNote.notes)
  user: User;
}
