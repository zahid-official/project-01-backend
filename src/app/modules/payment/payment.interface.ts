/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

// Defines payment status
export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

// Payment interface definition
export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGateway?: any;
  invoiceUrl?: string;
  status: PaymentStatus;
}
