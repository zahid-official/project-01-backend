import { Router } from "express";
import { Role } from "../user/user.interface";
import bookingController from "./booking.controller";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation";

// Initialize router
const router = Router();

// Get all bookings
router.get(
  "/",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings
);

// Get my bookings
router.get(
  "/my-bookings",
  validateToken(...Object.values(Role)),
  bookingController.getMyBookings
);

// Get single booking
router.get(
  "/:id",
  validateToken(...Object.values(Role)),
  bookingController.getSingleBooking
);

// Create new booking
router.post(
  "/create",
  validateToken(...Object.values(Role)),
  validateSchema(createBookingZodSchema),
  bookingController.createBooking
);

// Update booking
router.patch(
  "/:id",
  validateToken(Role.ADMIN, Role.SUPER_ADMIN),
  validateSchema(updateBookingZodSchema),
  bookingController.updateBooking
);

// Delete booking
router.delete(
  "/:id",
  validateToken(...Object.values(Role)),
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  bookingController.deleteBooking
);

// Export booking routes
const bookingRoutes = router;
export default bookingRoutes;
