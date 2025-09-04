import { Router } from "express";
import userController from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "./user.interface";

// Initialize router
const router = Router();

// Get all users
router.get(
  "/",
  validateToken(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);

// Create new user
router.post(
  "/register",
  validateSchema(createUserZodSchema),
  userController.createUser
);

// Update user
router.patch(
  "/:id",
  validateToken(...Object.values(Role)),
  validateSchema(updateUserZodSchema),
  userController.updateUser
);

// Export user routes
const userRoutes = router;
export default userRoutes;
