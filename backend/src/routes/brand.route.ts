import express from "express";
import { addBrand, getAllBrands } from "../controllers/brand.controller";
import brandUpload from "../middleware/brandUpload";
import { authValidate } from "../middleware/auth";

const router = express.Router();

router.post(
  "/add-brand",
  authValidate,
  brandUpload.single("logo"),
  (req, res, next) => {
    addBrand(req, res).catch(next);
  }
);

router.get("/all-brands", getAllBrands);

export default router;
