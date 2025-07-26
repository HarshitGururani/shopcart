import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  heading: string;
  subHeading: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

const bannerSchema: Schema<IBanner> = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subHeading: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    ctaText: {
      type: String,
      trim: true,
      required: true,
    },
    ctaLink: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
