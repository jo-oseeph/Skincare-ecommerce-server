 
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ role: "admin" });

  if (existing) {
    console.log("⚠️  Admin already exists. Skipping.");
    process.exit(0);
  }

  await User.create({
    name: "Sejjo",
    email: process.env.ADMIN_EMAIL || "realsejjo2001@gmail.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  });

  console.log("✅  Admin seeded successfully.");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});