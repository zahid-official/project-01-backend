import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

// Login with credentials
router.post("/login", authController.credentialsLogin);
router.post("/regenerate-token", authController.regenerateToken);
router.post("/logout", authController.logout);

// Export auth routes
const authRoutes = router;
export default authRoutes;
