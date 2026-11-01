// idempotency.js — bài 5.1: POST lặp lại an toàn bằng header Idempotency-Key
// (draft-ietf-httpapi-idempotency-key-header-08, 22/10/2026: 400 thiếu khoá · 422 khoá dùng lại với body khác · 409 đang xử lý)
import { createHash } from 'node:crypto';
import { HttpError } from './http.js';
import { now } from './deprecation.js';

const TTL_MS = 24 * 3600 * 1000;                                   // giữ kết quả 24 giờ
const store = new Map();   // "usr_1:<khoá>" ⇒ { fp, state: 'running' | 'done', status, body, location, at }

// Khoá là chuỗi structured field ("…"); nhận cả dạng không ngoặc kép mà nhiều client vẫn gửi
const parseKey = (raw) => /^"?([\x21\x23-\x7e]{1,255}?)"?$/.exec(raw)?.[1];

// Bài 8.3 — nhiều instance: LABFLOW_IDEMPOTENCY=pg ⇒ dùng bảng chung trong PostgreSQL (idempotency-pg.js)
const shared = process.env.LABFLOW_IDEMPOTENCY === 'pg' ? await import('./idempotency-pg.js') : null;

const memory = ({ required = false } = {}) => (req, res, next) => {
  const raw = req.get('Idempotency-Key');
  if (raw === undefined) {
    if (required) throw new HttpError(400, 'IDEMPOTENCY_KEY_MISSING');
    return next();                                                 // không gửi khoá ⇒ hành xử như trước
  }
  const key = parseKey(raw);
  if (!key) throw new HttpError(400, 'IDEMPOTENCY_KEY_INVALID');
  const k = `${req.user?.id ?? req.ip}:${key}`;                    // khoá thuộc về MỘT người gọi
  const fp = createHash('sha256').update(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body ?? null)}`).digest('hex');
  let e = store.get(k);
  if (e && now() - e.at > TTL_MS) { store.delete(k); e = undefined; }
  if (e) {
    if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');       // cùng khoá, KHÁC yêu cầu
    if (e.state === 'running') {
      res.set('Retry-After', '1');                                  // "quay lại sau 1 giây" — client biết lúc nào thử tiếp
      throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS');
    }
    res.set('Idempotent-Replayed', 'true');                         // lần này không làm gì mới
    if (e.location) res.location(e.location);
    return res.status(e.status).json(e.body);
  }
  store.set(k, { fp, state: 'running', at: now() });
  let result;
  const json = res.json.bind(res);
  res.json = (body) => { result = { status: res.statusCode, body, location: res.get('Location') }; return json(body); };
  // Chốt khi kết nối ĐÓNG — kể cả khi client đã bỏ đi giữa chừng: việc đã làm thì phải nhớ
  res.once('close', () => {
    if (result && result.status < 300) store.set(k, { fp, state: 'done', ...result, at: now() });
    else store.delete(k);                                           // lỗi ⇒ không lưu: lần thử sau được xét lại từ đầu
  });
  next();
};

export const idempotent = shared ? shared.idempotent : memory;
