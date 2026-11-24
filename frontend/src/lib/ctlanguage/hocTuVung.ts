/**
 * CT Language trên web — HỌC TỪ VỰNG: câu hỏi + hàng đợi phiên + trạng thái trên trình duyệt (24/11/2026). THUẦN.
 *
 * Bám app iOS (`ios-app/.../Modules/HocTuVung/MoHinhHocTuVungCTL.swift` › `DeHocTuVungCTL`, `PhienHocTuVungCTL.swift` ›
 * `HangPhienHTV`):
 *  · phiên "học": ≤ 8 từ MỚI, chia nhóm 4: THẺ từng từ → câu NHẬN BIẾT (chọn nghĩa / nghe chọn từ / đúng-sai) → VÒNG GHÉP CẶP
 *    → câu NHỚ LẠI khác dạng. Một từ chỉ được ghi "đã học" khi đúng ở ≥ 2 DẠNG KHÁC NHAU trong phiên. Câu sai quay lại cuối
 *    phiên ở dạng khác (≤ 2 lần/từ).
 *  · phiên "ôn": mỗi từ một câu (dạng xoay vòng), ≥ 5 từ thì chèn một vòng ghép cặp.
 * Trạng thái từ ("đang học / đã biết / thuộc / khó", mục tiêu hôm nay) lưu ở localStorage — như app lưu trên máy. Phần
 * DÙNG CHUNG với app đi qua sổ "Học từ vựng" (`dongBo.ts`): xem `daGapTu` / `thuocTu`.
 */
import type { TheTuCTL } from './soTu';
import { daThuocThe, khoaNgay } from './soTu';

export type DangCau =
  | 'chonNghia' | 'ngheChonTu' | 'chonTu' | 'goTu' | 'chonCachDoc' | 'dienCau'
  | 'dungSai' | 'xepChu' | 'ngheGo' | 'xepCau' | 'ghepCap';

export const TEN_DANG: Record<DangCau, string> = {
  chonNghia: 'Chọn nghĩa đúng', ngheChonTu: 'Nghe rồi chọn từ', chonTu: 'Chọn từ theo nghĩa', goTu: 'Gõ từ',
  chonCachDoc: 'Chọn cách đọc', dienCau: 'Điền vào câu', dungSai: 'Đúng hay sai?', xepChu: 'Xếp chữ thành từ',
  ngheGo: 'Nghe rồi gõ', xepCau: 'Xếp từ thành câu', ghepCap: 'Ghép cặp',
};
export const NHAN_BIET: readonly DangCau[] = ['chonNghia', 'ngheChonTu', 'dungSai'];
export const NHO_LAI: readonly DangCau[] = ['xepChu', 'goTu', 'chonTu', 'dienCau', 'ngheGo', 'xepCau', 'chonCachDoc'];

export type NnHoc = 'en' | 'ja' | 'zh';

/** Từ dùng trong phiên (khuôn `TuHTV` của máy chủ, chỉ các trường cần). */
export interface TuHoc {
  k: string;
  id: number;
  chu: string;
  doc?: string | null;
  nghia: string;
  cap?: string | null;
  viDu?: string | null;
  viDuDoc?: string | null;
  viDuNghia?: string | null;
}

export interface CauHoi {
  id: string;
  dang: DangCau;
  tu: TuHoc;
  de: string;
  phuongAn: string[];
  dung: number;
  /** Mảnh để xếp (đã trộn) — Xếp chữ / Xếp câu. */
  manh: string[];
  dapAn: string;
  /** Nối mảnh: "" (chữ cái, kana, Hán) hoặc " " (từ tiếng Anh). */
  noi: string;
}

/** Điểm ngữ pháp (tóm tắt) + một câu quiz — khuôn `/ctlanguage/ngu-phap` (app `TomTatNguPhap` / `CauQuizNguPhap`). */
export interface TomTatNguPhap { id: string; nn: string; cap: string; nhom: string; tieuDe: string; mau: string; nghia: string }
export interface CauQuizNguPhap { h: string; lc: string[]; da: number; gt: string }

export type MucPhien =
  | { loai: 'the'; id: string; tu: TuHoc }
  | { loai: 'cau'; id: string; cau: CauHoi }
  | { loai: 'ghep'; id: string; ds: TuHoc[] }
  | { loai: 'nguPhap'; id: string; diem: TomTatNguPhap; cau: CauQuizNguPhap };

export type Rng = () => number;
const tron = <T,>(ds: readonly T[], r: Rng): T[] => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
};

