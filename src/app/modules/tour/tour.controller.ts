/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import tourService from "./tour.service";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Get all Tours
const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourService.getAllTours();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All tours retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

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
  getAllTours,
  createTour,
};

export default tourController;
