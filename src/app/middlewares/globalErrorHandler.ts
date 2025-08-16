/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import envVars from "../config/env";
import AppError from "../errors/AppError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if response sent
  if (res.headersSent) {
    return next(error);
  }

  // Default error values
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!!";

  // Handle custom error
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle built-in Error
  else if (error instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
