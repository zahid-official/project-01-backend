import z from "zod";

// Zod scheme for sending otp
export const sendOtpZodSchema = z.object({
  // Name
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." })
    .trim(),

  // Email
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email format",
    })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .trim(),
});

// Zod scheme for verifying otp
export const verifyOtpZodSchema = z.object({
  // Email
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email format",
    })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .trim(),

  // OTP
  otp: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "OTP is required" : "OTP must be a string",
    })
    .length(6, { error: "OTP must be exactly 6 characters long." })
    .trim(),
});
