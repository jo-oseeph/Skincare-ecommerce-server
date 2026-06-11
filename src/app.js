import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import testRoute from "./routes/testRoute.js";

const app = express();

app.use(express.json());

// TEST
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// PRODUCTS DEBUG
app.use("/api/products", (req, res, next) => {
  console.log("📦 Request to /api/products:", req.method);
  next();
});

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/testroute", testRoute);

app.use(errorHandler);

export default app;