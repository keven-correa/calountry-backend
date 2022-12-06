import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('date', { nullable: true })
  start_date?: Date;

  @Column('date', { nullable: true })
  end_date?: Date;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users?: User[];
}
