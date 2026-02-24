import { TicketComment } from './ticket-comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus{
  OPEN='OPEN',
  IN_PROGRESS='IN_PROGRESS',
  RESOLVED='RESOLVED',
  CLOSED='CLOSED',
}

export enum TicketPriority{
   LOW='LOW',
   MEDIUM='MEDIUM',
   HIGH='HIGH',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  title:string;

  @Column('text')
  description:string;

  @Column({type:'enum', enum: TicketStatus,default:TicketStatus.OPEN})
  status:TicketStatus;

  @Column({
    type:'enum',
    enum:TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority:TicketPriority;

  @ManyToOne(()=>User)
  @JoinColumn({name:'created_by'})
  createdBy: User;

  @ManyToOne(()=>User,{nullable:true})
  @JoinColumn({name:'assigned_to'})
  assignedTo:User;

  @CreateDateColumn()
  created_at:Date;

  @OneToMany(() =>TicketComment,(comment) =>comment.ticket)
  comments:TicketComment[];
}
