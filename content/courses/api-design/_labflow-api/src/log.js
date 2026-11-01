// log.js — bài 12.7: MỖI request một dòng JSON (máy đọc được: lọc theo reqId, route, status bằng jq / Loki / CloudWatch).
//   X-Request-Id: nhận từ proxy nếu hợp lệ, không thì tự sinh; trả lại cho client ⇒ người dùng báo lỗi kèm mã này là tìm ra ngay dòng log.
//   KHÔNG BAO GIỜ ghi: header Authorization, body, mật khẩu, token, email (OWASP Logging Cheat Sheet).
//   LABFLOW_LOG_FORMAT=json (mặc định ở production) | off
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { routeOf } from './metrics.js';

const ON = (process.env.LABFLOW_LOG_FORMAT ?? (config.production ? 'json' : 'off')) === 'json';
export const log = (level, msg, fields = {}) => {
  process.stdout.write(`${JSON.stringify({ time: new Date().toISOString(), level, msg, instance: config.instance ?? undefined, ...fields })}\n`);
};

export function requestLog(req, res, next) {
  const incoming = req.get('X-Request-Id');
  req.id = incoming && /^[\w.-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  res.set('X-Request-Id', req.id);
  if (!ON) return next();
  const t0 = performance.now();
  res.once('finish', () => {
    const route = routeOf(req);
    log(res.statusCode >= 500 ? 'error' : 'info', 'request', { reqId: req.id, method: req.method, path: req.originalUrl.split('?')[0], route,
      status: res.statusCode, ms: Math.round((performance.now() - t0) * 10) / 10, userId: req.user?.id });
  });
  next();
}
