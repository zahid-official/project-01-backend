import express, { Application, Request, Response } from "express";
import userRoutes from "./app/modules/user/user.routes";

const app: Application = express();

// routes middleware
app.use("/user", userRoutes);

// root routue
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the wandora server");
});

export default app;
