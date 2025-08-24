import AppError from "../../errors/AppError";
import { AccountStatus, IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import getTokens from "../../utils/getTokens";
import { generateJWT, verifyJWT } from "../../utils/JWT";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// login by email
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

  // Payload
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT access token
  const accessToken = generateJWT(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRESIN
  );

  return { accessToken };
};

// Auth service object
const authService = {
  loginByEmail,
  renewAccessToken,
};

export default authService;
