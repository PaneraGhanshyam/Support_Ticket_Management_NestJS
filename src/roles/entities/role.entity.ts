import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export enum RoleName{
  MANAGER='MANAGER',
  SUPPORT='SUPPORT',
  USER='USER',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id:number;


    @Column({type:'enum', enum:RoleName, unique:true})
    name:RoleName;

    @OneToMany(()=> User,(user)=> user.role)
    users:User[];

}
