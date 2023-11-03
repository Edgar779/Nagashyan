import { ApiProperty } from "@nestjs/swagger";
import {

  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { DTO } from "src/util";

export class CreateProductCategoryDTO extends DTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}