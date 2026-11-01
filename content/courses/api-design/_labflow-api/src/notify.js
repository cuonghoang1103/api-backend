// notify.js — bài 12.5: thông báo email khi đặt/huỷ phòng.
//   Mặc định (queued): KHÔNG gửi trong request. Sự kiện đi outbox ⇒ relay ⇒ Redis Stream ⇒ worker xếp vào hàng đợi
//   `labflow-notify` (BullMQ) ⇒ gửi, thử lại lùi dần nếu nhà cung cấp hỏng. Request đặt phòng không chờ email.
//   LABFLOW_NOTIFY=sync — CHỈ để so: gửi ngay trong request (thấy độ trễ cộng thêm và lỗi email làm hỏng việc đặt phòng).
import { sendMail, bookingMail } from './mailer.js';

const SYNC = process.env.LABFLOW_NOTIFY === 'sync';
export async function notifySync(req, kind, booking) {
  if (!SYNC) return;
  await req.timing.timeAsync('mail', () => sendMail(bookingMail(kind, booking, req.user)));
}
