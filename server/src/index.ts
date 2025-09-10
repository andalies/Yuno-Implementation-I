import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());

// Request logger so we SEE every hit and path:
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (_req, res) => res.send("API ok"));

// ***** THIS is the route your client and curl must hit *****
app.post("/checkout/sessions", (req, res) => {
  console.log("POST /checkout/sessions BODY:", req.body);
  const { amount, orderId } = req.body || {};
  if (!amount || !orderId) {
    return res.status(400).json({ error: "missing_params" });
  }
  // mock response to unblock the flow
  return res.json({ checkoutSession: "00000000-0000-4000-8000-000000000001" });
});

// used by the SDK callback to create a payment
app.post("/api/create-payment", (req, res) => {
  console.log("POST /api/create-payment BODY:", req.body);
  const { oneTimeToken, checkoutSession } = req.body || {};
  if (!oneTimeToken || !checkoutSession) {
    return res.status(400).json({ error: "missing_params" });
  }
  return res.json({ status: "approved", id: "pay_mock_123" });
});

// JSON 404 (avoid the '*' pattern)
app.use((req, res) => {
  console.warn("404 on backend:", req.method, req.path);
  res.status(404).json({ error: "not_found", path: req.path });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
