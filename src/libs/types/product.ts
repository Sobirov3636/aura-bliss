import { ObjectId } from "mongoose";
import { ProductCategory, ProductStatus, ProductTargetUser } from "../enums/product.enum";
// import { ProductCategory, ProductSize, ProductStatus } from "../enums/ product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCategory: ProductCategory;
  productTargetUser: ProductTargetUser;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productTargetUser: ProductTargetUser;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
