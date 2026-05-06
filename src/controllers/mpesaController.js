import asyncHandler from "../utils/asyncHandler.js";
import { initiateSTKPush } from "../utils/mpesa.js";
import AppError from "../utils/AppError.js";

export const stkPush = asyncHandler(async (req, res) => {
  const { phone, amount, orderId } = req.body;

  if (!phone || !amount || !orderId) {
    throw new AppError("phone, amount, and orderId are required", 400);
  }

  console.log(" STK request received:", req.body);

  const response = await initiateSTKPush({
    phone,
    amount,
    orderId,
  });

  return res.status(200).json({
    success: true,
    message: "STK Push sent",
    checkoutRequestId: response.CheckoutRequestID,
    merchantRequestId: response.MerchantRequestID,
  });
});


// ── MPESA CALLBACK ─────────────────────────────────────────
export const mpesaCallback = asyncHandler(async (req, res) => {
  console.log(" MPESA CALLBACK:", JSON.stringify(req.body, null, 2));

  const { Body } = req.body;

  if (!Body || !Body.stkCallback) {
    return res.status(200).json({ message: "Invalid callback structure" });
  }

  const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } =
    Body.stkCallback;

  if (ResultCode === 0) {
    const items = CallbackMetadata?.Item || [];

    const get = (name) =>
      items.find((i) => i.Name === name)?.Value;

    const paymentData = {
      checkoutRequestId: CheckoutRequestID,
      mpesaReceiptNumber: get("MpesaReceiptNumber"),
      amount: get("Amount"),
      phone: get("PhoneNumber"),
    };

    console.log("✅ Payment success:", paymentData);

    // 🔥 NEXT STEP: update order here

  } else {
    console.log(`❌ Payment failed [${ResultCode}]: ${ResultDesc}`);
  }

  // ALWAYS respond 200
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});