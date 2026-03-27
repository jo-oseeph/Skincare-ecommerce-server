import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

const UPDATABLE_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "stock",
  "images",
];

// ── CREATE ───────────────────────────────────────────────────
export const createProduct = async (data) => {
  return await Product.create(data);
};

// ── GET ALL (pagination + filters) ───────────────────────────
export const getProducts = async (query) => {
  let {
    page,
    limit,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy,
  } = query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true };

  if (category) filter.category = category;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  const sort = sortMap[sortBy] ?? { createdAt: -1 };

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select("-__v")
      .lean(),
  ]);

  return {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
  };
};

// ── GET SINGLE ───────────────────────────────────────────────
export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isActive: true })
    .select("-__v")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ── UPDATE ───────────────────────────────────────────────────
export const updateProduct = async (id, data) => {
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
      new: true,
      runValidators: true,
    }
  )
    .select("-__v")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// ── DELETE (SOFT DELETE) ─────────────────────────────────────
export const deleteProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: { isActive: false } },
    { new: true }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};