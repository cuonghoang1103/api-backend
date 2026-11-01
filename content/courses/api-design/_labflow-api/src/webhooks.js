// webhooks.js — bài 10.5: ký và kiểm chữ ký webhook theo Standard Webhooks (standardwebhooks.com, giống Svix/Stripe):
//   webhook-id: msg_…   webhook-timestamp: <giây Unix>   webhook-signature: v1,<base64 HMAC-SHA256(khoá, "id.timestamp.body")>
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const newSecret = () => `whsec_${randomBytes(24).toString('base64')}`;     // hiện MỘT lần lúc đăng ký
const keyOf = (secret) => Buffer.from(secret.replace(/^whsec_/, ''), 'base64');

export function sign(secret, id, ts, body) {
  return `v1,${createHmac('sha256', keyOf(secret)).update(`${id}.${ts}.${body}`).digest('base64')}`;
}

export function signedHeaders(secret, id, body, ts = Math.floor(Date.now() / 1000)) {
  return { 'webhook-id': id, 'webhook-timestamp': String(ts), 'webhook-signature': sign(secret, id, ts, body) };
}

// Bên NHẬN: body phải là đúng chuỗi byte đã ký (express.raw, KHÔNG express.json rồi JSON.stringify lại)
export function verify(secret, headers, body, { toleranceSec = 300, now = Date.now() } = {}) {
  const id = headers['webhook-id'], ts = Number(headers['webhook-timestamp']), sigs = headers['webhook-signature'];
  if (!id || !ts || !sigs) return { ok: false, reason: 'missing headers' };
  if (Math.abs(now / 1000 - ts) > toleranceSec) return { ok: false, reason: 'timestamp outside tolerance' };   // chống phát lại
  const expected = Buffer.from(sign(secret, id, ts, body).slice(3), 'base64');
  for (const s of sigs.split(' ')) {                         // có thể nhiều chữ ký (đang xoay khoá)
    const [ver, b64] = s.split(',');
    const got = Buffer.from(b64 ?? '', 'base64');
    if (ver === 'v1' && got.length === expected.length && timingSafeEqual(got, expected)) return { ok: true, id };
  }
  return { ok: false, reason: 'bad signature' };
}
