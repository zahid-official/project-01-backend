import Tour from "./tour.model";
import { ITour } from "./tour.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";

// Get all tours
const getAllTours = async () => {
  const tours = await Tour.find();
  const totaltours = await Tour.countDocuments();
  return {
    data: tours,
    meta: { total: totaltours },
  };
};

// Create new tour
const createTour = async (payload: ITour) => {
  // Check if tour already exists
  const isTourExists = await Tour.findOne({ title: payload.title });
  if (isTourExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `The '${payload.title}' already exists`
    );
  }

  const tour = await Tour.create(payload);
  return tour;
};

// Update tour details
const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  // Check if tour exists
  const isTourExists = await Tour.findById(tourId);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }

  // Check if the updated title conflicts with another existing tour
  if (isTourExists.title === payload.title) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Tour title '${payload.title}' already exists. Please provide a different tour title to update`
    );
  }

  const modifiedDetails = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });

  return modifiedDetails;
};

// Tour service object
const tourService = {
  getAllTours,
  createTour,
  updateTour,
};

export default tourService;
