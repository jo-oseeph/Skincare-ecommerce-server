import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { createProductSchema } from "../validators/productValidator.js";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// PUBLIC ROUTES 
router.get("/", getProducts);
router.get("/:id", getProduct);

//  ADMIN ROUTES
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;