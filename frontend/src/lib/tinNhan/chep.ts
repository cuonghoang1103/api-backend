/**
 * ============================================================
 * CHÉP TIN NHẮN
 * ============================================================
 *
 * Dùng CHUNG cho web và app desktop — bong bóng tin nhắn ở hai nơi là hai cây
 * mã khác nhau, nhưng "chép cái gì ra clipboard" thì phải giống hệt. Tách ra
 * đây để nó không trôi làm hai kiểu.
 *
 * ─── Vì sao cần nút chép, trong khi bôi đen vẫn chép được ───
 * Bôi đen một bong bóng là kéo từ trên xuống dưới qua một khối bo góc có
 * padding; kéo trượt một chút là dính giờ gửi, dính tên người, hoặc thiếu mất
 * dòng cuối. Người dùng báo đúng chuyện đó: "nhiều lúc còn thiếu và sai".
 */

export interface TinDeChep {
  content?: string | null;
  mediaUrl?: string | null;
  createdAt: string;
  senderId: number;
  recalled?: boolean;
  deleted?: boolean;
}

/** Nhãn thay cho một tin chỉ có ảnh, khi chép nhiều tin. */
export const NHAN_ANH = '[ảnh]';

/**
 * Chữ của MỘT tin nhắn. Chuỗi rỗng = không có gì để chép (⇒ ẩn/khoá nút Chép).
 *
 * ⚠️ Tin ĐÃ THU HỒI hoặc ĐÃ XOÁ trả về rỗng, kể cả khi `content` vẫn còn nằm
 * trong dữ liệu máy chủ gửi xuống. Người gửi đã rút lại câu đó; chép nó ra là
 * đi ngược đúng điều họ vừa yêu cầu, và giao diện thì đang hiện "đã thu hồi"
 * nên người chép cũng không ngờ mình vừa lấy được nội dung thật.
 */
export function chuMotTin(t: TinDeChep): string {
  if (t.recalled || t.deleted) return '';
  return (t.content ?? '').trim();
}

/** Có gì để chép không — dùng cho việc bật/tắt nút. */
export function chepDuoc(t: TinDeChep): boolean {
  return chuMotTin(t) !== '';
}

/** `"2026-09-14T10:05:00Z"` → `"10:05"` theo giờ MÁY NGƯỜI DÙNG. */
export function gioNgan(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Chép NHIỀU tin thành một đoạn hội thoại đọc được.
 *
 *     An · 10:05
 *     câu đầu
 *
 *     Bình · 10:06
 *     câu trả lời
 *
 * ⚠️ Tin đã thu hồi bị BỎ HẲN khỏi đoạn chép, không để lại dòng trống hay
 * dòng "[đã thu hồi]" — xem lý do ở `chuMotTin`.
 *
 * ⚠️ Tin chỉ có ảnh KHÔNG bị bỏ, mà thành `[ảnh]`. Bỏ hẳn thì đoạn hội thoại
 * chép ra mất nhịp: hai câu nói về một tấm ảnh bỗng đứng cạnh nhau mà không
 * còn gì ở giữa, và người đọc lại tưởng mình chép thiếu.
 *
 * Tên người gửi do bên gọi cấp (`ten`) vì web và desktop lấy tên ở hai chỗ
 * khác nhau.
 */
export function chuNhieuTin(
  ds: TinDeChep[],
  ten: (senderId: number) => string,
): string {
  const khoi: string[] = [];
  for (const t of ds) {
    if (t.recalled || t.deleted) continue;
    const than = chuMotTin(t) || (t.mediaUrl ? NHAN_ANH : '');
    if (than === '') continue;
    const dau = `${ten(t.senderId)} · ${gioNgan(t.createdAt)}`.trim();
    khoi.push(dau === '·' ? than : `${dau}\n${than}`);
  }
  return khoi.join('\n\n');
}
