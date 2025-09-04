import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import Division from "./division.model";
import { IDivision } from "./division.interface";

// Get all divisions
const getAllDivisions = async () => {
  const divisions = await Division.find();
  const totalDivisions = await Division.countDocuments();
  return {
    data: divisions,
    meta: { total: totalDivisions },
  };
};

// Create new division
const createDivision = async (payload: IDivision) => {
  // Check if division already exists
  const isDivisionExists = await Division.findOne({ name: payload.name });
  if (isDivisionExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Division ${payload.name} already exists`
    );
  }

  const division = await Division.create(payload);
  return division;
};

// Update division details
const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  // Check if division exists
  const isDivisionExists = await Division.findById(divisionId);
  if (!isDivisionExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found");
  }

  // Check if the updated name conflicts with another existing division
  if (isDivisionExists.name === payload.name) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Division ${payload.name} already exists. Please provide a different division name to update`
    );
  }

  const modifiedDetails = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return modifiedDetails;
};

// Delete division
const deleteDivision = async (divisionId: string) => {
  // Check if division exists
  const isDivisionExists = await Division.findById(divisionId);
  if (!isDivisionExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found");
  }

  const deletedDivision = await Division.findByIdAndDelete(divisionId);
  return deletedDivision;
};

// Division service object
const divisionService = {
  getAllDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
};

export default divisionService;
