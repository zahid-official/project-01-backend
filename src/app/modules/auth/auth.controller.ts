/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import authService from "./auth.service";

// Credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginByEmail(req?.body);

    // Set access token in cookies
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
    });

    // Set refresh token in cookies
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: result,
    });
  }
);

// Regenerate access token
const regenerateToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.renewAccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token regenerated successfully",
      data: result,
    });
  }
);

// Auth controller object
const authController = { credentialsLogin, regenerateToken };

export default authController;
