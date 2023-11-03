import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { FileDTO } from "src/file";
import { DTO } from "src/util";
import { Type } from 'class-transformer';

export class CreateProductDTO extends DTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
  @ApiProperty({ required: false })
  @ValidateNested({ each: true })
  @Type(() => FileDTO)
  @IsOptional()
  images?: FileDTO[];
  // @ApiProperty()
  // categories: string[];
}

export class AddCategoriesDTO extends DTO {
  @ApiProperty()
  @ArrayMinSize(1)
  @IsNotEmpty()
  categoryIds: string[];
}
