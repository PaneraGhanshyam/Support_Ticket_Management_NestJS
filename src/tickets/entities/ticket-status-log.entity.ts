import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';
import { TicketStatus } from './ticket.entity';
@Entity('ticket_status_logs')
export class TicketStatusLog {
  @PrimaryGeneratedColumn()
  id:number;

  @ManyToOne(()=>Ticket,{ onDelete:'CASCADE' })
  ticket:Ticket;

  @Column({ type:'enum', enum:TicketStatus})
  old_status:TicketStatus;

  @Column({type: 'enum', enum:TicketStatus})
  new_status:TicketStatus;

  @ManyToOne(()=> User)
  changed_by:User;

   @CreateDateColumn()
  changed_at:Date;
}
