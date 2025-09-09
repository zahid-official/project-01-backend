/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errors/AppError";
import Tour from "../tour/tour.model";
import User from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import getTransactionId from "../../utils/getTransactionId";

// Get all bookings
const getAllBookings = async () => {
  return {
    data: { data: 0 },
    meta: { meta: 0 },
  };
};

// Get user bookings
const getUserBookings = async () => {
  return {
    data: { data: 0 },
    meta: { meta: 0 },
  };
};

// Get single bookings
const getSingleBooking = async () => {
  return {};
};

// Create new booking
const createBooking = async (userId: string, payload: Partial<IBooking>) => {
  // Check if user has phone and address
  const user = await User.findById(userId);
  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your profile with phone number and address before booking a tour"
    );
  }

  // Check if tour cost exists
  const tour = await Tour.findById(payload.tourId).select("cost");
  if (!tour?.cost) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour cost not found");
  }

  // Create booking
  payload.userId = userId as any;
  const booking = await Booking.create(payload);

  // Create payment record
  const paymentPayload = {
    bookingId: booking._id,
    transactionId: getTransactionId(),
    amount: Number(tour.cost) * Number(payload.guests),
  };
  const payment = await Payment.create(paymentPayload);

  // Update booking with payment ID
  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { paymentId: payment._id },
    { new: true, runValidators: true }
  )
    .populate("userId", "name email phone address")
    .populate("tourId", "title cost")
    .populate("paymentId", "bookingId transactionId amount status");

  return updatedBooking;
};

// Update booking
const updateBooking = async () => {
  return {};
};

// Delete booking
const deleteBooking = async () => {
  return {};
};

// Booking service object
const bookingService = {
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};

export default bookingService;
