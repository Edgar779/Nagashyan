import { ApiProperty } from "@nestjs/swagger";
import { FileDTO } from "src/file";
import { IProductCategory } from "src/productCategory/interface";

export class ProductDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty({ type: [FileDTO] })
  images?: FileDTO[];
  @ApiProperty()
  categories: string;
}
