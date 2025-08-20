import { IUser } from "./user.interface";
import User from "./user.model";

// Register new user
const registerUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
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
