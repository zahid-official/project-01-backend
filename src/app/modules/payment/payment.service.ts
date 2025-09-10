import AppError from "../../errors/AppError";
import Booking from "../booking/booking.model";
import { PaymentStatus } from "./payment.interface";
import httpStatus from "http-status-codes";
import Payment from "./payment.model";
import { BookingStatus } from "../booking/booking.interface";

// Successful payment handler
const successPayment = async (transactionId: string) => {
  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Update payment status to PAID
    const modifiedPayment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PaymentStatus.PAID },
      { new: true, runValidators: true, session }
    );

    // Check if payment record exists
    if (!modifiedPayment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Payment record not found for the given transaction ID"
      );
    }

    // Update booking status to COMPLETED
    const modifiedBooking = await Booking.findByIdAndUpdate(
      modifiedPayment?.bookingId,
      { status: BookingStatus.COMPLETED },
      { new: true, runValidators: true, session }
    )
      .populate("userId", "name email")
      .populate("tourId", "title");

    // Check if booking record exists
    if (!modifiedBooking) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Booking record not found for the given payment"
      );
    }

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment processed successfully" };
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Failed payment handler
const failedPayment = async (transactionId: string) => {
  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Update payment status to FAILED
    const modifiedPayment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PaymentStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    // Check if payment record exists
    if (!modifiedPayment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Payment record not found for the given transaction ID"
      );
    }

    // Update booking status to FAILED
    await Booking.findByIdAndUpdate(
      modifiedPayment?.bookingId,
      { status: BookingStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { failed: true, message: "Payment processing failed" };
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Canceled payment handler
const canceledPayment = async (transactionId: string) => {
  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Update payment status to CANCELED
    const modifiedPayment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: PaymentStatus.CANCELED },
      { new: true, runValidators: true, session }
    );

    // Check if payment record exists
    if (!modifiedPayment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Payment record not found for the given transaction ID"
      );
    }

    // Update booking status to CANCELED
    await Booking.findByIdAndUpdate(
      modifiedPayment?.bookingId,
      { status: BookingStatus.CANCELED },
      { new: true, runValidators: true, session }
    );

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { canceled: true, message: "Payment was canceled by the user" };
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Payment service object
const paymentService = {
  successPayment,
  failedPayment,
  canceledPayment,
};

export default paymentService;
