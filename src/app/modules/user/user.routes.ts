import { Router } from "express";
import userController from "./user.controller";

const router = Router();

// Register user
router.post("/register", userController.createUser);

// Export user routes
const userRoutes = router;
export default userRoutes;
