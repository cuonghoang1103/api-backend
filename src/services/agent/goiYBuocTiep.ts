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
 * KHI NÀO `<goi-y>` LÀ KHỐI GỢI Ý (QA 9.2, 19/10/2026 — bản đầu cắt MỌI thứ từ thẻ mở trở đi, và luồng cắt ở thẻ ĐẦU còn
 * hội thoại lưu cắt ở thẻ CUỐI): thẻ phải (a) ở ĐẦU DÒNG (trước nó chỉ có khoảng trắng) hoặc ngay sau nó là xuống dòng,
 * và (b) KHÔNG nằm trong khối mã ``` / ~~~. Nhờ vậy model in mã có chuỗi `'<goi-y>'` (repo này!) hay nhắc tới thẻ giữa
 * câu thì chữ không bị nuốt. Thẻ đóng `</goi-y>` kết thúc khối — chữ SAU khối (model đặt khối giữa câu trả lời) vẫn hiện.
 * Thiếu thẻ đóng (bị cắt) ⇒ khối tới hết. Nhiều khối ⇒ gỡ hết, gợi ý lấy từ khối có nội dung cuối cùng.
 * Luồng (`LocLuongGoiY`) và hội thoại lưu (`tachGoiY`) dùng CHUNG một máy trạng thái ⇒ không bao giờ lệch nhau.
 */
const RAO = /^\s*(```|~~~)/;

/**
 * Lọc LUỒNG chữ: chữ thường đi qua ngay; phần đuôi CÓ THỂ là đầu thẻ (hoặc khoảng trắng ngay trước nó) được giữ lại
 * tới khi chắc; khối gợi ý bị nuốt và gom lại. Mỗi lời gọi cổng dùng MỘT bộ lọc mới.
 */
export class LocLuongGoiY {
  private giu = '';
  private trongKhoi = false;
  private than = '';
  private dong = '';
  private trongRao = false;
  private daCoKhoi = false;
  private goiYCuoi: string[] = [];

  /** Đã gặp ít nhất một khối gợi ý. */
  get coKhoi(): boolean { return this.daCoKhoi; }
  /** Gợi ý của khối (có nội dung) cuối cùng. */
  get goiY(): string[] { return this.goiYCuoi; }

  /** Ghi nhận chữ đã nhả để biết đang ở đầu dòng / trong khối mã. */
  private nha(t: string): string {
    for (const c of t) {
      if (c === '\n') { if (RAO.test(this.dong)) this.trongRao = !this.trongRao; this.dong = ''; } else this.dong += c;
    }
    return t;
  }

  private dongKhoi(): void {
    const ds = [...new Set(this.than.split('\n').map(sachDong).filter((x) => x.length >= 2))].slice(0, TOI_DA);
    if (ds.length) this.goiYCuoi = ds;
    this.than = '';
    this.trongKhoi = false;
  }

  private chay(cuoi: boolean): string {
    let ra = '';
    for (;;) {
      if (this.trongKhoi) {
        const j = this.giu.indexOf(THE_DONG);
        if (j >= 0) {
          this.than += this.giu.slice(0, j);
          this.giu = this.giu.slice(j + THE_DONG.length);
          this.dongKhoi();
          continue;
        }
        if (cuoi) { this.than += this.giu; this.giu = ''; this.dongKhoi(); return ra; }
        let k = Math.min(THE_DONG.length - 1, this.giu.length);
        for (; k > 0; k--) if (THE_DONG.startsWith(this.giu.slice(-k))) break;
        this.than += this.giu.slice(0, this.giu.length - k);
        this.giu = this.giu.slice(this.giu.length - k);
        return ra;
      }
      const i = this.giu.indexOf(THE_MO);
      if (i >= 0) {
        const truoc = this.giu.slice(0, i);
        const sau = this.giu[i + THE_MO.length];
        if (sau === undefined && !cuoi) {
          /* Chưa biết ký tự kế tiếp — nhả phần chắc chắn trước thẻ (trừ khoảng trắng cuối), giữ lại phần còn lại. */
          let cat = i;
          while (cat > 0 && /\s/.test(this.giu[cat - 1]!)) cat--;
          ra += this.nha(this.giu.slice(0, cat));
          this.giu = this.giu.slice(cat);
          return ra;
        }
        const nl = truoc.lastIndexOf('\n');
        const dongHienTai = nl >= 0 ? truoc.slice(nl + 1) : this.dong + truoc;
        let raoTai = this.trongRao;
        if (nl >= 0) { const tam = this.dong + truoc.slice(0, nl + 1); let d = ''; for (const c of tam) { if (c === '\n') { if (RAO.test(d)) raoTai = !raoTai; d = ''; } else d += c; } }
        const laKhoi = !raoTai && (/^\s*$/.test(dongHienTai) || sau === '\n' || sau === '\r' || sau === undefined);
        if (laKhoi) {
          ra += this.nha(truoc.replace(/\s+$/, ''));
          this.dong = '';
          this.giu = this.giu.slice(i + THE_MO.length);
          this.trongKhoi = true;
          this.daCoKhoi = true;
          continue;
        }
        ra += this.nha(this.giu.slice(0, i + THE_MO.length));
        this.giu = this.giu.slice(i + THE_MO.length);
        continue;
      }
      if (cuoi) {
        /* Hết luồng: nhả phần còn giữ, trừ khoảng trắng cuối (vô hại, khớp `tachGoiY`). */
        const g = this.giu; this.giu = '';
        if (!/^\s*$/.test(g)) ra += this.nha(g);
        return ra;
      }
      /* Giữ phần đuôi dài nhất là tiền tố của thẻ mở + khoảng trắng ngay trước đó. */
      let k = Math.min(THE_MO.length - 1, this.giu.length);
      for (; k > 0; k--) if (THE_MO.startsWith(this.giu.slice(-k))) break;
      let cat = this.giu.length - k;
      while (cat > 0 && /\s/.test(this.giu[cat - 1]!)) cat--;
      ra += this.nha(this.giu.slice(0, cat));
      this.giu = this.giu.slice(cat);
      return ra;
    }
  }

  /** Nhận một mẩu, trả phần được phép hiện ngay ('' = chưa hiện gì). */
  day(manh: string): string {
    this.giu += manh;
    return this.chay(false);
  }

  /** Hết luồng: trả phần còn giữ (nếu hoá ra không phải thẻ). */
  xong(): string {
    return this.chay(true);
  }
}

/** Tách khối gợi ý khỏi câu trả lời ĐẦY ĐỦ (hội thoại lưu) — cùng máy trạng thái với luồng. */
export function tachGoiY(text: string): { chu: string; goiY: string[] } {
  const l = new LocLuongGoiY();
  const chu = l.day(text) + l.xong();
  if (!l.coKhoi) return { chu: text, goiY: [] };
  return { chu: chu.replace(/\s+$/, ''), goiY: l.goiY };
}
