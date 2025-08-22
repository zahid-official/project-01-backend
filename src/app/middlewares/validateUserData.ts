import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { ZodObject } from "zod";

const validateUserData = (zodSchema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
};

export default validateUserData;
