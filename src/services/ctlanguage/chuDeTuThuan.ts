/**
 * CT Language — TỪ VỰNG THEO CHỦ ĐỀ, khuôn dữ liệu + luật kiểm + lọc/phân trang. THUẦN — không CSDL, không tệp.
 * (15/11/2026 — mở rộng từ 14 chủ đề × 12 từ soạn tay lên ~49 chủ đề × 60–150 từ mỗi ngôn ngữ.)
 *
 * Nội dung: `content/ctlanguage/chu-de-tu/`
 *   · `_chu-de.json`        — danh mục DÙNG CHUNG ba ngôn ngữ: nhóm lớn + chủ đề (mã, tên, SF Symbol, ảnh Fluent, mục con).
 *                             Chủ đề văn hoá có `tenRieng`/`anhRieng`/`moTaRieng` theo ngôn ngữ (lễ hội Nhật ≠ Tết Trung Hoa).
 *   · `<nn>/<ma>.json`      — từ của một chủ đề ở một ngôn ngữ. Khuôn + cách dựng: `_KHUON.md` cùng thư mục.
 * Nạp + gắn id từ điển: `chuDeTu.ts`. Phục vụ: `khamPha.ts › dsChuDe / chuDe`. Kiểm: `npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts`.
 *
 * ⚠️ Mã chủ đề cũ (14 mã đợt C) GIỮ NGUYÊN — app cũ đã lưu sổ `chu-de:<mã>` và liên kết sâu `chu-de:<mã>`.
 * ⚠️ Tệp KHÔNG ghi id `ctl_tu` (id đổi mỗi lần nhập lại từ điển) — máy chủ khớp CHỮ lúc phục vụ.
 */

export const NN_CDT = ['en', 'ja', 'zh'] as const;
export type NnCdt = (typeof NN_CDT)[number];

export const SO_TU_TOI_THIEU = 60;
export const SO_TU_TOI_DA = 150;
/** Tối thiểu tỉ lệ từ có câu ví dụ trong một chủ đề. */
export const TI_LE_VI_DU = 0.3;
/** 14 mã của đợt C — phải còn trong danh mục (app cũ). */
export const MA_CU = ['gia-dinh', 'an-uong', 'mua-sam', 'du-lich', 'giao-thong', 'truong-hoc', 'cong-so', 'suc-khoe', 'nha-cua',
  'thoi-tiet', 'cam-xuc', 'thoi-gian', 'cong-nghe', 'so-thich'] as const;

/** Loại từ (mã ngắn — app đổi ra nhãn Việt). */
export const LOAI_TU = ['n', 'v', 'adj', 'adv', 'phr', 'num', 'mw', 'pron', 'intj', 'conj', 'prep', 'part', 'name'] as const;
export const NHAN_LOAI: Record<(typeof LOAI_TU)[number], string> = {
  n: 'danh từ', v: 'động từ', adj: 'tính từ', adv: 'phó từ', phr: 'cụm từ', num: 'số từ', mw: 'lượng từ', pron: 'đại từ',
  intj: 'thán từ', conj: 'liên từ', prep: 'giới từ', part: 'trợ từ', name: 'tên riêng',
};

/** Cấp theo ngôn ngữ, từ DỄ tới KHÓ: HSK 1–6 · JLPT N5–N1 · CEFR A1–C2. */
export const CAP_CUA: Record<NnCdt, readonly string[]> = {
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
  ja: ['N5', 'N4', 'N3', 'N2', 'N1'],
  en: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
};

export const GOC_ANH = 'https://media.cuongthai.com/hoc/hinh/';
export const urlAnh = (slug: string | null | undefined) => (slug ? `${GOC_ANH}${slug}.webp` : null);

