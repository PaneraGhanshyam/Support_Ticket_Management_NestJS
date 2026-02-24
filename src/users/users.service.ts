import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const {role,password, ...userData }= createUserDto;

    const roleEntity= await this.roleRepo.findOne({ where:{name: role } });

    if (!roleEntity) {
      throw new BadRequestException(
        `Role '${role}'does not exist in the dataabase.`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user =this.usersRepo.create({...userData,
      password:hashedPassword,
      role:  roleEntity,

    });

    return this.usersRepo.save(user);
  }
  async findByEmail(email:string) {
    return this.usersRepo.findOne({
      where:{email },
      relations:['role'],
    });
  }

  async findAll(){
    return this.usersRepo.find({relations:['role']});
  }
}
