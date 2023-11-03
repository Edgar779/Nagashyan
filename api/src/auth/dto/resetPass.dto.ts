import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class ResetPassDTO {
  // password
  @ApiProperty({
    type: String,
    description: 'must be at least 8 characters long, contain 1 uppercase 1 lowercase',
  })
  @MinLength(8)
  @MaxLength(30)
  newPassword: string;

  // password confirmation
  @ApiProperty()
  @MinLength(8)
  @MaxLength(30)
  confirmation: string;

  // Following values are set by the system
  email: string;
}
