import { Router } from "express";
import divisionController from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import validateSchema from "../../middlewares/validateSchema";
import multerUpload from "../../config/multer";

// Initialize router
const router = Router();

// Get all divisions
router.get("/", divisionController.getAllDivisions);

// Get single division
router.get("/:slug", divisionController.getSingleDivision);

// Create new division
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateSchema(createDivisionZodSchema),
  divisionController.createDivision
);

// Update division
router.patch(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateSchema(updateDivisionZodSchema),
  divisionController.updateDivision
);

// Delete division
router.delete(
  "/:id",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);

// Export division routes
const divisionRoutes = router;
export default divisionRoutes;
