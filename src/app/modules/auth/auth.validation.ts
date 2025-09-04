import z from "zod";

// Zod scheme for resetting password
export const resetPasswordZodSchema = z.object({
  // Old password
  oldPassword: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Old password is required"
        : "Old password must be string",
  }),

  // New password
  newPassword: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New password is required"
          : "New password must be string",
    })
    .min(8, { error: "New password must be at least 8 characters long." })

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "New password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "New password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "New password must contain at least 1 number.",
    }),
});
