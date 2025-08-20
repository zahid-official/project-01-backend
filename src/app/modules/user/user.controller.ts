/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService from "./user.service";
import catchAsync from "../../utils/catchAsync";

// Create new user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.registerUser(req?.body);
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      data: result,
    });
  }
);

// Get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.retrieveAllUsers();
    res.json({
      message: "Users retrieved successfully",
      data: result,
    });
  }
);

// User controller object
const userController = {
  createUser,
  getAllUsers,
};

export default userController;
