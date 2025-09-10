import { model, Schema } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";

// Mongoose schema definition for booking
const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: Schema.Types.ObjectId, ref: "Tour", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  { versionKey: false, timestamps: true }
);

// Create mongoose model from booking schema
const Booking = model<IBooking>("Booking", bookingSchema, "bookingCollection");
export default Booking;
