import { Note } from '../../note/entities/note.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoles } from '../enums/user.roles';
import { Group } from './../../group/entities/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  last_name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  user_name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  password: string;

  @Column('varchar')
  country: string;

  @Column('varchar')
  gmt_zone: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  phone_number: string;

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.User,
  })
  role: UserRoles;

  @Column({
    type: 'text',
  })
  technologies: string;

  @OneToMany(() => Note, (userNote) => userNote.user)
  notes?: Note[];

  @ManyToMany(() => Group, (group) => group.users)
  groups?: Group[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.gmt_zone = this.gmt_zone.toUpperCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
