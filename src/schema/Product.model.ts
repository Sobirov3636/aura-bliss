import mongoose, { Schema } from "mongoose";
import {
  ProductBrand,
  ProductCategory,
  ProductStatus,
  ProductTargetUser,
  ProductVolume,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCategory: {
      type: String,
      enum: ProductCategory,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },

    productTargetUser: {
      type: String,
      enum: ProductTargetUser,
      required: true,
    },
    productBrand: {
      type: String,
      enum: ProductBrand,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productVolume: {
      type: Number,
      enum: ProductVolume,
      required: true,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String],
      default: [],
    },

    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // updatedAt, createdAt
);
// productSchema.index({ productName: 1, productVolume: 1, productBrand: 1 }, { unique: true });
export default mongoose.model("Product", productSchema);
