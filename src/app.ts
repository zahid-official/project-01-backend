import cors from "cors";
import express, { Application, Request, Response } from "express";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

// Express application
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Wandora Server");
});

// Handle global error
app.use(globalErrorHandler);

// Handle not found
app.use(notFoundHandler);

export default app;
