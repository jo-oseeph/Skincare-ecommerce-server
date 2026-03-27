import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

//  CHECKOUT CREATE ORDER FROM CART
export const checkout = async (userId, { phoneNumber }) => {
  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      throw new AppError("Invalid product in cart", 400);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    // reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  // create order
  const order = await Order.create({
    userId,
    items: orderItems,
    totalAmount,
    phoneNumber,
  });

  // clear cart after successful order
  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 }).lean();
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id).lean();

  if (!order) throw new AppError("Order not found", 404);

  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  if (!order) throw new AppError("Order not found", 404);

  return order;
};