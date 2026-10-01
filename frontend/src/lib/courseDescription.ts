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
  | { loai: 'chuoi'; buoc: string[] }
  /** Mẩu "Lịch sử từ … (2024)" tách khỏi danh sách chủ đề. */
  | { loai: 'lichSu'; html: string }
  /**
   * Danh sách chủ đề nối bằng `;` (≥ 4 mẩu). `dan` = phần dẫn trước dấu `:`
   * (vd "Nội dung gồm:") nếu có. Mỗi mục là HTML (có thể chứa `<strong>`).
   */
  | { loai: 'danhSach'; dan?: string; muc: string[] }
  /** "dự án cuối: …" / "capstone: …" — `nhan` là phần trước dấu `:`, `html` phần sau. */
  | { loai: 'duAn'; nhan: string; html: string };

/** Bao nhiêu mũi tên thì coi là một chuỗi lộ trình chứ không phải câu văn. */
const TOI_THIEU_MUI_TEN = 3;
/** Gộp câu vào cùng một đoạn tới chừng này ký tự. */
const DOAN_TOI_DA = 260;
/** Bao nhiêu mẩu `;` trong MỘT câu thì coi là danh sách chủ đề chứ không phải câu văn. */
const TOI_THIEU_CHAM_PHAY = 4;
/** Phần dẫn trước `:` dài hơn chừng này thì là câu văn thật, không phải tiêu đề danh sách. */
const DAN_TOI_DA = 120;

