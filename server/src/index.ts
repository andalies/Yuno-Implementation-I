// server/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "node:crypto";

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());

// ---- ONE set of envs (no duplicates) ----
const BASE = (process.env.YUNO_BASE_URL ?? "https://api-sandbox.y.uno").replace(/\/+$/, "");
// accept either naming you used
const PUBLIC = (process.env.YUNO_PUBLIC_KEY ?? process.env.YUNO_PUBLIC_API_KEY ?? "").trim();
const SECRET = (process.env.YUNO_SECRET_KEY ?? process.env.YUNO_PRIVATE_SECRET_KEY ?? "").trim();
const ACCOUNT = (process.env.ACCOUNT_CODE ?? process.env.YUNO_ACCOUNT_ID ?? "").trim();

app.get("/", (_req, res) => res.send("API ok"));

// Create checkout session (Yuno v1)
app.post("/checkout/sessions", async (req, res) => {
  try {
    const {
      amount,                  // you can send 99.99 OR cents; see conversion below
      currency = "BRL",
      country = "BR",
      orderId,
      description,
      metadata,
    } = req.body ?? {};

    if (amount == null || !orderId) {
      return res.status(400).json({ error: "missing_params" });
    }
    if (!PUBLIC || !SECRET || !ACCOUNT) {
      return res
        .status(500)
        .json({ error: "server_misconfigured", details: "Missing PUBLIC/SECRET/ACCOUNT" });
    }

    const headers = {
      "Content-Type": "application/json",
      "public-api-key": PUBLIC,
      "private-secret-key": SECRET,
      "X-Idempotency-Key": crypto.randomUUID(),
    };

    // If your client sends cents (e.g., 9999), convert to decimal BRL; adjust to your case.
    const numericAmount = Number(amount);
    const value = numericAmount > 1000 ? numericAmount / 100 : numericAmount;

    const payload = {
      account_id: ACCOUNT,                      // REQUIRED by Yuno
      merchant_order_id: String(orderId),
      country,
      amount: { value, currency },
      payment_description: description,
      metadata,                                 // optional
    };

    const r = await axios.post(`${BASE}/v1/checkout/sessions`, payload, {
      headers,
      validateStatus: () => true,
    });

    if (r.status < 200 || r.status >= 300) {
      return res.status(r.status).json({
        error: "yuno_create_session_failed",
        details: r.data,
      });
    }

    const sess =
      r.data?.checkout_session ?? r.data?.checkoutSession ?? r.data?.id;
    if (!sess) return res.status(500).json({ error: "invalid_yuno_response", raw: r.data });

    return res.json({ checkoutSession: sess });
  } catch (err: any) {
    console.error("create session error:", err?.response?.data || err?.message);
    return res.status(500).json({ error: "server_error", details: err?.message });
  }
});

// (Keep this simple for now; you can swap to real Yuno payment call later)
app.post("/api/create-payment", async (req, res) => {
  const { oneTimeToken, checkoutSession } = req.body ?? {};
  if (!oneTimeToken || !checkoutSession)
    return res.status(400).json({ error: "missing_params" });

  // mock success to unblock your front-end flow
  return res.json({ status: "approved", id: "pay_mock_123" });
});

// 404
app.use((_req, res) => res.status(404).json({ error: "not_found" }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
