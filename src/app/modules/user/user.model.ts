import { model, Schema } from "mongoose";
import { IUser, AccountStatus, IAuthProvider, Role } from "./user.interface";

// Define auth provider schema
const authProvider = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

// Mongoose schema for user model
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auth: [authProvider],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Create mongoose model from user schema
const User = model<IUser>("User", userSchema, "userCollection");
export default User;
