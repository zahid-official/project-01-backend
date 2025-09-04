import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import Division from "./division.model";
import { IDivision } from "./division.interface";

// Create new division
const createDivision = async (payload: IDivision) => {
  // Check if division already exists
  const isDivisionExists = await Division.findOne({ name: payload.name });
  if (isDivisionExists) {
    throw new AppError(httpStatus.CONFLICT, "Division already exists");
  }

  const division = await Division.create(payload);
  return division;
};

// Division service object
const divisionService = {
  createDivision,
};

export default divisionService;
