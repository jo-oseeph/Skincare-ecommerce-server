import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/orderService.js";

//  CHECKOUT 
export const checkout = asyncHandler(async (req, res) => {
  const order = await orderService.checkout(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

// ── GET MY ORDERS ───────────────────────────────────────────
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

//  GET ALL ORDERS (ADMIN) 
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    data: orders,
  });
});

//  GET SINGLE ORDER 
export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

//  UPDATE STATUS (ADMIN) 
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Order updated",
    data: order,
  });
});