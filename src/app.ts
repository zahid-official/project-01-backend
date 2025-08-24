import cors from "cors";
import express, { Application, Request, Response } from "express";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import moduleRouter from "./app/routes";
import cookieParser from "cookie-parser";

// Express application
const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// routes middleware
app.use("/api/v1", moduleRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Wandora Server");
});

// Handle global error
app.use(globalErrorHandler);

// Handle not found
app.use(notFoundHandler);

export default app;
