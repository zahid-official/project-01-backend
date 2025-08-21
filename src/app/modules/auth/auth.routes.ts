import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

// Login with credentials
router.post("/login", authController.credentialsLogin);

// Export auth routes
const authRoutes = router;
export default authRoutes;
