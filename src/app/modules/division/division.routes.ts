import { Router } from "express";
import divisionController from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";
import validateUserData from "../../middlewares/validateUserData";

const router = Router();

// Create new division
router.post(
  "/create",
  validateUserData(createDivisionZodSchema),
  divisionController.createDivision
);

// Export division routes
const divisionRoutes = router;
export default divisionRoutes;
