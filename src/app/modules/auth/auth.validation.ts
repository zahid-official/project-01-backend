import z from "zod";

// Zod scheme for change password
export const changePasswordZodSchema = z.object({
  // Old password
  oldPassword: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Old password is required"
          : "Old password must be string",
    })
    .trim(),

  // New password
  newPassword: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New password is required"
          : "New password must be string",
    })
    .min(8, { error: "New password must be at least 8 characters long." })
    .trim()

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "New password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "New password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "New password must contain at least 1 number.",
    })
    .trim(),
});

// Zod scheme for set password
export const setPasswordZodSchema = z.object({
  // Password
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New password is required"
          : "New password must be string",
    })
    .min(8, { error: "New password must be at least 8 characters long." })
    .trim()

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "New password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "New password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "New password must contain at least 1 number.",
    })
    .trim(),
});

// Zod scheme for forgot password
export const forgotPasswordZodSchema = z.object({
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
