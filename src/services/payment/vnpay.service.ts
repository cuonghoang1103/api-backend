/**
 * VNPay Service — wrapper around the `vnpay` SDK.
 *
 * Centralizes:
 *  - VNPay config (TMN code, hash secret, host) from env
 *  - Build payment URL
 *  - Verify return URL (user-facing) and IPN callback (server-to-server)
 *  - Get client IP (proxy-aware)
 *
 * Docs: https://vnpay.js.org/
 *
 * Environment switching (VNPAY_SANDBOX env var):
 *  - VNPAY_SANDBOX=1  → sandbox:    https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
 *  - VNPAY_SANDBOX=0  → production: https://pay.vnpay.vn/vpcpay.html
 *  - Unset            → follows NODE_ENV ('production' → live, anything else → sandbox)
 *
 * Note: sandbox and production use DIFFERENT gateway hosts AND different
 * payment endpoint paths. The SDK's testMode=true forces the sandbox host
 * automatically; for production we supply the live host + the shorter path.
 *
 * All env vars (except VNPAY_URL) must be set; service throws at boot to
 * fail fast (better than silent breakage at runtime).
 */
import { VNPay, HashAlgorithm } from 'vnpay';
import type { Request } from 'express';
import { createHmac } from 'node:crypto';

interface VnpayConfig {
  tmnCode: string;
  secureSecret: string;
  vnpayHost: string;
  paymentEndpoint: string;
  returnUrl: string;
  ipnUrl: string;
  isSandbox: boolean;
}

let cachedConfig: VnpayConfig | null = null;
let cachedClient: VNPay | null = null;

function loadConfig(): VnpayConfig {
  if (cachedConfig) return cachedConfig;

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secureSecret = process.env.VNPAY_HASH_SECRET;
  const returnUrl = process.env.VNPAY_RETURN_URL;
  const ipnUrl = process.env.VNPAY_IPN_URL;

  const missing = [
    !tmnCode && 'VNPAY_TMN_CODE',
    !secureSecret && 'VNPAY_HASH_SECRET',
    !returnUrl && 'VNPAY_RETURN_URL',
    !ipnUrl && 'VNPAY_IPN_URL',
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    throw new Error(
      `[vnpay] Missing env vars: ${missing.join(', ')}. ` +
        'Set them in .env (sandbox) or .env.production (live).',
    );
  }

  // VNPAY_SANDBOX=1 → always sandbox.
  // VNPAY_SANDBOX=0 → always production.
  // Unset → fall back to NODE_ENV ('production' = live, anything else = sandbox).
  const isSandbox =
    process.env.VNPAY_SANDBOX === '1' ||
    (process.env.VNPAY_SANDBOX !== '0' && process.env.NODE_ENV !== 'production');

  // Sandbox and production use different hosts AND different path segments.
  // The SDK's `testMode: true` overrides vnpayHost to the sandbox host
  // automatically, but we still set it explicitly for clarity.
  const vnpayHost = isSandbox
    ? 'https://sandbox.vnpayment.vn'
    : 'https://pay.vnpay.vn';
  const paymentEndpoint = isSandbox
    ? 'paymentv2/vpcpay.html'  // sandbox:    /paymentv2/vpcpay.html
    : 'vpcpay.html';           // production: /vpcpay.html  ← different path!

  cachedConfig = {
    tmnCode: tmnCode!,
    secureSecret: secureSecret!,
    vnpayHost,
    paymentEndpoint,
    returnUrl: returnUrl!,
    ipnUrl: ipnUrl!,
    isSandbox,
  };
  return cachedConfig;
}

function getClient(): VNPay {
  if (cachedClient) return cachedClient;
  const cfg = loadConfig();
  cachedClient = new VNPay({
    tmnCode: cfg.tmnCode,
    secureSecret: cfg.secureSecret,
    vnpayHost: cfg.vnpayHost,
    // testMode=true forces the SDK to override vnpayHost with the sandbox
    // gateway regardless of what we pass. testMode=false uses our vnpayHost.
    testMode: cfg.isSandbox,
    hashAlgorithm: HashAlgorithm.SHA512,
    endpoints: {
      paymentEndpoint: cfg.paymentEndpoint,
    },
  });
  return cachedClient;
}

