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
      `The ${payload.title} already exists`
    );
  }

  const tour = await Tour.create(payload);
  return tour;
};

// Tour service object
const tourService = {
  getAllTours,
  createTour,
};

export default tourService;
