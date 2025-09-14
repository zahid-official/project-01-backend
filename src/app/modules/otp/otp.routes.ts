import { Router } from "express";
import otpController from "./otp.controller";
import { sendOtpZodSchema } from "./otp.validation";
import validateSchema from "../../middlewares/validateSchema";

// Initialize router
const router = Router();

// Post routes
router.post("/send", validateSchema(sendOtpZodSchema), otpController.sendOtp);
router.post("/verify", otpController.verifyOtp);

// Export otp routes
const otpRoutes = router;
export default otpRoutes;
