import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/util";

export class GetProductQuery extends PaginationDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ArrayMinSize(1)
  ids?: string[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  priceFrom?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  priceTo?: number;
}
