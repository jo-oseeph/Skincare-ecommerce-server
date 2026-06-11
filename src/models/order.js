import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["whatsapp_manual", "mpesa", "cash"],
      default: "whatsapp_manual",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    deliveryDetails: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      county: { type: String, required: true },
      town: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);