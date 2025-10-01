import { redisClient } from "../../config/redis";
import AppError from "../../errors/AppError";
import generateOtp from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import User from "../user/user.model";
import httpStatus from "http-status-codes";

// Send otp
const sendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user is already verified
  if (user.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already verified. Please login"
    );
  }

  // Store otp in redis with expiry time of 2 minutes
  const otp = generateOtp(6);
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 60 * 2,
    },
  });

  // Send otp to email
  await sendEmail({
    to: email,
    subject: "OTP code for verification",
    templateName: "sendOtp",
    templateData: {
      name: name,
      otpCode: otp,
      companyName: "Wandora",
      expiryTime: "2 minutes",
    },
  });

  return null;
};

// Verify otp
const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user is already verified
  if (user.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already verified. Please login"
    );
  }

  // Get otp from redis
  const redisKey = `otp:${email}`;
  const verifyOtp = await redisClient.get(redisKey);

  // Check if otp exists
  if (!verifyOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP expired or invalid. Please request a new one"
    );
  }

  // Check if otp is valid
  if (verifyOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP. Please try again");
  }

  // Update user as verified and delete otp from redis
  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey),
  ]);

  return null;
};

// Otp service object
const otpService = {
  sendOtp,
  verifyOtp,
};

export default otpService;
