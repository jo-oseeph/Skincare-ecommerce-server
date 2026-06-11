import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/orderService.js";

// CHECKOUT (WHATSAPP FLOW READY)
export const checkout = asyncHandler(async (req, res) => {
  const order = await orderService.checkout(req.user.id, {
    ...req.body,
    paymentMethod: "whatsapp_manual",
    status: "pending",
    isPaid: false,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

// GET MY ORDERS
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// ADMIN - GET ALL
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// GET SINGLE ORDER
export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

// ADMIN UPDATE STATUS
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, isPaid } = req.body;

  const order = await orderService.updateOrderStatus(
    req.params.id,
    status,
    isPaid
  );

  res.status(200).json({
    success: true,
    message: "Order updated",
    data: order,
  });
});