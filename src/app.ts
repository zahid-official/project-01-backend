import express, { Application, Request, Response } from "express";

const app: Application = express();

// root routue
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the wandora server");
});

export default app;
