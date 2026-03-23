import express from "express";
import productRoutes from "./routes/productRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json({ limit: "10kb" }));

//  endpoint for load balancers and uptime monitors.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

//  API Routes
app.use("/api/products", productRoutes);

// ── 404 Fallback ───────────────────────────────────────────────
// Catches any request that didn't match a registered route.
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