export interface TuChuDe {
  /** zh giản thể · ja dạng từ điển · en dạng gốc. */
  chu: string;
  /** ja toàn kana · zh pinyin CÓ DẤU THANH · en IPA `/…/` (được bỏ trống). */
  doc?: string;
  /** Nghĩa Việt ngắn. */
  nghia: string;
  loai?: (typeof LOAI_TU)[number];
  /** Nhãn cấp trong `CAP_CUA[nn]`. */
  cap?: string;
  /** true = cấp ƯỚC LƯỢNG (từ không có trong bộ từ theo cấp của CuongThai). */
  capUoc?: boolean;
  /** Mục con — phải nằm trong `nhom` của chủ đề ở danh mục. */
  nhom: string;
  viDu?: string;
  viDuDoc?: string;
  viDuNghia?: string;
  /** Tên ảnh Fluent Emoji đã có trên R2 (`hoc/hinh/<tên>.webp`). */
  anh?: string;
}

export interface TepChuDe { ma: string; nn: NnCdt; tu: TuChuDe[] }

export interface NhomLonChuDe { ma: string; ten: string; bieuTuong: string }

export interface ChuDeDanhMuc {
  ma: string;
  ten: string;
  nhomLon: string;
  bieuTuong: string;
  anh: string;
  moTa: string;
  nhom: string[];
  tenRieng?: Partial<Record<NnCdt, string>>;
  anhRieng?: Partial<Record<NnCdt, string>>;
  moTaRieng?: Partial<Record<NnCdt, string>>;
}

export interface DanhMucChuDe { nhomLon: NhomLonChuDe[]; chuDe: ChuDeDanhMuc[] }

