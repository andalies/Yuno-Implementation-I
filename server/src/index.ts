import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'node:crypto';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
  })
);
app.use(express.json());

// --- Yuno env/config ---
const BASE = (process.env.YUNO_BASE_URL ?? 'https://api-sandbox.y.uno').replace(/\/+$/, '');
const PUBLIC = (process.env.YUNO_PUBLIC_KEY ?? process.env.YUNO_PUBLIC_API_KEY ?? '').trim();
const SECRET = (process.env.YUNO_SECRET_KEY ?? process.env.YUNO_PRIVATE_SECRET_KEY ?? '').trim();
const ACCOUNT = (process.env.YUNO_ACCOUNT_ID ?? process.env.ACCOUNT_CODE ?? '').trim();

// Health check
app.get('/', (_req, res) => res.send('API ok'));

// Create checkout session (client sends cents)
app.post('/checkout/sessions', async (req, res) => {
  try {
    const {
      amount,                 // cents
      currency = 'BRL',
      countryCode = 'BR',
      country,
      orderId,
      description,
      paymentDescription,
      metadata,
    } = req.body ?? {};

    if (amount == null || !orderId) {
      return res.status(400).json({ error: 'missing_params' });
    }
    if (!PUBLIC || !SECRET || !ACCOUNT) {
      return res.status(500).json({ error: 'server_misconfigured', details: 'Missing keys' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'public-api-key': PUBLIC,
      'private-secret-key': SECRET,
      'X-Idempotency-Key': crypto.randomUUID(),
    };

    const payment_description =
      paymentDescription || description || `Order ${orderId} - ${(Number(amount) / 100).toFixed(2)} ${currency}`;

    const payload = {
      account_id: ACCOUNT,
      merchant_order_id: String(orderId),
      country: country || countryCode || 'BR',
      amount: { value: Number(amount) / 100, currency },
      payment_description,
      metadata,
    };

    const r = await axios.post(`${BASE}/v1/checkout/sessions`, payload, {
      headers,
      validateStatus: () => true,
    });

    if (r.status < 200 || r.status >= 300) {
      return res.status(r.status).json({ error: 'yuno_create_session_failed', details: r.data });
    }

    const sess = r.data?.checkout_session || r.data?.checkoutSession || r.data?.id;
    if (!sess) return res.status(500).json({ error: 'invalid_yuno_response', raw: r.data });

    return res.json({ checkoutSession: sess, raw: r.data });
  } catch (err: any) {
    console.error('create session error:', err?.response?.data || err?.message);
    return res.status(500).json({ error: 'server_error', details: err?.message });
  }
});

// Create Payment (server -> Yuno)
app.post('/api/create-payment', async (req, res) => {
  try {
    const {
      oneTimeToken,
      checkoutSession,
      merchantOrderId,
      description,
      country = 'BR',
      amount,           // cents
      currency = 'BRL',
      returnUrl,
    } = req.body ?? {};

    if (!oneTimeToken || !checkoutSession) {
      return res.status(400).json({ error: 'missing_params' });
    }
    if (!PUBLIC || !SECRET || !ACCOUNT) {
      return res.status(500).json({ error: 'server_misconfigured' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'public-api-key': PUBLIC,
      'private-secret-key': SECRET,
      'X-Idempotency-Key': crypto.randomUUID(),
    };

    // ✅ Yuno expects these fields
    const payload = {
      account_id: ACCOUNT,
      merchant_order_id: String(merchantOrderId),
      description,
      country,
      amount: { value: Number(amount) / 100, currency },  // cents -> decimal
      checkout: { session: checkoutSession },          // <-- required shape
      payment_method: {
        type: 'one_time_token',
        token: oneTimeToken,
      },
      capture: true,
      confirmation: returnUrl ? { return_url: returnUrl } : undefined,
    };

    const r = await axios.post(`${BASE}/v1/payments`, payload, {
      headers,
      validateStatus: () => true,
    });

    console.log('Yuno /v1/payments', r.status, JSON.stringify(r.data, null, 2));

    if (r.status < 200 || r.status >= 300) {
      return res.status(r.status).json({ error: 'yuno_create_payment_failed', details: r.data });
    }

    return res.json({ payment: r.data });
  } catch (err: any) {
    console.error('create payment exception:', err?.response?.data || err?.message);
    return res.status(500).json({ error: 'server_error', details: err?.message });
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));

// START SERVER ✅
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
