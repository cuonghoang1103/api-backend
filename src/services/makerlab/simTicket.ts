/**
 * ============================================================
 * VÉ MÔ PHỎNG — cho trình duyệt nối vào cổng thiết bị
 * ============================================================
 *
 * Trang mô phỏng robot giả làm một thiết bị thật: nó nói đúng giao
 * thức trong `device.gateway.ts`, nên mọi thứ chạy qua nó đều là đường
 * thật — cùng LLM, cùng TTS, cùng gác từ đánh thức. Không có nhánh
 * "nếu là mô phỏng thì..." nào ở phía server, và đó là điều làm nó
 * đáng tin: thứ chạy được trên mô phỏng thì chạy được trên bo.
 *
 * ⚠️ VÌ SAO CẦN VÉ, KHÔNG DÙNG THẲNG KEY + SECRET.
 *
 * `WebSocket` của trình duyệt KHÔNG đặt được header — đó là giới hạn
 * của chính API, không phải thiếu sót của ta. Bo ESP32 gửi
 * `X-Device-Key` / `X-Device-Secret` như bình thường; trình duyệt thì
 * không có cách nào.
 *
 * Đường còn lại là query string, mà `authenticateDevice()` đã chép
 * nguyên một khối cảnh báo về việc đó: đường dẫn đầy đủ nằm lại trong
 * nhật ký nginx hàng tháng, trong lịch sử trình duyệt, trong header
 * Referer, và ở mọi proxy trên đường đi. Ném `secret` vĩnh viễn của
 * thiết bị vào đó là hỏng hẳn — secret ấy dùng được mãi cho tới khi
 * có người xoay lại bằng tay.
 *
 * Vé thì khác về BẢN CHẤT, không phải về mức độ:
 *
 *   - sống 60 giây
 *   - dùng ĐÚNG MỘT LẦN, tiêu ngay lúc nối
 *   - không suy ra được secret từ nó
 *   - chỉ người CHỦ thiết bị xin được, qua REST đã xác thực
 *
 * Nên kể cả khi nó nằm lại trong log nginx, thứ nằm đó đã hết hạn và
 * đã bị tiêu trước khi ai kịp đọc.
 *
 * ⚠️ CỐ Ý ĐỂ TRONG BỘ NHỚ, KHÔNG VÀO DB.
 *
 * Vé sống 60 giây thì mất khi khởi động lại tiến trình là ĐÚNG — người
 * dùng bấm nối lại là có vé mới. Đưa vào Postgres chỉ tạo ra rác phải
 * dọn, một bảng phải migrate, và một cách nữa để deploy hỏng. Đây cũng
 * là lý do nó không chịu được nhiều tiến trình: nếu sau này chạy nhiều
 * bản backend sau load balancer thì phải chuyển sang Redis, vì vé phát
 * ở tiến trình A sẽ không tiêu được ở tiến trình B.
 */

import { randomBytes } from 'crypto';

export interface VeMoPhong {
  deviceId: number;
  projectId: number;
  ownerId: number;
  deviceKey: string;
  hetHanLuc: number;
}

/** 60 giây: đủ cho một cú bấm nút → mở WebSocket, không đủ để ai lục log. */
const SONG_MS = 60_000;

/** Chặn trên phòng trường hợp có ai gọi API phát vé trong vòng lặp. */
const TOI_DA = 200;

const kho = new Map<string, VeMoPhong>();

/** Dọn vé quá hạn. Gọi mỗi lần phát — kho nhỏ nên quét thẳng là đủ. */
function don(): void {
  const now = Date.now();
  for (const [ma, ve] of kho) if (ve.hetHanLuc <= now) kho.delete(ma);
}

/**
 * Phát một vé mới. Người gọi PHẢI kiểm quyền sở hữu thiết bị trước —
 * hàm này không biết gì về người dùng, nó chỉ ký nhận thứ đã được duyệt.
 */
export function phatVe(d: Omit<VeMoPhong, 'hetHanLuc'>): { ticket: string; expiresInMs: number } {
  don();
  if (kho.size >= TOI_DA) {
    // Vứt cái cũ nhất thay vì từ chối: vé sống 60 giây nên "cũ nhất"
    // gần như chắc chắn là vé bỏ đi, còn từ chối thì người dùng thấy
    // một lỗi không giải thích được.
    const dauTien = kho.keys().next();
    if (!dauTien.done) kho.delete(dauTien.value);
  }
  const ticket = randomBytes(32).toString('hex');
  kho.set(ticket, { ...d, hetHanLuc: Date.now() + SONG_MS });
  return { ticket, expiresInMs: SONG_MS };
}

/**
 * Tiêu vé. Trả `null` nếu không có, đã hết hạn, hoặc đã dùng rồi.
 *
 * Xoá TRƯỚC khi kiểm hạn, để một vé hết hạn cũng bị dọn luôn thay vì
 * nằm lại chờ `don()`.
 */
export function tieuVe(ticket: string): VeMoPhong | null {
  const ve = kho.get(ticket);
  if (!ve) return null;
  kho.delete(ticket);
  if (ve.hetHanLuc <= Date.now()) return null;
  return ve;
}
