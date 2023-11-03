import { Injectable } from "@nestjs/common";
import { ISanitize } from "src/util";
import { ProductDTO } from "./dto";
import { IProduct } from "./interface";

@Injectable()
export class ProductSanitizer implements ISanitize {
  sanitize(product: IProduct): ProductDTO {
    const sanitized: ProductDTO = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      categories: product.categories
    };
    return sanitized;
  }

  sanitizeMany(products: IProduct[]): ProductDTO[] {
    const sanitized: ProductDTO[] = [];
    for (let i = 0; i < products.length; i++) {
      sanitized.push(this.sanitize(products[i]));
    }
    return sanitized;
  }
}
