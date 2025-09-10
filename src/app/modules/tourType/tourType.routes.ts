import { Router } from "express";
import { Role } from "../user/user.interface";
import tourTypeController from "./tourType.controller";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";
import {
  createTourTypeZodSchema,
  updateTourTypeZodSchema,
} from "./tourType.validation";

// Initialize router
const router = Router();

// Get all tourTypes
router.get("/", tourTypeController.getAllTourTypes);

// Get single tourType
router.get("/:id", tourTypeController.getSingleTourType);

// Create new tourType
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(createTourTypeZodSchema),
  tourTypeController.createTourType
);

// Update tourType
router.patch(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(updateTourTypeZodSchema),
  tourTypeController.updateTourType
);

// Delete tourType
router.delete(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  tourTypeController.deleteTourType
);

// Export tourType routes
const tourTypeRoutes = router;
export default tourTypeRoutes;
