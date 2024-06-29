import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { Order, OrderInquery, OrderItemInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { Message } from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { T } from "../libs/types/common";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  public async createOrder(member: Member, input: OrderItemInput[]): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;
    try {
      const newOrder: any = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });
      const orderId = newOrder._id;
      console.log("orderId:", orderId);
      await this.recordOrderItem(orderId, input);
      return newOrder;
    } catch (err) {
      console.log("Error, model:createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  private async recordOrderItem(orderId: ObjectId, input: OrderItemInput[]): Promise<void> {
    const pomisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "INSERTED";
    });

    const orderItemsState = await Promise.all(pomisedList);
    console.log("orderItemsState:", orderItemsState);
  }

  public async getMyOrders(member: Member, inquery: OrderInquery): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches: T = { memberId: memberId, orderStatus: inquery.orderStatus };

    const result = await this.orderModel.aggregate([
      { $match: matches },
      { $sort: { updatedAt: -1 } },
      { $skip: (inquery.page - 1) * inquery.limit },
      { $limit: inquery.limit },
      {
        $lookup: {
          from: "orderItems",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
    ]);

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);

    return result;
  }
}

export default OrderService;
