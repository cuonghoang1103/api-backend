// mailer.js — "nhà cung cấp email" GIẢ cho bài 12.5 (không gửi thư thật, không cần khoá API):
//   mỗi thư = một dòng JSON trong MAIL_LOG (mặc định ./tmp/mail.jsonl)
//   MAIL_MS      độ trễ của nhà cung cấp (mặc định 300 ms — cỡ một lời gọi HTTPS ra ngoài)
//   MAIL_DOWN_FILE  tệp này tồn tại ⇒ nhà cung cấp "sập" (tạo/xoá tệp để bật/tắt sự cố mà không phải khởi động lại)
// Nhà cung cấp thật (SES, Resend, Postmark…) nhận Idempotency-Key — ở đây `id` đóng vai đó: gửi lại cùng id ⇒ không thêm thư.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const LOG = process.env.MAIL_LOG ?? 'tmp/mail.jsonl';
const MS = Number(process.env.MAIL_MS ?? 300);
const DOWN = process.env.MAIL_DOWN_FILE ?? 'tmp/mail-down';
mkdirSync(dirname(LOG), { recursive: true });
const sent = new Set(existsSync(LOG) ? readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).id) : []);

export async function sendMail({ id, to, subject }) {
  await new Promise((r) => setTimeout(r, MS));
  if (existsSync(DOWN)) throw new Error('MAIL_PROVIDER_DOWN: 503 từ nhà cung cấp email');
  if (sent.has(id)) return { id, duplicate: true };              // nhà cung cấp tự chống trùng theo khoá
  sent.add(id);
  appendFileSync(LOG, `${JSON.stringify({ at: new Date().toISOString(), id, to, subject })}\n`);
  return { id, duplicate: false };
}

// Thư cho một sự kiện lượt đặt — CHỈ đọc email lúc gửi (sự kiện không chở dữ liệu cá nhân, bài 10.3)
const SUBJECT = {
  created: (b) => `[LabFlow] Đã nhận lượt đặt ${b.id} (${b.labId}, ${b.startAt.slice(0, 16)}Z)`,
  cancelled: (b) => `[LabFlow] Đã huỷ lượt đặt ${b.id}`,
};
export const bookingMail = (kind, b, user) => ({ id: `ntf_${b.id}_v${b.version ?? 1}`, to: user.email, subject: SUBJECT[kind](b) });
export const MAIL_KINDS = Object.keys(SUBJECT);
