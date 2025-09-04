import { Router } from "express";
import divisionController from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import validateSchema from "../../middlewares/validateSchema";

// Initialize router
const router = Router();

// Get all divisions
router.get("/", divisionController.getAllDivisions);

// Create new division
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(createDivisionZodSchema),
  divisionController.createDivision
);

// Update user
router.patch(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(updateDivisionZodSchema),
  divisionController.updateDivision
);

// Export division routes
const divisionRoutes = router;
export default divisionRoutes;
