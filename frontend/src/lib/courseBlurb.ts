/**
 * Tách `whatYouLearn` / `requirements` của một khoá thành danh sách gạch đầu dòng.
 *
 * ⚠️ Vì sao không chỉ `split('\n')`: đo thật 19/09/2026 trên `content/academy/`,
 * **545 / 573 môn** viết cả đoạn trên MỘT dòng, ngăn nhau bằng dấu `;` — đó là
 * lối viết mặc định của mọi spec Academy. Tách theo `\n` thì ra đúng **một** mục
 * dài 400–970 ký tự, và lưới `md:grid-cols-2` nhét nguyên khối đó vào cột trái
 * rồi bỏ trống cột phải: một cột chữ hẹp, cao ngoằng, không ngắt ý. Sinh viên
 * phản ánh "khó nhìn, không chuyên nghiệp" — và họ đúng.
 *
 * Nên tách theo CẢ ba kiểu ngăn cách người viết thật sự dùng: xuống dòng,
 * dấu `;`, và ký tự bullet. KHÔNG tách theo `.` hay `,` — chúng nằm giữa câu
 * ("bù 2, dấu phẩy động IEEE 754") nên tách ra sẽ vụn vô nghĩa.
 *
 * ⚠️ Và phải BỎ QUA dấu `;` nằm TRONG ngoặc: nhiều môn viết
 * "kiến trúc (API gateway; service mesh)" — tách thẳng bằng regex thì đẻ ra
 * mẩu cụt "gateway" đứng riêng một gạch đầu dòng (đo thật: 70 mẩu như vậy).
 */

/** Một mục dài hơn chừng này thì hai cột sẽ làm dòng chữ hẹp lại, khó đọc. */
const DAI_TOI_DA = 220;

/**
 * Giải mã thực thể HTML. **153/573 môn** lưu `&amp;` nguyên văn trong
 * `whatYouLearn`/`requirements`, mà chỗ hiển thị render dạng TEXT (React tự
 * escape) ⇒ người học đọc được đúng chuỗi "&amp;" trên màn hình. Chỉ nhận
 * đúng các thực thể an toàn — KHÔNG dùng innerHTML ở đây.
 */
const THUC_THE: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…',
};

export function giaiMaThucThe(s: string): string {
  return s.replace(/&(#\d{1,6}|#x[0-9a-fA-F]{1,6}|[a-zA-Z][a-zA-Z0-9]{1,30});/g, (nguyen, ten: string) => {
    if (ten.startsWith('#x') || ten.startsWith('#X')) {
      const m = Number.parseInt(ten.slice(2), 16);
      return Number.isFinite(m) && m > 0 && m < 0x110000 ? String.fromCodePoint(m) : nguyen;
    }
    if (ten.startsWith('#')) {
      const m = Number.parseInt(ten.slice(1), 10);
      return Number.isFinite(m) && m > 0 && m < 0x110000 ? String.fromCodePoint(m) : nguyen;
    }
    return THUC_THE[ten.toLowerCase()] ?? nguyen;
  });
}

/**
 * Cắt theo `;` và bullet — nhưng BỎ QUA dấu `;` ở hai chỗ:
 *  1. bên trong ngoặc: "kiến trúc (API gateway; service mesh)"
 *  2. dấu `;` ĐÓNG một thực thể HTML: `&amp;` `&lt;` `&#39;` `&nbsp;`.
 *     Đây mới là thủ phạm chính — đo thật: **69 mẩu vụn** kiểu `"rơ le"`,
 *     `"gateway"` đều sinh ra từ việc cắt đôi `&amp;` thành `&amp` + phần sau.
 */
function catNgoaiNgoac(line: string): string[] {
  const out: string[] = [];
  let buf = '';
  let sau = 0; // độ sâu ngoặc

  for (const ch of line) {
    if (ch === '(' || ch === '[' || ch === '{') sau++;
    else if (ch === ')' || ch === ']' || ch === '}') sau = Math.max(0, sau - 1);

    // `;` này có đang đóng một thực thể HTML mở dở trong buf không?
    const dongThucThe = ch === ';' && /&(?:#\d{1,6}|#x[0-9a-fA-F]{1,6}|[a-zA-Z][a-zA-Z0-9]{1,30})$/.test(buf);

    if (sau === 0 && !dongThucThe && (ch === ';' || ch === '•')) {
      out.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  out.push(buf);
  return out;
}

export function tachGachDauDong(value: string | null | undefined): string[] {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(/\r?\n/)
    .flatMap(catNgoaiNgoac)
    // ⚠️ trim() phải chạy TRƯỚC: mẩu cắt ra luôn có dấu cách đầu (" và AI/ML…"),
    //    nên neo `^` không khớp nếu bóc tiền tố trước khi trim.
    .map((s) =>
      s
        .trim()
        .replace(/^[-–—•*·]\s*/, '') // ký tự gạch đầu dòng người viết gõ tay
        .replace(/^(và|and|hoặc|or)\s+/i, '') // mục cuối hay bắt đầu bằng "và ..."
        .replace(/[.;,\s]+$/, '') // bỏ dấu câu thừa ở cuối
        .trim(),
    )
    // Giải mã SAU khi cắt: `&amp;` chứa dấu `;`, giải mã trước sẽ làm
    // catNgoaiNgoac() không còn nhận ra đó là thực thể.
    .map(giaiMaThucThe)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

/**
 * true khi danh sách nên xếp MỘT cột: mục dài thì hai cột làm dòng chữ hẹp
 * lại, đúng cái làm trang CSI106 khó đọc.
 */
export function nenMotCot(items: string[]): boolean {
  if (items.length <= 1) return true;
  return items.some((s) => s.length > DAI_TOI_DA);
}
