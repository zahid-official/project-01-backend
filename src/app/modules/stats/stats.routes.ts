import { Router } from "express";
import { Role } from "../user/user.interface";
import statsController from "./stats.controller";
import validateToken from "../../middlewares/validateToken";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/user",
  validateToken(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getUserStats
);
router.get(
  "/tour",
  validateToken(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getTourStats
);
router.get(
  "/booking",
  validateToken(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getBookingStats
);
router.get(
  "/payment",
  validateToken(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getPaymentStats
);

// Export stats routes
const statsRoutes = router;
export default statsRoutes;
