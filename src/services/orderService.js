import Order from "../models/order.js";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

// ── CREATE ORDER ─────────────────────────────────────────────
export const createOrder = async (userId, data) => {
  const { items, phoneNumber } = data;

  if (!items || items.length === 0) {
    throw new AppError("Order items are required", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  // NEVER trust frontend prices
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      throw new AppError("Invalid product", 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    // calculate using DB price
    const itemTotal = product.price * item.quantity;

    totalAmount += itemTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    // reduce stock immediately
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    userId,
    items: orderItems,
    totalAmount,
    phoneNumber,
  });

  return order;
};

// ── GET MY ORDERS ────────────────────────────────────────────
export const getUserOrders = async (userId) => {
  return await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
};

// ── GET ALL ORDERS (ADMIN) ───────────────────────────────────
export const getAllOrders = async () => {
  return await Order.find()
    .sort({ createdAt: -1 })
    .lean();
};

// ── GET SINGLE ORDER ─────────────────────────────────────────
export const getOrderById = async (id) => {
  const order = await Order.findById(id).lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

// ── UPDATE ORDER STATUS (ADMIN) ──────────────────────────────
export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};