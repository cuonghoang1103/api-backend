/**
 * ============================================================
 * TÁCH CÂU ĐỂ ĐỌC VÀ HIỆN THEO NHỊP
 * ============================================================
 *
 * Bong bóng của robot nổi hiện ĐÚNG câu đang được đọc, chứ không đổ cả bài
 * ra một lượt. Lý do không phải thẩm mỹ: cửa sổ robot nhỏ, cả bài dài thì
 * bị chính biên cửa sổ cắt mất — người dùng gửi ảnh chữ cụt hai lần.
 *
 * ⚠️ ĐỪNG TÁCH Ở MỌI DẤU CHẤM. Ba cái bẫy, và cả ba đều xuất hiện trong
 * câu trả lời thật của model:
 *
 *   "3.14"            số thập phân
 *   "Node.js"         tên riêng có chấm
 *   "v.v."            chữ viết tắt
 *
 * Tách nhầm ở đó thì máy đọc phát ra "ba chấm" rồi ngắt, nghe như hỏng.
 * Nên luật là: dấu kết câu phải có KHOẢNG TRẮNG hoặc HẾT CHUỖI ngay sau,
 * và câu phải đủ dài để đáng đọc riêng.
 */

/** Ngắn hơn ngần này thì gộp vào câu trước — "Ừ." đọc riêng nghe rời rạc. */
const NGAN_NHAT = 12;

/**
 * Tách một đoạn trả lời thành các câu để đọc lần lượt.
 *
 * Trả về mảng RỖNG nếu không có gì đọc được. Câu cuối không cần dấu chấm —
 * model hay kết thúc bằng dấu hỏi, dấu than, hoặc chẳng dấu gì.
 */
export function tachCau(tho: string): string[] {
  const chu = (tho ?? '').replace(/\s+/g, ' ').trim();
  if (!chu) return [];

  const ra: string[] = [];
  let dau = 0;
  // Dấu kết câu + (dấu đóng ngoặc tuỳ chọn) + khoảng trắng. Khoảng trắng là
  // thứ phân biệt "hết câu" với "3.14" hay "Node.js".
  const re = /[.!?…]["')\]]?(\s+)/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(chu)) !== null) {
    const het = m.index + m[0].length - m[1]!.length;   // giữ dấu, bỏ khoảng trắng
    const cau = chu.slice(dau, het).trim();
    if (!cau) continue;
    // Câu quá ngắn thì NỐI vào câu trước thay vì đứng riêng.
    if (cau.length < NGAN_NHAT && ra.length) ra[ra.length - 1] += ` ${cau}`;
    else ra.push(cau);
    dau = het + m[1]!.length;
  }

  const con = chu.slice(dau).trim();
  if (con) {
    if (con.length < NGAN_NHAT && ra.length) ra[ra.length - 1] += ` ${con}`;
    else ra.push(con);
  }
  return ra;
}
