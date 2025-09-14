/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

// Defines payment status
export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

// Payment interface definition
export interface IPayment {
  bookingId: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGateway?: any;
  invoiceUrl?: string;
  status: PaymentStatus;
  createdAt?: Date;
}
