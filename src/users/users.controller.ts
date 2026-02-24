import { RolesGuard } from 'src/auth/guards/roles.guards';
import { RoleName } from 'src/roles/entities/role.entity';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {

   constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles(RoleName.MANAGER)
  create(@Body() createUserDto:CreateUserDTO){
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(RoleName.MANAGER)
  findAll(){
    return this.usersService.findAll();
  }
}
