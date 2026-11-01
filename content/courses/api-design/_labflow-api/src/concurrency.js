// concurrency.js — bài 5.4: khoá lạc quan bằng ETag + If-Match (RFC 9110 §8.8.3, §13.1.1)
import { HttpError } from './http.js';

// ETag MẠNH theo số phiên bản của bản ghi: đổi nội dung ⇒ tăng version ⇒ đổi ETag
export const etagOf = (r) => `"${r.id}-v${r.version ?? 1}"`;

// If-Match có mặt mà không khớp ⇒ 412: người gửi đang sửa trên một bản cũ
export function checkIfMatch(req, record) {
  const im = req.get('If-Match');
  if (im === undefined) return;                                    // không gửi ⇒ như trước (giữ tương thích v1/v2)
  const ok = im.trim() === '*' || im.split(',').map((s) => s.trim()).includes(etagOf(record));
  if (!ok) throw new HttpError(412, 'PRECONDITION_FAILED', { current: etagOf(record) }, { currentETag: etagOf(record) });
}

// Sau khi ghi: tăng version, trả ETag mới để client sửa tiếp không cần GET lại
export function bump(res, record) {
  record.version = (record.version ?? 1) + 1;
  res.set('ETag', etagOf(record));
}
