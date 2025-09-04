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
      `Tour type '${payload.name}' already exists`
    );
  }

  const tourType = await TourType.create(payload);
  return tourType;
};

// TourType service object
const tourTypeService = {
  createTourType,
  getAllTourTypes,
};

export default tourTypeService;
