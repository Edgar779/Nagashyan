import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants';

/** DTO that is sent to the user for most authentication requests */
export class SignedInDTO {
  @ApiProperty()
  token: string;
  @ApiProperty({ enum: Role })
  role: string;
}
