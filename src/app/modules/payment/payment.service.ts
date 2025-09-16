/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import Booking from "../booking/booking.model";
import { IPayment, PaymentStatus } from "./payment.interface";
import httpStatus from "http-status-codes";
import Payment from "./payment.model";
import { BookingStatus } from "../booking/booking.interface";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import SSLService from "../sslCommerz/sslCommerz.service";
import generatePdf, { IInvoiceData } from "../../utils/generatePdf";
import { sendEmail } from "../../utils/sendEmail";
import { uploadBufferToCloudinary } from "../../config/cloudinary";

// Get invoice service
const getInvoice = async (paymentId: string, userId: string) => {
  const payment = await Payment.findById(paymentId);

  // Check if payment exists and belongs to the user
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  // Check if booking exists and belongs to the user
  const booking = await Booking.findById(payment.bookingId).select("userId");
  if (!booking || booking.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this invoice"
    );
  }

  // Check if invoice URL exists
  if (!payment.invoiceUrl) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not available");
  }

  return { invoiceUrl: payment.invoiceUrl };
};

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
      .populate("userId", "name email phone address")
      .populate("tourId", "title cost")
      .populate("paymentId", "transactionId");

    // Check if booking record exists
    if (!modifiedBooking) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Booking record not found for the given payment"
      );
    }

    // Invoice data preparation
    const user = modifiedBooking.userId as any;
    const tour = modifiedBooking.tourId as any;
    const payment = modifiedBooking.paymentId as unknown as IPayment;

    const invoiceData: IInvoiceData = {
      cost: tour.cost,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      tourTitle: tour.title,
      guests: modifiedBooking.guests,
      amount: modifiedPayment.amount,
      status: modifiedPayment.status,
      transactionId: payment.transactionId,
      paymentDate: (modifiedPayment.createdAt as Date)
        .toISOString()
        .split("T")[0],
    };
    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );

    // Check if upload to Cloudinary was successful
    if (!cloudinaryResult) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload invoice to Cloudinary"
      );
    }

    // Check if secure_url is present in the Cloudinary response
    if (!cloudinaryResult.secure_url) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Cloudinary did not return a secure URL for the uploaded invoice"
      );
    }

    // Update payment record with invoice URL
    await Payment.findByIdAndUpdate(
      modifiedPayment._id,
      { invoiceUrl: cloudinaryResult.secure_url },
      { runValidators: true, session }
    );

    // Send invoice email to user
    await sendEmail({
      to: user.email,
      subject: "Invoice for Your Recent Booking",
      templateName: "sendInvoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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
      { runValidators: true, session }
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
      { runValidators: true, session }
    );

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment processing failed" };
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
      { runValidators: true, session }
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
      { runValidators: true, session }
    );

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment was canceled by the user" };
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Complete payment of canceled booking
const completePayment = async (bookingId: string) => {
  // Check if booking exists
  const booking = await Booking.findById(bookingId)
    .populate("userId", "name email phone address")
    .populate("paymentId", "transactionId amount status");
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // Initiate SSLCommerz payment
  const bookingDetails = booking as any;
  const sslPayload: ISSLCommerz = {
    name: bookingDetails?.userId?.name,
    email: bookingDetails.userId?.email,
    phone: bookingDetails?.userId?.phone,
    address: bookingDetails?.userId?.address,
    amount: bookingDetails?.paymentId?.amount,
    transactionId: bookingDetails?.paymentId?.transactionId,
  };

  const sslCommerz = await SSLService.sslCommerz(sslPayload);
  return {
    paymentUrl: sslCommerz.GatewayPageURL,
  };
};

// Validate sslCommerz payment
const validatePayment = async (payload: any) => {
  await SSLService.validatePayment(payload);

  return null;
};

// Payment service object
const paymentService = {
  getInvoice,
  successPayment,
  failedPayment,
  canceledPayment,
  completePayment,
  validatePayment,
};

export default paymentService;
