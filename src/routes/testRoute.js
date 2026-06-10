import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Test route working" });
});

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Nested test route working" });
});

console.log("✅ Test route configured");
export default router;