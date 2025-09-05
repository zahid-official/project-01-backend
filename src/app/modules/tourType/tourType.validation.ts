import z from "zod";

// Zod scheme for new tourType creation
export const createTourTypeZodSchema = z.object({
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
});

// Zod scheme for updating tourType data
export const updateTourTypeZodSchema = z.object({
  // Name
  name: z
    .string({ error: "Name must be a string" })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." })
    .trim()
    .optional(),
});
