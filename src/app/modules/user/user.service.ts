import AppError from "../../errors/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

// Register new user
const registerUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload || {};

  // Check if user already exists
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email"
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password as string, 10);

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

// User service object
const userService = {
  registerUser,
  retrieveAllUsers,
};

export default userService;
