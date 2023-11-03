import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { FileDTO } from "src/file";
import { DTO } from "src/util";

export class EditProductDTO extends DTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;
  @ApiProperty({ type: [FileDTO], required: false })
  imagesToAdd?: FileDTO[];
  @ApiProperty({ type: [FileDTO], required: false })
  imagesToRemove?: FileDTO[];
}
