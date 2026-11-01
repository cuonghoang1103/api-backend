// cors.js — bài 6.4: cho đúng những trang web của mình gọi API từ trình duyệt
import { VULN } from './vuln.js';

const ALLOWED = (process.env.LABFLOW_CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((s) => s.trim());
const ALLOW_HEADERS = 'Authorization, Content-Type, Idempotency-Key, If-Match, If-None-Match, LabFlow-Client, Accept-Language';
const EXPOSE = 'Location, ETag, Link, Retry-After, RateLimit, RateLimit-Policy, Deprecation, Sunset, Idempotent-Replayed, LabFlow-Version';

export function cors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');                                               // câu trả lời khác nhau theo Origin ⇒ báo cho cache
  if (!origin) return next();                                       // không phải trình duyệt gọi chéo nguồn
  const ok = VULN || ALLOWED.includes(origin);
  if (ok) {
    res.set('Access-Control-Allow-Origin', origin);                 // phản chiếu ĐÚNG origin đã duyệt, không bao giờ "*"
    res.set('Access-Control-Expose-Headers', EXPOSE);
    if (VULN) res.set('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS' && req.get('Access-Control-Request-Method')) {   // preflight
    if (ok) res.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE')
      .set('Access-Control-Allow-Headers', ALLOW_HEADERS).set('Access-Control-Max-Age', '600');
    return res.status(204).end();
  }
  next();
}
