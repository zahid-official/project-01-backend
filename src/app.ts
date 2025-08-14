import cors from "cors";
import express, { Application, Request, Response } from "express";
import userRoutes from "./app/modules/user/user.routes";
import routesErrorHandler from "./app/middlewares/routesErrorHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

// Express application
const app: Application = express();

// routes middleware
app.use("/user", userRoutes);

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Wandora Server");
});

// Handle routes error
app.use(routesErrorHandler);

// Handle global error
app.use(globalErrorHandler);

export default app;
