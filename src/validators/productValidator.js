import { z } from "zod";
import { PRODUCT_CATEGORIES } from "../models/Product.js";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().nonnegative(),
  category: z.enum(PRODUCT_CATEGORIES),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).optional(),
  vendorId: z.string().min(1),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    price: z.number().nonnegative().optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    stock: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
  })
  .partial();

export const productQuerySchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .default(1),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .default(10),
  category: z.string().optional(),
  minPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val))),
  maxPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val))),
  search: z.string().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional(),
});
