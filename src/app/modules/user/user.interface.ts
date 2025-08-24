import { Types } from "mongoose";

// Defines user roles
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

// Defines account status
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// Defines authentication provider interface
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

// User interface definition
export interface IUser {
  _id?: Types.ObjectId;
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
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
