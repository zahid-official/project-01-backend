import { Types } from "mongoose";

// Defines booking status
export enum BookingStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

// Booking interface definition
export interface IBooking {
  userId: Types.ObjectId;
  tourId: Types.ObjectId;
  paymentId?: Types.ObjectId;
  guests: number;
  status: BookingStatus;
}
