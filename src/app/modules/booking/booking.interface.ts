import { Types } from "mongoose";

// Defines booking status
export enum BookingStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

// Booking interface definition
export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guests: number;
  status: BookingStatus;
}
