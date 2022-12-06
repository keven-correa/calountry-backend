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

  @Column('varchar')
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (userNote) => userNote.notes)
  user: User;
}
