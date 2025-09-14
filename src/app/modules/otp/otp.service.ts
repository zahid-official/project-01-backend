import { redisClient } from "../../config/redis";
import generateOtp from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";

// Send otp
const sendOtp = async (name: string, email: string) => {
  const otp = generateOtp(6);

  // Store otp in redis with expiry time of 2 minutes
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
const verifyOtp = async () => {
  return null;
};

// Otp service object
const otpService = {
  sendOtp,
  verifyOtp,
};

export default otpService;
