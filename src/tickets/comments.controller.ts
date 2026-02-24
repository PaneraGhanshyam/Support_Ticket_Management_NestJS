import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CommentDTO } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleName } from '../roles/entities/role.entity';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  
   constructor(private readonly ticketsService: TicketsService) {}

  @Patch(':id')
  @Roles(RoleName.MANAGER ,RoleName.SUPPORT,RoleName.USER)
  updateComment(
     @Param('id') id:string,
     @Body() commentDto:CommentDTO,
     @Request() req,
  ) {

    return this.ticketsService.updateComment(+id,commentDto.comment,req.user);
  }

  @Delete(':id')
  @Roles(RoleName.MANAGER, RoleName.SUPPORT,RoleName.USER)
   @HttpCode( HttpStatus.NO_CONTENT)
  deleteComment(@Param('id') id: string,@Request() req) {
    return this.ticketsService.deleteComment(+id  ,req.user);
  }
}
