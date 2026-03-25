import { z } from "zod";
import { PRODUCT_CATEGORIES } from "../utils/constants.js";

export const createProductSchema = z.object({
  name: z.string().min(2),

  price: z.coerce.number().positive(),

  // normalize category before validation
  category: z
    .string()
    .transform((val) => val.trim().toLowerCase())
    .refine((val) => PRODUCT_CATEGORIES.includes(val), {
      message: `Invalid category. Allowed: ${PRODUCT_CATEGORIES.join(", ")}`
    }),

  stock: z.coerce.number().min(0).optional(),

  description: z.string().optional()
});