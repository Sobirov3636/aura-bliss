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

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductModel;
  }

  /* SPA */
  public async getProducts(inquery: ProductInquery): Promise<Product[]> {
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
    const proudctId = shapeIntoMongooseObjectId(id);
    let result: any = await this.productModel.findOne({ _id: proudctId, productStatus: ProductStatus.PROCESS }).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);

    //TODO: If authenticated users => first => view log creation
    //TODO: Like logic
    return result;
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
