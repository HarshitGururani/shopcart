import cloudinary from "../utils/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "shopcart/brands",
    format: "webp", // Keep WebP format, as it supports transparency
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [
      {
        quality: "auto",
        background: "transparent", // Explicitly set transparent background
      },
    ],
  }),
});

const brandUpload = multer({ storage: brandStorage });

export default brandUpload;
