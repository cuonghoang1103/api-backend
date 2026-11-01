// rateLimit.js — bài 5.3: giới hạn tần suất bằng "xô token" (token bucket)
// Header theo draft-ietf-httpapi-ratelimit-headers-11 (23/05/2026): RateLimit-Policy (q, w) + RateLimit (r, t); hết lượt ⇒ 429 + Retry-After
// Bài 12.4: xô trong RAM ⇒ N instance = N lần hạn mức (bài 8.3 đo: 8/8 lượt đặt lọt qua giới hạn 5).
//   LABFLOW_RATE=redis (mặc định khi kho pg + LABFLOW_REDIS) ⇒ xô nằm trong Redis, MỘT script Lua đọc-tính-ghi nguyên tử.
import { HttpError } from './http.js';
import { now } from './deprecation.js';
import { config } from './config.js';
import { shared } from './redis.js';

// Chạy NGUYÊN TỬ trong Redis: không instance nào chen vào giữa "đọc số token" và "trừ một token".
// Giờ lấy từ đồng hồ CỦA REDIS (TIME) — đồng hồ hai máy chủ lệch nhau không làm xô rót sai.
const LUA = `
local cap, rate = tonumber(ARGV[1]), tonumber(ARGV[2])
local t = redis.call('TIME')
local nowS = tonumber(t[1]) + tonumber(t[2]) / 1000000
local b = redis.call('HMGET', KEYS[1], 'tokens', 'at')
local tokens = tonumber(b[1]) or cap
local at = tonumber(b[2]) or nowS
tokens = math.min(cap, tokens + (nowS - at) * rate)
local ok = 0
if tokens >= 1 then tokens = tokens - 1; ok = 1 end
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'at', tostring(nowS))
redis.call('EXPIRE', KEYS[1], math.ceil(cap / rate) + 1)
return {ok, tostring(tokens)}`;

function memoryBucket(capacity, perSec) {
  const buckets = new Map();                                       // khoá ⇒ { tokens, at }
  return async (k) => {
    const t = now() / 1000;
    const b = buckets.get(k) ?? { tokens: capacity, at: t };
    b.tokens = Math.min(capacity, b.tokens + (t - b.at) * perSec);   // rót thêm phần đã "chảy" từ lần trước
    b.at = t;
    buckets.set(k, b);
    const ok = b.tokens >= 1;
    if (ok) b.tokens -= 1;
    return { ok, tokens: b.tokens };
  };
}
function redisBucket(name, capacity, perSec, fallback) {
  return async (k) => {
    // Redis hỏng ⇒ MỞ (cho qua, dùng xô RAM của instance này): giới hạn tần suất bảo vệ hệ thống, không được tự nó làm sập hệ thống
    if (!shared?.isReady) return fallback(k);
    try {
      const [ok, tokens] = await shared.eval(LUA, { keys: [`labflow:rl:${name}:${k}`], arguments: [String(capacity), String(perSec)] });
      return { ok: ok === 1, tokens: Number(tokens) };
    } catch (e) { console.error('rate limit redis:', e.message); return fallback(k); }
  };
}

export function rateLimit({ name, capacity, windowSec, key }) {
  const perSec = capacity / windowSec;                             // tốc độ rót lại token
  const local = memoryBucket(capacity, perSec);
  const take = config.rateLimitStore === 'redis' ? redisBucket(name, capacity, perSec, local) : local;
  return async (req, res, next) => {
    const { ok, tokens } = await take(key(req));
    res.set('RateLimit-Policy', `"${name}";q=${capacity};w=${windowSec}`);
    if (!ok) {                                                     // hết token ⇒ chờ tới khi có lại MỘT token
      const wait = Math.ceil((1 - tokens) / perSec);
      res.set('RateLimit', `"${name}";r=0;t=${wait}`).set('Retry-After', String(wait));
      throw new HttpError(429, 'RATE_LIMITED', { wait });
    }
    res.set('RateLimit', `"${name}";r=${Math.floor(tokens)};t=${Math.ceil((capacity - tokens) / perSec)}`);
    next();
  };
}

// Hai giới hạn của LabFlow: đặt phòng theo NGƯỜI DÙNG, đọc công khai theo ĐỊA CHỈ IP
// Lab 5 — báo hỏng: tối đa 3 báo cáo mỗi phút cho một người
// Lab 12: bộ chấm tạo nhiều báo hỏng ⇒ LABFLOW_REPORT_LIMIT=1000/60 (CHỈ để chấm/đo, như LABFLOW_BOOKING_LIMIT)
const [rq, rw] = (process.env.LABFLOW_REPORT_LIMIT ?? '3/60').split('/').map(Number);
export const reportLimit = rateLimit({ name: 'report', capacity: rq, windowSec: rw, key: (req) => req.user.id });
// Bài 10.3–10.4: kịch bản đo tạo hàng trăm lượt đặt ⇒ LABFLOW_BOOKING_LIMIT=1000000/60 (CHỈ để đo, như LABFLOW_IP_LIMIT)
const [bq, bw] = (process.env.LABFLOW_BOOKING_LIMIT ?? '5/60').split('/').map(Number);
export const bookingLimit = rateLimit({ name: 'booking', capacity: bq, windowSec: bw, key: (req) => req.user.id });
const [q, w] = (process.env.LABFLOW_IP_LIMIT ?? '100/60').split('/').map(Number);
export const ipLimit = rateLimit({ name: 'ip', capacity: q, windowSec: w, key: (req) => req.ip });
