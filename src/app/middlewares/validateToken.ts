import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import envVars from "../config/env";
import catchAsync from "../utils/catchAsync";
import { Role } from "../modules/user/user.interface";

const validateToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No token provided, authorization denied"
      );
    }

    // Verify the token
    const verifiedToken = jwt.verify(token, envVars.JWT_SECRET) as JwtPayload;

    // Check if user has permission to access
    if (
      verifiedToken.role !== Role.ADMIN &&
      verifiedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }

    next();
  }
);

export default validateToken;
