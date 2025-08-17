/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService from "./user.service";

// Create new user
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.registerUser(req?.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// User controller object
const userController = {
  createUser,
};

export default userController;
