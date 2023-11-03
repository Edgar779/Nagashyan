import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ACCESS_TOKEN, ParseObjectIdPipe, Public } from "src/util";
import {
  ProductDTO,
  CreateProductDTO,
  EditProductDTO,
  GetProductQuery,
  AddCategoriesDTO,
} from "./dto";
import { ProductService } from "./product.service";
import { SessionDTO } from "../auth";
import { Response } from "express";

@Controller("products")
@ApiTags("Product Endpoints")
@ApiHeader({ name: ACCESS_TOKEN })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /** Create the product */
  @Post()
  @ApiBody({ type: CreateProductDTO })
  @ApiOkResponse({ type: ProductDTO })
  async create(@Body() dto: CreateProductDTO): Promise<ProductDTO> {
    const product = await this.productService.create(dto);
    return product;
  }

  /** Add categories */
  @Patch(":id/category/add")
  @ApiBody({ type: AddCategoriesDTO })
  @ApiOkResponse({ type: ProductDTO })
  async addAuthors(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: AddCategoriesDTO
  ): Promise<ProductDTO> {
    const product = await this.productService.addCategories(id, dto);
    console.log(product, 'ssasa')
    return product;
  }

  /** Delete categories */
  @Patch(":id/category/delete")
  @ApiBody({ type: AddCategoriesDTO })
  @ApiOkResponse({ type: ProductDTO })
  async deleteAuthors(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: AddCategoriesDTO
  ): Promise<string> {
    const product = await this.productService.deleteCategories(id, dto);
    return product;
  }

  /** Update the product fields */
  @Patch(":id")
  @ApiBody({ type: EditProductDTO })
  @ApiOkResponse({ type: ProductDTO })
  async editMenu(
    @Param("id", ParseObjectIdPipe) id: string,
    @Body() dto: EditProductDTO
  ): Promise<ProductDTO> {
    const product = await this.productService.edit(id, dto);
    return product;
  }

  /** Get the product by id */
  @Get(":id")
  @Public()
  @ApiOkResponse({ type: ProductDTO })
  async getBusinessMenus(
    @Param("id", ParseObjectIdPipe) id: string
  ): Promise<ProductDTO> {
    const product = await this.productService.getById(id);
    return product;
  }

  /** Get all products */
  @Get()
  @Public()
  @ApiOkResponse({ type: [ProductDTO] })
  async getAll(@Query() dto: GetProductQuery): Promise<ProductDTO[]> {
    const products = await this.productService.getAll(dto);
    return products;
  }

  /** Delete a product */
  @Delete(":id")
  @ApiOkResponse({ type: String, description: "Id of the deleted product" })
  async deleteMenu(
    @Param("id", ParseObjectIdPipe) menuId: string,
    @Body("user") user: SessionDTO
  ): Promise<string> {
    const deletedId = await this.productService.delete(menuId, user);
    return deletedId;
  }
}
/** End of Controller */
