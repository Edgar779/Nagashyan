import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductSanitizer } from "./product.sanitizer";
import { ProductService } from "./product.service";
import { ProductCategoryModule } from "src/productCategory/productCategory.module";
import { FileModule } from "src/file/file.module";
import { AuthZModule } from "src/authZ/authZ.module";

@Module({
  imports: [ProductCategoryModule, FileModule, AuthZModule],
  exports: [ProductService],
  providers: [ProductService, ProductSanitizer],
  controllers: [ProductController],
})
export class ProductModule {}
