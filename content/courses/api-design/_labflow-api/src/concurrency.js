// concurrency.js — bài 5.4: khoá lạc quan bằng ETag + If-Match (RFC 9110 §8.8.3, §13.1.1)
import { HttpError } from './http.js';

// ETag MẠNH theo số phiên bản của bản ghi: đổi nội dung ⇒ tăng version ⇒ đổi ETag
export const etagOf = (r) => `"${r.id}-v${r.version ?? 1}"`;
export const preconditionFailed = (record) =>
  new HttpError(412, 'PRECONDITION_FAILED', { current: etagOf(record) }, { currentETag: etagOf(record) });

// If-Match có mặt mà không khớp ⇒ 412: người gửi đang sửa trên một bản cũ
export function checkIfMatch(req, record) {
  const im = req.get('If-Match');
  if (im === undefined) return;                                    // không gửi ⇒ như trước (giữ tương thích v1/v2)
  const ok = im.trim() === '*' || im.split(',').map((s) => s.trim()).includes(etagOf(record));
  if (!ok) throw preconditionFailed(record);
}

// Bài 12.4: như checkIfMatch, và trả version client đã thấy để store ghi CÓ ĐIỀU KIỆN (UPDATE … WHERE version = n).
// Không gửi If-Match ⇒ undefined (ghi đè như trước — giữ tương thích).
export function ifMatchVersion(req, record) {
  checkIfMatch(req, record);
  return req.get('If-Match') === undefined || req.get('If-Match').trim() === '*' ? undefined : (record.version ?? 1);
}
