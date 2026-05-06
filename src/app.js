import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import crypto from "crypto";  
const app = express();

app.use(express.json());
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/mpesa", mpesaRoutes);  
app.use(errorHandler);

export default app;