import Cart from "../models/cart.js";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

// ── GET CART ────────────────────────────────────────────────
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return cart;
};

// ── ADD TO CART ─────────────────────────────────────────────
export const addToCart = async (userId, { productId, quantity }) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new AppError("Product not available", 400);
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  return cart;
};

// ── UPDATE CART ITEM ────────────────────────────────────────
export const updateCartItem = async (userId, { productId, quantity }) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) throw new AppError("Cart not found", 404);

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) throw new AppError("Item not in cart", 404);

  item.quantity = quantity;

  await cart.save();

  return cart;
};

// ── REMOVE ITEM ─────────────────────────────────────────────
export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();

  return cart;
};

// ── CLEAR CART ──────────────────────────────────────────────
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return cart;
};