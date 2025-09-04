import { Router } from "express";
import divisionController from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";
import validateUserData from "../../middlewares/validateUserData";

// Initialize router
const router = Router();

// Get all divisions
router.get("/", divisionController.getAllDivisions);

// Create new division
router.post(
  "/create",
  validateUserData(createDivisionZodSchema),
  divisionController.createDivision
);

// Export division routes
const divisionRoutes = router;
export default divisionRoutes;
