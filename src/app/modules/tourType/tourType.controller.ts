/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import tourTypeService from "./tourType.service";
import sendResponse from "../../utils/sendResponse";

// Create new tourType
const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourTypeService.createTourType(req?.body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "TourType created successfully",
      data: result,
    });
  }
);

// TourType controller object
const tourTypeController = {
  createTourType,
};

export default tourTypeController;
