/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import authService from "./auth.service";
import { clearCookies, setCookies } from "../../utils/cookies";
import AppError from "../../errors/AppError";
import getTokens from "../../utils/getTokens";
import envVars from "../../config/env";

// Credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginByEmail(req?.body);

    // Set token in cookies
    setCookies(res, result);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: result.data,
    });
  }
);

// Regenerate access token
const regenerateToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.renewAccessToken(refreshToken);

    // Set token in cookies
    setCookies(res, result);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token regenerated successfully",
      data: null,
    });
  }
);

// Logout user
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear cookies
    clearCookies(res);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: null,
    });
  }
);

// Reset password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req?.decodedToken;
    const { oldPassword, newPassword } = req?.body || {};

    const result = await authService.changePassword(
      decodedToken,
      oldPassword,
      newPassword
    );

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successful",
      data: result,
    });
  }
);

// Google callback
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Get redirect from state
    let redirect = req.query.state ? (req.query.state as string) : "";
    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }

    // Check if user exists
    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Google authentication failed"
      );
    }

    // Generate tokens
    const tokens = getTokens(user);

    // Set token in cookies
    setCookies(res, tokens);

    // Redirect to frontend with tokens
    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
  }
);

// Auth controller object
const authController = {
  credentialsLogin,
  regenerateToken,
  logout,
  resetPassword,
  googleCallback,
};

export default authController;
