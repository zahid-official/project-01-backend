import { Types } from "mongoose";

// Defines user roles
enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

// Describes account status
enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// Authentication provider details
interface AuthProvider {
  provider: string;
  providerId: string;
}

// User profile structure
interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  accountStatus?: AccountStatus;
  isDeleted?: string;
  isVerified?: string; 
  role: Role;
  auth: AuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}

export default IUser;
