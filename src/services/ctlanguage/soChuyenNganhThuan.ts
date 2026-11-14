/**
 * CT Language — SỔ TAY CHUYÊN NGÀNH (15/11/2026): khuôn dữ liệu + luật kiểm. THUẦN — không CSDL, không tệp.
 * Bộ từ theo NGHỀ / LĨNH VỰC cho người Việt đi làm / du học (CNTT, văn phòng, nhà máy, nhà hàng – khách sạn, y tế –
 * điều dưỡng (kaigo), xây dựng, TMĐT – logistics, du lịch – sân bay…). Cùng `ma` cho cả ba ngôn ngữ.
 * Nội dung: `content/ctlanguage/so-chuyen-nganh/<nn>/<ma>.json` (khuôn: `_KHUON.md` cùng thư mục).
 * Nạp + gắn id từ điển: `soChuyenNganh.ts`. Tuyến: `routes/ctlanguage.soChuyenNganh.routes.ts`.
 * Kiểm: `npx tsx scripts/ctlanguage-kiem-so-chuyen-nganh.mts`.
 *
 * ⚠️ Tệp KHÔNG ghi id `ctl_tu`: lệnh nhập từ điển xoá rồi nạp lại cả bảng ⇒ id đổi mỗi lần nhập. Máy chủ khớp CHỮ lúc
 * phục vụ (như chủ đề từ vựng `khamPha.ts › chuDe`) — không khớp ⇒ id ÂM ổn định `idAm`, app tự tra lại theo chữ.
 */

export const NN_SCN = ['en', 'ja', 'zh'] as const;
export type NnScn = (typeof NN_SCN)[number];

export const SO_TU_TOI_THIEU = 60;
export const SO_TU_TOI_DA = 150;
/** "Phần lớn từ có câu ví dụ": tối thiểu tỉ lệ này trong một bộ. */
export const TI_LE_VI_DU = 0.6;

export interface TuChuyenNganh {
  /** Chữ: từ tiếng Anh · kanji/kana (ja) · giản thể (zh). */
  chu: string;
  /** Cách đọc: ja = toàn kana · zh = pinyin CÓ DẤU THANH · en = IPA (được bỏ trống — máy chủ lấy IPA của từ điển). */
  doc?: string;
  /** Nghĩa tiếng Việt ngắn. */
  nghia: string;
  /** Âm Hán Việt (ja/zh, tuỳ chọn). */
  hanViet?: string;
  /** Mục nhỏ trong bộ ("Họp & báo cáo", "An toàn lao động"…) — app chia đoạn theo đây. */
  nhom?: string;
  /** Câu ví dụ ngắn (chữ của ngôn ngữ đang học). */
  viDu?: string;
  /** Cách đọc câu ví dụ: ja = kana · zh = pinyin có dấu · en = bỏ trống. */
  viDuDoc?: string;
  /** Nghĩa Việt của câu ví dụ (bắt buộc khi có viDu). */
  viDuNghia?: string;
}

export interface BoChuyenNganh {
  ma: string;
  nn: NnScn;
  /** Tên hiển thị: "CNTT – phần mềm". */
  ten: string;
  /** Một – hai câu: bộ này cho ai, dùng khi nào. */
  moTa: string;
  /** Tên SF Symbol cho app. */
  bieuTuong: string;
  /** Thứ tự hiển thị (nhỏ trước). */
  thuTu: number;
  tu: TuChuyenNganh[];
}

