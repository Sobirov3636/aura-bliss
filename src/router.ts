import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/** Member **/
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.verifyAuth, memberController.logout);
router.get("/member/detail", memberController.verifyAuth, memberController.getMemberDetail);
router.post(
  "/member/update",
  memberController.verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateMember
);

/** Product **/
router.get("/product/all", productController.getProducts);
router.get("/product/:id", memberController.retrieveAuth, productController.getProduct);

/** Like **/
router.post("/product/like", memberController.verifyAuth, productController.toggleLike);
// router.get("/product/like", memberController.verifyAuth, productController.checkLikeExistence);

/** Order **/
router.post("/order/create", memberController.verifyAuth, orderController.createOrder);
router.get("/order/all", memberController.verifyAuth, orderController.getMyOrders);
router.post("/order/update", memberController.verifyAuth, orderController.updateOrder);

export default router;
