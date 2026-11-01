// rateLimit.js — bài 5.3: giới hạn tần suất bằng "xô token" (token bucket)
// Header theo draft-ietf-httpapi-ratelimit-headers-11 (23/05/2026): RateLimit-Policy (q, w) + RateLimit (r, t); hết lượt ⇒ 429 + Retry-After
import { HttpError } from './http.js';
import { now } from './deprecation.js';

export function rateLimit({ name, capacity, windowSec, key }) {
  const buckets = new Map();                                       // khoá ⇒ { tokens, at }
  const perSec = capacity / windowSec;                             // tốc độ rót lại token
  return (req, res, next) => {
    const k = key(req);
    const t = now() / 1000;
    const b = buckets.get(k) ?? { tokens: capacity, at: t };
    b.tokens = Math.min(capacity, b.tokens + (t - b.at) * perSec);   // rót thêm phần đã "chảy" từ lần trước
    b.at = t;
    buckets.set(k, b);
    res.set('RateLimit-Policy', `"${name}";q=${capacity};w=${windowSec}`);
    if (b.tokens < 1) {                                            // hết token ⇒ chờ tới khi có lại MỘT token
      const wait = Math.ceil((1 - b.tokens) / perSec);
      res.set('RateLimit', `"${name}";r=0;t=${wait}`).set('Retry-After', String(wait));
      throw new HttpError(429, 'RATE_LIMITED', { wait });
    }
    b.tokens -= 1;
    res.set('RateLimit', `"${name}";r=${Math.floor(b.tokens)};t=${Math.ceil((capacity - b.tokens) / perSec)}`);
    next();
  };
}

// Hai giới hạn của LabFlow: đặt phòng theo NGƯỜI DÙNG, đọc công khai theo ĐỊA CHỈ IP
// Lab 5 — báo hỏng: tối đa 3 báo cáo mỗi phút cho một người
export const reportLimit = rateLimit({ name: 'report', capacity: 3, windowSec: 60, key: (req) => req.user.id });
// Bài 10.3–10.4: kịch bản đo tạo hàng trăm lượt đặt ⇒ LABFLOW_BOOKING_LIMIT=1000000/60 (CHỈ để đo, như LABFLOW_IP_LIMIT)
const [bq, bw] = (process.env.LABFLOW_BOOKING_LIMIT ?? '5/60').split('/').map(Number);
export const bookingLimit = rateLimit({ name: 'booking', capacity: bq, windowSec: bw, key: (req) => req.user.id });
const [q, w] = (process.env.LABFLOW_IP_LIMIT ?? '100/60').split('/').map(Number);
export const ipLimit = rateLimit({ name: 'ip', capacity: q, windowSec: w, key: (req) => req.ip });
