import { Router } from "express";
import paymentController from "./payment.controller";

// Initialize router
const router = Router();

router.post("/success", paymentController.successPayment);
router.post("/failed", paymentController.failedPayment);
router.post("/canceled", paymentController.canceledPayment);

// Export payment routes
const paymentRoutes = router;
export default paymentRoutes;
