import { Schema, model, Types } from "mongoose";
import { FileSchema } from '../file';
import { IProduct } from "./interface";

const ProductSchema = new Schema(
  {
    name: { type: String, unique: true },
    description: { type: String},
    price: { type: Number },
    images: [FileSchema],
    categories: [{ type: Types.ObjectId, ref: "productCategory" }],
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>("product", ProductSchema);
