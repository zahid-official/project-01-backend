/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create new user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.registerUser(req?.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: result,
    });
  }
);

// Get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.retrieveAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// User controller object
const userController = {
  createUser,
  getAllUsers,
};

export default userController;
