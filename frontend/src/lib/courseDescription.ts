/**
 * Chia `course.description` thành các khối đọc được.
 *
 * ⚠️ Vì sao cần: đo thật 19/09/2026 trên `content/academy/` —
 *   · **495 / 573 môn** có mô tả >500 ký tự mà **không một lần xuống dòng**;
 *   · **404 môn** nhồi một chuỗi lộ trình `A → B → C → …` (tới 13 mắt xích)
 *     vào giữa câu;
 *   · **266 môn** in đậm ≥10 cụm, đọc như đang hét.
 * Chỗ hiển thị đổ thẳng chuỗi đó vào `dangerouslySetInnerHTML` ⇒ một khối chữ
 * đặc, không ngắt ý. Sinh viên phản ánh "khó nhìn, không chuyên nghiệp".
 *
 * Hàm này KHÔNG viết lại nội dung — nó chỉ **nhận ra cấu trúc vốn có**: câu
 * dẫn, chuỗi lộ trình, câu kết; rồi trả về từng khối để chỗ hiển thị dựng
 * đoạn văn và dãy thẻ bước. Bất biến bắt buộc: **không mất chữ nào**.
 */

import { giaiMaThucThe, hoaChuDau } from './courseBlurb';

export type KhoiMoTa =
  | { loai: 'doan'; html: string }
  | { loai: 'chuoi'; buoc: string[] };

/** Bao nhiêu mũi tên thì coi là một chuỗi lộ trình chứ không phải câu văn. */
const TOI_THIEU_MUI_TEN = 3;
/** Gộp câu vào cùng một đoạn tới chừng này ký tự. */
const DOAN_TOI_DA = 260;

const boThe = (s: string) => s.replace(/<[^>]*>/g, '');

/** Cắt theo ". " nhưng bỏ qua dấu chấm nằm TRONG thẻ HTML. */
function catCau(html: string): string[] {
  const out: string[] = [];
  let buf = '';
  let trongThe = false;
  for (let i = 0; i < html.length; i++) {
    const ch = html[i];
    if (ch === '<') trongThe = true;
    else if (ch === '>') trongThe = false;
    buf += ch;
    if (trongThe || ch !== '.') continue;
    // Chỉ ngắt khi sau dấu chấm là khoảng trắng rồi tới chữ HOA / thẻ mở.
    const sau = html.slice(i + 1);
    if (/^\s+(?:<[^>]*>)*[A-ZĐÀ-Ỹ]/.test(sau)) {
      out.push(buf);
      buf = '';
    }
  }
  if (buf.trim()) out.push(buf);
  return out.map((s) => s.trim()).filter(Boolean);
}

export function phanTichMoTa(html: string | null | undefined): KhoiMoTa[] {
  if (!html || typeof html !== 'string') return [];
  const cau = catCau(html);
  const khoi: KhoiMoTa[] = [];
  let dem: string[] = [];

  const xaDem = () => {
    if (!dem.length) return;
    khoi.push({ loai: 'doan', html: dem.join(' ') });
    dem = [];
  };

  for (const c of cau) {
    const soMuiTen = (c.match(/→|->/g) || []).length;
    if (soMuiTen < TOI_THIEU_MUI_TEN) {
      dem.push(c);
      // Đoạn đủ dài thì xuống dòng, đừng dồn cả bài vào một khối.
      if (dem.join(' ').length >= DOAN_TOI_DA) xaDem();
      continue;
    }

    // Câu này là chuỗi lộ trình. Phần dẫn trước dấu ":" cuối cùng (nếu nằm
    // TRƯỚC mũi tên đầu tiên) là câu văn thật, tách ra làm đoạn riêng.
    const viTriMuiTen = c.search(/→|->/);
    const viTriHaiCham = c.lastIndexOf(':', viTriMuiTen);
    let phanChuoi = c;
    if (viTriHaiCham > 0) {
      const dan = c.slice(0, viTriHaiCham + 1).trim();
      if (boThe(dan).trim().length > 3) dem.push(dan);
      phanChuoi = c.slice(viTriHaiCham + 1);
    }
    xaDem();

    const buoc = phanChuoi
      .split(/→|->/)
      // Bước hiển thị dạng TEXT nên phải tự giải mã `&amp;` — 460 môn lưu
      // thực thể HTML nguyên văn, để nguyên là người học đọc thấy "&amp;".
      .map((s) => hoaChuDau(giaiMaThucThe(boThe(s)).replace(/^[\s.,;]+|[\s.,;]+$/g, '').trim()))
      .filter((s) => s.length > 0);

    if (buoc.length >= TOI_THIEU_MUI_TEN) khoi.push({ loai: 'chuoi', buoc });
    else dem.push(c); // không tách được thì trả về nguyên câu, không mất chữ
  }
  xaDem();
  return khoi;
}

/** Chữ thuần của kết quả — dùng để nghiệm thu "không mất chữ nào". */
export function chuThuan(khoi: KhoiMoTa[]): string {
  return khoi
    .map((k) => (k.loai === 'doan' ? boThe(k.html) : k.buoc.join(' ')))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
