// resilience.js — bài 8.4: tính sẵn sàng viết VÀO hợp đồng
//   limitInflight(max) — quá max request ĐANG XỬ LÝ cùng lúc ⇒ 503 + Retry-After ngay (bỏ bớt tải thay vì để ai cũng chậm)
//   dependency          — giả lập "CSDL sập" để thấy API suy giảm có kiểm soát (CHỈ để học: bật bằng LABFLOW_CHAOS=1)
// Chương 12: CSDL thật có thể sập thật — withLastGood bắt cả lỗi 503 DEPENDENCY_DOWN do src/pg.js ném ra.
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

// Đọc có đường lùi: nhớ bản tốt gần nhất (theo khoá = URL), CSDL sập thì trả bản đó kèm Age + LabFlow-Degraded
export function withLastGood(read) {
  const last = new Map();
  return async (req, res) => {
    const k = req.originalUrl;
    if (!dependency.down) {
      try {
        const data = await read(req);
        last.set(k, { data, at: Date.now() });
        return { data, stale: null };
      } catch (e) {
        if (e.code !== 'DEPENDENCY_DOWN') throw e;                // chỉ "không tới được CSDL" mới được lùi; lỗi khác vẫn là lỗi
      }
    }
    const hit = last.get(k);
    if (!hit) { const e = new HttpError(503, 'DEPENDENCY_DOWN'); e.retryAfter = 30; throw e; }   // chưa từng đọc được ⇒ hết cách
    return { data: hit.data, stale: Math.floor((Date.now() - hit.at) / 1000) };
  };
}

export const chaosDbRouter = Router();                           // POST /chaos/db { "down": true|false } — chỉ khi LABFLOW_CHAOS=1
chaosDbRouter.post('/db', (req, res) => {
  dependency.down = Boolean(req.body?.down);
  dependency.since = dependency.down ? new Date().toISOString() : null;
  res.json(dependency);
});
