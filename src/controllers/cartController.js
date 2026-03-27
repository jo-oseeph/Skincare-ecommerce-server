import asyncHandler from "../utils/asyncHandler.js";
import * as cartService from "../services/cartService.js";

// ── GET CART ────────────────────────────────────────────────
export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// ── ADD TO CART ─────────────────────────────────────────────
export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

// ── UPDATE ITEM ─────────────────────────────────────────────
export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
});

// ── REMOVE ITEM ─────────────────────────────────────────────
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(
    req.user.id,
    req.params.productId
  );

  res.status(200).json({
    success: true,
    message: "Item removed",
    data: cart,
  });
});

// ── CLEAR CART ──────────────────────────────────────────────
export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);

  res.status(200).json({
    success: true,
    message: "Cart cleared",
  });
});