/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import paymentService from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import envVars from "../../config/env";

// Get invoice handler
const getInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req?.params?.paymentId;
    const userId = req?.decodedToken?.userId;
    const result = await paymentService.getInvoice(paymentId, userId);

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Invoice retrieved successfully",
      data: result,
    });
  }
);

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
    if (!result.success) {
      res.redirect(
        `${envVars.SSL.FAILED_FRONTEND_URL}/payment/success?transactionId=${transactionId}&amount=${amount}&status=${status}`
      );
    }
  }
);

// Canceled payment handler
const canceledPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req?.query.transactionId as string;
    const amount = req?.query?.amount;
    const status = req?.query?.status;
    const result = await paymentService.canceledPayment(transactionId);

    // Redirect to frontend with query params
    if (!result.success) {
      res.redirect(
        `${envVars.SSL.FAILED_FRONTEND_URL}/payment/success?transactionId=${transactionId}&amount=${amount}&status=${status}`
      );
    }
  }
);

// Complete payment of canceled booking
const completePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req?.params?.bookingId as string;
    const result = await paymentService.completePayment(bookingId);

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment process initiated successfully",
      data: result,
    });
  }
);

// Validate payment handler
const validatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req?.body;
    const result = await paymentService.validatePayment(body);

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment validated successfully",
      data: result,
    });
  }
);

// Payment controller object
const paymentController = {
  getInvoice,
  successPayment,
  failedPayment,
  canceledPayment,
  completePayment,
  validatePayment,
};

export default paymentController;
