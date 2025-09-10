import { v2 as cloudinary } from "cloudinary";
import envVars from "./env";

// Configure cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

// Export the configured cloudinary instance
const cloudinaryUpload = cloudinary;
export default cloudinaryUpload;
