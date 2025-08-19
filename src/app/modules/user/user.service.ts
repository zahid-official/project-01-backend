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
  return users;
};

// User service object
const userService = {
  registerUser,
  retrieveAllUsers,
};

export default userService;
