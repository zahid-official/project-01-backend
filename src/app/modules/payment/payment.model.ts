import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

// Mongoose schema definition for payment
const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentGateway: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
  },
  { versionKey: false, timestamps: true }
);

// Create mongoose model from payment schema
const Payment = model<IPayment>("Payment", paymentSchema, "paymentCollection");
export default Payment;
