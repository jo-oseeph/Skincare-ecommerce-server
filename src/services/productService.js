
import Product from "../models/Product.js"; 
import AppError from "../utils/AppError.js";

// ── Allowed fields for PATCH (explicit whitelist) ──────────────
// Only these fields can be updated through the public API.
// vendorId and isActive are intentionally excluded to prevent
// ownership hijacking or accidental reactivation.
const UPDATABLE_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "stock",
  "images",
];

// ── Create ─────────────────────────────────────────────────────
export const createProduct = async (data) => {
  // Explicitly pick allowed fields — never spread req.body
  // directly even after Zod validation, as an extra defence
  // against future schema changes accidentally exposing fields.
  const product = await Product.create({
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    stock: data.stock,
    images: data.images,
    vendorId: data.vendorId,
    // isActive defaults to true at schema level
  });

  return product;
};

// ── Get All (with pagination, filtering, search) ───────────────
export const getProducts = async (query) => {
  const {
    page,
    limit,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy,
  } = query;

  // ── Build filter object ──────────────────────────────────────
  const filter = {
    isActive: true, // Never return soft-deleted products
  };

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  // Use MongoDB $text search when a search term is provided.
  // This leverages the text index on `name` for fast,
  // case-insensitive partial-word matching.
  // For an even richer search experience, consider Atlas Search.
  if (search) {
    filter.$text = { $search: search };
  }

  // ── Build sort object ────────────────────────────────────────
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sort = sortMap[sortBy] ?? { createdAt: -1 };

  // ── Pagination ────────────────────────────────────────────────
  const skip = (page - 1) * limit;

  // Run count and data queries in parallel — saves one round-trip.
  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      // Exclude internal fields from the response payload.
      .select("-__v")
      .lean(), // ← Returns plain objects, not Mongoose documents
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

// ── Get Single ────────────────────────────────────────────────
export const getProductById = async (id) => {
  // Mongoose will throw a CastError if `id` is not a valid
  // ObjectId — the error middleware converts that to a 404.
  const product = await Product.findOne({ _id: id, isActive: true })
    .select("-__v")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ── Update ────────────────────────────────────────────────────
export const updateProduct = async (id, data) => {
  // Whitelist: only copy fields that are explicitly allowed.
  // This is the primary guard against mass-assignment attacks.
  const updateData = {};
  for (const field of UPDATABLE_FIELDS) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: updateData },
    {
      new: true,          // Return the updated document
      runValidators: true, // Run Mongoose schema validators on update
    }
  )
    .select("-__v")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ── Soft Delete ───────────────────────────────────────────────
// We never hard-delete products because:
//  1. Orders referencing this product must remain valid.
//  2. Analytics/reporting need historical data.
//  3. Accidental deletion can be recovered by re-activating.
export const deleteProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: { isActive: false } },
    { new: true }
  ).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};