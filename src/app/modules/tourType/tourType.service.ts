import TourType from "./tourType.model";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { ITourType } from "./tourType.interface";

// Get all tourTypes
const getAllTourTypes = async () => {
  const tourTypes = await TourType.find();
  const totalTourTypes = await TourType.countDocuments();
  return {
    data: tourTypes,
    meta: { total: totalTourTypes },
  };
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
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};

export default tourTypeService;
