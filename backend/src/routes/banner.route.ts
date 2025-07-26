import express from "express";
import { createBanner, getBanner } from "../controllers/banner.controller";
import upload from "../middleware/upload";
import { authValidate } from "../middleware/auth";

const router = express.Router();

router.post(
  "/createBanner",
  authValidate,
  upload.single("image"),
  createBanner
);
router.get("/getBanner", getBanner);

export default router;
