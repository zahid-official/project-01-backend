import Tour from "./tour.model";
import { ITour } from "./tour.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../utils/queryBuilder";
import { cloudinaryDelete } from "../../config/cloudinary";

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
  return tour;
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
  // Start a session for transaction
  const session = await Tour.startSession();
  session.startTransaction();

  try {
    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
    }

    // Check if the updated title conflicts with another existing tour
    if (tour.title === payload.title) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Title '${payload.title}' already exists. Please provide a different title to update`
      );
    }

    // Merge new images with existing images
    if (
      payload.images &&
      payload.images.length > 0 &&
      tour.images &&
      tour.images.length > 0
    ) {
      payload.images = [...payload.images, ...tour.images];
    }

    // Handle image addition and deletions together
    if (
      payload.deleteImages &&
      payload.deleteImages.length > 0 &&
      tour.images &&
      tour.images.length > 0
    ) {
      // Filter out images to be deleted from existing images in database (if only deletion is requested)
      const restDatabaseImages = tour.images.filter(
        (image) => !payload.deleteImages?.includes(image)
      );

      // Filter out deletable and duplicate images from payload (if both addition and deletion is requested)
      const filteredPayloadImages = (payload.images || [])
        .filter((image) => !payload.deleteImages?.includes(image))
        .filter((image) => !restDatabaseImages?.includes(image));

      payload.images = [...restDatabaseImages, ...filteredPayloadImages];
    }

    // Update tour details
    const modifiedDetails = await Tour.findByIdAndUpdate(tourId, payload, {
      new: true,
      runValidators: true,
      session,
    });

    // Remove deleted images from cloudinary
    if (
      payload.deleteImages &&
      payload.deleteImages.length > 0 &&
      tour.images &&
      tour.images.length > 0
    ) {
      await Promise.all(
        payload.deleteImages.map((image) => cloudinaryDelete(image))
      );
    }

    // Commit transaction and end session
    await session.commitTransaction();
    await session.endSession();
    return modifiedDetails;
  } catch (error) {
    // Abort transaction and rollback changes
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
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
