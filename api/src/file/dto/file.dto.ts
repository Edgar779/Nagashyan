import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsUrl } from 'class-validator';

export class FileDTO {
  @ApiProperty()
  @IsMongoId()
  id: string;
  @ApiProperty()
  @IsUrl()
  url: string;
  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  thumbUrl?: string;
}
