// deprecation.js — bài 4.3: báo trước bằng header chuẩn, đo xem AI còn dùng, đến hạn thì 410
import { Router } from 'express';
import { HttpError } from './http.js';
import { requireAuth, requireRole } from './auth.js';

// Đồng hồ giả lập để học (LABFLOW_NOW=2027-05-02T00:00:00Z) — production không đặt biến này
export const now = () => (process.env.LABFLOW_NOW ? Date.parse(process.env.LABFLOW_NOW) : Date.now());

// "GET /bookings · android/1.2.0" ⇒ { count, lastSeen } — ai còn gọi đường cũ, gọi bao nhiêu
export const usage = new Map();

export function deprecate({ since, sunset, docs, successor }) {
  return (req, res, next) => {
    const client = req.get('LabFlow-Client') ?? req.get('User-Agent') ?? 'unknown';
    const route = (req.baseUrl + req.path).replace(/\/[a-z]+_\d+(\/.*)?$/, '');   // /bookings/bk_8/cancel ⇒ /bookings
    const key = `${req.method} ${route} · ${client}`;
    const u = usage.get(key) ?? { count: 0 };
    usage.set(key, { count: u.count + 1, lastSeen: new Date(now()).toISOString() });
    const next_ = successor(req);
    if (now() >= Date.parse(sunset))                                  // quá hạn: không phục vụ nữa, nói rõ đi đâu
      throw new HttpError(410, 'API_SUNSET', { sunset, successor: next_ }, { successor: next_ });
    res.set('Deprecation', `@${Math.floor(Date.parse(since) / 1000)}`);   // RFC 9745: ngày dạng @giây-unix
    res.set('Sunset', new Date(sunset).toUTCString());                    // RFC 8594: HTTP-date, không sớm hơn Deprecation
    res.links({ deprecation: docs, 'successor-version': next_ });        // tài liệu + địa chỉ thay thế
    next();
  };
}

// GET /v1/admin/deprecations — cho người quản lý xem trước khi tắt: còn ai, còn bao nhiêu
export const adminRouter = Router();
adminRouter.get('/deprecations', requireAuth, requireRole('LAB_MANAGER'), (req, res) => {
  const data = [...usage].map(([key, v]) => {
    const [route, client] = key.split(' · ');
    return { route, client, ...v };
  }).sort((a, b) => b.count - a.count);
  res.json({ data });
});
