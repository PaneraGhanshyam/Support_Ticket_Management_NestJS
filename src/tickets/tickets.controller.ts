import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { RoleName } from 'src/roles/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignDTO } from './dto/assign.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { CommentDTO } from './dto/comment.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
  @Post()
  @Roles(RoleName.USER,RoleName.MANAGER)
  create(@Body() createTicketDto:CreateTicketDTO,@Request() req) {
     return this.ticketsService.create(createTicketDto,req.user);
  }

  @Patch(':id/assign')
  @Roles(RoleName.MANAGER,RoleName.SUPPORT)
  assign(@Param('id') id:string, @Body() assignDto:AssignDTO) {
     return this.ticketsService.assign(+id,assignDto.userId);
  }


  @Get()
  @Roles(RoleName.MANAGER,RoleName.SUPPORT,RoleName.USER)
   findAll(@Request() req){
    return this.ticketsService.findAll(req.user);
  }

  @Patch(':id/status')
  @Roles(RoleName.MANAGER,RoleName.SUPPORT)
  updateStatus(
    @Param('id') id:string,
    @Body() updateStatusDto:UpdateStatusDTO,
     @Request() req,
  ){
    return this.ticketsService.updateStatus(
       +id,
      updateStatusDto.status,
      req.user,
  );
  }

  @Delete(':id')
  @Roles(RoleName.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id:string) {
    return this.ticketsService.remove(+id);
  }

  @Post(':id/comments')
  @Roles(RoleName.MANAGER,RoleName.SUPPORT, RoleName.USER)
   addComment(
    @Param('id') id:string,
    @Body() commentDto:CommentDTO,
    @Request() req,
  ){
     return this.ticketsService.addComment(+id, commentDto.comment,req.user);
  }

  @Get(':id/comments')
  @Roles(RoleName.MANAGER, RoleName.SUPPORT,RoleName.USER)
  getComments(@Param('id') id:string,@Request() req) {
    return this.ticketsService.getComments(+id,req.user);
  }
}
