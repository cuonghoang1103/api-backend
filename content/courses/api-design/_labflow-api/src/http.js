// http.js — lỗi chỉ mang MÃ + THAM SỐ; câu chữ (vi/en) được dựng ở problems.js lúc trả lời
export class HttpError extends Error {
  constructor(status, code, params = {}, more) {
    super(code);
    this.status = status;   // mã HTTP: 400, 404, 409…
    this.code = code;       // mã máy đọc: 'BOOKING_CONFLICT'
    this.params = params;   // dữ liệu của lần lỗi này: { id: 'lab_9' }
    this.more = more;       // tuỳ chọn: mảng lỗi từng trường, HOẶC object thành viên mở rộng
  }
}

// Route có thật nhưng sai phương thức ⇒ 405 + header Allow
export const onlyAllow = (...methods) => (req, res) => {
  res.set('Allow', methods.join(', '));
  if (req.method === 'OPTIONS') return res.status(204).end();
  throw new HttpError(405, 'METHOD_NOT_ALLOWED', { method: req.method, path: req.baseUrl + req.path });
};
