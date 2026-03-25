import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import validate from "../middlewares/validateMiddleware.js";
import { createProductSchema } from "../validators/productValidator.js";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  protect,                // checks token
  adminOnly,              // checks role
  upload.array("images", 5), // handles file upload
  validate(createProductSchema), // validates input
  createProduct           // creates product
);

export default router;