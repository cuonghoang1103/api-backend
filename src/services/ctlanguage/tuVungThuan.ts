/**
 * CT Language — BỘ TỪ BỔ SUNG cho lộ trình học từ vựng (16/11/2026): khuôn + luật kiểm (THUẦN — test đọc).
 *
 * User: "mục học từ vựng riêng: mục tiêu mỗi ngày, học + kiểm tra + luyện, đánh dấu, không trùng; kho có đủ để học và thi
 * IELTS từ 0 tới 8.0 chưa?" Kiểm 16/11: kho chủ đề tiếng Anh 4.090 từ (A1 1.493 · A2 960 · B1 893 · B2 549 · C1 55) — thiếu
 * hẳn từ học thuật B2–C1. Bộ bổ sung ở `content/ctlanguage/tu-vung/<nn>/<ma>.json`, KHÔNG trùng kho chủ đề
 * (`content/ctlanguage/chu-de-tu/`) và không trùng nhau; lộ trình học = kho chủ đề + bộ bổ sung, xếp theo cấp.
 */
import { CAP_CUA, LOAI_TU, type NnCdt } from './chuDeTuThuan.js';

export interface TuBoSung {
  chu: string;
  /** en IPA `/…/` · zh pinyin có dấu · ja kana */
  doc: string;
  loai: (typeof LOAI_TU)[number];
  /** Nghĩa Việt ngắn, đúng nghĩa thông dụng nhất trong ngữ cảnh học thuật/giao tiếp. */
  nghia: string;
  cap: string;
  viDu: string;
  viDuDoc?: string;
  viDuNghia: string;
  /** Cụm hay đi kèm (collocation) — en: "make a significant contribution". */
  cumTu?: string[];
  /** Họ từ — en: "significance (n)", "significantly (adv)". */
  hoTu?: string[];
  /** Ghi chú dùng (dễ nhầm, sắc thái, IELTS Writing/Speaking). */
  ghiChu?: string;
  /** Ảnh minh hoạ: slug Fluent Emoji (`scripts/hinh/fluent-catalog.json`), phục vụ ở `hoc/hinh/<slug>.webp` — giống kho chủ đề. */
  anh?: string;
}

export interface BoTuBoSung {
  ma: string;
  nn: NnCdt;
  ten: string;
  moTa: string;
  /** "ielts" | "giao-tiep" | "hsk" | "jlpt" … — để app gom nhóm. */
  nhom: string;
  /** cấp chủ đạo của bộ */
  cap: string;
  tu: TuBoSung[];
}

const MA = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SLUG = MA;

/** `tenAnhCo` (tuỳ chọn) = tập slug có thật — có thì slug lạ bị báo như kho chủ đề. */
export function kiemBoTu(b: BoTuBoSung, tenAnhCo?: ReadonlySet<string>): string[] {
  const loi: string[] = [];
  if (!b || typeof b !== 'object') return ['không phải object'];
  if (!['en', 'ja', 'zh'].includes(b.nn)) return [`nn lạ: ${String(b.nn)}`];
  if (typeof b.ma !== 'string' || !MA.test(b.ma)) loi.push(`ma sai khuôn: ${String(b.ma)}`);
  for (const k of ['ten', 'moTa', 'nhom'] as const) if (typeof b[k] !== 'string' || !b[k].trim()) loi.push(`thiếu ${k}`);
  const caps = CAP_CUA[b.nn];
  if (!caps.includes(b.cap)) loi.push(`cap lạ: ${String(b.cap)}`);
  if (!Array.isArray(b.tu) || b.tu.length < 20 || b.tu.length > 200) { loi.push('tu: 20–200 từ'); return loi; }
  const thay = new Set<string>();
  b.tu.forEach((t, i) => {
    const o = `tu[${i}] ${String(t?.chu)}`;
    if (typeof t?.chu !== 'string' || !t.chu.trim()) loi.push(`${o}: thiếu chu`);
    const k = b.nn === 'en' ? String(t?.chu).toLowerCase() : String(t?.chu);
    if (thay.has(k)) loi.push(`${o}: trùng trong bộ`);
    thay.add(k);
    if (typeof t?.doc !== 'string' || !t.doc.trim()) loi.push(`${o}: thiếu doc`);
    else if (b.nn === 'en' && !/^\/.+\/$/.test(t.doc)) loi.push(`${o}: doc tiếng Anh phải là IPA /…/`);
    if (!(LOAI_TU as readonly string[]).includes(t?.loai)) loi.push(`${o}: loai lạ ${String(t?.loai)}`);
    if (typeof t?.nghia !== 'string' || !t.nghia.trim() || t.nghia.length > 120) loi.push(`${o}: nghia thiếu/quá dài`);
    if (!caps.includes(t?.cap)) loi.push(`${o}: cap lạ ${String(t?.cap)}`);
    if (typeof t?.viDu !== 'string' || !t.viDu.trim()) loi.push(`${o}: thiếu viDu`);
    if (typeof t?.viDuNghia !== 'string' || !t.viDuNghia.trim()) loi.push(`${o}: thiếu viDuNghia`);
    if (b.nn !== 'en' && (typeof t?.viDuDoc !== 'string' || !t.viDuDoc.trim())) loi.push(`${o}: thiếu viDuDoc`);
    if (b.nn === 'en' && typeof t?.chu === 'string' && typeof t?.viDu === 'string'
        && !t.viDu.toLowerCase().includes(t.chu.toLowerCase().split(' ')[0].slice(0, Math.max(3, t.chu.length - 3)))) {
      loi.push(`${o}: ví dụ không chứa từ`);
    }
    for (const f of ['cumTu', 'hoTu'] as const) {
      const v = t?.[f];
      if (v !== undefined && (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !x.trim()))) loi.push(`${o}: ${f} phải là mảng chuỗi`);
    }
    if (t?.anh !== undefined) {
      if (typeof t.anh !== 'string' || !SLUG.test(t.anh)) loi.push(`${o}: anh sai`);
      else if (tenAnhCo && !tenAnhCo.has(t.anh)) loi.push(`${o}: ảnh "${t.anh}" chưa có trên R2`);
    }
  });
  return loi;
}
