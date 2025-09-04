import { Router } from "express";
import { Role } from "../user/user.interface";
import tourController from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";

// Initialize router
const router = Router();

// Get all tours
router.get("/", tourController.getAllTours);

// Create new tour
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(createTourZodSchema),
  tourController.createTour
);

// Update tour
router.patch(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(updateTourZodSchema),
  tourController.updateTour
);

// Export tour routes
const tourRoutes = router;
export default tourRoutes;
