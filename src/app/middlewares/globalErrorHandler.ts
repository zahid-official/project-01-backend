/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }

  // Fallback for others
  res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({
    message: error.message || "Something went wrong!!",
    error,
  });
};

export default globalErrorHandler;
