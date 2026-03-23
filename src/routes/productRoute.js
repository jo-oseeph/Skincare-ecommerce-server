import { Router } from "express";
import validate from "../middlewares/validateMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validators/productValidator.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// POST   /api/products        — create a new product
router.post("/", validate(createProductSchema, "body"), createProduct);

// GET    /api/products        — list products with filters/search/pagination
router.get("/", validate(productQuerySchema, "query"), getProducts);

// GET    /api/products/:id    — single product by ID
router.get("/:id", getProduct);

// PATCH  /api/products/:id    — partial update
router.patch("/:id", validate(updateProductSchema, "body"), updateProduct);

// DELETE /api/products/:id    — soft delete (sets isActive = false)
router.delete("/:id", deleteProduct);

export default router;
