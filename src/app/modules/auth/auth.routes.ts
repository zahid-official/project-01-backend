import { NextFunction, Request, Response, Router } from "express";
import authController from "./auth.controller";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import { resetPasswordZodSchema } from "../user/user.validation";
import validateUserData from "../../middlewares/validateUserData";
import passport from "passport";

const router = Router();

// Post routes
router.post("/login", authController.credentialsLogin);
router.post("/regenerate-token", authController.regenerateToken);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  validateToken(...Object.values(Role)),
  validateUserData(resetPasswordZodSchema),
  authController.resetPassword
);

// Get routes
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

// Export auth routes
const authRoutes = router;
export default authRoutes;
