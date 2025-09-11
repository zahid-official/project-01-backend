/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import divisionService from "./division.service";
import { IDivision } from "./division.interface";
import sendResponse from "../../utils/sendResponse";

// Get all divisions
const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const result = await divisionService.getAllDivisions(
      query as Record<string, string>
    );

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

// Get single division
const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req?.params?.slug;
    const result = await divisionService.getSingleDivision(slug);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All divisions retrieved successfully",
      data: result.data,
    });
  }
);

// Create new division
const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = { ...req.body, thumbnail: req.file?.path };
    const result = await divisionService.createDivision(payload);

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

// Delete division
const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req?.params?.id;

    const result = await divisionService.deleteDivision(divisionId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division deleted successfully",
      data: result,
    });
  }
);

// Division controller object
const divisionController = {
  getAllDivisions,
  getSingleDivision,
  createDivision,
  updateDivision,
  deleteDivision,
};

export default divisionController;
