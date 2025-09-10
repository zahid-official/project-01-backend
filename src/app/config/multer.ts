import multer from "multer";
import cloudinaryUpload from "./cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure multer-storage to use cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // Generate a unique file name
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      // Get the file extension
      const extention = file.originalname.split(".").pop();

      // Return the unique file name
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extention;

      return uniqueFileName;
    },
  },
});

// Initialize multer with the cloudinary storage
const multerUpload = multer({ storage: storage });
export default multerUpload;
