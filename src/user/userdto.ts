import { IsNotEmpty, IsEmail, IsDateString, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    last_name: string;
  
    @IsEmail()
    email: string;
  
    @IsDateString()
    birthdate: Date;
  
    @IsInt()
    identification: number;
    
  }