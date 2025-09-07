import { Types } from "mongoose";

// Tour interface defination
export interface ITour {
  title: string;
  slug: string;
  cost?: number;
  minAge?: number;
  location?: string;
  maxGuests?: number;
  description?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  startDate?: Date;
  endDate?: Date;
  images?: string[];
  included?: string[];
  excluded?: string[];
  tourPlan?: string[];
  aminities?: string[];
  divisionId: Types.ObjectId;
  tourTypeId: Types.ObjectId;
}
