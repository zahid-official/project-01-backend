import AppError from "../../errors/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Register new user
const registerUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload || {};

  // Check if user already exists
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, `User '${email}' already exists`);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    password as string,
    parseInt(envVars.BCRYPT_SALT_ROUNDS)
  );

  // Authentication provider
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string, // Using email as providerId for credentials
  };

  // Create new user
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

// Retrieve all users
const retrieveAllUsers = async () => {
  const users = await User.find();
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

// Modify user details
const modifyUserDetails = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  // Ensure the user is modifying their own details
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Only super admin can set super admin role
  if (
    payload?.role === Role.SUPER_ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only super admin can assign super admin role"
    );
  }

  // Only anmin and super admin can change roles
  if (
    payload?.role &&
    (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You don't have permission to change role"
    );
  }

  // Prevent status modification by non-admin users
  if (
    (payload?.accountStatus || payload?.isDeleted || payload?.isVerified) &&
    (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You don't have permission to change account status, delete status or verfication status."
    );
  }

  // Hash the password if provided
  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      parseInt(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  const modifiedDetails = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return modifiedDetails;
};

// User service object
const userService = {
  registerUser,
  retrieveAllUsers,
  modifyUserDetails,
};

export default userService;
