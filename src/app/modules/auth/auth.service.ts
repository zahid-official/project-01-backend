/* eslint-disable @typescript-eslint/no-non-null-assertion */

import AppError from "../../errors/AppError";
import { AccountStatus, IAuthProvider } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateResetToken, recreateToken } from "../../utils/getTokens";
import { verifyJWT } from "../../utils/JWT";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

// Regenerate access token using refresh token
const regenerateAccessToken = async (refreshToken: string) => {
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

  // Check if user is verified
  if (!user.isVerified) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is not verified. Please verify your email to proceed."
    );
  }

  // Check if user is blocked or inactive
  if (
    user.accountStatus === AccountStatus.BLOCKED ||
    user.accountStatus === AccountStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `User is ${user.accountStatus}. Please contact support for more information.`
    );
  }

  // Check if user is deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is deleted. Please contact support for more information."
    );
  }

  // Recrete JWT access token
  const accessToken = recreateToken(user);
  return { accessToken };
};

// Set password
const setPassword = async (userId: string, password: string) => {
  const user = await User.findById(userId);

  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user has credentials auth provider
  if (
    !user.auths.some((auth) => auth.provider === "google") &&
    user.auths.some((auth) => auth.provider === "credentials")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only users without credentials auth provider can set password"
    );
  }

  // Check if password is already set for Google authenticated user
  if (user?.password && user.auths.some((auth) => auth.provider === "google")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is already set for Google authenticated user"
    );
  }

  // Hash the password to store in database
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(envVars.BCRYPT_SALT_ROUNDS)
  );

  // Add credentials auth provider to auths array
  const credentialsAuth: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths = [...user.auths, credentialsAuth];

  // Update user password and auths array
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();

  return null;
};

// Reset password
const resetPassword = async () => {
  return null;
};

// Change password
const changePassword = async (
  decodedToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(decodedToken?.userId);

  // Compare old password with database stored password
  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  // Check if old password matches
  if (!isPasswordMatched) {
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

// Forgot password
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user is verified
  if (!user.isVerified) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is not verified. Please verify your email to proceed."
    );
  }

  // Check if user is blocked or inactive
  if (
    user.accountStatus === AccountStatus.BLOCKED ||
    user.accountStatus === AccountStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `User is ${user.accountStatus}. Please contact support for more information.`
    );
  }

  // Check if user is deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is deleted. Please contact support for more information."
    );
  }

  // generate reset token
  const resetToken = generateResetToken(user);

  sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    templateName: "forgotPassword",
    templateData: {
      name: user.name,
      expiryTime: 10,
      companyName: "Wandora",
      resetLink: `${envVars.FRONTEND_URL}/reset-password?token=${resetToken}`,
    },
  });

  return null;
};

// Auth service object
const authService = {
  regenerateAccessToken,
  setPassword,
  resetPassword,
  changePassword,
  forgotPassword,
};

export default authService;
