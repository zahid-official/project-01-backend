import { Router } from "express";
import { Role } from "../user/user.interface";
import tourTypeController from "./tourType.controller";
import validateToken from "../../middlewares/validateToken";
import validateSchema from "../../middlewares/validateSchema";
import { createTourTypeZodSchema } from "./tourType.validation";

const router = Router();

// Create new tourType
router.post(
  "/create",
  validateToken(Role.SUPER_ADMIN, Role.SUPER_ADMIN),
  validateSchema(createTourTypeZodSchema),
  tourTypeController.createTourType
);

// Export tourType routes
const tourTypeRoutes = router;
export default tourTypeRoutes;
