import { Router } from "express";
import authController from "./auth.controller";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import { resetPasswordZodSchema } from "../user/user.validation";
import validateUserData from "../../middlewares/validateUserData";

const router = Router();

// Login with credentials
router.post("/login", authController.credentialsLogin);
router.post("/regenerate-token", authController.regenerateToken);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  validateToken(...Object.values(Role)),
  validateUserData(resetPasswordZodSchema),
  authController.resetPassword
);

// Export auth routes
const authRoutes = router;
export default authRoutes;
