import { Router } from "express";
import userRoutes from "../modules/user/user.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const moduleRouter = router;
export default moduleRouter;
