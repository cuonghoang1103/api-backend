/**
 * ============================================================
 * `edit_file` KHÔNG KHỚP — NÓI RÕ VÌ SAO, ĐỪNG BẮT ĐOÁN
 * ============================================================
 *
 * Người dùng gửi ảnh 15/09/2026: agent gọi `edit_file` bốn lần liên tiếp, lần
 * nào cũng "không khớp", rồi phải tự chạy `xxd` để đọc từng byte của file mới
 * tìm ra chỗ lệch. Năm sáu lượt gọi cổng cho một lần sửa một dòng.
 *
 * Thông báo cũ chỉ nói "đọc lại rồi chép CHÍNH XÁC (kể cả thụt lề)" — đúng,
 * nhưng vô dụng: agent TƯỞNG mình đã chép chính xác. Thứ nó thiếu không phải
 * lời khuyên mà là **thông tin**: lệch ở đâu, lệch cái gì.
 *
 * Nên khi khớp hụt, ta tự chẩn đoán và trả về ĐOẠN THẬT trên đĩa để agent chép
 * thẳng. Ba nguyên nhân chiếm gần hết số lần hụt:
 *
 *   • TAB ↔ DẤU CÁCH, hoặc số dấu cách thụt lề khác nhau
 *   • CRLF ↔ LF (file do Windows tạo)
 *   • Khoảng trắng thừa ở CUỐI dòng — mắt không thấy được
 *
 * ⚠️ CHỈ BÁO, KHÔNG TỰ SỬA. Khớp gần đúng rồi tự thay là sửa một chỗ người
 * dùng không duyệt; họ bấm duyệt một diff trông hợp lý, còn cái sai nằm ở đoạn
 * không ai nhìn. Ta chỉ đưa đúng chuỗi trên đĩa và để agent gọi lại.
 */

/** Chuẩn hoá để SO SÁNH: bỏ CR, gộp khoảng trắng, bỏ khoảng trắng cuối dòng. */
function chuanHoa(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((d) => d.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n')
    .trim();
}

/** Hiện khoảng trắng vô hình để người (và model) NHÌN thấy chỗ lệch. */
export function hienKhoangTrang(s: string): string {
  return s.replace(/\t/g, '→').replace(/ +$/gm, (m) => '·'.repeat(m.length));
}

export interface KetQuaGanDung {
  /** Đoạn THẬT trên đĩa, nguyên văn — agent chép cái này vào `old_text`. */
  doanThat: string;
  /** Vì sao lệch, nói bằng tiếng người. */
  lyDo: string;
}

/**
 * Tìm đoạn trên đĩa khớp với `can` nếu bỏ qua khác biệt khoảng trắng.
 *
 * Trả `null` khi không tìm được, hoặc khi tìm được NHIỀU HƠN MỘT — nhiều chỗ
 * thì đưa ra một chỗ là đoán hộ, và đoán sai ở đây là sửa nhầm đoạn mã.
 */
export function timGanDung(noiDung: string, can: string): KetQuaGanDung | null {
  const canCh = chuanHoa(can);
  if (!canCh) return null;

  const dong = noiDung.split('\n');
  const soDong = can.replace(/\r\n/g, '\n').split('\n').length;
  /* Quét theo CỬA SỔ đúng bằng số dòng của `old_text`. Quét theo ký tự thì với
     file 2MB là hàng triệu phép so — ở đây mỗi cửa sổ so một lần. */
  const thay: string[] = [];
  for (let i = 0; i + soDong <= dong.length; i += 1) {
    const cua = dong.slice(i, i + soDong).join('\n');
    if (chuanHoa(cua) === canCh) {
      thay.push(cua);
      if (thay.length > 1) return null;   // nhiều chỗ ⇒ không đoán hộ
    }
  }
  if (thay.length !== 1) return null;

  const that = thay[0]!;
  return { doanThat: that, lyDo: doanLyDo(can, that) };
}

/** Đoán nguyên nhân lệch, theo thứ tự hay gặp nhất. */
function doanLyDo(can: string, that: string): string {
  const coTab = (s: string) => s.includes('\t');
  if (coTab(that) && !coTab(can)) return 'file dùng TAB, còn old_text của bạn dùng dấu cách';
  if (coTab(can) && !coTab(that)) return 'file dùng DẤU CÁCH, còn old_text của bạn dùng tab';

  if (that.includes('\r') && !can.includes('\r')) return 'file xuống dòng kiểu Windows (CRLF)';

  const leTrai = (s: string) => (s.split('\n')[0]?.match(/^[ \t]*/)?.[0] ?? '').length;
  if (leTrai(can) !== leTrai(that)) {
    return `thụt lề khác nhau (file ${leTrai(that)} ký tự, old_text ${leTrai(can)})`;
  }

  if (/[ \t]+$/m.test(that) && !/[ \t]+$/m.test(can)) return 'file có khoảng trắng THỪA ở cuối dòng';

  return 'khác nhau ở khoảng trắng';
}
