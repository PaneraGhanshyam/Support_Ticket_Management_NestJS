import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleName } from '../../roles/entities/role.entity';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email:string;

  @IsString()
  @MinLength(6,{message:'Password must be at least 6 chararcters'})
  password: string;

  @IsEnum(RoleName)
  role:RoleName;
}
