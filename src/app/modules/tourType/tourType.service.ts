import TourType from "./tourType.model";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { ITourType } from "./tourType.interface";
import QueryBuilder from "../../utils/queryBuilder";

// Get all tourTypes
const getAllTourTypes = async (query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["name"];

  // Build the query using QueryBuilder class and fetch tourTypes
  const queryBuilder = new QueryBuilder<ITourType>(TourType.find(), query);
  const tourTypes = await queryBuilder
    .sort()
    .filter()
    .paginate()
    .fieldSelect()
    .search(searchFields)
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();

  return {
    data: tourTypes,
    meta,
  };
};

// Get single tour
const getSingleTourType = async (id: string) => {
  const tour = await TourType.findById(id);
  return tour;
};

// Create new tourType
const createTourType = async (payload: ITourType) => {
  // Check if tourType already exists
  const isTourTypeExists = await TourType.findOne({ name: payload.name });
  if (isTourTypeExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `TourType '${payload.name}' already exists`
    );
  }

  const tourType = await TourType.create(payload);
  return tourType;
};

// Update tourType details
const updateTourType = async (
  tourTypeId: string,
  payload: Partial<ITourType>
) => {
  // Check if tourType exists
  const isTourTypeExists = await TourType.findById(tourTypeId);
  if (!isTourTypeExists) {
    throw new AppError(httpStatus.NOT_FOUND, "TourType not found");
  }

  // Check if the updated name conflicts with another existing tourType
  if (isTourTypeExists.name === payload.name) {
    throw new AppError(
      httpStatus.CONFLICT,
      `TourType '${payload.name}' already exists. Please provide a different tourType name to update`
    );
  }

  const modifiedDetails = await TourType.findByIdAndUpdate(
    tourTypeId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return modifiedDetails;
};

// Delete tourType
const deleteTourType = async (tourTypeId: string) => {
  // Check if tourType exists
  const isTourTypeExists = await TourType.findById(tourTypeId);
  if (!isTourTypeExists) {
    throw new AppError(httpStatus.NOT_FOUND, "TourType not found");
  }

  const deletedTourType = await TourType.findByIdAndDelete(tourTypeId);
  return deletedTourType;
};

// TourType service object
const tourTypeService = {
  getAllTourTypes,
  getSingleTourType,
  createTourType,
  updateTourType,
  deleteTourType,
};

export default tourTypeService;
