import axios from "axios";

// ── Step 1: Get Access Token ──────────────────────────────────
export const getAccessToken = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;

  const auth = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    console.log("🔐 Requesting MPESA token...");

    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
        timeout: 10000,
      }
    );

    console.log("✅ Token received");
    return data.access_token;

  } catch (error) {
    console.error("❌ TOKEN ERROR:", error.response?.data || error.message);
    throw new Error("Failed to get MPESA token");
  }
};

// ── Step 2: Format Phone ─────────────────────────────────────
export const formatPhone = (phone) => {
  phone = phone.toString().trim().replace(/\s+/g, "");

  if (phone.startsWith("+254")) return phone.slice(1);
  if (phone.startsWith("0")) return `254${phone.slice(1)}`;
  if (phone.startsWith("7")) return `254${phone}`;

  return phone;
};

// ── Step 3: Generate Timestamp + Password ────────────────────
const generateTimestamp = () => {
  const date = new Date();

  const pad = (n) => n.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

const generatePassword = (timestamp) => {
  const { MPESA_SHORTCODE, MPESA_PASSKEY } = process.env;

  return Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
};

// ── Step 4: STK Push ─────────────────────────────────────────
export const initiateSTKPush = async ({ phone, amount, orderId }) => {
  try {
    console.log("🚀 Starting STK Push...");

    const token = await getAccessToken();

    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(Number(amount)),
      PartyA: formatPhone(phone),
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formatPhone(phone),
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: orderId,
      TransactionDesc: "Skincare Shop Payment",
    };

    console.log("📦 Payload:", payload);

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 🔥 CRITICAL FIX
      }
    );

    console.log("✅ STK Response:", data);

    return data;

  } catch (error) {
    console.error("❌ FULL MPESA ERROR:");

    if (error.response) {
      console.error("DATA:", error.response.data);
      console.error("STATUS:", error.response.status);
    } else {
      console.error("MESSAGE:", error.message);
    }

    throw new Error(
      error.response?.data?.errorMessage ||
      error.response?.data?.errorCode ||
      error.message
    );
  }
};