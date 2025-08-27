/* eslint-disable @typescript-eslint/no-non-null-assertion */

import AppError from "../../errors/AppError";
import { AccountStatus, IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import getTokens, { recreateToken } from "../../utils/getTokens";
import { verifyJWT } from "../../utils/JWT";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Login by email
const loginByEmail = async (payload: IUser) => {
  const { email, password } = payload || {};

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
  }

  // Compare password with hashed password
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    user?.password as string
  );

  // If password does not match, throw error
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Generate JWT tokens
  const tokens = getTokens(user);

  // Convert to plain object & remove password before sending response
  const data = user.toObject();
  delete data?.password;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    data,
  };
};

// Renew access token using refresh token
const renewAccessToken = async (refreshToken: string) => {
  // Check if refresh token is provided
  if (!refreshToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "No refresh token provided, authorization denied"
    );
  }

  const verifiedRefreshToken = verifyJWT(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  // Find user by email
  const user = await User.findOne({ email: verifiedRefreshToken.email });

  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist");
  }

  // Check if user is blocked or inactive
  if (
    user.accountStatus === AccountStatus.BLOCKED ||
    user.accountStatus === AccountStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `User is ${user.accountStatus}`
    );
  }

  // Check if user is deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  }

  // Recrete JWT access token
  const accessToken = recreateToken(user);

  return { accessToken };
};

// Change password
const changePassword = async (
  decodedToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(decodedToken?.userId);

  // Compare old password with database stored password
  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  // Check if old password matches
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  // Hash the new password and save to database
  user!.password = await bcrypt.hash(
    newPassword,
    parseInt(envVars.BCRYPT_SALT_ROUNDS)
  );
  user!.save();

  return null;
};

// Auth service object
const authService = {
  loginByEmail,
  renewAccessToken,
  changePassword,
};

export default authService;
