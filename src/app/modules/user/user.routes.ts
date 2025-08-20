import { Router } from "express";
import userController from "./user.controller";

const router = Router();

// Get all users
router.get("/", userController.getAllUsers);

// Create new user
router.post("/register", userController.createUser);

// Export user routes
const userRoutes = router;
export default userRoutes;
