// versioning.js — Chương 4: MỘT bộ route, nhiều phiên bản biểu diễn
import { HttpError } from './http.js';

export const VERSIONS = [1, 2];

// Phiên bản nằm trong URL: /v1/…, /v2/… (LabFlow chọn cách này cho API công khai)
export const inVersion = (v) => (req, res, next) => {
  req.apiVersion = v;
  res.set('LabFlow-Version', String(v));
  next();
};

// Đường KHÔNG có số phiên bản (client cũ từ Chương 1–3): đọc header LabFlow-Version, vắng ⇒ 1
export function fromHeader(req, res, next) {
  const h = req.get('LabFlow-Version') ?? '1';
  if (!VERSIONS.map(String).includes(h))
    throw new HttpError(400, 'UNKNOWN_VERSION', { got: h, known: VERSIONS.join(', ') });
  req.apiVersion = Number(h);
  res.set('LabFlow-Version', h).vary('LabFlow-Version');   // cùng URL, khác header ⇒ khác body: báo cho cache
  next();
}
