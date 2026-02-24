import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDTO } from './create-ticket.dto';
export class UpdateTicketDto extends PartialType(CreateTicketDTO) {}
