// resilience.js — bài 8.4: tính sẵn sàng viết VÀO hợp đồng
//   limitInflight(max) — quá max request ĐANG XỬ LÝ cùng lúc ⇒ 503 + Retry-After ngay (bỏ bớt tải thay vì để ai cũng chậm)
//   dependency          — giả lập "CSDL sập" để thấy API suy giảm có kiểm soát (CHỈ để học: bật bằng LABFLOW_CHAOS=1)
import { Router } from 'express';
import { HttpError } from './http.js';

export function limitInflight(max) {
  let inflight = 0;
  return (req, res, next) => {
    if (inflight >= max) {
      res.set('Retry-After', '1');
      throw new HttpError(503, 'OVERLOADED', { max });
    }
    inflight++;
    res.once('close', () => { inflight--; });
    next();
  };
}

export const dependency = { down: false, since: null };
export function requireDependency(req, res, next) {             // việc GHI không có đường lùi ⇒ 503 rõ ràng
  if (!dependency.down) return next();
  res.set('Retry-After', '30');
  throw new HttpError(503, 'DEPENDENCY_DOWN');
}

// Đọc có đường lùi: nhớ bản tốt gần nhất, CSDL sập thì trả bản đó kèm Age + LabFlow-Degraded
export function withLastGood(read) {
  let last = null;
  return (req, res) => {
    if (!dependency.down) { const data = read(req); last = { data, at: Date.now() }; return { data, stale: null }; }
    if (!last) { res.set('Retry-After', '30'); throw new HttpError(503, 'DEPENDENCY_DOWN'); }   // chưa từng đọc được ⇒ hết cách
    return { data: last.data, stale: Math.floor((Date.now() - last.at) / 1000) };
  };
}

export const chaosDbRouter = Router();                           // POST /chaos/db { "down": true|false } — chỉ khi LABFLOW_CHAOS=1
chaosDbRouter.post('/db', (req, res) => {
  dependency.down = Boolean(req.body?.down);
  dependency.since = dependency.down ? new Date().toISOString() : null;
  res.json(dependency);
});
