import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DTO } from "src/util";

export class EditProductCategoryDTO extends DTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
