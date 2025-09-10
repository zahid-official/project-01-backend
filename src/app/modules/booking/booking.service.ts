/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errors/AppError";
import Tour from "../tour/tour.model";
import User from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import getTransactionId from "../../utils/getTransactionId";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import SSLService from "../sslCommerz/sslCommerz.service";

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
  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Check if user has phone and address
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile with phone number and address before booking a tour"
      );
    }

    // Create booking
    payload.userId = userId as any;
    const booking = await Booking.create([payload], { session });

    // Check if tour cost exists
    const tour = await Tour.findById(payload.tourId).select("cost");
    if (!tour?.cost) {
      throw new AppError(httpStatus.BAD_REQUEST, "Tour cost not found");
    }

    // Create payment record
    const paymentPayload = {
      bookingId: booking[0]._id,
      transactionId: getTransactionId(),
      amount: Number(tour.cost) * Number(payload.guests),
    };
    const payment = await Payment.create([paymentPayload], { session });

    // Update booking with payment ID
    const modifiedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { paymentId: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("userId", "name email phone address")
      .populate("tourId", "title cost")
      .populate("paymentId", "bookingId transactionId amount status");

    // Initiate SSLCommerz payment
    const bookingDetails = modifiedBooking as any;
    const sslPayload: ISSLCommerz = {
      name: bookingDetails?.userId?.name,
      email: bookingDetails.userId?.email,
      phone: bookingDetails?.userId?.phone,
      address: bookingDetails?.userId?.address,
      amount: bookingDetails?.paymentId?.amount,
      transactionId: bookingDetails?.paymentId?.transactionId,
    };
    const sslCommerz = await SSLService.sslCommerz(sslPayload);

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { paymentUrl: sslCommerz?.GatewayPageURL, booking: modifiedBooking };
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
