// httpCache.js — bài 9.1: cache HTTP cho API
//   versions: mỗi bộ sưu tập một số phiên bản; lệnh ghi nào cũng bump() ⇒ ETag của mọi trang danh sách đổi theo
//   notModifiedEarly: so If-None-Match TRƯỚC khi chạy truy vấn ⇒ 304 không tốn công (Express tự 304 chỉ SAU khi đã dựng body)
//   LABFLOW_HTTP_CACHE=express ⇒ tắt bước sớm, để Express tự lo (để đo so sánh)
import { createHash } from 'node:crypto';

export const versions = { bookings: 0, labs: 0 };
export const bump = (name) => { versions[name]++; };

const short = (s) => createHash('sha256').update(s).digest('base64url').slice(0, 16);

// ETag mạnh: phiên bản bộ sưu tập + ai hỏi + hỏi gì (URL, phiên bản API, ngôn ngữ) — khác bất kỳ cái nào ⇒ ETag khác
export const listEtag = (name, req) =>
  `"${name}-v${versions[name]}-${short(`${req.user?.id ?? '-'}|${req.apiVersion}|${req.get('Accept-Language') ?? ''}|${req.originalUrl}`)}"`;

export function notModifiedEarly(name, cacheControl) {
  return (req, res, next) => {
    const tag = listEtag(name, req);
    res.set('Cache-Control', cacheControl()).set('ETag', tag);
    if (process.env.LABFLOW_HTTP_CACHE === 'express') { res.removeHeader('ETag'); return next(); }
    const inm = req.get('If-None-Match');
    if (inm && inm.split(',').map((s) => s.trim().replace(/^W\//, '')).includes(tag)) return res.status(304).end();
    next();
  };
}
