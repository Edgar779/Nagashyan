import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  skip?: number;
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
