/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import tourService from "./tour.service";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create new tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourService.createTour(req?.body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour created successfully",
      data: result,
    });
  }
);

// Tour controller object
const tourController = {
  createTour,
};

export default tourController;
