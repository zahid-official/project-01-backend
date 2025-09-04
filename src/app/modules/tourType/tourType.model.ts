import { model, Schema } from "mongoose";
import { ITourType } from "./tourType.interface";

// Mongoose schema definition for tour type
const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create mongoose model from tour type schema
const TourType = model<ITourType>(
  "TourType",
  tourTypeSchema,
  "tourTypeCollection"
);

export default TourType;
