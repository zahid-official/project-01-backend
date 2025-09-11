/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import tourService from "./tour.service";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Get all tours
const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const result = await tourService.getAllTours(
      query as Record<string, string>
    );

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

// Get single tour
const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req?.params?.slug;
    const result = await tourService.getSingleTour(slug);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All tours retrieved successfully",
      data: result.data,
    });
  }
);

// Create new tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req?.body,
      images: (req?.files as Express.Multer.File[]).map((file) => file?.path),
    };
    const result = await tourService.createTour(payload);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour created successfully",
      data: result,
    });
  }
);

// Update tour
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req?.params?.id;
    const body = req?.body;

    const result = await tourService.updateTour(tourId, body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour details updated successfully",
      data: result,
    });
  }
);

// Delete tour
const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req?.params?.id;

    const result = await tourService.deleteTour(tourId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour deleted successfully",
      data: result,
    });
  }
);

// Tour controller object
const tourController = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};

export default tourController;
