/* eslint-disable @typescript-eslint/no-dynamic-delete */

import Tour from "./tour.model";
import { ITour } from "./tour.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { excludeFields } from "../../utils/contants";

// Get all tours
const getAllTours = async (query: Record<string, string>) => {
  // Search functionality
  const searchTerm = query?.searchTerm || "";
  const searchFields = ["title", "location", "description"];
  const searchQuery = {
    $or: searchFields?.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  // Sort functionality
  const sort = query?.sort || "-createdAt";

  // Field filtering functionality
  const fields = query?.fields?.split(",").join(" ") || "";

  // Filter functionality
  const filter = query;
  excludeFields.forEach((field) => delete filter[field]);

  // Retrieve tours data from database
  const tours = await Tour.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields);
  const totalTours = await Tour.countDocuments();

  return {
    data: tours,
    meta: { total: totalTours, matched: tours.length },
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
  createTour,
  updateTour,
  deleteTour,
};

export default tourService;
