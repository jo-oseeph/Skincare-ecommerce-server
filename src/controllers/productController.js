import asyncHandler from "../utils/asyncHandler.js";
import * as productService from "../services/productService.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PRODUCT
export const createProduct = asyncHandler(async (req, res) => {
  let imageUrls = [];

  // Upload images to Cloudinary
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const base64 = file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64}`,
        { folder: "skincare/products" }
      );

      imageUrls.push(result.secure_url);
    }
  }

  const productData = {
    ...req.body,
    images: imageUrls,
    vendorId: req.user.id // secure source
  };

  const product = await productService.createProduct(productData);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// ── GET ALL PRODUCTS ─────────────────────────────────────────
export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    ...result,
  });
});

// ── GET SINGLE PRODUCT ───────────────────────────────────────
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
});

// ── UPDATE PRODUCT (ADMIN) ───────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  let imageUrls = [];

  // If new images are uploaded → replace
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const base64 = file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64}`,
        { folder: "skincare/products" }
      );

      imageUrls.push(result.secure_url);
    }

    req.body.images = imageUrls;
  }

  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// ── DELETE PRODUCT (ADMIN) ───────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  // Remove images from Cloudinary
  for (const url of product.images) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `skincare/products/${filename.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  }

  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
});