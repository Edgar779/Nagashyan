import { Injectable } from "@nestjs/common";
import { ISanitize } from "src/util";
import { ProductCategoryDTO } from "./dto";
import { IProductCategory } from "./interface";

@Injectable()
export class ProductCategorySanitizer implements ISanitize {
  sanitize(category: IProductCategory): ProductCategoryDTO {
    const sanitized: ProductCategoryDTO = {
      id: category.id,
      name: category.name,
    };
    return sanitized;
  }

  sanitizeMany(categories: IProductCategory[]): ProductCategoryDTO[] {
    const sanitized: ProductCategoryDTO[] = [];
    for (let i = 0; i < categories.length; i++) {
      sanitized.push(this.sanitize(categories[i]));
    }
    return sanitized;
  }
}
