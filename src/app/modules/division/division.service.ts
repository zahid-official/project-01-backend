import AppError from "../../errors/AppError";
import httpStatus from "http-status-codes";
import Division from "./division.model";
import { IDivision } from "./division.interface";
import QueryBuilder from "../../utils/queryBuilder";
import { cloudinaryDelete } from "../../config/cloudinary";

// Get all divisions
const getAllDivisions = async (query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["name", "description"];

  // Build the query using QueryBuilder class and fetch divisions
  const queryBuilder = new QueryBuilder<IDivision>(Division.find(), query);
  const divisions = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .search(searchFields)
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();
  return {
    data: divisions,
    meta,
  };
};

// Get single division
const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

// Create new division
const createDivision = async (payload: IDivision) => {
  // Check if division already exists
  const isDivisionExists = await Division.findOne({ name: payload.name });
  if (isDivisionExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Division '${payload.name}' already exists`
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
  // Start a session for transaction
  const session = await Division.startSession();
  session.startTransaction();

  try {
    // Check if division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      throw new AppError(httpStatus.NOT_FOUND, "Division not found");
    }

    // Check if the updated name conflicts with another existing division
    if (division.name === payload.name) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Division '${payload.name}' already exists. Please provide a different division name to update`
      );
    }

    const modifiedDetails = await Division.findByIdAndUpdate(
      divisionId,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (division.thumbnail && payload.thumbnail) {
      await cloudinaryDelete(division.thumbnail);
    }

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();
    return modifiedDetails;
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
  getSingleDivision,
  createDivision,
  updateDivision,
  deleteDivision,
};

export default divisionService;