const LA_LICH_SU = /^(?:<[^>]*>)*\s*(?:lịch sử|history)(?=[\s:,(]|$)/i;
const LA_DU_AN = /^(?:<[^>]*>)*\s*(?:(?:và|and)\s+)?(?:dự án cuối(?: khoá| khóa| kỳ)?|đồ án cuối(?: khoá| khóa| kỳ)?|capstone(?: project)?|final project)(?=[\s:,(]|$)/i;

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

/**
 * Cắt một câu theo `;` CẤP NGOÀI: bỏ qua `;` trong ngoặc `( [ {`, trong thẻ
 * HTML, và `;` đóng thực thể (`&amp;` — đo thật: phần lớn mô tả Academy có
 * `&amp;`, cắt nhầm là đẻ mẩu vụn). Ghép các mẩu lại bằng "; " ra đúng câu cũ.
 */
function catChamPhay(html: string): string[] {
  const out: string[] = [];
  let buf = '';
  let sau = 0;
  let trongThe = false;
  for (const ch of html) {
    if (ch === '<') trongThe = true;
    else if (ch === '>') trongThe = false;
    else if (!trongThe && (ch === '(' || ch === '[' || ch === '{')) sau++;
    else if (!trongThe && (ch === ')' || ch === ']' || ch === '}')) sau = Math.max(0, sau - 1);
    if (ch === ';' && !trongThe && sau === 0
      // `(?:amp;)?`: dữ liệu có chỗ mã hoá HAI lần (`&amp;amp;`).
      && !/&(?:amp;)?(?:#\d{1,6}|#x[0-9a-fA-F]{1,6}|[a-zA-Z][a-zA-Z0-9]{1,30})$/.test(buf)) {
      out.push(buf);
      buf = '';
      continue;
    }
    buf += ch;
  }
  out.push(buf);
  return out.map((m) => m.trim()).filter((m) => boThe(m).trim().length > 0);
}

/** Vị trí dấu `:` cấp ngoài đầu tiên (ngoài thẻ/ngoặc), -1 nếu không có. */
function haiChamNgoai(html: string): number {
  let sau = 0;
  let trongThe = false;
  for (let i = 0; i < html.length; i++) {
    const ch = html[i];
    if (ch === '<') trongThe = true;
    else if (ch === '>') trongThe = false;
    else if (trongThe) continue;
    else if (ch === '(' || ch === '[' || ch === '{') sau++;
    else if (ch === ')' || ch === ']' || ch === '}') sau = Math.max(0, sau - 1);
    else if (ch === ':' && sau === 0 && !/^\/\//.test(html.slice(i + 1))) return i;
  }
  return -1;
}

/** Bỏ dấu câu thừa ở cuối mẩu (chỉ dấu câu — không đụng chữ). */
const goDuoi = (s: string) => s.replace(/[\s.;,]+$/, '').trim();

/** Viết hoa chữ đầu nếu mẩu mở đầu bằng chữ thường (không nằm trong thẻ). */
const hoaDauHtml = (s: string) => (s.startsWith('<') ? s : hoaChuDau(s));

/**
 * Câu kiểu "A; B; C; D; dự án cuối: E" ⇒ khối lịch sử / danh sách / dự án.
 * Trả null nếu câu không phải danh sách (ít hơn 4 mẩu).
 */
function tachDanhSach(c: string): KhoiMoTa[] | null {
  const manh = catChamPhay(c);
  if (manh.length < TOI_THIEU_CHAM_PHAY) return null;

  let dan: string | undefined;
  const dau = manh[0];
  const viTri = haiChamNgoai(dau);
  if (viTri > 0 && !LA_LICH_SU.test(dau) && !LA_DU_AN.test(dau)) {
    const truoc = dau.slice(0, viTri + 1).trim();
    const sauHaiCham = dau.slice(viTri + 1).trim();
    if (boThe(truoc).trim().length <= DAN_TOI_DA && boThe(sauHaiCham).trim().length > 0) {
      dan = truoc;
      manh[0] = sauHaiCham;
    }
  }

  const ketQua: KhoiMoTa[] = [];
  const muc: string[] = [];
  const duAn: KhoiMoTa[] = [];
  manh.forEach((m, i) => {
    const sach = goDuoi(m);
    if (i === 0 && !dan && LA_LICH_SU.test(sach)) {
      ketQua.push({ loai: 'lichSu', html: hoaDauHtml(sach) });
      return;
    }
    if (LA_DU_AN.test(sach)) {
      const vt = haiChamNgoai(sach);
      if (vt > 0 && boThe(sach.slice(vt + 1)).trim().length > 0) {
        duAn.push({ loai: 'duAn', nhan: boThe(sach.slice(0, vt)).trim(), html: hoaDauHtml(sach.slice(vt + 1).trim()) });
      } else {
        duAn.push({ loai: 'duAn', nhan: '', html: hoaDauHtml(sach) });
      }
      return;
    }
    muc.push(hoaDauHtml(sach));
  });

  if (muc.length >= 2) ketQua.push({ loai: 'danhSach', dan, muc });
  else if (muc.length || dan) ketQua.push({ loai: 'doan', html: [dan, ...muc].filter(Boolean).join(' ') });
  return [...ketQua, ...duAn];
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
    // Câu là danh sách chủ đề nối bằng `;` (kiểu "Lịch sử …; A; B; …; dự án cuối: …").
    // Câu đã là chuỗi lộ trình `A → B → C` thì giữ luật chuỗi cũ (ưu tiên).
    const ds = (c.match(/→|->/g) || []).length >= TOI_THIEU_MUI_TEN ? null : tachDanhSach(c);
    if (ds) {
      xaDem();
      khoi.push(...ds);
      continue;
    }

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
    .map((k) => {
      switch (k.loai) {
        case 'doan':
        case 'lichSu':
          return boThe(k.html);
        case 'chuoi':
          return k.buoc.join(' ');
        case 'danhSach':
          return [k.dan ?? '', ...k.muc].map(boThe).join(' ');
        case 'duAn':
          return `${k.nhan} ${boThe(k.html)}`;
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * `requirements` hay được viết thành VÀI CÂU liền nhau (không có `;`) ⇒
 * `tachGachDauDong` trả đúng một mục dài. Mục nào dài và có ≥ 2 câu thì tách
 * theo câu (cùng luật cắt câu với mô tả). Không mất chữ: chỉ bỏ dấu chấm cuối.
 */
export function tachCauDai(items: string[], toiThieu = 140): string[] {
  return items.flatMap((it) => {
    if (it.length < toiThieu) return [it];
    const cau = catCau(it).map(goDuoi).filter(Boolean);
    return cau.length >= 2 ? cau : [it];
  });
}
