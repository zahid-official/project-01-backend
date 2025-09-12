import { Router } from "express";
import { Role } from "../user/user.interface";
import tourController from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";
import multerUpload from "../../config/multer";

// Initialize router
const router = Router();

// Get all tours
router.get("/", tourController.getAllTours);

// Get single tour
router.get("/:slug", tourController.getSingleTour);

// Create new tour
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateSchema(createTourZodSchema),
  tourController.createTour
);

// Update tour
router.patch(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateSchema(updateTourZodSchema),
  tourController.updateTour
);

// Delete tour
router.delete(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTour
);

// Export tour routes
const tourRoutes = router;
export default tourRoutes;
