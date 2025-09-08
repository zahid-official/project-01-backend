import z from "zod";
import { Types } from "mongoose";
import { BookingStatus } from "./booking.interface";

// Zod scheme for new booking creation
export const createBookingZodSchema = z.object({
  // TourId
  tourId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Tour is required"
          : "Tour must be a string objectId",
    })
    .refine((value) => Types.ObjectId.isValid(value), {
      error: "Invalid ObjectId",
    }),

  // Guests
  guests: z
    .number({ error: "Guests must be a number" })
    .min(1, { error: "Guests must be at least 1" }),
});

// Zod scheme for booking update
export const updateBookingZodSchema = z.object({
  // Status
  status: z.enum(Object.values(BookingStatus), {
    error: "Invalid booking status",
  }),
});
