import mongoose, { Document, Schema } from "mongoose";
export interface IBrand extends Document {
  name: string;
  imageUrl: string;
  slug?: string;
}

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  logoUrl: { type: String },
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
