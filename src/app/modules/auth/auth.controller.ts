/* eslint-disable @typescript-eslint/no-explicit-any */
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
import passport from "passport";

// Regenerate access token
const regenerateAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.regenerateAccessToken(refreshToken);

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

// Credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      // Check for errors
      if (error) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      // Check if user exists
      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, info.message));
      }

      // Generate tokens
      const tokens = getTokens(user);

      // Set token in cookies
      setCookies(res, tokens);

      // Convert to plain object & remove password before sending response
      const data = user.toObject();
      delete data?.password;

      // Send response
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Credentials login successful",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          data,
        },
      });
    })(req, res, next);
  }
);

// Google login
const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = (req.query.redirect as string) || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect,
    })(req, res, next);
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

// Change password
const changePassword = catchAsync(
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

// Reset password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.resetPassword();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successful",
      data: result,
    });
  }
);

// Auth controller object
const authController = {
  regenerateAccessToken,
  credentialsLogin,
  googleLogin,
  googleCallback,
  logout,
  changePassword,
  resetPassword,
};

export default authController;
