import { Router } from "express";
import userController from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import validateUserData from "../../middlewares/validateUserData";
import validateToken from "../../middlewares/validateToken";
import { Role } from "./user.interface";

// Initialize router
const router = Router();

// Create new user
router.post(
  "/register",
  validateUserData(createUserZodSchema),
  userController.createUser
);

// Get all users
router.get(
  "/",
  validateToken(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);

// Update user
router.patch(
  "/:id",
  validateToken(...Object.values(Role)),
  validateUserData(updateUserZodSchema),
  userController.updateUser
);

// Export user routes
const userRoutes = router;
export default userRoutes;
