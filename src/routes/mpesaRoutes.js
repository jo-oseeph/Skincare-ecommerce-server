// src/routes/mpesa.routes.js

import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { stkPush, mpesaCallback } from "../controllers/mpesaController.js";

const router = Router();

// Protected — user must be logged in to pay
router.post("/stkpush", protect, stkPush);

// Public — Safaricom hits this directly, no auth token possible
router.post("/callback", mpesaCallback);

export default router;