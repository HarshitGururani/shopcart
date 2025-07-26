import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  brand: Types.ObjectId; // reference to Brand
  price: number;
  originalPrice: number;
  stock: number;
  images: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isOnSale: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true }, // foreign key
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
