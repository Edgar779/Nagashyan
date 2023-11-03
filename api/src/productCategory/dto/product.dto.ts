import { ApiProperty } from "@nestjs/swagger";

export class ProductCategoryDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
