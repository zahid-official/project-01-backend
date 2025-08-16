import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const routesErrorHandler = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: "Route not found",
    success: false,
    error: {
      name: "404 Not found",
      message: "The requested route does not exist on the server",
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default routesErrorHandler;
