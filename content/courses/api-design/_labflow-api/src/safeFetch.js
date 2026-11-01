// safeFetch.js — bài 6.3 (OWASP API7 SSRF): server chỉ tải URL công khai, qua HTTPS, không bao giờ vào mạng nội bộ
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

// loopback, mạng riêng, link-local (169.254.x.x — nơi cloud để metadata), CGNAT, "this network", IPv6 nội bộ
const PRIVATE = [/^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^0\./,
  /^::1$/, /^f[cd]/i, /^fe80:/i, /^::ffff:(127|10|192\.168|169\.254)\./i];
const isPrivate = (ip) => PRIVATE.some((r) => r.test(ip));

export async function safeFetch(raw) {
  let url;
  try { url = new URL(raw); } catch { throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'not a URL' }); }
  if (!VULN) {
    if (url.protocol !== 'https:') throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'https only' });
    const host = url.hostname.replace(/^\[|\]$/g, '');
    const addrs = isIP(host) ? [host] : (await lookup(host, { all: true })).map((a) => a.address);
    if (addrs.some(isPrivate)) throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'private address' });
  }
  const res = await fetch(url, { redirect: VULN ? 'follow' : 'error', signal: AbortSignal.timeout(3000) });   // chuyển hướng có thể dẫn vào trong
  return { status: res.status, contentType: res.headers.get('content-type'), bytes: (await res.arrayBuffer()).byteLength };
}
