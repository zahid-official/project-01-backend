/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import tourTypeService from "./tourType.service";
import sendResponse from "../../utils/sendResponse";

// Get all tourTypes
const getAllTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const result = await tourTypeService.getAllTourTypes(
      query as Record<string, string>
    );

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All tourTypes retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get single tourType
const getSingleTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req?.params?.id;
    const result = await tourTypeService.getSingleTourType(id);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "TourType retrieved successfully",
      data: result,
    });
  }
);

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

// Update tourType
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req?.params?.id;
    const body = req?.body;

    const result = await tourTypeService.updateTourType(tourTypeId, body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "TourType details updated successfully",
      data: result,
    });
  }
);

// Delete tourType
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req?.params?.id;

    const result = await tourTypeService.deleteTourType(tourTypeId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "TourType deleted successfully",
      data: result,
    });
  }
);

// TourType controller object
const tourTypeController = {
  getAllTourTypes,
  getSingleTourType,
  createTourType,
  updateTourType,
  deleteTourType,
};

export default tourTypeController;
