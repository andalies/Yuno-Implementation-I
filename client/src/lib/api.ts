// client/src/lib/api.ts
export interface CreateCheckoutSessionReq {
  amount: number;
  currency?: string;
  countryCode?: string;
  orderId: string;
}
export interface CreateCheckoutSessionRes {
  checkoutSession?: string;
  id?: string;
  [k: string]: unknown;
}
export interface CreatePaymentReq {
  oneTimeToken: string;
  checkoutSession: string;
}
export interface CreatePaymentRes {
  status: string;
  id?: string;
  [k: string]: unknown;
}

const BASE =
  (import.meta.env.VITE_API_BASE?.trim() || (import.meta.env.DEV ? "http://127.0.0.1:4000" : ""));

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${res.status} ${text}`);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from ${path}: ${text}`);
  }
}

export function createCheckoutSession(
  body: CreateCheckoutSessionReq
): Promise<CreateCheckoutSessionRes> {
  return request<CreateCheckoutSessionRes>("/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency: "BRL", countryCode: "BR", ...body }),
  });
}

export function createPayment(body: CreatePaymentReq): Promise<CreatePaymentRes> {
  return request<CreatePaymentRes>("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export interface CreateCheckoutSessionReq {
  amount: number;          // cents (your current code)
  currency?: string;
  countryCode?: string;
  orderId: string;
  description?: string;    // NEW
}