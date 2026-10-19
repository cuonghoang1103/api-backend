/**
 * ============================================================
 * GỢI Ý BƯỚC TIẾP (như prompt suggestion của Claude Code) — đợt 8A, 19/10/2026
 * ============================================================
 *
 * Cuối mỗi lượt có ích, model trả 1–3 việc tiếp theo ngắn. CÁCH LÀM (chọn vì rẻ + ổn định):
 *   • Model tự viết trong CHÍNH lượt đó, ở cuối câu trả lời, trong khối đánh dấu `<goi-y>…</goi-y>` (luật ở prompt hệ
 *     thống — phần ỔN ĐỊNH ⇒ không phá đệm tiền tố). Tốn ~20–40 token ra mỗi lượt, KHÔNG thêm lời gọi, KHÔNG thêm độ
 *     trễ, và gợi ý biết đủ ngữ cảnh (đã đọc gì, sửa gì, thẻ CT Work nào) — một lời gọi rẻ riêng phải gửi lại cả hội
 *     thoại (đắt hơn hẳn với hội thoại dài, và model rẻ đoán kém hơn).
 *   • Máy chủ LỌC khối khỏi luồng chữ (`LocLuongGoiY` — giữ lại phần có thể là đầu thẻ cho tới khi chắc) và khỏi tin
 *     assistant lưu vào hội thoại (`tachGoiY`), rồi gửi riêng trong khung `done` (`goiY: string[]`). App cũ bỏ qua trường
 *     lạ ⇒ không bao giờ thấy chữ thô.
 * File THUẦN.
 */

export const THE_MO = '<goi-y>';
export const THE_DONG = '</goi-y>';
const TOI_DA = 3;
const DAI_TOI_DA = 120;

/** Luật cho prompt hệ thống (song ngữ theo người dùng — model trả cùng ngôn ngữ). Chỉ lượt CHÍNH. */
export const LUAT_GOI_Y = `GỢI Ý BƯỚC TIẾP (ẩn với người dùng — app hiện thành chữ mờ trong ô nhập + nút bấm):
Khi KẾT THÚC lượt bằng câu trả lời cuối (không gọi tool nữa) VÀ có việc tiếp theo hợp lý, thêm ở CUỐI CÙNG đúng một khối:
${THE_MO}
câu gợi ý 1
câu gợi ý 2
${THE_DONG}
- 1–3 dòng; mỗi dòng là một câu NGƯỜI DÙNG có thể gửi lại nguyên văn cho bạn (mệnh lệnh ngắn ≤ 60 ký tự, cùng ngôn ngữ người dùng đang dùng, không đánh số, không markdown, không dấu ngoặc kép). Dòng đầu = việc nên làm nhất.
- Phiên gắn dự án CT Work ⇒ ưu tiên việc CT Work cụ thể: chuyển trạng thái thẻ (vd "Chuyển LF-18 sang Review"), bình luận bằng chứng, log giờ, đọc tài liệu dự án, hỏi trưởng nhóm.
- Chỉ chào hỏi / trả lời xong không còn việc gì / đang hỏi lại người dùng ⇒ KHÔNG thêm khối. Không nhắc tới khối này trong câu trả lời.`;

/** Lọc một dòng gợi ý: bỏ gạch đầu dòng/số/ngoặc, cắt dài, bỏ rỗng. */
function sachDong(s: string): string {
  return s.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["“'`]+|["”'`]+$/g, '').replace(/\s+/g, ' ').trim().slice(0, DAI_TOI_DA);
}

/**
 * Tách khối gợi ý khỏi câu trả lời. Khối thiếu thẻ đóng (bị cắt) vẫn nhận. Thẻ lạc giữa câu (model nhắc tới nó) không
 * nằm cuối ⇒ vẫn cắt từ thẻ mở trở đi (phần sau thẻ mở không bao giờ hiện cho người dùng — cùng luật với bộ lọc luồng).
 */
export function tachGoiY(text: string): { chu: string; goiY: string[] } {
  const i = text.lastIndexOf(THE_MO);
  if (i < 0) return { chu: text, goiY: [] };
  const sau = text.slice(i + THE_MO.length);
  const j = sau.indexOf(THE_DONG);
  const than = j >= 0 ? sau.slice(0, j) : sau;
  const goiY = [...new Set(than.split('\n').map(sachDong).filter((x) => x.length >= 2))].slice(0, TOI_DA);
  return { chu: text.slice(0, i).replace(/\s+$/, ''), goiY };
}

/**
 * Lọc LUỒNG chữ: chữ thường đi qua ngay; phần đuôi CÓ THỂ là đầu `<goi-y>` được giữ lại tới khi chắc; gặp thẻ mở ⇒
 * nuốt mọi thứ sau đó (khối nằm cuối câu trả lời). Mỗi lời gọi cổng dùng MỘT bộ lọc mới.
 */
export class LocLuongGoiY {
  private giu = '';
  private daGapThe = false;

  /** Nhận một mẩu, trả phần được phép hiện ngay ('' = chưa hiện gì). */
  day(manh: string): string {
    if (this.daGapThe) return '';
    const tong = this.giu + manh;
    const i = tong.indexOf(THE_MO);
    if (i >= 0) {
      this.daGapThe = true;
      this.giu = '';
      return tong.slice(0, i).replace(/\s+$/, '');
    }
    /* Giữ phần đuôi dài nhất là tiền tố của thẻ mở. */
    let k = Math.min(THE_MO.length - 1, tong.length);
    for (; k > 0; k--) if (THE_MO.startsWith(tong.slice(-k))) break;
    /* Giữ cả khoảng trắng ngay trước đó — khối nằm sau "\n\n", không để dòng trống thừa lọt ra cuối câu trả lời. */
    let cat = tong.length - k;
    while (cat > 0 && /\s/.test(tong[cat - 1]!)) cat--;
    this.giu = tong.slice(cat);
    return tong.slice(0, cat);
  }

  /** Hết luồng: trả phần còn giữ (nếu hoá ra không phải thẻ). */
  xong(): string {
    if (this.daGapThe) return '';
    const g = this.giu;
    this.giu = '';
    /* Hết luồng mà không có khối: nhả đuôi đang giữ, trừ khoảng trắng cuối (vô hại, khớp `tachGoiY`). */
    return /^\s*$/.test(g) ? '' : g;
  }
}
