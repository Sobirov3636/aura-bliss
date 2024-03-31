import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

// Admin BSSR
const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.send("Hompe Page");
  } catch (err) {
    console.log("Error, goHome", err);
  }
};

adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");

    res.send("Login Page");
  } catch (err) {
    console.log("Error, getLogin", err);
  }
};

adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");

    res.send("Signup Page");
  } catch (err) {
    console.log("Error, getSignup", err);
  }
};

adminController.processLogin = async (req: Request, res: Response) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body;

    const memberService = new MemberService();
    const result = await memberService.processLogin(input);
    res.send(result);
  } catch (err) {
    console.log("Error, processLogin", err);
    res.send(err);
  }
};

adminController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");

    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.ADMIN;

    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);
    res.send(result);
  } catch (err) {
    console.log("Error, processSignup", err);
    res.send(err);
  }
};

export default adminController;
