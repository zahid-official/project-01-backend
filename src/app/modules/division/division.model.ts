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

// Pre-save middleware to generate slug from name
divisionSchema.pre("save", function (next) {
  // Generate slug only if the name is modified or new
  if (this.isModified("name")) {
    const slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");

    // Append the slug field
    this.slug = `${slug}-division`;
  }
  next();
});

// Pre-update middleware to update slug if name is modified
divisionSchema.pre("findOneAndUpdate", function (next) {
  const divisionDocs = this.getUpdate() as Partial<IDivision>;
  // Regenerate slug only if the name is being updated
  if (divisionDocs.name) {
    const slug = divisionDocs.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");
    divisionDocs.slug = `${slug}-division`;

    // Append the slug field
    this.setUpdate(divisionDocs);
  }
  next();
});

// Create mongoose model from division schema
const Division = model<IDivision>(
  "Division",
  divisionSchema,
  "divisionCollection"
);

export default Division;
