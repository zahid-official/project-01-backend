import { model, Schema } from "mongoose";
import { ITour } from "./tour.interface";

// Mongoose schema definition for tour
const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    cost: { type: Number },
    minAge: { type: Number },
    location: { type: String },
    maxGuests: { type: Number },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    images: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    aminities: { type: [String], default: [] },
    divisionId: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourTypeId: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to generate slug from title
tourSchema.pre("save", function (next) {
  // Generate slug only if the title is modified or new
  if (this.isModified("title")) {
    const slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");

    // Append the slug field
    this.slug = `${slug}`;
  }
  next();
});

// Pre-update middleware to update slug if title is modified
tourSchema.pre("findOneAndUpdate", function (next) {
  const tourDocs = this.getUpdate() as Partial<ITour>;
  // Regenerate slug only if the title is being updated
  if (tourDocs.title) {
    const slug = tourDocs.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");
    tourDocs.slug = `${slug}`;

    // Append the slug field
    this.setUpdate(tourDocs);
  }
  next();
});

// Create mongoose model from tour schema.
const Tour = model<ITour>("Tour", tourSchema, "tourCollection");
export default Tour;
