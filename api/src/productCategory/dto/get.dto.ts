import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/util';

export class GetProductCategoryQuery extends PaginationDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ArrayMinSize(1)
  ids?: string[];
}