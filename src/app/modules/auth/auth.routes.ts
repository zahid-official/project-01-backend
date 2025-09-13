import passport from "passport";
import { Router } from "express";
import { Role } from "../user/user.interface";
import authController from "./auth.controller";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  setPasswordZodSchema,
} from "./auth.validation";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";
import envVars from "../../config/env";

// Initialize router
const router = Router();

// Get routes
router.get("/google", authController.googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?errorMessage=There was an error during Google authentication. Please try again.`,
  }),
  authController.googleCallback
);

// Post routes
router.post("/login", authController.credentialsLogin);
router.post("/regenerate-token", authController.regenerateAccessToken);
router.post("/logout", authController.logout);

// Patch routes
router.patch(
  "/set-password",
  validateToken(...Object.values(Role)),
  validateSchema(setPasswordZodSchema),
  authController.setPassword
);
router.patch(
  "/reset-password",
  validateToken(...Object.values(Role)),
  authController.resetPassword
);
router.patch(
  "/change-password",
  validateToken(...Object.values(Role)),
  validateSchema(changePasswordZodSchema),
  authController.changePassword
);
router.patch(
  "/forgot-password",
  validateSchema(forgotPasswordZodSchema),
  authController.forgotPassword
);

// Export auth routes
const authRoutes = router;
export default authRoutes;
