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
  if (this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");

    this.slug = `${baseSlug}-division`;
  }

  next();
});

// Pre-update middleware to update slug if name is modified
divisionSchema.pre("findOneAndUpdate", function (next) {
  const divisionDocs = this.getUpdate() as Partial<IDivision>;
  if (divisionDocs.name) {
    const baseSlug = divisionDocs.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/ /g, "-");
    divisionDocs.slug = `${baseSlug}-division`;
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
