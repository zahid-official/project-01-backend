import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateUserData = (zodSchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = zodSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
