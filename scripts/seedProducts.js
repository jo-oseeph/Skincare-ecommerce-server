// scripts/seedProducts.js

import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import Product from "../src/models/product.js";
import { PRODUCT_CATEGORIES } from "../src/utils/constants.js";

if (!global.crypto) {
  global.crypto = crypto.webcrypto;
}


const products = [
  {
    name: "CeraVe Hydrating Facial Cleanser",
    price: 1200,
    category: "cleanser",
    stock: 20,
    description: "Gentle hydrating cleanser that removes dirt without stripping skin barrier.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205845/Cleanser_zikghm.png"],
  },
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    price: 1500,
    category: "serum",
    stock: 15,
    description: "Reduces blemishes and controls sebum production.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205839/Serum_gy8srr.png"],
  },
  {
    name: "CeraVe Moisturizing Cream",
    price: 1800,
    category: "moisturizer",
    stock: 18,
    description: "Restores skin barrier with ceramides and hyaluronic acid.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205849/Moisturizer_osmclp.png"],
  },
  {
    name: "La Roche-Posay Anthelios SPF 50+",
    price: 2200,
    category: "sunscreen",
    stock: 12,
    description: "High protection sunscreen for sensitive skin.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205844/Sun_Screen_tcgpf5.png"],
  },
  {
    name: "Thayers Witch Hazel Toner",
    price: 1100,
    category: "toner",
    stock: 25,
    description: "Alcohol-free toner that balances skin pH.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205849/Toner_ifzmgk.png"],
  },
  {
    name: "Paula’s Choice 2% BHA Liquid Exfoliant",
    price: 2500,
    category: "exfoliant",
    stock: 10,
    description: "Unclogs pores and smooths skin texture.",
    images: ["https://res.cloudinary.com/dsyljzfv7/image/upload/v1781205844/Exfoliant_in49si.png"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    for (const p of products) {
      if (!PRODUCT_CATEGORIES.includes(p.category)) {
        throw new Error(`Invalid category: ${p.category}`);
      }
    }

    await Product.deleteMany({});
    console.log("Old products cleared");

    await Product.insertMany(products);
    console.log("Products seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();