import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket,User, TicketStatusLog, TicketComment]),
  ],
  controllers:[TicketsController,CommentsController],
  
  providers:[TicketsService],
})
export class TicketsModule {}
