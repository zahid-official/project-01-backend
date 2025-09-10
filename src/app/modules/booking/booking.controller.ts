/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import bookingService from "./booking.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Get all bookings
const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const result = await bookingService.getAllBookings(
      query as Record<string, string>
    );

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get my bookings
const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req?.query;
    const userId = req?.decodedToken?.userId;
    const result = await bookingService.getMyBookings(
      userId,
      query as Record<string, string>
    );

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User bookings retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get single bookings
const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req?.params?.id;
    const result = await bookingService.getSingleBooking(bookingId);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  }
);

// Create new booking
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.decodedToken?.userId;
    const payload = req?.body;
    const result = await bookingService.createBooking(userId, payload);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  }
);

// Update booking
const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req?.params?.id;
    const body = req?.body;
    const result = await bookingService.updateBooking(bookingId, body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: result,
    });
  }
);

// Booking controller object
const bookingController = {
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
};

export default bookingController;
