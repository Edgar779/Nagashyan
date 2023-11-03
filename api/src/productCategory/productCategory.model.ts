import { Schema, model } from "mongoose";
import { IProductCategory } from "./interface";

const ProductCategorySchema = new Schema(
  {
    name: { type: String, unique: true },
  },
  { timestamps: true }
);

export const ProductCategoryModel = model<IProductCategory>("productCategory", ProductCategorySchema);
