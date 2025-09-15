import { Router } from "express";
import userController from "./user.controller";
import { registerUserZodSchema, updateUserZodSchema } from "./user.validation";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "./user.interface";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);
router.get(
  "/:id",
  validateToken(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getSingleUser
);
router.get(
  "/profile",
  validateToken(...Object.values(Role)),
  userController.getProfileInfo
);

// Post routes
router.post(
  "/register",
  validateSchema(registerUserZodSchema),
  userController.registerUser
);

// Patch routes
router.patch(
  "/:id",
  validateToken(...Object.values(Role)),
  validateSchema(updateUserZodSchema),
  userController.updateUser
);

// Export user routes
const userRoutes = router;
export default userRoutes;
