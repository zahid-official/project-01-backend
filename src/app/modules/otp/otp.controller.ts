/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import otpService from "./otp.service";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Send otp
const sendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    const result = await otpService.sendOtp(name, email);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "OTP sent successfully",
      data: result,
    });
  }
);

// Verify otp
const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const result = await otpService.verifyOtp(email, otp);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "OTP verified successfully",
      data: result,
    });
  }
);

// Otp controller object
const otpController = {
  sendOtp,
  verifyOtp,
};

export default otpController;
