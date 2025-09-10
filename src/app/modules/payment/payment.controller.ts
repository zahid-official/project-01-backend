/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import paymentService from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Success payment handler
const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.successPayment();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment processed successfully",
      data: result,
    });
  }
);

// Failed payment handler
const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.failedPayment();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment processing failed",
      data: result,
    });
  }
);

// Canceled payment handler
const canceledPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.canceledPayment();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment was cancelled by the user",
      data: result,
    });
  }
);

// Payment controller object
const paymentController = {
  successPayment,
  failedPayment,
  canceledPayment,
};

export default paymentController;
