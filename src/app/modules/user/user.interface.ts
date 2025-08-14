import { Types } from "mongoose";

// Defines user roles
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

// Describes account status
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// Authentication provider details
export interface IAuthProvider {
  provider: string;
  providerId: string;
}

// User profile structure
export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  accountStatus?: AccountStatus;
  isDeleted?: boolean;
  isVerified?: boolean;
  role: Role;
  auth: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
