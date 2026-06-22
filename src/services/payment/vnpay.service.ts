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
        `Set them in .env (sandbox) or .env.production (live).`,
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
