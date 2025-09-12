import passport from "passport";
import { Router } from "express";
import { Role } from "../user/user.interface";
import authController from "./auth.controller";
import { changePasswordZodSchema } from "./auth.validation";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";

// Initialize router
const router = Router();

// Post routes
router.post("/login", authController.credentialsLogin);
router.post("/regenerate-token", authController.regenerateAccessToken);
router.post("/logout", authController.logout);
router.post(
  "/change-password",
  validateToken(...Object.values(Role)),
  validateSchema(changePasswordZodSchema),
  authController.changePassword
);
router.post(
  "/reset-password",
  validateToken(...Object.values(Role)),
  authController.resetPassword
);

// Get routes
router.get("/google", authController.googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

// Export auth routes
const authRoutes = router;
export default authRoutes;
