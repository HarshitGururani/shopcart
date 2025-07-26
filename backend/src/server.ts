import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import bannerRouter from "./routes/banner.route";
import brandRouter from "./routes/brand.route";
import productRouter from "./routes/product.route";

const app: Application = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/auth", authRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "Test" });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
