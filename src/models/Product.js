import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../utils/constants.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES, // restrict values at DB level
      index: true
    },
    stock: {
      type: Number,
      default: 0
    },
    description: String,
    images: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    vendorId: {
      type: String,
      default: "default_vendor",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);