import { IsEnum, IsString, MinLength } from 'class-validator';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDTO {

  @IsString()
  @MinLength(5,{message:'Title is too short (min 5 charcters)'})
  title:string;

  @IsString()
  @MinLength(10,{message:'Decription is too short (min 10 characters)'})
  description: string;

  @IsEnum(TicketPriority)
  priority:TicketPriority;

  
}
