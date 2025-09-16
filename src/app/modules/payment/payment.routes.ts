import { Router } from "express";
import paymentController from "./payment.controller";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/invoice/:paymentId",
  validateToken(...Object.values(Role)),
  paymentController.getInvoice
);

// Post routes
router.post("/success", paymentController.successPayment);
router.post("/failed", paymentController.failedPayment);
router.post("/canceled", paymentController.canceledPayment);
router.post("/complete-payment/:bookingId", paymentController.completePayment);
router.post("/validate-payment", paymentController.validatePayment);

// Export payment routes
const paymentRoutes = router;
export default paymentRoutes;
