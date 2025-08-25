import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJWT } from "../utils/JWT";
import envVars from "../config/env";
import { JwtPayload } from "jsonwebtoken";

// It's a high-order function that returns a middleware function
const validateToken = (...userRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    // Check if access token is provided
    if (!accessToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "No access token provided, authorization denied"
      );
    }

    // Verify & decode access token
    const verifiedAccessToken = verifyJWT(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Check if user has permission to access
    if (!userRoles.includes(verifiedAccessToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }

    // Attach the decoded token to the request object for further use
    req.decodedToken = verifiedAccessToken;
    next();
  });

export default validateToken;
