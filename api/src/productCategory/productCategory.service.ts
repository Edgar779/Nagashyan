import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";
import {
  CreateProductCategoryDTO,
  ProductCategoryDTO,
  EditProductCategoryDTO,
  GetProductCategoryQuery,
} from "./dto";
import { ProductCategoryModel } from "./productCategory.model";
import { IProductCategory } from "./interface";
import { MongooseUtil } from "../util";
import { ProductCategorySanitizer } from "./productCategory.sanitizer";
import { Role, SessionDTO } from "../auth";
import { AuthZService } from "src/authZ/authZ.service";

@Injectable()
export class ProductCategoryService {
  constructor(private readonly sanitizer: ProductCategorySanitizer, private authZService: AuthZService) {
    this.mongooseUtil = new MongooseUtil();
    this.model = ProductCategoryModel;
  }
  //The Model
  private model: Model<IProductCategory>;
  mongooseUtil: MongooseUtil;

  /************************** Service API *************************/
  /** Create a new product */
  async create(dto: CreateProductCategoryDTO): Promise<ProductCategoryDTO> {
    try {
      this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
      let category: IProductCategory = new this.model({
        name: dto.name,
      });
      await category.save();
      return this.sanitizer.sanitize(category);
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "Category with this name exists");
      throw err;
    }
  }

  /** edit the category */
  async edit(_id: string, dto: EditProductCategoryDTO): Promise<ProductCategoryDTO> {
    try {
      this.authZService.checkRole(dto.user.role, [Role.ADMIN]);
      const category = await this.model.findById(_id);
      this.checkCategory(category);
      if (dto.name) category.name = dto.name;
      await category.save();
      return this.sanitizer.sanitize(category);
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, "Category with this name exists");
      throw err;
    }
  }

  /** get all categories */
  async getAll(dto: GetProductCategoryQuery): Promise<ProductCategoryDTO[]> {
    const query: FilterQuery<IProductCategory> = {};
    if (dto.ids && dto.ids.length) query._id = { $in: dto.ids };
    const categories = await this.model
      .find(query)
    return this.sanitizer.sanitizeMany(categories);
  }

  /** edit the category */
  async getById(id: string): Promise<ProductCategoryDTO> {
    const category = await this.model.findById(id);
    this.checkCategory(category);
    return this.sanitizer.sanitize(category);
  }

  /** delete the category */
  async deleteCategory(_id: string, user: SessionDTO): Promise<string> {
    const category = await this.model.findById(_id);
    this.checkCategory(category);
    await category.remove();
    return _id;
  }

  /********************** Private Methods **********************/
  /** @throws if the category is undefined */
  private checkCategory(category: IProductCategory) {
    if (!category) {
      throw new HttpException("Product category was not found", HttpStatus.NOT_FOUND);
    }
  }
}
//End of Service
