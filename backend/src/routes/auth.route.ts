import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserDetails,
  updateUserProfile,
} from "../controllers/auth.controller";
import { authValidate } from "../middleware/auth";

const router = express.Router();

router.post("/register", (req, res, next) => {
  registerUser(req, res).catch(next);
});

router.post("/login", (req, res, next) => {
  loginUser(req, res).catch(next);
});

router.post("/logout", logoutUser);

router.get("/user", authValidate, (req, res, next) => {
  getUserDetails(req, res).catch(next);
});

router.put("/user", authValidate, (req, res, next) => {
  updateUserProfile(req, res).catch(next);
});

export default router;
