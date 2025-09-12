import passport from "passport";
import { Router } from "express";
import { Role } from "../user/user.interface";
import authController from "./auth.controller";
import {
  changePasswordZodSchema,
  setPasswordZodSchema,
} from "./auth.validation";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";

// Initialize router
const router = Router();

// Get routes
router.get("/google", authController.googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
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

// Export auth routes
const authRoutes = router;
export default authRoutes;
