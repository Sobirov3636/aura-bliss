import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel;
  }

  /* SPA */

  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result: any = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (error) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick, memberStatus: { $ne: MemberStatus.DELETE } },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }
    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

    if (!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    const result: any = await this.memberModel.findById(member._id).lean().exec();
    return result;
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result: any = await this.memberModel.findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE }).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);
    return result;
  }

  public async updateMember(member: Member, input: MemberUpdateInput): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result: any = await this.memberModel.findOneAndUpdate({ _id: memberId }, input, { new: true }).exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result:any =  await this.memberModel
      .findOneAndUpdate(
        { _id: memberId, memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE },
        { $inc: { memberPoints: point } },
        { new: true }
      )
      .exec();
      return result
  }

  /* BSSR */

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel.findOne({ memberType: MemberType.ADMIN }).exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result: any = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (error) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1 })
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

    if (!isMatch) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    const result: any = await this.memberModel.findById(member._id).lean().exec();

    return result;
  }

  public async getUsers(): Promise<Member[]> {
    const result: any = await this.memberModel.find({ memberType: MemberType.USER }).exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NOT_DATA_FOUND);
    return result;
  }

  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(input._id);
    const result: any = await this.memberModel.findByIdAndUpdate({ _id: memberId }, input, { new: true }).exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default MemberService;
