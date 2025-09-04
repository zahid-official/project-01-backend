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

// Update division
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req?.params?.id;
    const body = req?.body;

    const result = await divisionService.updateDivision(divisionId, body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division details updated successfully",
      data: result,
    });
  }
);

// Division controller object
const divisionController = {
  getAllDivisions,
  createDivision,
  updateDivision,
};

export default divisionController;