/**
 * Build a VNPay payment URL for ANY order type (course or product).
 *
 * This is the generic, order-type-agnostic builder used by the unified
 * `POST /create-qr` endpoint. The `txnRef` is whatever string we want
 * VNPay to echo back in the IPN/return callback — we encode the order
 * type as its prefix (`COURSE_...` or `PRODUCT_...`) so the IPN handler
 * can split the flow without an extra DB lookup.
 *
 * The `vnpay` SDK does the heavy lifting that VNPay's spec requires:
 *  - sorts the params alphabetically,
 *  - builds the query string,
 *  - signs it with HMAC-SHA512 using the secret hash (vnp_HashSecret),
 *  - appends vnp_SecureHash.
 * (Configured in getClient() with HashAlgorithm.SHA512.)
 *
 * @param txnRef vnp_TxnRef — must be unique per day. Format:
 *               `{ORDER_TYPE}_{id}_{ts}` e.g. `PRODUCT_42_1718000000000`.
 * @param amount VND amount (NOT multiplied by 100 — the SDK does that).
 * @param orderInfo Description, ASCII only ("Thanh toan ...").
 * @param ipAddr User's IP from req.
 * @returns Full VNPay gateway URL with the HMAC-signed query string.
 */
export function buildVnpayPaymentUrl(
  txnRef: string,
  amount: number,
  orderInfo: string,
  ipAddr: string,
): string {
  const cfg = loadConfig();
  const vnpay = getClient();
  return vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_ReturnUrl: cfg.returnUrl,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: sanitizeOrderInfo(orderInfo),
  });
}

/**
 * Build the VNPay payment URL for a course purchase.
 *
 * Thin wrapper around {@link buildVnpayPaymentUrl}, kept for backward
 * compatibility with the existing `POST /payments/course` flow (whose
 * orderCode already starts with `COURSE_`).
 *
 * @param orderCode Unique order code (used as vnp_TxnRef). Format:
 *                  COURSE_{courseId}_{userId}_{ts}
 * @param amount VND amount (NOT multiplied by 100 — vnpay SDK does that)
 * @param orderInfo Description, ASCII only ("Thanh toan khoa hoc XYZ")
 * @param ipAddr User's IP from req
 * @returns Full VNPay gateway URL with HMAC-signed query string
 */
export function buildCoursePaymentUrl(
  orderCode: string,
  amount: number,
  orderInfo: string,
  ipAddr: string,
): string {
  return buildVnpayPaymentUrl(orderCode, amount, orderInfo, ipAddr);
}

/**
 * Strip Vietnamese diacritics + special chars so VNPay (which expects
 * ASCII in vnp_OrderInfo) accepts the string. VNPay docs say
 * "Tiếng Việt, không dấu".
 */
function sanitizeOrderInfo(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .slice(0, 255);
}

/**
 * Verify a return URL (user-facing) query payload.
 * Returns { isVerified, isSuccess, message }.
 *
 * Cast to `unknown` first then to the SDK's expected shape because the
 * SDK types are tighter than Express's `req.query` (which is
 * `ParsedQs`). The verify functions iterate over the keys and pull
 * vnp_* fields, so any object with vnp_ keys is fine.
 */
export function verifyReturnUrl(query: Record<string, unknown>) {
  return getClient().verifyReturnUrl(query as unknown as never);
}

/**
 * Verify an IPN callback (server-to-server) payload from VNPay.
 * Returns { isVerified, isSuccess, message }.
 *
 * Critical: this is the trusted path. We use it to update order status
 * and create Enrollment. Return URL is NOT trusted (user can manipulate).
 */
export function verifyIpnCall(query: Record<string, unknown>) {
  return getClient().verifyIpnCall(query as unknown as never);
}

/**
 * Extract client IP from request, respecting common reverse-proxy headers.
 * VNPay logs vnp_IpAddr so we want the real client, not the proxy.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return xff[0];
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * ─────────────────────────────────────────────────────────────────
 * VNPay Refund API — best-effort, NON-BLOCKING for the IPN/admin flow.
 * ─────────────────────────────────────────────────────────────────
 *
 * VNPay's refund endpoint requires us to POST to their merchant API
 * with a signed payload. We do this OUT-OF-BAND from the admin's
 * POST /admin/refund request — the DB update happens first (so the
 * user can never be charged twice) and if VNPay's refund API
 * rejects/times-out, the admin sees a clear error and can retry.
 *
 * Endpoint (sandbox): POST https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
 * Endpoint (prod):    POST https://pay.vnpay.vn/merchant_webapi/api/transaction
 * Command: refund (TransactionType 02 = full, 03 = partial)
 *
 * Why we built this in-house instead of using the SDK:
 *   - The published `vnpay` npm SDK only covers payment URL + verify
 *     callbacks. Refund / query-dr / capture have no first-party
 *     helper, so we hand-roll the HMAC-SHA512 signing.
 *   - VNPay's merchant API returns a JSON object with
 *     vnp_ResponseCode where 00 = success and any other value means
 *     the refund failed (insufficient funds, order not yet settled,
 *     etc.). We surface the code + message to the admin so they
 *     know whether to retry.
 *
 * IMPORTANT — when VNPAY_SANDBOX=1 we hit sandbox.vnpayment.vn
 * (the test gateway). Set VNPAY_SANDBOX=0 for production.
 */
