// auth.js — Chương 6: xác thực THẬT. Ba loại "chìa" trong Authorization: Bearer …
//   eyJ…      ⇒ JWT do POST /v2/auth/login cấp (người dùng, 15 phút)
//   lf_live_… ⇒ API key cho script (chỉ lưu bản băm)
//   tok_…     ⇒ token giả của Chương 1–5, CHỈ còn khi chạy dev (LABFLOW_DEMO_TOKENS khác "0" và không phải production)
import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { tokens, users } from './db.js';
import { HttpError } from './http.js';
import { now } from './deprecation.js';
import { VULN } from './vuln.js';

const SECRET = process.env.LABFLOW_JWT_SECRET
  ?? (process.env.NODE_ENV === 'production' ? null : 'dev-only-secret-change-me');
if (!SECRET) throw new Error('LABFLOW_JWT_SECRET is required in production');
export const ACCESS_TTL_SEC = 15 * 60;
const b64u = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
const sign = (data) => createHmac('sha256', SECRET).update(data).digest('base64url');

export function signJwt(user) {
  const iat = Math.floor(now() / 1000);
  const head = b64u({ alg: 'HS256', typ: 'JWT' });
  const body = b64u({ iss: 'labflow', sub: user.id, role: user.role, iat, exp: iat + ACCESS_TTL_SEC });
  return `${head}.${body}.${sign(`${head}.${body}`)}`;
}

export function verifyJwt(token) {
  const [head, body, sig] = token.split('.');
  let h, p;
  try { h = JSON.parse(Buffer.from(head, 'base64url')); p = JSON.parse(Buffer.from(body, 'base64url')); }
  catch { throw new HttpError(401, 'INVALID_TOKEN'); }
  if (VULN && h.alg === 'none') return p;                         // lỗ hổng kinh điển: tin vào thuật toán do TOKEN tự khai
  if (h.alg !== 'HS256' || !sig) throw new HttpError(401, 'INVALID_TOKEN');   // chỉ nhận đúng thuật toán của server
  const expected = Buffer.from(sign(`${head}.${body}`));
  const got = Buffer.from(sig);
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) throw new HttpError(401, 'INVALID_TOKEN');
  if (p.iss !== 'labflow') throw new HttpError(401, 'INVALID_TOKEN');
  if (!VULN && !(p.exp * 1000 > now())) throw new HttpError(401, 'TOKEN_EXPIRED');
  return p;
}

// API key: hiện MỘT lần lúc tạo, server chỉ giữ sha256 + tiền tố để nhận diện
export const apiKeys = new Map();                                  // sha256 ⇒ { userId, prefix, createdAt }
const sha256 = (s) => createHash('sha256').update(s).digest('hex');
export function createApiKey(userId) {
  const key = `lf_live_${randomBytes(24).toString('base64url')}`;
  const meta = { userId, prefix: key.slice(0, 12), createdAt: new Date(now()).toISOString() };
  apiKeys.set(sha256(key), meta);
  return { key, ...meta };
}

const demoTokens = process.env.NODE_ENV !== 'production' && process.env.LABFLOW_DEMO_TOKENS !== '0';

export function requireAuth(req, res, next) {
  const [scheme, cred] = (req.get('Authorization') ?? '').split(' ');
  let userId;
  if (scheme?.toLowerCase() === 'bearer' && cred) {
    if (cred.startsWith('eyJ')) userId = (req.timing ? req.timing.time('auth', () => verifyJwt(cred)) : verifyJwt(cred)).sub;
    else if (cred.startsWith('lf_')) userId = apiKeys.get(sha256(cred))?.userId;
    else if (demoTokens) userId = tokens[cred];
  }
  if (!userId) {
    res.set('WWW-Authenticate', 'Bearer realm="labflow"');
    throw new HttpError(401, 'UNAUTHENTICATED');
  }
  req.user = users.find((u) => u.id === userId);
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) throw new HttpError(403, 'FORBIDDEN', { role });
    next();
  };
}
