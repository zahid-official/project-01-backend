import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import generateJWT from "../../utils/generateJWT";

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

  // JWT token payload
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate JWT token
  const token = generateJWT(jwtPayload);
  return { token };
};

// Auth service object
const authService = {
  loginByEmail,
};

export default authService;
