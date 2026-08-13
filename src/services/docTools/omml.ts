/**
 * LaTeX → công thức THẬT của Word (OMML).
 * ─────────────────────────────────────────────────────────────────────────
 * Đường đi: LaTeX → MathML (KaTeX) → OMML (mathml2omml) → nhúng vào docx.
 * Kết quả là công thức Word gốc: bấm vào sửa được, phóng to không vỡ, khác
 * hẳn kiểu chụp ảnh công thức rồi dán vào file.
 *
 * HAI CÁI BẪY đã dính khi dựng thử 13/08/2026, đều đã vá ở đây:
 *
 *  1. KaTeX gắn kèm `<semantics><annotation>` chứa lại mã LaTeX gốc.
 *     mathml2omml không hiểu thẻ đó, in ra "Type not supported: annotation"
 *     và bỏ qua — không hỏng file, nhưng làm log bẩn. Cắt trước cho sạch.
 *
 *  2. mathml2omml có chỗ đẻ ra HAI thẻ `<m:argPr>` liền nhau trong cùng một
 *     tham số. Lược đồ của Word chỉ cho phép MỘT. Word gặp cái thứ hai thì
 *     coi là file hỏng và đòi "phục hồi nội dung" — mà lúc đó thì đã muộn,
 *     người dùng đã tải file về rồi. Gộp lại còn một.
 */
import katex from 'katex';
import { mml2omml } from 'mathml2omml';

/** Không có ký hiệu nào trong đời thực dài đến mức này — dài hơn là dấu hiệu
 *  model trả về rác, và nó sẽ làm KaTeX quay lâu vô ích. */
const MAX_TEX = 3000;

export class MathConvertError extends Error {}

/**
 * Một biểu thức LaTeX → chuỗi XML OMML.
 * Ném `MathConvertError` khi không dựng nổi — người gọi quyết định thay bằng
 * chữ thường, chứ ở đây KHÔNG âm thầm nuốt lỗi.
 */
export function texToOmml(tex: string, display = false): string {
  const raw = tex.trim();
  if (!raw) throw new MathConvertError('biểu thức rỗng');
  if (raw.length > MAX_TEX) throw new MathConvertError('biểu thức quá dài');

  let html: string;
  try {
    // `throwOnError: false` để một lệnh lạ không làm hỏng cả trang: KaTeX vẽ
    // nó thành chữ đỏ và đi tiếp, mình vẫn nhận được MathML hợp lệ.
    html = katex.renderToString(raw, { output: 'mathml', displayMode: display, throwOnError: false });
  } catch (e) {
    throw new MathConvertError(`KaTeX không dựng được: ${(e as Error).message}`);
  }

  const khop = html.match(/<math[\s\S]*?<\/math>/);
  if (!khop) throw new MathConvertError('KaTeX không trả về MathML');

  let mathml = khop[0];
  if (!mathml.includes('xmlns')) {
    mathml = mathml.replace('<math', '<math xmlns="http://www.w3.org/1998/Math/MathML"');
  }
  mathml = mathml
    .replace(/<annotation[\s\S]*?<\/annotation>/g, '')
    .replace(/<\/?semantics>/g, '');

  let omml: string;
  try {
    omml = mml2omml(mathml);
  } catch (e) {
    throw new MathConvertError(`mathml2omml hỏng: ${(e as Error).message}`);
  }

  omml = omml.replace(/(<m:argPr>[\s\S]*?<\/m:argPr>)(\s*<m:argPr>[\s\S]*?<\/m:argPr>)+/g, '$1');
  if (!omml.includes('<m:oMath')) throw new MathConvertError('kết quả không phải OMML');
  return omml;
}

/** Một mẩu của dòng: chữ thường hay công thức. */
export interface Manh {
  loai: 'chu' | 'toan';
  noiDung: string;
  display?: boolean;
}

/**
 * Tách một dòng thành các mẩu theo `$...$` / `$$...$$`.
 *
 * `\$` (đô la thật, ví dụ giá tiền trong đề Toán kinh tế) được giữ nguyên chứ
 * không mở đầu một công thức.
 */
export function tachCongThuc(dong: string): Manh[] {
  const ra: Manh[] = [];
  const re = /(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$|(?<!\\)\$([^$\n]+?)(?<!\\)\$/g;
  let cuoi = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(dong))) {
    if (m.index > cuoi) ra.push({ loai: 'chu', noiDung: dong.slice(cuoi, m.index) });
    ra.push({ loai: 'toan', noiDung: (m[1] ?? m[2]).trim(), display: m[1] !== undefined });
    cuoi = re.lastIndex;
  }
  if (cuoi < dong.length) ra.push({ loai: 'chu', noiDung: dong.slice(cuoi) });
  return ra.map((p) => (p.loai === 'chu' ? { ...p, noiDung: p.noiDung.replace(/\\\$/g, '$') } : p));
}

/** Gộp khối `$$...$$` trải nhiều dòng về MỘT dòng — nếu không, bước tách theo
 *  dòng ở dưới sẽ xé đôi công thức. Đã dính đúng lỗi này khi dựng thử. */
export function gopKhoiToan(vanBan: string): string {
  return vanBan.replace(/\$\$([\s\S]*?)\$\$/g, (_, trong: string) => `$$${trong.replace(/\s*\n\s*/g, ' ').trim()}$$`);
}
