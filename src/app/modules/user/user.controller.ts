/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyJWT } from "../../utils/JWT";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

// Update user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.params?.id;
    const body = req?.body;
    const token = req?.headers?.authorization;

    // Decode the token
    const decodedToken = verifyJWT(
      token as string,
      envVars.JWT_SECRET
    ) as JwtPayload;

    const result = await userService.modifyUserDetails(
      userId,
      body,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User details updated successfully",
      data: result,
    });
  }
);

// User controller object
const userController = {
  createUser,
  getAllUsers,
  updateUser,
};

export default userController;
