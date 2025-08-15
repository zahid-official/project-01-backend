import { Router } from "express";
import userRoutes from "../modules/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const moduleRouter = router;
export default moduleRouter;