const MA = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SF = /^[a-z0-9]+(?:\.[a-z0-9]+)*$/;
const KANA = /[ぁ-ゖァ-ヺ]/;
const CO_HAN = /\p{Script=Han}/u;
const CJK = /[぀-ヿ㐀-鿿豈-﫿]/;
const CHI_KANA = /^[ぁ-ゖァ-ヺー・\s〜～]+$/;
const DAU_THANH = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const PINYIN = /^[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙ'’\s,.·\-?!…]+$/;
const LATIN = /^[A-Za-z0-9][A-Za-z0-9 .,'’&/()+\-?!]*$/;

const chuoi = (v: unknown, toiDa = 400): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= toiDa;
const tuyChon = (v: unknown) => v === undefined || v === null || v === '';

/** Chuẩn hoá để so trùng: thường, gộp khoảng trắng, katakana → hiragana. */
export function khoaTrung(chu: string): string {
  return chu.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** Pinyin đã chuẩn hoá để so (bỏ khoảng trắng, dấu nháy, gạch; chữ thường). */
export const khoaPinyin = (s: string) => s.normalize('NFC').toLowerCase().replace(/[\s'’\-·]/g, '');
/** Kana đã chuẩn hoá để so (katakana → hiragana, bỏ khoảng trắng). */
export const khoaKana = (s: string) => khoaTrung(s).replace(/\s/g, '');

/** Kiểm danh mục chung. */
export function kiemDanhMuc(x: unknown, tenAnhCo?: ReadonlySet<string>): string[] {
  const loi: string[] = [];
  if (!x || typeof x !== 'object') return ['danh mục không phải đối tượng'];
  const d = x as DanhMucChuDe;
  if (!Array.isArray(d.nhomLon) || !d.nhomLon.length) loi.push('thiếu nhomLon');
  if (!Array.isArray(d.chuDe)) return [...loi, 'thiếu chuDe'];
  const maNhomLon = new Set<string>();
  for (const n of d.nhomLon ?? []) {
    if (!MA.test(String(n?.ma))) loi.push(`nhomLon "${n?.ma}": ma sai`);
    if (maNhomLon.has(n.ma)) loi.push(`nhomLon "${n.ma}" trùng`);
    maNhomLon.add(n.ma);
    if (!chuoi(n.ten, 40)) loi.push(`nhomLon "${n.ma}": thiếu ten`);
    if (!SF.test(String(n.bieuTuong))) loi.push(`nhomLon "${n.ma}": bieuTuong không phải SF Symbol`);
  }
  const daCo = new Set<string>();
  const kiemAnh = (a: unknown, nhan: string) => {
    if (typeof a !== 'string' || !SLUG.test(a)) loi.push(`${nhan}: anh sai`);
    else if (tenAnhCo && !tenAnhCo.has(a)) loi.push(`${nhan}: ảnh "${a}" chưa có trên R2`);
  };
  for (const c of d.chuDe) {
    const ten = `chuDe "${c?.ma}"`;
    if (!MA.test(String(c?.ma)) || c.ma.length > 40) { loi.push(`${ten}: ma phải kebab-case ≤ 40`); continue; }
    if (daCo.has(c.ma)) loi.push(`${ten}: trùng mã`);
    daCo.add(c.ma);
    if (!chuoi(c.ten, 40)) loi.push(`${ten}: thiếu ten (≤ 40)`);
    if (!maNhomLon.has(c.nhomLon)) loi.push(`${ten}: nhomLon "${c.nhomLon}" không có`);
    if (!SF.test(String(c.bieuTuong))) loi.push(`${ten}: bieuTuong không phải SF Symbol`);
    kiemAnh(c.anh, ten);
    if (!chuoi(c.moTa, 200)) loi.push(`${ten}: thiếu moTa (≤ 200)`);
    if (!Array.isArray(c.nhom) || c.nhom.length < 3 || c.nhom.length > 8) loi.push(`${ten}: cần 3–8 mục con`);
    else if (new Set(c.nhom).size !== c.nhom.length || !c.nhom.every((n) => chuoi(n, 40))) loi.push(`${ten}: mục con trùng / rỗng / > 40 ký tự`);
    for (const nn of Object.keys(c.tenRieng ?? {})) if (!(NN_CDT as readonly string[]).includes(nn) || !chuoi(c.tenRieng![nn as NnCdt], 40)) loi.push(`${ten}: tenRieng.${nn} sai`);
    for (const [nn, a] of Object.entries(c.anhRieng ?? {})) kiemAnh(a, `${ten}.anhRieng.${nn}`);
    for (const nn of Object.keys(c.moTaRieng ?? {})) if (!chuoi(c.moTaRieng![nn as NnCdt], 200)) loi.push(`${ten}: moTaRieng.${nn} sai`);
  }
  for (const m of MA_CU) if (!daCo.has(m)) loi.push(`thiếu mã cũ "${m}" (app cũ cần)`);
  return loi;
}

/** Kiểm một từ. */
export function kiemTu(x: unknown, nn: NnCdt, nhomCho: ReadonlySet<string>, nhan = 'tu', tenAnhCo?: ReadonlySet<string>): string[] {
  const loi: string[] = [];
  if (!x || typeof x !== 'object' || Array.isArray(x)) return [`${nhan}: không phải đối tượng`];
  const t = x as Record<string, unknown>;
  const cho = new Set(['chu', 'doc', 'nghia', 'loai', 'cap', 'capUoc', 'nhom', 'viDu', 'viDuDoc', 'viDuNghia', 'anh']);
  for (const k of Object.keys(t)) if (!cho.has(k)) loi.push(`${nhan}: trường lạ "${k}"`);
  const chu = typeof t.chu === 'string' ? t.chu : '';
  const ten = `${nhan} "${chu || '?'}"`;
  if (!chuoi(t.chu, 60)) loi.push(`${ten}: thiếu chu (≤ 60)`);
  if (!chuoi(t.nghia, 80)) loi.push(`${ten}: thiếu nghia (≤ 80)`);
  else if (CJK.test(String(t.nghia))) loi.push(`${ten}: nghia lẫn chữ Hán/kana`);
  if (typeof t.nhom !== 'string' || !nhomCho.has(t.nhom)) loi.push(`${ten}: nhom "${String(t.nhom)}" không thuộc chủ đề`);
  if (!tuyChon(t.loai) && !(LOAI_TU as readonly string[]).includes(String(t.loai))) loi.push(`${ten}: loai "${String(t.loai)}" lạ`);
  if (!tuyChon(t.cap) && !CAP_CUA[nn].includes(String(t.cap))) loi.push(`${ten}: cap "${String(t.cap)}" không phải cấp ${nn}`);
  if (!tuyChon(t.capUoc) && typeof t.capUoc !== 'boolean') loi.push(`${ten}: capUoc phải là boolean`);
  if (!tuyChon(t.anh)) {
    if (typeof t.anh !== 'string' || !SLUG.test(t.anh)) loi.push(`${ten}: anh sai`);
    else if (tenAnhCo && !tenAnhCo.has(t.anh)) loi.push(`${ten}: ảnh "${t.anh}" chưa có trên R2`);
  }
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
    else if (CJK.test(String(t.viDuNghia))) loi.push(`${ten}: viDuNghia lẫn chữ Hán/kana`);
    const v = String(t.viDu);
    const vd = typeof t.viDuDoc === 'string' ? t.viDuDoc.trim() : '';
    if (nn === 'ja') {
      if (!KANA.test(v) && !CO_HAN.test(v)) loi.push(`${ten}: viDu không phải câu tiếng Nhật`);
      if (vd && CO_HAN.test(vd)) loi.push(`${ten}: viDuDoc còn chữ Hán`);
    } else if (nn === 'zh') {
      if (!CO_HAN.test(v) || KANA.test(v)) loi.push(`${ten}: viDu không phải câu tiếng Trung`);
      if (vd && !DAU_THANH.test(vd)) loi.push(`${ten}: viDuDoc pinyin không có dấu thanh`);
    } else if (CJK.test(v)) loi.push(`${ten}: viDu tiếng Anh lẫn chữ CJK`);
  } else if (!tuyChon(t.viDuNghia) || !tuyChon(t.viDuDoc)) loi.push(`${ten}: có viDuNghia/viDuDoc mà không có viDu`);
  return loi;
}

/** Kiểm một tệp chủ đề (đối chiếu danh mục). */
export function kiemTep(x: unknown, dm: DanhMucChuDe, tenAnhCo?: ReadonlySet<string>): string[] {
  const loi: string[] = [];
  if (!x || typeof x !== 'object' || Array.isArray(x)) return ['tệp không phải đối tượng'];
  const b = x as Record<string, unknown>;
  for (const k of Object.keys(b)) if (!['ma', 'nn', 'tu'].includes(k)) loi.push(`trường lạ "${k}"`);
  if (!(NN_CDT as readonly string[]).includes(String(b.nn))) return [...loi, 'nn phải là en/ja/zh'];
  const c = dm.chuDe.find((z) => z.ma === b.ma);
  if (!c) return [...loi, `mã "${String(b.ma)}" không có trong danh mục`];
  if (!Array.isArray(b.tu)) return [...loi, 'thiếu mảng tu'];
  const nn = b.nn as NnCdt;
  if (b.tu.length < SO_TU_TOI_THIEU || b.tu.length > SO_TU_TOI_DA) loi.push(`số từ ${b.tu.length} — cần ${SO_TU_TOI_THIEU}–${SO_TU_TOI_DA}`);
  const nhomCho = new Set(c.nhom);
  const daCo = new Map<string, number>();
  let coViDu = 0;
  b.tu.forEach((t, i) => {
    loi.push(...kiemTu(t, nn, nhomCho, `tu[${i}]`, tenAnhCo));
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

/** Tên / ảnh / mô tả của chủ đề ở một ngôn ngữ (chủ đề văn hoá đổi theo nước). */
export function hienThi(c: ChuDeDanhMuc, nn: NnCdt) {
  return { ten: c.tenRieng?.[nn] ?? c.ten, anh: c.anhRieng?.[nn] ?? c.anh, moTa: c.moTaRieng?.[nn] ?? c.moTa };
}

/** Đếm từ theo mục con (đúng thứ tự danh mục, bỏ mục rỗng) và theo cấp (đúng thứ tự cấp). */
export function demNhomCap(c: ChuDeDanhMuc, tu: readonly TuChuDe[], nn: NnCdt) {
  const nhom = c.nhom.map((ten) => ({ ten, soTu: tu.filter((t) => t.nhom === ten).length })).filter((n) => n.soTu > 0);
  const cap = CAP_CUA[nn].map((ma) => ({ ma, soTu: tu.filter((t) => t.cap === ma).length })).filter((x) => x.soTu > 0);
  return { nhom, cap };
}

/** Thẻ tóm tắt cho lưới chủ đề. `mau`, `soTu`, `bieuTuong` giữ khuôn cũ (app đợt C). */
export function tomTatChuDe(c: ChuDeDanhMuc, tep: TepChuDe, dm: DanhMucChuDe) {
  const nn = tep.nn;
  const h = hienThi(c, nn);
  const nl = dm.nhomLon.find((x) => x.ma === c.nhomLon);
  const { nhom, cap } = demNhomCap(c, tep.tu, nn);
  return {
    ma: c.ma, ten: h.ten, bieuTuong: c.bieuTuong, soTu: tep.tu.length, mau: tep.tu.slice(0, 3).map((t) => t.chu),
    moTa: h.moTa, anh: h.anh, anhUrl: urlAnh(h.anh), nhomLon: c.nhomLon, tenNhomLon: nl?.ten ?? null,
    soViDu: tep.tu.filter((t) => !!t.viDu).length, nhom, cap,
  };
}

export interface BoLocChuDe { cap: string[] | null; nhom: string | null; trang: number | null; kichThuoc: number }

/** Đọc bộ lọc từ query: `?cap=HSK1,HSK2&nhom=Rau củ&trang=1&kichThuoc=40`. Không `trang` ⇒ trả CẢ chủ đề (app cũ). */
export function docBoLoc(q: Record<string, unknown>, nn: NnCdt): BoLocChuDe {
  const mot = (v: unknown) => (Array.isArray(v) ? v[0] : v);
  const capTho = mot(q.cap);
  const cap = typeof capTho === 'string' && capTho.trim()
    ? [...new Set(capTho.split(',').map((s) => s.trim().toUpperCase()).filter((s) => CAP_CUA[nn].includes(s)))]
    : null;
  const nhomTho = mot(q.nhom);
  const nhom = typeof nhomTho === 'string' && nhomTho.trim() ? nhomTho.trim().slice(0, 60) : null;
  const trangTho = Number(mot(q.trang));
  const trang = Number.isInteger(trangTho) && trangTho >= 1 ? Math.min(trangTho, 1000) : null;
  const kTho = Number(mot(q.kichThuoc));
  const kichThuoc = Number.isInteger(kTho) && kTho >= 5 ? Math.min(kTho, 150) : 40;
  return { cap: cap && cap.length ? cap : null, nhom, trang, kichThuoc };
}

/** Lọc theo cấp / mục con rồi cắt trang. */
export function locVaCatTrang<T extends { cap?: string | null; nhom?: string | null }>(tu: readonly T[], b: BoLocChuDe) {
  const loc = tu.filter((t) => (!b.cap || (t.cap != null && b.cap.includes(t.cap))) && (!b.nhom || t.nhom === b.nhom));
  if (!b.trang) return { tu: loc, tong: loc.length, trang: 1, soTrang: 1 };
  const soTrang = Math.max(1, Math.ceil(loc.length / b.kichThuoc));
  return { tu: loc.slice((b.trang - 1) * b.kichThuoc, b.trang * b.kichThuoc), tong: loc.length, trang: b.trang, soTrang };
}
