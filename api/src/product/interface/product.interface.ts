import { Document } from "mongoose";
import { FileDTO } from "src/file";
import { IProductCategory } from "src/productCategory/interface";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images?: FileDTO[];
  categories: IProductCategory['_id'];
}
