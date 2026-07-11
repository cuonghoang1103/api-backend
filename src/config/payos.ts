import crypto from 'crypto';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

// PayOS — Vietnamese payment gateway (https://payos.vn). We call the REST
// API directly with global fetch + HMAC-SHA256 signatures (no SDK, so the
// Docker image stays lean). Credentials come from the merchant dashboard:
//   PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY

const PAYOS_BASE = 'https://api-merchant.payos.vn';

export function isPayosConfigured(): boolean {
  const { clientId, apiKey, checksumKey } = config.payos;
  return Boolean(clientId && apiKey && checksumKey);
}

// Signature for creating a payment link: HMAC-SHA256 over the 5 required
// fields, sorted alphabetically by key, joined as `k=v&...`.
function signCreate(data: { amount: number; cancelUrl: string; description: string; orderCode: number; returnUrl: string }): string {
  const str = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;
  return crypto.createHmac('sha256', config.payos.checksumKey).update(str).digest('hex');
}

// Signature verification for the webhook: HMAC-SHA256 over ALL data fields
// sorted alphabetically by key (`k=v&...`, null/undefined → '').
function signWebhookData(data: Record<string, unknown>): string {
  const keys = Object.keys(data).sort();
  const str = keys
    .map((k) => {
      const v = data[k];
      const val = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      return `${k}=${val}`;
    })
    .join('&');
  return crypto.createHmac('sha256', config.payos.checksumKey).update(str).digest('hex');
}

export interface PayosLink {
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
  orderCode: number;
}

/**
 * Create a PayOS payment link for a course order.
 * `orderCode` MUST be a positive integer unique across the merchant — we
 * pass the CourseOrder.id. `description` is capped at 25 chars by PayOS.
 */
export async function createPayosLink(params: {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  buyerName?: string;
}): Promise<PayosLink> {
  if (!isPayosConfigured()) throw new Error('PAYOS_NOT_CONFIGURED');
  const description = params.description.slice(0, 25);
  const body = {
    orderCode: params.orderCode,
    amount: Math.round(params.amount),
    description,
    cancelUrl: params.cancelUrl,
    returnUrl: params.returnUrl,
    ...(params.buyerName ? { buyerName: params.buyerName.slice(0, 100) } : {}),
    signature: signCreate({
      amount: Math.round(params.amount),
      cancelUrl: params.cancelUrl,
      description,
      orderCode: params.orderCode,
      returnUrl: params.returnUrl,
    }),
  };

  const res = await fetch(`${PAYOS_BASE}/v2/payment-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': config.payos.clientId,
      'x-api-key': config.payos.apiKey,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { code: string; desc: string; data?: PayosLink | null };
  if (json.code !== '00' || !json.data) {
    // 231 = orderCode already exists → the caller can fetch the existing link.
    const err = new Error(`PAYOS_CREATE_FAILED: ${json.code} ${json.desc}`);
    (err as Error & { payosCode?: string }).payosCode = json.code;
    throw err;
  }
  return json.data;
}

/** Fetch an existing payment link (used to recover on retry / orderCode-exists). */
export async function getPayosLink(orderCode: number): Promise<PayosLink | null> {
  if (!isPayosConfigured()) return null;
  try {
    const res = await fetch(`${PAYOS_BASE}/v2/payment-requests/${orderCode}`, {
      headers: { 'x-client-id': config.payos.clientId, 'x-api-key': config.payos.apiKey },
    });
    const json = (await res.json()) as { code: string; data?: (PayosLink & { checkoutUrl?: string }) | null };
    return json.code === '00' && json.data?.checkoutUrl ? json.data : null;
  } catch (err) {
    logger.warn(`[payos] getPayosLink failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

/**
 * Fetch the real payment status of an order from PayOS. Used as a
 * webhook-independent fallback: when the buyer returns to our site we ask
 * PayOS directly whether the order is PAID, so confirmation works even if
 * the merchant hasn't wired up the webhook. Returns e.g. { status: 'PAID' }.
 */
export async function getPayosStatus(orderCode: number): Promise<{ status: string; amountPaid: number } | null> {
  if (!isPayosConfigured()) return null;
  try {
    const res = await fetch(`${PAYOS_BASE}/v2/payment-requests/${orderCode}`, {
      headers: { 'x-client-id': config.payos.clientId, 'x-api-key': config.payos.apiKey },
    });
    const json = (await res.json()) as { code: string; data?: { status?: string; amountPaid?: number } | null };
    if (json.code === '00' && json.data?.status) {
      return { status: String(json.data.status), amountPaid: Number(json.data.amountPaid || 0) };
    }
    return null;
  } catch (err) {
    logger.warn(`[payos] getPayosStatus failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

/** Verify a webhook body's signature against its data. */
export function verifyPayosWebhook(payload: { data?: Record<string, unknown>; signature?: string }): boolean {
  if (!isPayosConfigured() || !payload?.data || !payload?.signature) return false;
  try {
    const expected = signWebhookData(payload.data);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(payload.signature));
  } catch {
    return false;
  }
}