export interface VnpayRefundResult {
  /** True only if VNPay returned vnp_ResponseCode === '00'. */
  ok: boolean;
  /** VNPay response code, e.g. "00" (success), "99" (system error). */
  responseCode: string | null;
  /** Human-readable message from VNPay, may be null. */
  message: string | null;
  /** Raw response body for audit. */
  raw: unknown;
}

/**
 * Format a Date as VNPay's `yyyyMMddHHmmss` (no separators, VN time).
 * Used for vnp_TransactionDate + vnp_CreateDate in the refund
 * payload. We deliberately use the server's local clock — VNPay
 * timestamps are interpreted in Vietnam time (UTC+7), but
 * formatting with the local zone is the convention the docs
 * document (and the SDK uses this same approach).
 */
function formatVnpayDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

/**
 * Build the canonical VNPay query string for the refund payload.
 * VNPay signs `vnp_*` params alphabetically with HMAC-SHA512.
 * Matches the signing scheme the SDK uses for payments — copy of
 * the relevant step so we don't depend on a private API.
 */
function buildSignedVnpayQuery(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params).sort();
  const signData = sorted
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHmac('sha512', secret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
}

/**
 * POST a refund request to VNPay's merchant API. The admin's
 * `/admin/refund` route calls this AFTER updating the local DB —
 * if it fails, the refund is still recorded locally and the admin
 * sees the VNPay error in the response so they can retry from
 * the dashboard (with the next attempt's amount capped at the
 * outstanding balance).
 */
export async function requestVnpayRefund(opts: {
  /** The vnp_TransactionNo from the original IPN (NOT vnp_TxnRef). */
  transactionNo: string;
  /** The vnp_TransactionDate from the original IPN (yyyyMMddHHmmss). */
  transactionDate: string;
  /** VND amount to refund. Must be ≤ the original amount. */
  amount: number;
  /** Admin user id (for vnp_CreateBy + audit). */
  createdBy: number;
  /** Client IP (optional). Defaults to 127.0.0.1. */
  ipAddr?: string;
  /** Admin's reason — shown to VNPay for traceability. */
  reason?: string;
}): Promise<VnpayRefundResult> {
  const cfg = loadConfig();
  // We do the request manually because the SDK doesn't expose
  // refund. The endpoint expects application/x-www-form-urlencoded
  // with all params signed, just like the payment URL.
  const requestId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  // vnp_TransactionType: 02 = full refund, 03 = partial refund.
  // We use 03 for every call and pass the exact amount we want;
  // 02 is only valid when amount === originalAmount. Using 03
  // uniformly keeps the code path simple.
  const params: Record<string, string> = {
    vnp_RequestId: requestId,
    vnp_Version: '2.1.0',
    vnp_Command: 'refund',
    vnp_TmnCode: cfg.tmnCode,
    vnp_TransactionType: '03',
    vnp_TxnRef: opts.transactionNo,
    vnp_Amount: String(opts.amount * 100),  // VNPay uses VND × 100
    vnp_TransactionNo: opts.transactionNo,
    vnp_TransactionDate: opts.transactionDate,
    vnp_CreateBy: String(opts.createdBy),
    vnp_IpAddr: opts.ipAddr ?? '127.0.0.1',
    vnp_OrderInfo: opts.reason ? sanitizeOrderInfo(`Hoan tien: ${opts.reason}`) : 'Refund',
    vnp_CreateDate: formatVnpayDateTime(new Date()),
  };
  const secureHash = buildSignedVnpayQuery(params, cfg.secureSecret);

  // The merchant API URL is different from the payment gateway:
  // - Sandbox: https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
  // - Prod:    https://pay.vnpay.vn/merchant_webapi/api/transaction
  // (Sandbox uses the same path but a different host; we host-switch
  // here rather than parsing the gateway URL.)
  const endpoint = cfg.isSandbox
    ? 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
    : 'https://pay.vnpay.vn/merchant_webapi/api/transaction';

  const formBody = new URLSearchParams({ ...params, vnp_SecureHash: secureHash });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await res.text();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      // Non-JSON response (e.g. HTML error page); keep raw text for debug.
      parsed = { _raw: text };
    }
    const code = typeof parsed.vnp_ResponseCode === 'string'
      ? parsed.vnp_ResponseCode
      : null;
    return {
      ok: code === '00',
      responseCode: code,
      message: typeof parsed.vnp_Message === 'string'
        ? parsed.vnp_Message
        : (text ? `HTTP ${res.status}` : null),
      raw: parsed,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      ok: false,
      responseCode: null,
      message: err instanceof Error ? err.message : 'unknown',
      raw: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}
