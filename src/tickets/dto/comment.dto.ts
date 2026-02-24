import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDTO{
  
  @IsString()
  @IsNotEmpty({message:'Comment cannot be empty'})
  comment:string;

}
