import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty()
  permissions?: Set<number>;
}
