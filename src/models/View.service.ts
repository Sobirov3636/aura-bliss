import { ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";
import { View } from "../libs/types/view";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import Errors from "../libs/Errors";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View> {
    const result: any = await this.viewModel.findOne({ memberId: input.memberId, viewRefId: input.viewRefId }).exec();
    return result;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      const result: any = await this.viewModel.create(input);
      return result;
    } catch (err) {
      console.log("ERROR, model:insertMemberView:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
