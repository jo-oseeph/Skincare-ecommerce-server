import mongoose from "mongoose";
 
export const PRODUCT_CATEGORIES = [
  "cleanser",
  "serum",
  "moisturizer",
  "sunscreen",
  "toner",
  "exfoliant",
  "mask",
  "eye_cream",
  "spot_treatment",
  "oil",
];
 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
 
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
 
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
 
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`,
      },
    },
 
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
 
    images: {
      type: [String],
      default: [],
    },
 
    // Soft-delete flag
    isActive: {
      type: Boolean,
      default: true,
    },
 
    vendorId: {
      type: String,
      required: [true, "vendorId is required"],
      trim: true,
    },
  },
  {
   
    timestamps: true,
 
    versionKey: false,
  }
);
 

productSchema.index({ name: "text" });
productSchema.index({ category: 1, price: 1, isActive: 1 });
productSchema.index({ vendorId: 1, isActive: 1 });
 
const Product = mongoose.model("Product", productSchema);
 
export default Product;