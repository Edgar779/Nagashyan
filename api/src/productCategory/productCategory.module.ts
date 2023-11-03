import { Module } from "@nestjs/common";
import { ProductCategoryController } from "./productCategory.controller";
import { ProductCategorySanitizer } from "./productCategory.sanitizer";
import { ProductCategoryService } from "./productCategory.service";
import { AuthZModule } from "src/authZ/authZ.module";

@Module({
  imports: [AuthZModule],
  exports: [ProductCategoryService],
  providers: [ProductCategoryService, ProductCategorySanitizer],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}
