import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User{
  
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  name:string;

  @Column({ unique: true})
  email:string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(()=>Role, (role)=> role.users)
  @JoinColumn({ name: 'role_id'})
  role:Role;

  @CreateDateColumn()
  created_at: Date;
}
