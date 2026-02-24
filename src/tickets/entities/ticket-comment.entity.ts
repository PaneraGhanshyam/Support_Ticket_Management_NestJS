import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from './ticket.entity';

@Entity('ticket_comments')
export class TicketComment {
  @PrimaryGeneratedColumn()
  id:number;

  @Column('text')
  comment: string;

  @ManyToOne(()=>Ticket,(ticket) => ticket.comments, {onDelete:'CASCADE' })
  @JoinColumn({name:'ticket_id'})
  ticket:Ticket;


  @ManyToOne(()=>User)
  @JoinColumn({name:'user_id' })
  user:User;

  @CreateDateColumn()
  created_at: Date;
}
