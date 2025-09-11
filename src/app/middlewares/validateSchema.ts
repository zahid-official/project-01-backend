import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { ZodObject } from "zod";

const validateSchema = (zodSchema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data) || req.body;
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
};

export default validateSchema;
