import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Role } from '../constants';

export class CreateAuthDTO {
  // email
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  // password
  @ApiProperty({
    type: String,
    description: 'must be at least 8 characters long, contain 1 uppercase 1 lowercase',
  })
  @MinLength(8)
  @MaxLength(30)
  password: string;

  //internally generated
  id?: string;
  role?: Role;
}
