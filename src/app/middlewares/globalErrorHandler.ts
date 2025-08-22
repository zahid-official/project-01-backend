/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import envVars from "../config/env";
import { ZodError } from "zod";
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
  let errorDetails = error;

  // Zod validation error handling
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";
    errorDetails = error.issues;
  }

  // JWT error handling
  else if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = error.message;
  }

  // Handle custom error
  else if (error instanceof AppError) {
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
    error: errorDetails,
    stack:
      envVars.NODE_ENV === "development"
        ? error.stack?.split("\n").map((line: any) => line.trim())
        : null,
  });
};

export default globalErrorHandler;
