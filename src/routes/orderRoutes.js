import express from "express";
import {
  checkout,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// USER
router.post("/checkout", protect, checkout);
router.get("/my", protect, getMyOrders);

// ADMIN
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id", protect, adminOnly, updateOrderStatus);

// SHARED
router.get("/:id", protect, getOrder);

export default router;