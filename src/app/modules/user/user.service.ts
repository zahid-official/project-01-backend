import AppError from "../../errors/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../utils/queryBuilder";

// Get all users
const getAllUsers = async (query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["name", "email"];

  // Build the query using QueryBuilder class and fetch users
  const queryBuilder = new QueryBuilder<IUser>(User.find(), query);
  const users = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .search(searchFields)
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();

  return {
    data: users,
    meta,
  };
};

// Get single user
const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return user;
};

// Get profile info
const getProfileInfo = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return user;
};

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

  // Convert to plain object & remove password before sending response
  const data = user.toObject();
  delete data?.password;

  return data;
};

// Update user details
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  // Ensure users and guides can only update their own profile
  if (
    (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) &&
    userId !== decodedToken.userId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own profile"
    );
  }

  // Check if user exists
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Prevent modification of super admin account by non-super admin users
  if (
    isUserExists?.role === Role.SUPER_ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You don't have permission to modify super admin account"
    );
  }

  // Only anmin & super admin can change roles
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

  // Update user details
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  // Convert to plain object & remove password before sending response
  const data = user?.toObject();
  delete data?.password;

  return data;
};

// User service object
const userService = {
  getAllUsers,
  getProfileInfo,
  getSingleUser,
  registerUser,
  updateUser,
};

export default userService;
