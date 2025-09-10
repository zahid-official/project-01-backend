/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import paymentService from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import envVars from "../../config/env";

// Success payment handler
const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req?.query.transactionId as string;
    const amount = req?.query?.amount;
    const status = req?.query?.status;
    const result = await paymentService.successPayment(transactionId);

    // Redirect to frontend with query params
    if (result.success) {
      res.redirect(
        `${envVars.SSL.SUCCESS_FRONTEND_URL}/payment/success?transactionId=${transactionId}&amount=${amount}&status=${status}`
      );
    }
  }
);

// Failed payment handler
const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req?.query.transactionId as string;
    const amount = req?.query?.amount;
    const status = req?.query?.status;
    const result = await paymentService.failedPayment(transactionId);

    // Redirect to frontend with query params
    if (result.failed) {
      res.redirect(
        `${envVars.SSL.FAILED_FRONTEND_URL}/payment/success?transactionId=${transactionId}&amount=${amount}&status=${status}`
      );
    }
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
