/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import divisionService from "./division.service";
import sendResponse from "../../utils/sendResponse";

// Get all divisions
const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionService.getAllDivisions();

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All divisions retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Create new division
const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionService.createDivision(req?.body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division created successfully",
      data: result,
    });
  }
);

// Division controller object
const divisionController = {
  getAllDivisions,
  createDivision,
};

export default divisionController;
