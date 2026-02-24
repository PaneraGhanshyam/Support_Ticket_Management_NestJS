import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateStatusDTO {
  @IsNotEmpty()
  @IsEnum(TicketStatus,{
    message:'Status must be OPEN, IN_PROGRES, RESOLVED, or CLOSED',
  })
  
  status: TicketStatus;
}
