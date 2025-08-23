import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import catchAsync from "../utils/catchAsync";
import { verifyJWT } from "../utils/JWT";

// It's a high-order function that returns a middleware function
const validateToken = (...userRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No token provided, authorization denied"
      );
    }

    // Verify & decode the token
    const verifiedToken = verifyJWT(token, envVars.JWT_SECRET) as JwtPayload;

    // Check if user has permission to access
    if (!userRoles.includes(verifiedToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }

    next();
  });

export default validateToken;
