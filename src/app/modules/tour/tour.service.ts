import Tour from "./tour.model";
import { ITour } from "./tour.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../utils/queryBuilder";

// Get all tours
const getAllTours = async (query: Record<string, string>) => {
  // Define searchable fields
  const searchFields = ["title", "location", "description"];

  // Build the query using QueryBuilder class and fetch tours
  const queryBuilder = new QueryBuilder<ITour>(Tour.find(), query);
  const tours = await queryBuilder
    .filter()
    .fieldSelect()
    .sort()
    .search(searchFields)
    .paginate()
    .build();

  // Get meta data for pagination
  const meta = await queryBuilder.meta();
  return {
    data: tours,
    meta,
  };
};

// Get single tour
const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug });
  return {
    data: tour,
  };
};

// Create new tour
const createTour = async (payload: ITour) => {
  // Check if tour already exists
  const isTourExists = await Tour.findOne({ title: payload.title });
  if (isTourExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Title '${payload.title}' already exists`
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
      `Title '${payload.title}' already exists. Please provide a different title to update`
    );
  }

  const modifiedDetails = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });

  return modifiedDetails;
};

// Delete tour
const deleteTour = async (tourId: string) => {
  // Check if tour exists
  const isTourExists = await Tour.findById(tourId);
  if (!isTourExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }

  const deletedTour = await Tour.findByIdAndDelete(tourId);
  return deletedTour;
};

// Tour service object
const tourService = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};

export default tourService;
