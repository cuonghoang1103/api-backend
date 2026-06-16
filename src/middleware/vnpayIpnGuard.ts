/**
 * Middleware to gate VNPay IPN callbacks.
 *
 * Layered defense (in case a single check is bypassed):
 *  1. User-Agent must contain "VNPay" — VNPay docs say the IPN UA is
 *     recognizable. (Sanity check, not bulletproof.)
 *  2. Source IP must be in the official VNPay allowlist. VNPay publishes
 *     their IP ranges; for now we ship a small set and the rest of the
 *     world gets a 403.
 *  3. The body is small (< 4 KB) — anything bigger is suspicious.
 *
 * NOTE: The allowlist below is for production. For sandbox testing we
 * bypass the IP check (sandbox.vnpayment.vn can come from anywhere
 * because it shares infrastructure with their CDN). Set
 * `VNPAY_SANDBOX=1` in env to skip the IP gate.
 *
 * Production VNPay IPs (per their docs and community reports):
 *   203.171.20.0/24, 123.30.235.0/24, 113.161.69.0/24
 * We accept the most common ones here; admin can extend the list
 * later via env var (comma-separated) if VNPay adds more.
 */
import { Request, Response, NextFunction } from 'express';
import { isIpInAnyCidr } from '../utils/cidr.js';

const PROD_VNPAY_CIDRS = [
  '203.171.20.0/24',
  '123.30.235.0/24',
  '113.161.69.0/24',
  // Cloudflare-fronted VNPay sometimes presents as:
  '103.220.87.0/24',
  '103.220.88.0/24',
];

function getVnpayCidrs(): string[] {
  const envList = process.env.VNPAY_IP_ALLOWLIST;
  if (envList && envList.trim().length > 0) {
    return envList
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return PROD_VNPAY_CIDRS;
}

export function vnpayIpnGuard(req: Request, res: Response, next: NextFunction): void {
  // 1. User-Agent check (cheap, runs first)
  const ua = (req.headers['user-agent'] || '').toString();
  // VNPay IPN UA in production is typically "VNPay-IPN" or contains
  // "VNPay". Sandbox sometimes sends a different UA. We allow
  // anything containing "VNPay" (case-insensitive).
  if (!/vnpay/i.test(ua)) {
    res.status(403).json({
      RspCode: '99',
      Message: 'Forbidden: invalid User-Agent',
    });
    return;
  }

  // 2. IP allowlist (sandbox-bypassable)
  const isSandbox = process.env.VNPAY_SANDBOX === '1';
  if (!isSandbox) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      '';
    const allowed = getVnpayCidrs();
    if (!isIpInAnyCidr(clientIp, allowed)) {
      res.status(403).json({
        RspCode: '99',
        Message: 'Forbidden: IP not in VNPay allowlist',
      });
      return;
    }
  }

  // 3. Payload size sanity check (4 KB is plenty for VNPay IPN)
  const contentLength = parseInt(
    (req.headers['content-length'] || '0').toString(),
    10,
  );
  if (contentLength > 4096) {
    res.status(413).json({
      RspCode: '99',
      Message: 'Payload too large',
    });
    return;
  }

  next();
}
