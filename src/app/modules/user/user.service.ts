import { IUser } from "./user.interface";
import User from "./user.model";

const registerUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });

  return user;
};

// User service object
const userService = {
  registerUser,
};

export default userService;
