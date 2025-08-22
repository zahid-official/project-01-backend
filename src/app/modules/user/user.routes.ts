import { Router } from "express";
import userController from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validateUserData from "../../middlewares/validateUserData";

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
