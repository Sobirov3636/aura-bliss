import mongoose, { Schema } from "mongoose";
import { ProductCategory, ProductStatus, ProductTargetUser, ProductVolume } from "../libs/enums/product.enum";

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
      type: String,
      enum: ProductVolume,
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
productSchema.index({ productName: 1, productVolume: 1 }, { unique: true });
export default mongoose.model("Product", productSchema);
