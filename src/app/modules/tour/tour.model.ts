import { model, Schema } from "mongoose";
import { ITour } from "./tour.interface";

// Mongoose schema definition for tour
const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
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
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create mongoose model from tour schema.
const Tour = model<ITour>("Tour", tourSchema, "tourCollection");
export default Tour;