/** Cách đọc đáng hiện: bỏ ngoặc 『』 của IPA từ điển, bỏ khi trùng chữ (app `TuHTV.sachDoc`). */
export function docHien(w: Pick<TuHoc, 'doc' | 'chu'>): string | null {
  let d = w.doc?.trim();
  if (!d) return null;
  d = d.replace(/[『』]/g, '').replace(/\/ /g, '/').replace(/ \//g, '/');
  return d === w.chu ? null : d;
}

/** Câu ví dụ có chứa từ ⇒ thay bằng "_____" (en không phân biệt hoa thường). */
export function cauTrong(w: TuHoc, nn: NnHoc): string | null {
  const v = w.viDu;
  if (!v) return null;
  const i = nn === 'en' ? v.toLowerCase().indexOf(w.chu.toLowerCase()) : v.indexOf(w.chu);
  if (i < 0) return null;
  return v.slice(0, i) + '_____' + v.slice(i + w.chu.length);
}

const laKana = (s: string) => !!s && [...s].every((c) => { const v = c.codePointAt(0)!; return (v >= 0x3040 && v <= 0x30ff) || v === 0x30fc; });
const laHan = (s: string) => !!s && [...s].every((c) => { const v = c.codePointAt(0)!; return (v >= 0x4e00 && v <= 0x9fff) || (v >= 0x3400 && v <= 0x4dbf); });
const laChuCai = (c: string) => /\p{L}/u.test(c);

/** Mảnh của dạng Xếp chữ: en = chữ cái; ja = kana của cách đọc (không có thì chữ); zh = chữ Hán. null ⇒ không hợp dạng. */
export function manhChu(w: TuHoc, nn: NnHoc): string[] | null {
  if (nn === 'en') {
    const c = [...w.chu.trim()];
    if (c.length < 3 || c.length > 12 || !c.every(laChuCai)) return null;
    return c.map((x) => x.toLowerCase());
  }
  if (nn === 'ja') {
    const d = docHien(w)?.replace(/ /g, '');
    if (d && laKana(d) && [...d].length >= 2 && [...d].length <= 7) return [...d];
    const c = [...w.chu];
    return c.length >= 2 && c.length <= 6 ? c : null;
  }
  const c = [...w.chu];
  return laHan(w.chu) && c.length >= 2 && c.length <= 6 ? c : null;
}

/** Mảnh của dạng Xếp câu: en = từ (giữ dấu câu dính kèm); ja/zh = khúc ≤ 3 chữ, cắt sau trợ từ và dấu câu. 3–8 mảnh. */
export function manhCau(w: TuHoc, nn: NnHoc): string[] | null {
  const v = w.viDu?.trim();
  if (!v || !w.viDuNghia) return null;
  if (nn === 'en') {
    if (!v.toLowerCase().includes(w.chu.toLowerCase())) return null;
    const ds = v.split(' ').filter(Boolean);
    return ds.length >= 3 && ds.length <= 9 ? ds : null;
  }
  const i = v.indexOf(w.chu);
  if (i < 0) return null;
  const dau = v.slice(0, i), cuoi = v.slice(i + w.chu.length);
  const troTu = new Set(nn === 'ja' ? ['は', 'が', 'を', 'に', 'で', 'と', 'も', 'へ', 'の'] : ['的', '了', '在', '是', '很']);
  const dauCau = new Set(['、', '。', '，', '！', '？', ',', '.', '!', '?', '；']);
  const cat = (s: string): string[] => {
    const ra: string[] = [];
    let cur = '';
    for (const ch of s) {
      if (dauCau.has(ch)) {
        if (cur) { cur += ch; ra.push(cur); cur = ''; } else if (ra.length) ra[ra.length - 1] += ch; else cur += ch;
        continue;
      }
      cur += ch;
      if (troTu.has(ch) || [...cur].length >= 3) { ra.push(cur); cur = ''; }
    }
    if (cur) { if ([...cur].length === 1 && ra.length && [...ra[ra.length - 1]!].length < 4) ra[ra.length - 1] += cur; else ra.push(cur); }
    return ra;
  };
  const ds = [...cat(dau), w.chu];
  let duoi = cuoi;
  while (duoi && dauCau.has(duoi[0]!)) { ds[ds.length - 1] += duoi[0]; duoi = duoi.slice(1); }
  ds.push(...cat(duoi));
  return ds.length >= 3 && ds.length <= 8 ? ds : null;
}

const coChuoiGo = (w: TuHoc) => { const c = w.chu.trim(); return c.length >= 2 && c.length <= 20 && /^[\p{L} '-]+$/u.test(c); };

/** Các dạng dùng được cho một từ (cần đủ phương án gây nhiễu). */
export function dangDuoc(w: TuHoc, nn: NnHoc, nhieu: readonly TuHoc[]): DangCau[] {
  const khac = nhieu.filter((x) => x.k !== w.k);
  const ds: DangCau[] = ['dungSai'];
  if (khac.length >= 2) ds.push('chonNghia', 'ngheChonTu', 'chonTu');
  if (nn === 'en') {
    if (coChuoiGo(w)) ds.push('goTu');
    if (coChuoiGo(w) && w.chu.length <= 16) ds.push('ngheGo');
  } else {
    const d = docHien(w);
    if (d && new Set(khac.map(docHien).filter((x): x is string => !!x && x !== d)).size >= 3) ds.push('chonCachDoc');
  }
  if (manhChu(w, nn)) ds.push('xepChu');
  if (khac.length >= 2 && cauTrong(w, nn)) ds.push('dienCau');
  if (manhCau(w, nn)) ds.push('xepCau');
  return ds;
}

/** Vế nghĩa (để phương án gây nhiễu không "cũng đúng": "không có gì" vs "không có gì; không sao"). */
function ve(s: string): Set<string> {
  return new Set(s.toLowerCase().split(/[;,/()]/).map((x) => x.trim().replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, '')).filter(Boolean));
}
const roiNhau = (a: Set<string>, b: Set<string>) => [...a].every((x) => !b.has(x));

function bon(dung: string, ds: readonly string[], r: Rng): { pa: string[]; d: number } {
  const pa = [dung];
  const veDung = ve(dung);
  for (const s of ds) {
    if (pa.length >= 4) break;
    if (!s || pa.includes(s) || !roiNhau(ve(s), veDung) || pa.some((p) => !roiNhau(ve(p), ve(s)))) continue;
    pa.push(s);
  }
  for (const s of ds) {
    if (pa.length >= 4) break;
    if (!s || pa.includes(s) || s.toLowerCase() === dung.toLowerCase() || !roiNhau(ve(s), veDung)) continue;
    pa.push(s);
  }
  const t = tron(pa, r);
  return { pa: t, d: t.indexOf(dung) };
}

export function taoCau(w: TuHoc, dang: DangCau, nn: NnHoc, nhieu: readonly TuHoc[], so: number, r: Rng = Math.random): CauHoi {
  const khac = tron(nhieu.filter((x) => x.k !== w.k), r);
  const id = `${so}-${dang}-${w.k}`;
  const goc = { id, dang, tu: w, manh: [] as string[], dapAn: '', noi: '' };
  switch (dang) {
    case 'chonNghia': { const { pa, d } = bon(w.nghia, khac.map((x) => x.nghia), r); return { ...goc, de: w.chu, phuongAn: pa, dung: d }; }
    case 'ngheChonTu': { const { pa, d } = bon(w.chu, khac.map((x) => x.chu), r); return { ...goc, de: '', phuongAn: pa, dung: d }; }
    case 'chonTu': { const { pa, d } = bon(w.chu, khac.map((x) => x.chu), r); return { ...goc, de: w.nghia, phuongAn: pa, dung: d }; }
    case 'goTu': case 'ngheGo': return { ...goc, de: w.nghia, phuongAn: [], dung: 0 };
    case 'chonCachDoc': {
      const { pa, d } = bon(docHien(w) ?? w.chu, khac.map(docHien).filter((x): x is string => !!x), r);
      return { ...goc, de: w.chu, phuongAn: pa, dung: d };
    }
    case 'dienCau': { const { pa, d } = bon(w.chu, khac.map((x) => x.chu), r); return { ...goc, de: cauTrong(w, nn) ?? w.nghia, phuongAn: pa, dung: d }; }
    case 'dungSai': {
      const veDung = ve(w.nghia);
      const sai = khac.find((x) => x.nghia && roiNhau(ve(x.nghia), veDung))?.nghia;
      const dua = sai && r() < 0.5 ? sai : w.nghia;
      return { ...goc, de: dua, phuongAn: ['Đúng', 'Sai'], dung: dua === w.nghia ? 0 : 1 };
    }
    case 'xepChu': {
      let m = manhChu(w, nn) ?? [...w.chu];
      const dapAn = m.join('');
      if (nn !== 'en') {
        const co = new Set(m);
        const them = [...new Set(khac.flatMap((x) => manhChu(x, nn) ?? []).filter((x) => !co.has(x)))];
        m = [...m, ...tron(them, r).slice(0, m.length <= 3 ? 2 : 1)];
      }
      let t = tron(m, r);
      if (t.join('') === dapAn && m.length > 1) t = [...t].reverse();
      return { ...goc, de: w.nghia, phuongAn: [], dung: 0, manh: t, dapAn, noi: '' };
    }
    case 'xepCau': {
      const m = manhCau(w, nn) ?? [w.chu];
      const noi = nn === 'en' ? ' ' : '';
      let t = tron(m, r);
      if (t.join('\u0000') === m.join('\u0000') && m.length > 1) t = [...t].reverse();
      return { ...goc, de: w.viDuNghia ?? w.nghia, phuongAn: [], dung: 0, manh: t, dapAn: m.join(noi), noi };
    }
    case 'ghepCap': return { ...goc, de: '', phuongAn: [], dung: 0 };
  }
}

/** Dạng đầu tiên trong `uuTien` (xoay theo `xoay`) mà từ dùng được và chưa nằm trong `tranh`. */
export function chonDang(w: TuHoc, nn: NnHoc, nhieu: readonly TuHoc[], uuTien: readonly DangCau[], tranh: ReadonlySet<DangCau>, xoay: number): DangCau {
  const duoc = dangDuoc(w, nn, nhieu);
  for (let i = 0; i < uuTien.length; i++) {
    const d = uuTien[(xoay + i) % uuTien.length]!;
    if (duoc.includes(d) && !tranh.has(d)) return d;
  }
  return duoc.find((d) => !tranh.has(d)) ?? duoc[0] ?? 'dungSai';
}

/** Chấm câu gõ: bỏ hoa thường, khoảng trắng thừa, dấu câu ở hai đầu, ’ ⇒ '. */
export function goDung(go: string, w: TuHoc): boolean {
  const chuan = (s: string) => s.toLowerCase().replace(/’/g, "'").replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, '').split(/\s+/).filter(Boolean).join(' ');
  return !!go.trim() && chuan(go) === chuan(w.chu);
}

/** Chấm câu xếp mảnh: so chuỗi nối (en không phân biệt hoa thường). */
export function xepDung(chon: readonly string[], c: CauHoi, nn: NnHoc): boolean {
  const a = chon.join(c.noi);
  return nn === 'en' ? a.toLowerCase() === c.dapAn.toLowerCase() : a === c.dapAn;
}

/** Bỏ từ trùng khoá (giữ lần đầu). */
export const khongTrung = <T extends { k: string }>(ds: readonly T[]) => { const co = new Set<string>(); return ds.filter((x) => (co.has(x.k) ? false : (co.add(x.k), true))); };

/** Hàng đợi phiên HỌC (app `HangPhienHTV.hoc`). */
export function hangHoc(moi: readonly TuHoc[], nn: NnHoc, nhieu: readonly TuHoc[], r: Rng = Math.random): MucPhien[] {
  const h: MucPhien[] = [];
  let xoay = Math.floor(r() * 3), soGhep = 0;
  let truoc: TuHoc[] = [];
  for (let i = 0; i < moi.length; i += 4) {
    const n = moi.slice(i, i + 4);
    const dangA = new Map<string, DangCau>();
    for (const w of n) h.push({ loai: 'the', id: `the-${w.k}`, tu: w });
    for (const w of n) {
      const d = chonDang(w, nn, nhieu, NHAN_BIET, new Set(), xoay++);
      dangA.set(w.k, d);
      const c = taoCau(w, d, nn, nhieu, h.length, r);
      h.push({ loai: 'cau', id: `cau-${c.id}`, cau: c });
    }
    const ghep = [...n, ...tron(truoc, r).slice(0, Math.max(0, 5 - n.length))];
    if (ghep.length >= 3) h.push({ loai: 'ghep', id: `ghep-${soGhep++}`, ds: ghep });
    for (const w of tron(n, r)) {
      const a = dangA.get(w.k);
      const d = chonDang(w, nn, nhieu, NHO_LAI, new Set(a ? [a] : []), xoay++);
      const c = taoCau(w, d, nn, nhieu, h.length, r);
      h.push({ loai: 'cau', id: `cau-${c.id}`, cau: c });
    }
    truoc = [...truoc, ...n];
  }
  return h;
}

/** Hàng đợi phiên ÔN / KIỂM TRA (app `DeHocTuVungCTL.de` + vòng ghép cặp khi ôn ≥ 5 từ). */
export function hangOn(ds0: readonly TuHoc[], nn: NnHoc, nhieu: readonly TuHoc[], opt: { ghep: boolean; uuTienNhoLai?: boolean }, r: Rng = Math.random): MucPhien[] {
  const ds = khongTrung(ds0);
  const thuTu: DangCau[] = opt.uuTienNhoLai
    ? ['xepChu', 'chonTu', 'goTu', 'dienCau', 'ngheChonTu', 'xepCau', 'chonNghia', 'ngheGo', 'chonCachDoc']
    : ['chonNghia', 'xepChu', 'ngheChonTu', 'goTu', 'dungSai', 'dienCau', 'chonTu', 'xepCau', 'ngheGo', 'chonCachDoc'];
  const h: MucPhien[] = tron(ds, r).map((w, i) => {
    const c = taoCau(w, chonDang(w, nn, nhieu, thuTu, new Set(), i), nn, nhieu, i, r);
    return { loai: 'cau', id: `cau-${c.id}`, cau: c };
  });
  if (opt.ghep && ds.length >= 5) h.splice(Math.min(3, h.length), 0, { loai: 'ghep', id: 'ghep-0', ds: tron(ds, r).slice(0, 5) });
  return h;
}

/** Câu hỏi lại cho từ vừa sai — đổi sang dạng khác (gặp lại cuối phiên). */
export function cauHoiLai(w: TuHoc, nn: NnHoc, nhieu: readonly TuHoc[], tranh: ReadonlySet<DangCau>, so: number, r: Rng = Math.random): CauHoi {
  const d = chonDang(w, nn, nhieu, [...NHAN_BIET, ...NHO_LAI], tranh, Math.floor(r() * 6));
  return taoCau(w, d, nn, nhieu, so, r);
}

// ─── Trạng thái trên trình duyệt (app `KhoHocTuVungCTL`) ───────────────────────────────────────────────────────────

export type TrangThaiTu = 'dangHoc' | 'daBiet' | 'thuoc';
export interface TuCuaToi {
  nn: NnHoc; k: string; chu: string; doc?: string | null; nghia: string; id0?: number; cap?: string | null;
  viDu?: string | null; viDuNghia?: string | null;
  trangThai: TrangThaiTu; kho: boolean; lanDung: number; lanSai: number; hocLuc: string; bai?: string | null;
  /** Lúc qua kiểm tra cuối đợt 4 ngày (ISO). */
  thuocLuc?: string | null;
}
export interface CaiDatHtv {
  mucTieu: number; tuDoc: boolean; loTrinh: Partial<Record<NnHoc, 'cap' | 'chu-de'>>;
  /** Chèn 2–3 câu ngữ pháp của bài vào phiên học (app `CaiDatHTV.ghepNguPhap`, mặc định bật). */
  ghepNguPhap: boolean;
}

/**
 * ĐỢT 4 NGÀY (app `DotOnHTV` — MoHinhHocTuVungCTL.swift, 16/11/2026). LUẬT:
 *  1. Từ được tính ĐÃ HỌC hoặc bấm "Đã biết" ⇒ vào ĐỢT ĐANG MỞ của ngôn ngữ (đợt có ngày đầu B mà hôm nay < B + 4 ngày lịch);
 *     không có ⇒ mở đợt mới B = hôm nay. Từ đã nằm trong một đợt chưa xong ⇒ giữ chỗ cũ.
 *  2. Đợt TỚI HẠN lúc 9:00 ngày B + 4 (web không có giờ nhắc học riêng ⇒ luôn 9:00 như mặc định của app). App báo bằng thông
 *     báo cục bộ; web không có thông báo đẩy ⇒ thẻ "Đợt kiểm tra đến hạn" ở mục Hôm nay.
 *  3. KIỂM TRA ⇒ phiên kiểm tra các từ chưa "thuộc qua kiểm tra": đúng NGAY ⇒ `thuoc` (+ thẻ ôn lặp chấm "Dễ"); sai ⇒ khó +
 *     "đang học" (+ thẻ ôn lặp chấm "Quên"). Đợt đóng. Thoát giữa chừng ⇒ đợt vẫn chờ.
 *  4. CHƯA / BỎ QUA ⇒ dời hạn đúng 1 ngày (9:00 ngày mai) — hai nút cùng tác dụng, "Bỏ qua" KHÔNG đóng đợt.
 *  5. Từ bị "Bỏ đánh dấu" ⇒ rời mọi đợt. Đợt hết 4 ngày mà không còn từ để kiểm ⇒ tự đóng.
 * Thời điểm lưu dạng ISO; "ngày" tính theo giờ máy (như app dùng `Calendar.current`).
 */
export interface DotOn {
  id: string;
  nn: NnHoc;
  /** 0 giờ (giờ máy) ngày đầu của đợt. */
  batDau: string;
  /** Khoá từ theo thứ tự vào đợt. */
  tu: string[];
  /** Lúc hỏi (tới hạn) — dời 1 ngày mỗi lần "Chưa"/"Bỏ qua". */
  hanHoi: string;
  soLanDoi?: number;
  xongLuc?: string | null;
  dung?: number;
  sai?: number;
}
export const SO_NGAY_DOT = 4;
export const GIO_HOI_DOT: readonly [number, number] = [9, 0];
const TOI_DA_DOT = 40;

export interface KhoHtv {
  tu: Record<string, TuCuaToi>;
  /** "yyyy-MM-dd|nn" ⇒ số từ MỚI học hôm đó (trên trình duyệt này). */
  moiTheoNgay: Record<string, number>;
  caiDat: CaiDatHtv;
  /** "nn|loai" ⇒ id bài gần nhất. */
  ganNhat: Record<string, string>;
  /** Các đợt 4 ngày (giữ ≤ 40 đợt gần nhất). */
  dot: DotOn[];
  /** Điểm ngữ pháp đã luyện trong phiên (id ⇒ đúng/tổng lần gần nhất) — app `KhoNguPhapMay.ghiQuiz`. */
  nguPhap: Record<string, { dung: number; tong: number }>;
}
export const MUC_TIEU_CHON = [5, 10, 15, 20, 30] as const;
export const khoRong = (): KhoHtv => ({
  tu: {}, moiTheoNgay: {}, caiDat: { mucTieu: 10, tuDoc: true, loTrinh: {}, ghepNguPhap: true }, ganNhat: {}, dot: [], nguPhap: {},
});

const laDot = (d: unknown): d is DotOn => {
  const x = d as DotOn;
  return !!x && typeof x.id === 'string' && typeof x.nn === 'string' && typeof x.batDau === 'string' && typeof x.hanHoi === 'string'
    && Array.isArray(x.tu) && !Number.isNaN(Date.parse(x.batDau)) && !Number.isNaN(Date.parse(x.hanHoi));
};

export function docKho(raw: string | null): KhoHtv {
  try {
    const v = JSON.parse(raw ?? '') as Partial<KhoHtv>;
    const r = khoRong();
    return {
      tu: v.tu && typeof v.tu === 'object' ? v.tu : r.tu,
      moiTheoNgay: v.moiTheoNgay && typeof v.moiTheoNgay === 'object' ? v.moiTheoNgay : r.moiTheoNgay,
      caiDat: { ...r.caiDat, ...(v.caiDat ?? {}) },
      ganNhat: v.ganNhat && typeof v.ganNhat === 'object' ? v.ganNhat : r.ganNhat,
      dot: Array.isArray(v.dot) ? v.dot.filter(laDot) : r.dot,
      nguPhap: v.nguPhap && typeof v.nguPhap === 'object' ? v.nguPhap : r.nguPhap,
    };
  } catch { return khoRong(); }
}

const id = (nn: NnHoc, k: string) => `${nn}:${k}`;
export const moiHomNay = (kho: KhoHtv, nn: NnHoc, bayGio = new Date()) => kho.moiTheoNgay[`${khoaNgay(bayGio)}|${nn}`] ?? 0;

/** Từ đã gặp: trên trình duyệt này, HOẶC có thẻ trong sổ "Học từ vựng" của tài khoản (học trên điện thoại). */
export const daGapTu = (kho: KhoHtv, the: ReadonlyMap<string, TheTuCTL>, nn: NnHoc, k: string) => !!kho.tu[id(nn, k)] || the.has(k);

/** Đã thuộc: "Đã biết" / qua kiểm tra / đúng ngay ≥ 2 phiên (trình duyệt) hoặc thẻ ôn lặp nhớ sâu ≥ 21 ngày (tài khoản). */
export function thuocTu(kho: KhoHtv, the: ReadonlyMap<string, TheTuCTL>, nn: NnHoc, k: string): boolean {
  const t = kho.tu[id(nn, k)];
  if (t && (t.trangThai === 'daBiet' || t.trangThai === 'thuoc' || (t.lanDung >= 2 && !t.kho))) return true;
  const c = the.get(k);
  return !!c && daThuocThe(c);
}

export function tienDoBai(kho: KhoHtv, the: ReadonlyMap<string, TheTuCTL>, nn: NnHoc, khoa: readonly string[]) {
  let gap = 0, thuoc = 0;
  for (const k of khoa) {
    if (!daGapTu(kho, the, nn, k)) continue;
    gap++;
    if (thuocTu(kho, the, nn, k)) thuoc++;
  }
  return { gap, thuoc, tong: khoa.length };
}

const moi = (w: TuHoc, nn: NnHoc, bai: string | null, trangThai: TrangThaiTu, luc: Date): TuCuaToi => ({
  nn, k: w.k, chu: w.chu, doc: w.doc ?? null, nghia: w.nghia, id0: w.id, cap: w.cap ?? null, viDu: w.viDu ?? null,
  viDuNghia: w.viDuNghia ?? null, trangThai, kho: false, lanDung: 0, lanSai: 0, hocLuc: luc.toISOString(), bai,
});

/** MỘT từ vừa được tính "đã học" (đúng ≥ 2 dạng) ⇒ ghi + mục tiêu hôm nay + đợt 4 ngày. Trả kho MỚI + có phải từ mới thật không. */
export function ghiDaHocMot(kho: KhoHtv, w: TuHoc, nn: NnHoc, bai: string | null, luc = new Date()): { kho: KhoHtv; moi: boolean } {
  if (kho.tu[id(nn, w.k)]) return { kho: themVaoDot(kho, [w.k], nn, luc), moi: false };
  const kn = `${khoaNgay(luc)}|${nn}`;
  const k2: KhoHtv = { ...kho, tu: { ...kho.tu, [id(nn, w.k)]: moi(w, nn, bai, 'dangHoc', luc) }, moiTheoNgay: { ...kho.moiTheoNgay, [kn]: (kho.moiTheoNgay[kn] ?? 0) + 1 } };
  return { kho: themVaoDot(k2, [w.k], nn, luc), moi: true };
}

/** "Đã biết" — bỏ qua từ, không bao giờ hiện lại như từ mới; vào đợt 4 ngày như app. */
export function ghiDaBiet(kho: KhoHtv, w: TuHoc, nn: NnHoc, bai: string | null, luc = new Date()): KhoHtv {
  const co = kho.tu[id(nn, w.k)] ?? moi(w, nn, bai, 'daBiet', luc);
  const k2: KhoHtv = { ...kho, tu: { ...kho.tu, [id(nn, w.k)]: { ...co, trangThai: co.trangThai === 'thuoc' ? 'thuoc' : 'daBiet', kho: false } } };
  return themVaoDot(k2, [w.k], nn, luc);
}

/** Kết quả kiểm tra của MỘT phiên: đúng ngay lần đầu / sai (⇒ khó). */
export function ghiKetQua(kho: KhoHtv, nn: NnHoc, dungNgay: ReadonlySet<string>, sai: ReadonlySet<string>, onLai: boolean): KhoHtv {
  const tu = { ...kho.tu };
  for (const k of new Set([...dungNgay, ...sai])) {
    const t = tu[id(nn, k)];
    if (!t) continue;
    tu[id(nn, k)] = sai.has(k) ? { ...t, lanSai: t.lanSai + 1, kho: true } : { ...t, lanDung: t.lanDung + 1, kho: onLai ? false : t.kho };
  }
  return { ...kho, tu };
}

export const tuCua = (kho: KhoHtv, nn: NnHoc) => Object.values(kho.tu).filter((t) => t.nn === nn);
/** Bỏ đánh dấu ⇒ từ quay lại thành "từ mới" ở bài của nó + rời mọi đợt 4 ngày (app `boDanhDau`). */
export const boDanhDau = (kho: KhoHtv, nn: NnHoc, k: string): KhoHtv => {
  const tu = { ...kho.tu };
  delete tu[id(nn, k)];
  return { ...kho, tu, dot: kho.dot.map((d) => (d.nn === nn && d.tu.includes(k) ? { ...d, tu: d.tu.filter((x) => x !== k) } : d)) };
};
export const datKho = (kho: KhoHtv, nn: NnHoc, k: string, la: boolean): KhoHtv => {
  const t = kho.tu[id(nn, k)];
  return t ? { ...kho, tu: { ...kho.tu, [id(nn, k)]: { ...t, kho: la } } } : kho;
};
/** Từ chỉ có trong sổ "Học từ vựng" của tài khoản (học trên điện thoại) ⇒ nhận vào trình duyệt là "đang học" để đánh dấu được
 *  (app `nhanTuSoOn`). KHÔNG cộng mục tiêu hôm nay, KHÔNG vào đợt 4 ngày. Có rồi ⇒ giữ nguyên. */
export function nhanTu(kho: KhoHtv, w: TuHoc, nn: NnHoc, hocLuc: string): KhoHtv {
  if (kho.tu[id(nn, w.k)]) return kho;
  const d = new Date(hocLuc);
  return { ...kho, tu: { ...kho.tu, [id(nn, w.k)]: moi(w, nn, null, 'dangHoc', Number.isNaN(d.getTime()) ? new Date() : d) } };
}

/** "Đánh dấu đã thuộc" ở Từ của tôi (app `datThuoc`: thành "Đã biết", gỡ cờ khó). */
export const datThuoc = (kho: KhoHtv, nn: NnHoc, k: string): KhoHtv => {
  const t = kho.tu[id(nn, k)];
  return t ? { ...kho, tu: { ...kho.tu, [id(nn, k)]: { ...t, trangThai: t.trangThai === 'thuoc' ? 'thuoc' : 'daBiet', kho: false } } } : kho;
};

/** Lọc "Từ của tôi" (app `TuCuaToiHTVView.Loc`). */
export type LocTuCuaToi = 'tatCa' | 'dangHoc' | 'thuoc' | 'kho';
export function locTuCuaToi<T extends { chu: string; nghia: string; doc?: string | null; thuoc: boolean; kho?: boolean }>(ds: readonly T[], loc: LocTuCuaToi, q: string): T[] {
  const t = q.trim().toLowerCase();
  return ds.filter((x) => {
    if (loc === 'dangHoc' && x.thuoc) return false;
    if (loc === 'thuoc' && !x.thuoc) return false;
    if (loc === 'kho' && !x.kho) return false;
    return !t || x.chu.toLowerCase().includes(t) || x.nghia.toLowerCase().includes(t) || !!x.doc?.toLowerCase().includes(t);
  });
}

// ─── Đợt 4 ngày (luật ở `DotOn`) ───────────────────────────────────────────────────────────────────────────────────

const dauNgay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Hạn hỏi của đợt bắt đầu ngày `b`: ngày b + 4, lúc 9:00 (giờ máy). */
export function hanHoiDot(b: Date, gio: readonly [number, number] = GIO_HOI_DOT): Date {
  return new Date(b.getFullYear(), b.getMonth(), b.getDate() + SO_NGAY_DOT, gio[0], gio[1]);
}
/** Hết 4 ngày gom từ: 0 giờ ngày b + 4. */
export function ketThucDot(d: Pick<DotOn, 'batDau'>): Date {
  const b = new Date(d.batDau);
  return new Date(b.getFullYear(), b.getMonth(), b.getDate() + SO_NGAY_DOT);
}
export const dotXong = (d: DotOn) => !!d.xongLuc;

/** Đợt đang gom từ của ngôn ngữ (chưa xong, hôm nay còn trong 4 ngày). */
export function dotDangMo(kho: KhoHtv, nn: NnHoc, bayGio = new Date()): DotOn | null {
  for (let i = kho.dot.length - 1; i >= 0; i--) {
    const d = kho.dot[i]!;
    if (d.nn === nn && !dotXong(d) && bayGio < ketThucDot(d)) return d;
  }
  return null;
}

/** Đưa từ vào đợt đang mở (mở đợt mới nếu chưa có). Từ đã nằm trong một đợt chưa xong / đã thuộc qua kiểm tra ⇒ bỏ qua. */
export function themVaoDot(kho: KhoHtv, ks: readonly string[], nn: NnHoc, bayGio = new Date()): KhoHtv {
  const dot = kho.dot ?? [];
  const dangCho = new Set(dot.filter((d) => d.nn === nn && !dotXong(d)).flatMap((d) => d.tu));
  const can = [...new Set(ks)].filter((k) => !dangCho.has(k) && kho.tu[id(nn, k)]?.trangThai !== 'thuoc');
  if (!can.length) return kho;
  const mo = dotDangMo({ ...kho, dot }, nn, bayGio);
  let ds: DotOn[];
  if (mo) {
    ds = dot.map((d) => (d === mo ? { ...d, tu: [...d.tu, ...can.filter((k) => !d.tu.includes(k))] } : d));
  } else {
    const b = dauNgay(bayGio);
    let ma = `${nn}|${khoaNgay(b)}`;
    for (let n = 2; dot.some((d) => d.id === ma); n++) ma = `${nn}|${khoaNgay(b)}#${n}`;
    ds = [...dot, { id: ma, nn, batDau: b.toISOString(), tu: can, hanHoi: hanHoiDot(b).toISOString() }];
  }
  return { ...kho, dot: ds.slice(-TOI_DA_DOT) };
}

/** Từ còn phải kiểm của một đợt (còn trong kho, chưa "thuộc qua kiểm tra"). */
export function tuCuaDot(kho: KhoHtv, d: DotOn): TuCuaToi[] {
  return d.tu.map((k) => kho.tu[id(d.nn, k)]).filter((t): t is TuCuaToi => !!t && t.trangThai !== 'thuoc');
}

/** Đợt tới hạn sớm nhất còn từ để kiểm. */
export function dotDenHan(kho: KhoHtv, nn: NnHoc, bayGio = new Date()): DotOn | null {
  return kho.dot
    .filter((d) => d.nn === nn && !dotXong(d) && Date.parse(d.hanHoi) <= bayGio.getTime() && tuCuaDot(kho, d).length > 0)
    .sort((a, b) => Date.parse(a.hanHoi) - Date.parse(b.hanHoi))[0] ?? null;
}

/** Đợt sắp tới hạn gần nhất (chưa tới hạn) — để nói "Gấu sẽ hỏi lại vào …". */
export function dotSapToi(kho: KhoHtv, nn: NnHoc, bayGio = new Date()): DotOn | null {
  return kho.dot
    .filter((d) => d.nn === nn && !dotXong(d) && Date.parse(d.hanHoi) > bayGio.getTime() && tuCuaDot(kho, d).length > 0)
    .sort((a, b) => Date.parse(a.hanHoi) - Date.parse(b.hanHoi))[0] ?? null;
}

/** "Chưa" / "Bỏ qua" ⇒ dời hạn sang 9:00 ngày mai. */
export function doiDot(kho: KhoHtv, ma: string, bayGio = new Date()): KhoHtv {
  return {
    ...kho,
    dot: kho.dot.map((d) => {
      if (d.id !== ma || dotXong(d)) return d;
      const mai = new Date(bayGio.getFullYear(), bayGio.getMonth(), bayGio.getDate() + 1, GIO_HOI_DOT[0], GIO_HOI_DOT[1]);
      return { ...d, hanHoi: mai.toISOString(), soLanDoi: (d.soLanDoi ?? 0) + 1 };
    }),
  };
}

/**
 * Kết quả kiểm tra đợt: đúng ngay (và không sai lần nào) ⇒ ĐÃ THUỘC; sai ⇒ khó + "đang học". Đóng đợt.
 * Trả thêm `de` / `quen` (khoá từ) để bên gọi chấm thẻ ôn lặp của tài khoản ("Dễ" / "Quên") như app.
 */
export function chotDot(kho: KhoHtv, ma: string, dung: ReadonlySet<string>, sai: ReadonlySet<string>, bayGio = new Date()): { kho: KhoHtv; de: string[]; quen: string[] } {
  const d = kho.dot.find((x) => x.id === ma);
  if (!d) return { kho, de: [], quen: [] };
  const nn = d.nn;
  const tu = { ...kho.tu };
  const de: string[] = [], quen: string[] = [];
  for (const k of dung) {
    if (sai.has(k)) continue;
    const t = tu[id(nn, k)];
    if (!t) continue;
    tu[id(nn, k)] = { ...t, trangThai: 'thuoc', thuocLuc: bayGio.toISOString(), kho: false, lanDung: t.lanDung + 1 };
    de.push(k);
  }
  for (const k of sai) {
    const t = tu[id(nn, k)];
    if (!t) continue;
    tu[id(nn, k)] = { ...t, trangThai: 'dangHoc', kho: true, lanSai: t.lanSai + 1 };
    quen.push(k);
  }
  const dot = kho.dot.map((x) => (x.id === ma ? { ...x, xongLuc: bayGio.toISOString(), dung: de.length, sai: quen.length } : x));
  return { kho: { ...kho, tu, dot }, de, quen };
}

/** Đóng các đợt đã hết 4 ngày mà không còn từ nào để kiểm (luật 5). Không đổi gì ⇒ trả đúng `kho` cũ. */
export function donDotRong(kho: KhoHtv, bayGio = new Date()): KhoHtv {
  let doi = false;
  const dot = kho.dot.map((d) => {
    if (dotXong(d) || bayGio < ketThucDot(d) || tuCuaDot(kho, d).length) return d;
    doi = true;
    return { ...d, xongLuc: bayGio.toISOString() };
  });
  return doi ? { ...kho, dot } : kho;
}

// ─── Ngữ pháp chèn trong phiên (app `NguPhapPhienHTV`) ───────────────────────────────────────────────────────────

/** "a1" / "A1" / "HSK 1" / "n5" ⇒ mã cấp của thư viện ngữ pháp ("A1", "HSK1", "N5"). */
export const chuanCapNguPhap = (c: string) => c.toUpperCase().replace(/[\s~]/g, '');

/** Điểm ngữ pháp cho phiên khi bài không kèm sẵn: điểm CHƯA luyện đầu tiên cùng cấp, không có thì một điểm ngẫu nhiên cùng cấp. */
export function chonDiemNguPhap<T extends { id: string }>(
  capDs: readonly { cap: string; nhom: readonly { diem: readonly T[] }[] }[], cap: string, daLam: Readonly<Record<string, unknown>>, r: Rng = Math.random,
): T | null {
  const ds = capDs.find((c) => chuanCapNguPhap(c.cap) === chuanCapNguPhap(cap))?.nhom.flatMap((n) => n.diem) ?? [];
  if (!ds.length) return null;
  return ds.find((d) => !(d.id in daLam)) ?? ds[Math.floor(r() * ds.length)]!;
}

/** Vị trí chèn các câu ngữ pháp: rải đều trong phần hàng đợi còn lại, bắt đầu sau câu đang làm 2 mục (app `napNguPhap`). */
export function chenRai<T>(h: readonly T[], them: readonly T[], viTri: number): T[] {
  const ra = [...h];
  const tu = Math.min(ra.length, viTri + 2);
  const con = ra.length - tu;
  them.forEach((g, i) => {
    const vt = Math.min(ra.length, tu + Math.floor((con * (i + 1)) / (them.length + 1)) + i);
    ra.splice(vt, 0, g);
  });
  return ra;
}
