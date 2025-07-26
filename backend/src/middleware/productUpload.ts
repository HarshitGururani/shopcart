import cloudinary from "../utils/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "shopcart/products",
    format: "webp",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ width: 1200, height: 400, crop: "limit" }],
    quality: "auto",
  }),
});

// File filter: allow only image files
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Multer upload middleware
const productUpload = multer({
  storage,
  fileFilter,
  limits,
});

export default productUpload;
