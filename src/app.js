import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
console.log("📋 Product route imported:", productRoute);
console.log("📋 Product route stack:", productRoute?.stack);
import { errorHandler } from "./middlewares/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import testRoute from "./routes/testRoute.js";

import crypto from "crypto";  
const app = express();


app.use(express.json());

app.use(express.json());

// DEBUG: Test if app is receiving requests
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// DEBUG: Log all requests to /api/products
app.use("/api/products", (req, res, next) => {
  console.log("📦 Request to /api/products:", req.method);
  next();
});

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/mpesa", mpesaRoutes);  
app.use("/api/testroute", testRoute);
app.use(errorHandler);

export default app;