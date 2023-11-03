import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DTO } from './dto';

export class ReorderDTO extends DTO {
  @ApiProperty()
  @Type(() => Number)
  from: number;
  @ApiProperty()
  @Type(() => Number)
  to: number;
}
