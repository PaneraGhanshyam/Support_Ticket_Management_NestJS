import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    private usersService:UsersService,
    private jwtService:JwtService,
  ) {}

  async login(loginDto:any) {
    const user=await this.usersService.findByEmail(loginDto.email);
    if(!user) throw new UnauthorizedException('Invalid credenctials');

     const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if(!isMatch)throw new UnauthorizedException('Invalid credentials');

    const payload ={ sub:user.id, email:user.email, role:user.role.name};
      return{
      access_token:await this.jwtService.signAsync(payload),
    };

  }
}
