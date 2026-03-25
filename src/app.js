import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use(errorHandler);

export default app;