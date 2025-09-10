import { Router } from "express";
import paymentController from "./payment.controller";

// Initialize router
const router = Router();

router.post("/success", paymentController.successPayment);
router.post("/failed", paymentController.failedPayment);
router.post("/canceled", paymentController.canceledPayment);
router.post("/complete-payment/:bookingId", paymentController.completePayment);

// Export payment routes
const paymentRoutes = router;
export default paymentRoutes;
