/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errors/AppError";
import Tour from "../tour/tour.model";
import User from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import Booking from "./booking.model";
import Payment from "../payment/payment.model";
import getTransactionId from "../../utils/getTransactionId";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import SSLService from "../sslCommerz/sslCommerz.service";
import QueryBuilder from "../../utils/queryBuilder";
import { PaymentStatus } from "../payment/payment.interface";

// Get all bookings
const getAllBookings = async (query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["status"];

  // Build the query using QueryBuilder class and fetch bookings
  const queryBuilder = new QueryBuilder<IBooking>(Booking.find(), query);
  const bookings = await queryBuilder
    .filter()
    .fieldSelect()
    .sort()
    .search(searchFields)
    .paginate()
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();
  return {
    data: bookings,
    meta,
  };
};

// Get my bookings
const getMyBookings = async (userId: string, query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["status"];

  // Build the query using QueryBuilder class and fetch bookings
  const queryBuilder = new QueryBuilder<IBooking>(
    Booking.find({ userId }),
    query
  );
  const bookings = await queryBuilder
    .filter()
    .fieldSelect()
    .sort()
    .search(searchFields)
    .paginate()
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();
  return {
    data: bookings,
    meta,
  };
};

// Get single bookings
const getSingleBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  return {
    data: booking,
  };
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
const updateBooking = async (bookingId: string, payload: Partial<IBooking>) => {
  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    // Check if the updated status and existing status are the same
    if (booking.status === payload.status) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Booking is already in ${booking.status} status. Please provide a different status to update`
      );
    }

    // Update booking status
    const modifiedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    // Check if payment exists
    const payment = await Payment.findById(booking.paymentId);
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    // Update payment status based on booking status
    if (modifiedBooking?.status) {
      if (modifiedBooking?.status === BookingStatus.PENDING) {
        payment.status = PaymentStatus.UNPAID;
      } else if (modifiedBooking?.status === BookingStatus.COMPLETED) {
        payment.status = PaymentStatus.PAID;
      } else if (modifiedBooking?.status === BookingStatus.FAILED) {
        payment.status = PaymentStatus.FAILED;
      } else if (modifiedBooking?.status === BookingStatus.CANCELED) {
        payment.status = PaymentStatus.CANCELED;
      }

      // Save payment status to database
      await payment.save({ session });
    }

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return modifiedBooking;
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Booking service object
const bookingService = {
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
