import { Router } from "express";
import userRoutes from "../modules/user/user.routes";
import authRoutes from "../modules/auth/auth.routes";
import tourRoutes from "../modules/tour/tour.routes";
import tourTypeRoutes from "../modules/tourType/tourType.routes";
import divisionRoutes from "../modules/division/division.routes";
import bookingRoutes from "../modules/booking/booking.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import otpRoutes from "../modules/otp/otp.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/tour",
    route: tourRoutes,
  },
  {
    path: "/tour-type",
    route: tourTypeRoutes,
  },
  {
    path: "/division",
    route: divisionRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/stat",
    route: otpRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const moduleRouter = router;
export default moduleRouter;
