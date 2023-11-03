import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";
import {
  CreateProductDTO,
  ProductDTO,
  EditProductDTO,
  GetProductQuery,
  AddCategoriesDTO,
} from "./dto";
import { ProductModel } from "./product.model";
import { IProduct } from "./interface";
import { MongooseUtil } from "../util";
import { ProductSanitizer } from "./product.sanitizer";
import { Role, SessionDTO } from "../auth";
import { FileDTO } from "src/file";
import { FileService } from "src/file/file.service";
import { AuthZService } from "src/authZ/authZ.service";

@Injectable()
export class ProductService {
  constructor(private readonly sanitizer: ProductSanitizer, private fileService: FileService, private authZService: AuthZService) {
    this.mongooseUtil = new MongooseUtil();
    this.model = ProductModel;
  }
  //The Model
  private model: Model<IProduct>;
  mongooseUtil: MongooseUtil;

  /************************** Service API *************************/
  /** Create a new product */
  async create(dto: CreateProductDTO): Promise<ProductDTO> {
    try {
      this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
      /** transaction is not needed yet */
      let product: IProduct = new this.model({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        images: dto.images ? dto.images : [],
        categories: [],
      });
      await product.save();
      return this.sanitizer.sanitize(product);
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "Product with this name exists");
      throw err;
    }
  }

  /** add categories */
  async addCategories(_id: string, dto: AddCategoriesDTO): Promise<ProductDTO> {
    this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
    const product = await this.model.findById(_id);
    this.checkProduct(product);
    dto.categoryIds.forEach((categoryId) => {
      if (!product.categories.includes(categoryId)) {
        product.categories.push(categoryId);
      }
    });
    await product.save();
    return this.sanitizer.sanitize(product);
  }

  /** delete categories */
  async deleteCategories(_id: string, dto: AddCategoriesDTO): Promise<string> {
    this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
    const user = await this.model.updateMany({
      $pull: { categories: { $in: dto.categoryIds } },
    });
    return "ok";
  }

  /** edit the product */
  async edit(_id: string, dto: EditProductDTO): Promise<ProductDTO> {
    try {
      this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
      const product = await this.model.findById(_id);
      this.checkProduct(product);
      if (dto.name) product.name = dto.name;
      if (dto.description) product.description = dto.description;
      if (dto.price) product.price = dto.price;
      await this.manageImages(product, dto);
      await product.save();
      return this.sanitizer.sanitize(product);
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "Product with this name exists");
      throw err;
    }
  }

  /** get all products */
  async getAll(dto: GetProductQuery): Promise<ProductDTO[]> {
    const query: FilterQuery<IProduct> = {};
    if (dto.ids && dto.ids.length) query._id = { $in: dto.ids };
    if(dto.name) query.name = dto.name;
    if (dto.priceFrom) {
      query.createdAt = { $gte: dto.priceFrom };
    }
    if (dto.priceTo) {
      query.closedDate = { $lte: dto.priceTo };
    }
    const products = await this.model
      .find(query)
      .populate("categories")
    return this.sanitizer.sanitizeMany(products);
  }

  /** edit the product */
  async getById(id: string): Promise<ProductDTO> {
    const product = await this.model.findById(id);
    this.checkProduct(product);
    return this.sanitizer.sanitize(product);
  }

  /** delete the product */
  async delete(_id: string, user: SessionDTO): Promise<string> {
    this.authZService.checkRole(user.role, [Role.ADMIN]);
    const product = await this.model.findById(_id);
    this.checkProduct(product);
    if (product.images && product.images.length > 0) {
      const imageIds = product.images.map((image) => image.id);
      await this.fileService.deleteFiles(user.id, imageIds);
    }
    await product.remove();
    return _id;
  }

  /********************** Private Methods **********************/

   /** Updates the product images */
   private async manageImages(product: IProduct, dto: EditProductDTO) {
    const newImages: FileDTO[] = [];
    const idsToRemove = [];
    dto.imagesToAdd?.forEach((img) => product.images.push(img));
    dto.imagesToRemove?.forEach((img) => idsToRemove.push(img.id));
    if (idsToRemove.length > 0) await this.fileService.deleteFiles(dto.user.id, idsToRemove);
    let imageIndex;
    for (let i = 0; i < product.images?.length; i++) {
      // check if this image needs to be deleted
      imageIndex = idsToRemove.findIndex((id) => product.images[i].id === id);
      if (imageIndex < 0) {
        //does not need to be deleted
        newImages.push(product.images[i]);
      }
    }
    product.images = newImages;
  }

  /** @throws if the product is undefined */
  private checkProduct(product: IProduct) {
    if (!product) {
      throw new HttpException("Product was not found", HttpStatus.NOT_FOUND);
    }
  }
}
//End of Service
