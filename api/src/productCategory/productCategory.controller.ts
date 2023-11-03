import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ACCESS_TOKEN, ParseObjectIdPipe, Public } from "src/util";
import {
  ProductCategoryDTO,
  CreateProductCategoryDTO,
  EditProductCategoryDTO,
  GetProductCategoryQuery,
} from "./dto";
import { ProductCategoryService } from "./productCategory.service";
import { SessionDTO } from "../auth";

@Controller("products/categories")
@ApiTags("Product Category Endpoints")
@ApiHeader({ name: ACCESS_TOKEN })
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  /** Create the product category */
  @Post()
  @ApiBody({ type: CreateProductCategoryDTO })
  @ApiOkResponse({ type: ProductCategoryDTO })
  async create(@Body() dto: CreateProductCategoryDTO): Promise<ProductCategoryDTO> {
    const product = await this.productCategoryService.create(dto);
    return product;
  }

  /** Update the category fields */
  @Patch(":id")
  @ApiBody({ type: EditProductCategoryDTO })
  @ApiOkResponse({ type: ProductCategoryDTO })
  async editMenu(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: EditProductCategoryDTO
  ): Promise<ProductCategoryDTO> {
    const product = await this.productCategoryService.edit(id, dto);
    return product;
  }

  /** Get the product by id */
  @Get(":id")
  @Public()
  @ApiOkResponse({ type: ProductCategoryDTO })
  async getBusinessMenus(
    @Param("id", ParseObjectIdPipe) id: string
  ): Promise<ProductCategoryDTO> {
    const product = await this.productCategoryService.getById(id);
    return product;
  }

  /** Get all product category */
  @Get()
  @Public()
  @ApiOkResponse({ type: [ProductCategoryDTO] })
  async getAll(@Query() dto: GetProductCategoryQuery): Promise<ProductCategoryDTO[]> {
    const category = await this.productCategoryService.getAll(dto);
    return category;
  }

  /** Delete a product category */
  @Delete(":id")
  @ApiOkResponse({ type: String, description: "Id of the deleted product" })
  async deleteCategory(
    @Param("id", ParseObjectIdPipe) menuId: string,
    @Body("user") user: SessionDTO
  ): Promise<string> {
    const deletedId = await this.productCategoryService.deleteCategory(menuId, user);
    return deletedId;
  }
}
/** End of Controller */
