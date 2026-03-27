import asyncHandler from "../utils/asyncHandler.js";
import * as productService from "../services/productService.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
  let imageUrls = [];

  // 🔍 Debug (remove later)
  console.log("FILES:", req.files);

  // Upload images to Cloudinary
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      // convert buffer → base64
      const base64 = file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64}`,
        {
          folder: "skincare/products",
        }
      );

      imageUrls.push(result.secure_url);
    }
  }

  // attach images to body
  const productData = {
    ...req.body,
    images: imageUrls,
  };

  const product = await productService.createProduct(productData);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

//  GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    ...result,
  });
});

// ── GET /api/products/:id ─────────────────────────────────────
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
});

// ── PATCH /api/products/:id ───────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// ── DELETE /api/products/:id ──────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
});
