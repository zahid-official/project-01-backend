import { Router } from "express";
import userController from "./user.controller";
import { validateUserData } from "../../middlewares/validateUserData";
import { createUserZodSchema } from "./user.validation";

const router = Router();

// Get all users
router.get("/", userController.getAllUsers);

// Create new user
router.post(
  "/register",
  validateUserData(createUserZodSchema),
  userController.createUser
);

// Export user routes
const userRoutes = router;
export default userRoutes;
