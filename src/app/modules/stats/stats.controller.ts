/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import statsService from "./stats.service";

// Get user statistics
const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getUserStats();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User statistics retrieved successfully",
      data: result,
    });
  }
);

// Get tour statistics
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getTourStats();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour statistics retrieved successfully",
      data: result,
    });
  }
);

// Get booking statistics
const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getBookingStats();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking statistics retrieved successfully",
      data: result,
    });
  }
);

// Get payment statistics
const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getPaymentStats();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment statistics retrieved successfully",
      data: result,
    });
  }
);

// Stat controller object
const statsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};

export default statsController;
