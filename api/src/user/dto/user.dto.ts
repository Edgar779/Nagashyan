import { ApiProperty } from '@nestjs/swagger';
import { IAuth } from 'src/auth/interface';

export class UserDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  auth: IAuth['_id'];
  @ApiProperty()
  email: string;
  @ApiProperty({
    required: false,
    description: 'use this one if it exists and avatar does not exist',
  })
  socialAvatar?: string;
  /** package */
  package?: any;
}
