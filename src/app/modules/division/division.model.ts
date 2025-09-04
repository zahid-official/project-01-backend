import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

// Mongoose schema definition for division
const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create mongoose model from division schema
const Division = model<IDivision>(
  "Division",
  divisionSchema,
  "divisionCollection"
);

export default Division;
