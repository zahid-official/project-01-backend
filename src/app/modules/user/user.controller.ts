/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const result = await userService.getAllUsers(
      query as Record<string, string>
    );

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get single user
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.params?.id;
    const result = await userService.getSingleUser(id);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  }
);

// Get profile info
const getProfileInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.decodedToken?.userId;
    const result = await userService.getProfileInfo(userId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile info retrieved successfully",
      data: result,
    });
  }
);

// Create new user
const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.registerUser(req?.body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Account created successfully",
      data: result,
    });
  }
);

// Update user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.params?.id;
    const body = req?.body;
    const decodedToken = req.decodedToken;
    const result = await userService.updateUser(userId, body, decodedToken);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Details updated successfully",
      data: result,
    });
  }
);

// User controller object
const userController = {
  getAllUsers,
  getProfileInfo,
  getSingleUser,
  registerUser,
  updateUser,
};

export default userController;
