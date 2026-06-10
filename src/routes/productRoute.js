import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getProducts);

// CREATE PRODUCT
router.post("/", createProduct);

// GET SINGLE PRODUCT
router.get("/:id", getProduct);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;