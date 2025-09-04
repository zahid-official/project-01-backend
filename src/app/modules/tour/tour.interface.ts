import { Types } from "mongoose";

// Tour type interface defination
export interface ITourType {
  name: string;
}

// Tour interface defination
export interface ITour {
  title: string;
  slug: string;
  cost?: number;
  minAge?: number;
  location?: string;
  maxGuests?: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  images?: string[];
  included?: string[];
  excluded?: string[];
  tourPlan?: string[];
  aminities?: string[];
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}
