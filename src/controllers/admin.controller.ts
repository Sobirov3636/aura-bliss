import { Request, Response } from "express";

import { T } from "../libs/types/common";

// Admin BSSR
const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    res.send("Hompe Page");
  } catch (err) {
    console.log("Error, goHome", err);
  }
};

adminController.getLogin = (req: Request, res: Response) => {
  try {
    res.send("Login Page");
  } catch (err) {
    console.log("Error, getLogin", err);
  }
};

adminController.getSignup = (req: Request, res: Response) => {
  try {
    res.send("Signup Page");
  } catch (err) {
    console.log("Error, getSignup", err);
  }
};

export default adminController;
