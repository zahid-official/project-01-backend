/* eslint-disable no-console */

import envVars from "../config/env";
import User from "../modules/user/user.model";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";

const superAdmin = async () => {
  try {
    // Check if super admin already exists
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      return console.log("Super admin already exists");
    }

    // Auth provider
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      parseInt(envVars.BCRYPT_SALT_ROUNDS)
    );

    // Super admin payload
    const superAdminData: IUser = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      auths: [authProvider],
    };

    await User.create(superAdminData);
    console.log("Super admin created successfully");
  } catch (error) {
    console.error(error);
  }
};

export default superAdmin;
