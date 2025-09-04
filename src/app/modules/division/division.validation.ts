import z from "zod";

// Zod scheme for new division creation
export const createDivisionZodSchema = z.object({
  // Name
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." }),

  // Thumbnail
  thumbnail: z.string({ error: "Thumbnail must be string" }).optional(),

  // Description
  description: z
    .string({ error: "Description must be string" })
    .max(500, { error: "Description cannot exceed 500 characters." })
    .optional(),
});

// Zod scheme for updating division data
export const updateDivisionZodSchema = z.object({
  // Name
  name: z
    .string({ error: "Name must be string" })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." })
    .optional(),

  // Thumbnail
  thumbnail: z.string({ error: "Thumbnail must be string" }).optional(),

  // Description
  description: z
    .string({ error: "Description must be string" })
    .max(500, { error: "Description cannot exceed 500 characters." })
    .optional(),
});
