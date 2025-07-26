import cloudinary from "../utils/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "shopcart/banners",
    format: "webp",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ width: 1200, height: 400, crop: "limit" }],
  }),
});

const upload = multer({ storage });

export default upload;
