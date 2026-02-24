import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { TicketComment } from './entities/ticket-comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { TicketStatusLog } from './entities/ticket-status-log.entity';
import { CreateTicketDTO } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService{
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(User)
    private readonly usersRepo:Repository<User>,
    @InjectRepository(TicketStatusLog)
    private readonly logRepo: Repository<TicketStatusLog>,

    @InjectRepository(TicketComment)
    private readonly commentRepo:Repository<TicketComment>,
  ) {}


  private readonly statusOrder ={
    [TicketStatus.OPEN]:1,
    [TicketStatus.IN_PROGRESS]:2,
    [TicketStatus.RESOLVED]:3,
    [TicketStatus.CLOSED]:4,
  };

  async updateStatus(id:number, newStatus:TicketStatus,user: User) {
    const ticket = await this.ticketRepo.findOne({where: { id} });

    if(!ticket) throw new NotFoundException('Ticket not found');

    const currentWeight = this.statusOrder[ticket.status];
    const nextWeight =this.statusOrder[newStatus];

    if (nextWeight !==currentWeight + 1){
      throw new BadRequestException(
        `Invalid status transsition from ${ticket.status} to ${newStatus}`,
      );
    }

     const oldStatus =ticket.status;
    ticket.status = newStatus;

     const log =this.logRepo.create({
      ticket,
       old_status: oldStatus,
      new_status:newStatus,
      changed_by: user,
    });
     await this.logRepo.save(log);

    await this.ticketRepo.save(ticket);

     return this.ticketRepo.findOne({
      where:{ id},
      relations:[
        'createdBy',
        'createdBy.role',
        'assignedTo',
        'assignedTo.role',
      ],
    });
  }

  async remove(id:number) {
     const ticket =await this.ticketRepo.findOne({where: { id }});
    if(!ticket) throw new NotFoundException('Ticket not found');

    await this.ticketRepo.remove(ticket);
   }

   async create(createTicketDto:CreateTicketDTO,user: User){
    const ticket = this.ticketRepo.create({
      ...createTicketDto,
      createdBy: user,
    });
    return this.ticketRepo.save(ticket);
  }

  async assign(ticketId: number,userId: number) {
    const ticket =await this.ticketRepo.findOne({ where:{ id: ticketId }});
     if(!ticket) throw new NotFoundException('Ticket not found');

    const user= await this.usersRepo.findOne({
       where:{ id:userId },
       relations:['role'],
    });

    if(!user) throw new NotFoundException('User not found');
    if(user.role.name==='USER') {
      throw new BadRequestException(
        'Tickets cannot be assigned to regular USERS',
      );
    }

    ticket.assignedTo=user;
    return this.ticketRepo.save(ticket);
  }

  async findAll(user:any) {
    const relations = [
      'createdBy',
      'createdBy.role',
      'assignedTo',
      'assignedTo.role',
    ];

    if (user.role.name==='MANAGER') {
       return this.ticketRepo.find({ relations});
    } else if (user.role.name==='SUPPORT') {
      return this.ticketRepo.find({
         where: {assignedTo: {id: user.id} },
        relations,
    });
    } else {
      return this.ticketRepo.find({
         where:{ createdBy: {id: user.id} },
        relations,
      });
    }
  }
  private async verifyTicketAccess(ticketId:number, user:any) {
    const ticket = await this.ticketRepo.findOne({
       where: {id:ticketId },
      relations:['createdBy','assignedTo'],
    });

    if(!ticket) throw new NotFoundException('Ticket not found');

    if(user.role.name === 'MANAGER') return ticket;
    if(user.role.name ==='SUPPORT' &&ticket.assignedTo?.id === user.id)
       return ticket;
    if(user.role.name==='USER' && ticket.createdBy?.id === user.id)
       return ticket;

    throw new ForbiddenException(
      'You do not have permision to access this ticket',
    );
  }

  async addComment(ticketId:number, commentText:string,user: any) {
    const ticket =await this.verifyTicketAccess(ticketId, user);
    const comment= this.commentRepo.create({
       comment:commentText,
       ticket,
       user,
    });
    await this.commentRepo.save(comment);

    return this.commentRepo.findOne({
      where:{ id:comment.id },
      relations:['user','user.role'],
    });
  }

  async getComments(ticketId: number, user: any) {
    await this.verifyTicketAccess(ticketId, user);
    return this.commentRepo.find({
      where:{ ticket:{ id: ticketId } },
      relations: ['user','user.role'],
      order:{ created_at: 'ASC' },
     });
  }

  async updateComment(commentId: number, commentText: string, user: any) {
    const comment = await this.commentRepo.findOne({
      where:{ id: commentId },
      relations: ['user'],
    });
    if(!comment) throw new NotFoundException('Comment not found');

    if (user.role.name!== 'MANAGER' && comment.user.id!== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.comment =commentText;
    await this.commentRepo.save(comment);

    return this.commentRepo.findOne({
      where:{id: comment.id},
      relations:['user','user.role'],
    });
  }

  async deleteComment(commentId:number,user:any) {
    const comment=await this.commentRepo.findOne({
      where:{id:commentId },
      relations:['user'],
    });
    if(!comment) throw new NotFoundException('Comment not found');

    if(user.role.name !== 'MANAGER' && comment.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepo.remove(comment);
  }
}
