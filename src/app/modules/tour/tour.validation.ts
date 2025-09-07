import z from "zod";

// Zod scheme for new tour creation
export const createTourZodSchema = z.object({
  // Title
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(50, { error: "Title cannot exceed 50 characters." })
    .trim(),

  // Cost
  cost: z
    .number({ error: "Cost must be a number" })
    .min(0, { error: "Cost cannot be negative" })
    .optional(),

  // Min Age
  minAge: z
    .number({ error: "Minimum age must be a number" })
    .min(0, { error: "Minimum age cannot be negative" })
    .optional(),

  // Location
  location: z.string({ error: "Location must be a string" }).trim().optional(),

  // Max Guests
  maxGuests: z
    .number({ error: "Max guests must be a number" })
    .min(1, { error: "Max guests must be at least 1" })
    .optional(),

  // Description
  description: z
    .string({ error: "Description must be string" })
    .max(500, { error: "Description cannot exceed 500 characters." })
    .trim()
    .optional(),

  // Departure Location
  departureLocation: z
    .string({ error: "Departure location must be a string" })
    .trim()
    .optional(),

  // Arrival Location
  arrivalLocation: z
    .string({ error: "Arrival location must be a string" })
    .trim()
    .optional(),

  // Start Date
  startDate: z
    .string({ error: "Start date must be a valid string date format" })
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "Start date must be in the future",
    })
    .optional(),

  // End Date
  endDate: z
    .string({ error: "End date must be a valid string date format" })
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "End date must be in the future",
    })
    .optional(),

  // Images
  images: z
    .array(z.string({ error: "Each image must be a string" }))
    .optional(),

  // Included
  included: z
    .array(z.string({ error: "Each included item must be a string" }))
    .optional(),

  // Excluded
  excluded: z
    .array(z.string({ error: "Each excluded item must be a string" }))
    .optional(),

  // Tour Plan
  tourPlan: z
    .array(z.string({ error: "Each tour plan must be a string" }))
    .optional(),

  // Amenities
  aminities: z
    .array(z.string({ error: "Each amenity must be a string" }))
    .optional(),

  // Division id
  divisionId: z.string({ error: "Division ID must be a string" }).trim(),

  // TourType id
  tourTypeId: z.string({ error: "Tour Type ID must be a string" }).trim(),
});

// Zod scheme for updating tour data
export const updateTourZodSchema = z.object({
  // Title
  title: z
    .string({ error: "Title must be a string" })
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(50, { error: "Title cannot exceed 50 characters." })
    .trim()
    .optional(),

  // Cost
  cost: z
    .number({ error: "Cost must be a number" })
    .min(0, { error: "Cost cannot be negative" })
    .optional(),

  // Min Age
  minAge: z
    .number({ error: "Minimum age must be a number" })
    .min(0, { error: "Minimum age cannot be negative" })
    .optional(),

  // Location
  location: z.string({ error: "Location must be a string" }).trim().optional(),

  // Max Guests
  maxGuests: z
    .number({ error: "Max guests must be a number" })
    .min(1, { error: "Max guests must be at least 1" })
    .optional(),

  // Description
  description: z
    .string({ error: "Description must be string" })
    .max(500, { error: "Description cannot exceed 500 characters." })
    .trim()
    .optional(),

  // Departure Location
  departureLocation: z
    .string({ error: "Departure location must be a string" })
    .trim()
    .optional(),

  // Arrival Location
  arrivalLocation: z
    .string({ error: "Arrival location must be a string" })
    .trim()
    .optional(),

  // Start Date
  startDate: z
    .string({ error: "Start date must be a valid string date format" })
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "Start date must be in the future",
    })
    .optional(),

  // End Date
  endDate: z
    .string({ error: "End date must be a valid string date format" })
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "End date must be in the future",
    })
    .optional(),

  // Images
  images: z
    .array(z.string({ error: "Each image must be a string" }))
    .optional(),

  // Included
  included: z
    .array(z.string({ error: "Each included item must be a string" }))
    .optional(),

  // Excluded
  excluded: z
    .array(z.string({ error: "Each excluded item must be a string" }))
    .optional(),

  // Tour Plan
  tourPlan: z
    .array(z.string({ error: "Each tour plan must be a string" }))
    .optional(),

  // Amenities
  aminities: z
    .array(z.string({ error: "Each amenity must be a string" }))
    .optional(),

  // Division
  divisionId: z
    .string({ error: "Division ID must be a string" })
    .trim()
    .optional(),

  // Tour Type
  tourTypeId: z
    .string({ error: "Tour Type ID must be a string" })
    .trim()
    .optional(),
});