const MA = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KANA = /[ぁ-ゖァ-ヺ]/;
const CO_HAN = /\p{Script=Han}/u;
const CHI_KANA = /^[ぁ-ゖァ-ヺー・\s（）()〜～]+$/;
const DAU_THANH = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const PINYIN = /^[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙ'’\s,.·\-?!…]+$/;
const LATIN = /^[A-Za-z0-9][A-Za-z0-9 .,'’&/()+\-]*$/;
const SF = /^[a-z0-9]+(?:\.[a-z0-9]+)*$/;

const chuoi = (v: unknown, toiDa = 400): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= toiDa;
const tuyChon = (v: unknown) => v === undefined || v === null || v === '';

/** Chuẩn hoá để so trùng: thường, gộp khoảng trắng, katakana → hiragana. */
export function khoaTrung(chu: string): string {
  return chu.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** Kiểm một từ. Trả danh sách lỗi (rỗng = hợp lệ). */
export function kiemTu(x: unknown, nn: NnScn, nhan = 'tu'): string[] {
  const loi: string[] = [];
  if (!x || typeof x !== 'object' || Array.isArray(x)) return [`${nhan}: không phải đối tượng`];
  const t = x as Record<string, unknown>;
  const cho = new Set(['chu', 'doc', 'nghia', 'hanViet', 'nhom', 'viDu', 'viDuDoc', 'viDuNghia']);
  for (const k of Object.keys(t)) if (!cho.has(k)) loi.push(`${nhan}: trường lạ "${k}"`);
  const ten = `${nhan} "${typeof t.chu === 'string' ? t.chu : '?'}"`;
  if (!chuoi(t.chu, 80)) loi.push(`${ten}: thiếu chu (≤ 80 ký tự)`);
  if (!chuoi(t.nghia, 200)) loi.push(`${ten}: thiếu nghia (≤ 200 ký tự)`);
  if (!tuyChon(t.nhom) && !chuoi(t.nhom, 60)) loi.push(`${ten}: nhom sai (≤ 60 ký tự)`);
  if (!tuyChon(t.hanViet) && !chuoi(t.hanViet, 80)) loi.push(`${ten}: hanViet sai`);
  const chu = typeof t.chu === 'string' ? t.chu : '';
  const doc = typeof t.doc === 'string' ? t.doc.trim() : '';
  if (nn === 'ja') {
    if (chu && !KANA.test(chu) && !CO_HAN.test(chu)) loi.push(`${ten}: chu không có chữ Nhật`);
    if (!doc) loi.push(`${ten}: thiếu doc (kana)`);
    else if (!CHI_KANA.test(doc)) loi.push(`${ten}: doc "${doc}" phải toàn kana`);
  } else if (nn === 'zh') {
    if (chu && !CO_HAN.test(chu)) loi.push(`${ten}: chu không có chữ Hán`);
    if (chu && KANA.test(chu)) loi.push(`${ten}: chu lẫn kana`);
    if (!doc) loi.push(`${ten}: thiếu doc (pinyin)`);
    else {
      if (!PINYIN.test(doc)) loi.push(`${ten}: doc "${doc}" không phải pinyin`);
      if (!DAU_THANH.test(doc)) loi.push(`${ten}: doc "${doc}" pinyin không có dấu thanh`);
      if (/v/i.test(doc)) loi.push(`${ten}: doc dùng "v" thay "ü"`);
    }
  } else {
    if (chu && !LATIN.test(chu)) loi.push(`${ten}: chu "${chu}" không phải từ tiếng Anh`);
    if (doc && !/^\/.+\/$/.test(doc)) loi.push(`${ten}: doc tiếng Anh là IPA dạng /…/ hoặc bỏ trống`);
  }
  if (!tuyChon(t.viDu)) {
    if (!chuoi(t.viDu, 200)) loi.push(`${ten}: viDu quá dài (≤ 200)`);
    if (!chuoi(t.viDuNghia, 300)) loi.push(`${ten}: có viDu nhưng thiếu viDuNghia`);
    const v = String(t.viDu);
    const vd = typeof t.viDuDoc === 'string' ? t.viDuDoc.trim() : '';
    if (nn === 'ja') {
      if (!KANA.test(v) && !CO_HAN.test(v)) loi.push(`${ten}: viDu không phải câu tiếng Nhật`);
      if (vd && CO_HAN.test(vd)) loi.push(`${ten}: viDuDoc còn chữ Hán — phải toàn kana`);
    } else if (nn === 'zh') {
      if (!CO_HAN.test(v)) loi.push(`${ten}: viDu không phải câu tiếng Trung`);
      if (vd && !DAU_THANH.test(vd)) loi.push(`${ten}: viDuDoc pinyin không có dấu thanh`);
    } else if (/[぀-ヿ一-鿿]/.test(v)) loi.push(`${ten}: viDu tiếng Anh lẫn chữ CJK`);
  } else if (!tuyChon(t.viDuNghia) || !tuyChon(t.viDuDoc)) loi.push(`${ten}: có viDuNghia/viDuDoc mà không có viDu`);
  return loi;
}

/** Kiểm một tệp bộ từ. */
export function kiemBo(x: unknown): string[] {
  const loi: string[] = [];
  if (!x || typeof x !== 'object' || Array.isArray(x)) return ['tệp không phải đối tượng'];
  const b = x as Record<string, unknown>;
  const cho = new Set(['ma', 'nn', 'ten', 'moTa', 'bieuTuong', 'thuTu', 'tu']);
  for (const k of Object.keys(b)) if (!cho.has(k)) loi.push(`trường lạ "${k}"`);
  if (typeof b.ma !== 'string' || !MA.test(b.ma) || b.ma.length > 40) loi.push('ma phải dạng kebab-case ≤ 40');
  if (!(NN_SCN as readonly string[]).includes(String(b.nn))) loi.push('nn phải là en/ja/zh');
  if (!chuoi(b.ten, 60)) loi.push('thiếu ten (≤ 60)');
  if (!chuoi(b.moTa, 300)) loi.push('thiếu moTa (≤ 300)');
  if (typeof b.bieuTuong !== 'string' || !SF.test(b.bieuTuong)) loi.push('bieuTuong phải là tên SF Symbol');
  if (typeof b.thuTu !== 'number' || !Number.isInteger(b.thuTu)) loi.push('thuTu phải là số nguyên');
  if (!Array.isArray(b.tu)) return [...loi, 'thiếu mảng tu'];
  const nn = String(b.nn) as NnScn;
  if (b.tu.length < SO_TU_TOI_THIEU || b.tu.length > SO_TU_TOI_DA) loi.push(`số từ ${b.tu.length} — cần ${SO_TU_TOI_THIEU}–${SO_TU_TOI_DA}`);
  const daCo = new Map<string, number>();
  let coViDu = 0;
  b.tu.forEach((t, i) => {
    loi.push(...kiemTu(t, nn, `tu[${i}]`));
    const chu = (t as { chu?: unknown })?.chu;
    if (typeof chu === 'string') {
      const k = khoaTrung(chu);
      if (daCo.has(k)) loi.push(`tu[${i}] "${chu}" trùng tu[${daCo.get(k)}]`);
      else daCo.set(k, i);
    }
    if (chuoi((t as { viDu?: unknown })?.viDu)) coViDu++;
  });
  if (b.tu.length && coViDu / b.tu.length < TI_LE_VI_DU) loi.push(`chỉ ${coViDu}/${b.tu.length} từ có câu ví dụ — cần ≥ ${Math.round(TI_LE_VI_DU * 100)}%`);
  return loi;
}

/** Tóm tắt một bộ (danh sách). */
export function tomTatBo(b: BoChuyenNganh) {
  const nhom = [...new Set(b.tu.map((t) => t.nhom).filter((x): x is string => !!x))];
  return {
    ma: b.ma, nn: b.nn, ten: b.ten, moTa: b.moTa, bieuTuong: b.bieuTuong,
    soTu: b.tu.length, soViDu: b.tu.filter((t) => !!t.viDu).length, nhom,
    mau: b.tu.slice(0, 4).map((t) => t.chu),
  };
}
