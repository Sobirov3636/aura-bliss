import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service";
import LikeService from "../models/Like.service"; // Import LikeService
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductInput, ProductInquery } from "../libs/types/product";
import { ProductCategory } from "../libs/enums/product.enum";
import { ProductTargetUser } from "../libs/enums/product.enum";
import { ProductBrand } from "../libs/enums/product.enum";
import { LikeInput } from "../libs/types/like";
import mongoose from "mongoose"; // Import mongoose to use ObjectId

import { LikeGroup } from "../libs/enums/like.enum";

const productService = new ProductService();
const likeService = new LikeService(); // Create instance of LikeService
const productController: T = {};

/* SPA */
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const { page, limit, order, productCategory, productTargetUser, productBrand, search } = req.query;
    const inquery: ProductInquery = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCategory) {
      inquery.productCategory = productCategory as ProductCategory;
    }
    if (productTargetUser) {
      inquery.productTargetUser = productTargetUser as ProductTargetUser;
    }
    if (productBrand) {
      inquery.productBrand = productBrand as ProductBrand;
    }
    if (search) inquery.search = String(search);
    const result = await productService.getProducts(inquery);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const { id } = req.params;
    const memberId = req.member?._id ?? null;
    const result = await productService.getProduct(memberId, id);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/* BSSR */
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);

    res.send(`<script>alert("Sucessfull creation!"); window.location.replace('/admin/product/all')</script>`);
  } catch (err) {
    console.log("Error, createNewProduct", err);
    const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script>alert("${message}"); window.location.replace('/admin/product/all')</script>`);
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;

    const result = await productService.updateChosenProduct(id, req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/* Like logic */
productController.toggleLike = async (req: Request, res: Response) => {
  try {
    console.log("toggleLike");
    const input = req.body;
    const result = await likeService.toggleLike(input);
    res.status(HttpCode.OK).json({ modifier: result });
  } catch (err) {
    console.log("Error, toggleLike", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
