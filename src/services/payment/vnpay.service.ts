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
 * Sandbox: https://sandbox.vnpayment.vn
 *
 * IMPORTANT — sandbox vs production:
 *  - Sandbox: vnpayHost = "https://sandbox.vnpayment.vn", tmnCode/secureSecret
 *    from https://sandbox.vnpayment.vn/devreg
 *  - Production: vnpayHost = "https://pay.vnpayment.vn", real credentials
 *    from VNPay after contract signing.
 *
 * All env vars must be set, otherwise the service throws at boot to
 * fail fast (better than silent breakage at runtime).
 */
import { VNPay, HashAlgorithm } from 'vnpay';
import type { Request } from 'express';

interface VnpayConfig {
  tmnCode: string;
  secureSecret: string;
  vnpayHost: string;
  returnUrl: string;
  ipnUrl: string;
}

let cachedConfig: VnpayConfig | null = null;
let cachedClient: VNPay | null = null;

function loadConfig(): VnpayConfig {
  if (cachedConfig) return cachedConfig;

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secureSecret = process.env.VNPAY_HASH_SECRET;
  const vnpayHost = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;
  const ipnUrl = process.env.VNPAY_IPN_URL;

  const missing = [
    !tmnCode && 'VNPAY_TMN_CODE',
    !secureSecret && 'VNPAY_HASH_SECRET',
    !vnpayHost && 'VNPAY_URL',
    !returnUrl && 'VNPAY_RETURN_URL',
    !ipnUrl && 'VNPAY_IPN_URL',
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    throw new Error(
      `[vnpay] Missing env vars: ${missing.join(', ')}. ` +
        `Set them in .env (sandbox) or .env.production (live).`,
    );
  }

  // Strip trailing slash from host so URL concatenation is clean.
  const normalizedHost = vnpayHost!.replace(/\/$/, '');

  cachedConfig = {
    tmnCode: tmnCode!,
    secureSecret: secureSecret!,
    vnpayHost: normalizedHost,
    returnUrl: returnUrl!,
    ipnUrl: ipnUrl!,
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
    testMode: cfg.vnpayHost.includes('sandbox'),
    hashAlgorithm: HashAlgorithm.SHA512,
    endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
    },
  });
  return cachedClient;
}

/**
 * Build the VNPay payment URL for a course purchase.
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
  const cfg = loadConfig();
  const vnpay = getClient();
  return vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_ReturnUrl: cfg.returnUrl,
    vnp_TxnRef: orderCode,
    vnp_OrderInfo: sanitizeOrderInfo(orderInfo),
  });
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
