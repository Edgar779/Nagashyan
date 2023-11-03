import { ApiProperty } from '@nestjs/swagger';
import { SessionDTO } from './session.dto';

export class ChangePassDTO {
  @ApiProperty()
  password: string;
  @ApiProperty()
  newPassword: string;
  @ApiProperty()
  confirmation: string;

  /** System set values */
  user: SessionDTO;
}
