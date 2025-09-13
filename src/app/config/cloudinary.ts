/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import envVars from "./env";
import AppError from "../errors/AppError";
import httpStatus from "http-status-codes";

// Configure cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

// Delete image from cloudinary
export const cloudinaryDelete = async (imageUrl: string) => {
  try {
    // Extract public_id from the image url
    const extractPublicId = /\/(?:v\d+\/)?([^/]+)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = imageUrl.match(extractPublicId);

    // If public_id is found, delete the image from cloudinary
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to delete image from Cloudinary"
    );
  }
};

// Export the configured cloudinary instance
const cloudinaryUpload = cloudinary;
export default cloudinaryUpload;
