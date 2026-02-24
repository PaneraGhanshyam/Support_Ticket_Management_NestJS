import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignDTO{
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
