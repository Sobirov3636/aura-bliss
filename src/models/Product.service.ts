import { ProductInput, ProductInquery, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Product } from "../libs/types/product";
import Errors from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { T } from "../libs/types/common";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import { LikeGroup } from "../libs/enums/like.enum";
import LikeService from "./Like.service";
import { LikeInput } from "../libs/types/like";

class ProductService {
  private readonly productModel;
  public viewService;
  public likeService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
    this.likeService = new LikeService();
  }

  /* SPA */
  public async getProducts(inquery: ProductInquery): Promise<Product[]> {
    console.log("inquiry:", inquery);
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquery.productCategory) {
      match.productCategory = inquery.productCategory;
    }
    if (inquery.productTargetUser) {
      match.productTargetUser = inquery.productTargetUser;
    }
    if (inquery.productBrand) {
      match.productBrand = inquery.productBrand;
    }
    if (inquery.search) {
      match.productName = { $regex: new RegExp(inquery.search, "i") };
    }

    const sort: T = inquery.order === "productPrice" ? { [inquery.order]: 1 } : { [inquery.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquery.page * 1 - 1) * inquery.limit },
        { $limit: inquery.limit * 1 },
      ])
      .exec();
    console.log("result:", result);
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);
    return result;
  }

  public async getProduct(memberId: ObjectId | null, id: string): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    let result: any = await this.productModel.findOne({ _id: productId, productStatus: ProductStatus.PROCESS }).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);

    //TODO: If authenticated users => first => view log creation
    if (memberId) {
      // Check Existance
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);

      console.log("exist", !!existView);
      if (!existView) {
        // Insert View
        await this.viewService.insertMemberView(input);

        // Increase Counts of  View
        result = await this.productModel
          .findByIdAndUpdate(productId, { $inc: { productViews: +1 } }, { new: true })
          .exec();
      }
    }
    //TODO: Like logic

    // meLiked
    const likeInput: LikeInput = { memberId: memberId as ObjectId, likeRefId: productId, likeGroup: LikeGroup.PRODUCT };
    result.meLiked = await this.likeService.checkLikeExistence(likeInput);

    return result;
  }

  public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<Product> {
    const target: any = await this.productModel
      .findOne({ _id: likeRefId, productStatus: ProductStatus.PROCESS })
      .exec();
    if (!target) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.PRODUCT,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result: any = await this.productModel.findByIdAndUpdate(likeRefId, { $inc: { productLikes: modifier } });
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result as Product;
  }

  /* BSSR */

  public async getAllProducts(): Promise<Product[]> {
    const result: any = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);
    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result: any = await this.productModel.create(input);
      return result;
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    // string => ObjectId
    id = shapeIntoMongooseObjectId(id);
    const result: any = await this.productModel.findOneAndUpdate({ _id: id }, input, { new: true }).exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default ProductService;
