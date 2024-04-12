import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Admin */
routerAdmin.get("/", adminController.goHome);
routerAdmin.get("/login", adminController.getLogin).post("/login", adminController.processLogin);
routerAdmin
  .get("/signup", adminController.getSignup)
  .post("/signup", makeUploader("members").single("memberImage"), adminController.processSignup);
routerAdmin.get("/logout", adminController.logout);
routerAdmin.get("/check-me", adminController.checkAuthSession);

/** Product */

routerAdmin.get("/product/all", adminController.verifyAdmin, productController.getAllProducts);
routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post("/product/:id", adminController.verifyAdmin, productController.updateChosenProduct);
/** User */

export default routerAdmin;
