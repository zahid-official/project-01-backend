import { IUser } from "./user.interface";
import User from "./user.model";

// Retrieve all users
const retrieveAllUsers = async () => {
  const users = await User.find();
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

// Register new user
const registerUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
  return user;
};

// User service object
const userService = {
  registerUser,
  retrieveAllUsers,
};

export default userService;
