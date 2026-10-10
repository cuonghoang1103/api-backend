/**
 * CT Work đợt 8a — mã hoá token OAuth + ký state.
 *
 * Token: AES-256-GCM, khoá = APP_ENCRYPTION_KEY (base64 32 byte) nếu có, không thì sha256("ctw-oauth-v1|" + JWT secret)
 * (cùng cách 7b làm với bí mật kênh ngoài, nhưng khác miền khoá). AAD gắn bản mã vào ĐÚNG người + nhà cung cấp:
 * chép bản mã sang dòng của người khác thì giải không ra.
 * State: HMAC-SHA256 trên "nonce|userId|provider|exp" — state bị sửa một ký tự ⇒ 400 trước khi chạm DB.
 */

import crypto from 'node:crypto';
import { config } from '../../../config/env.js';

function key(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (raw) {
    const k = Buffer.from(raw, 'base64');
    if (k.length === 32) return k;
  }
  return crypto.createHash('sha256').update(`ctw-oauth-v1|${config.jwtSecret}`).digest();
}

export function sealToken(plain: string, aad: string): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  c.setAAD(Buffer.from(aad));
  const ct = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `o1.${Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64url')}`;
}

export function openToken(token: string | null | undefined, aad: string): string | null {
  if (!token || !token.startsWith('o1.')) return null;
  try {
    const buf = Buffer.from(token.slice(3), 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
    d.setAAD(Buffer.from(aad));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export const tokenAad = (provider: string, userId: number) => `${provider}:${userId}`;

function hmac(s: string): string {
  return crypto.createHmac('sha256', `ctw-oauth-state|${config.jwtSecret}`).update(s).digest('base64url');
}

/** state = "<nonce>.<exp giây>.<chữ ký>" */
export function signState(nonce: string, userId: number, provider: string, expSec: number): string {
  return `${nonce}.${expSec}.${hmac(`${nonce}|${userId}|${provider}|${expSec}`)}`;
}

/** Tách + kiểm hình dạng (CHƯA kiểm chữ ký — cần userId của dòng DB). */
export function parseState(state: string): { nonce: string; exp: number; sig: string } | null {
  const m = /^([A-Za-z0-9_-]{20,64})\.(\d{9,11})\.([A-Za-z0-9_-]{43})$/.exec(state);
  return m ? { nonce: m[1], exp: Number(m[2]), sig: m[3] } : null;
}

export function stateSignatureOk(p: { nonce: string; exp: number; sig: string }, userId: number, provider: string): boolean {
  const want = Buffer.from(hmac(`${p.nonce}|${userId}|${provider}|${p.exp}`));
  const got = Buffer.from(p.sig);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

/** PKCE (RFC 7636): verifier 43–128 ký tự, challenge = base64url(sha256(verifier)). */
export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = crypto.randomBytes(48).toString('base64url');
  return { verifier, challenge: crypto.createHash('sha256').update(verifier).digest('base64url') };
}

export const randomNonce = () => crypto.randomBytes(24).toString('base64url');
