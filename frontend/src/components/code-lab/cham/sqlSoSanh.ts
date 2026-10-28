/**
 * Máy chấm SQL — SO KẾT QUẢ (phần thuần, 29/10/2026). Dùng chung: trang (chamSql.ts), bộ xuất đề
 * (scripts/codelab-xuat-de.mjs dựng `mongDoi` bằng chính hàm này) và test sql.test.ts.
 *
 * Một bảng kết quả = { cot: tên cột[], hang: giá trị[][] }; giá trị đã CHUẨN HOÁ:
 *   số (int/numeric/float/bigint) ⇒ number · date ⇒ 'YYYY-MM-DD' · timestamp ⇒ 'YYYY-MM-DD HH:MM:SS[.fff]'
 *   chữ ⇒ string · NULL ⇒ null · boolean ⇒ true/false.
 * Tuỳ chọn so (trên từng kiểm):
 *   thuTu        true ⇒ so đúng thứ tự dòng (đề có ORDER BY) · mặc định false: so như TẬP (multiset)
 *   tenCot       true (mặc định) ⇒ tên cột/bí danh phải khớp (không phân biệt hoa thường — SQL Server
 *                hiện đúng chữ bạn viết, PostgreSQL gập chữ thường; cả hai đều coi là một)
 *   boQuaThuTuCot true ⇒ cột được đứng thứ tự bất kỳ (ghép theo tên)
 *   saiSo        sai số tuyệt đối cho số (mặc định 1e-6 — SQL Server làm tròn DECIMAL ở 6 chữ số lẻ)
 *   nullBang     'chat' (mặc định: NULL chỉ bằng NULL) · 'rong' (NULL = '' — đề cho phép "để trống")
 *   catKhoangTrang true (mặc định) ⇒ bỏ khoảng trắng cuối chuỗi (SQL Server so sánh '=' cũng bỏ)
 */

export interface BangSql { cot: string[]; hang: unknown[][] }
export interface TuyChonSo {
  thuTu?: boolean;
  tenCot?: boolean;
  boQuaThuTuCot?: boolean;
  saiSo?: number;
  nullBang?: 'chat' | 'rong';
  catKhoangTrang?: boolean;
}
export interface KetQuaSo {
  dat: boolean;
  vi: string;
  en: string;
  /** Dòng mong đợi không thấy (≤ 10). */
  thieu?: unknown[][];
  /** Dòng thừa (≤ 10). */
  thua?: unknown[][];
  /** Chỉ số (0-based) dòng lệch đầu tiên khi so thứ tự. */
  dongLech?: number;
}

/** OID kiểu số của PostgreSQL: int2, int4, int8, oid, float4, float8, numeric. */
const KIEU_SO = new Set([20, 21, 23, 26, 700, 701, 1700]);
const KIEU_NGAY = 1082;
const KIEU_GIO = new Set([1114, 1184]);

function soTuChuoi(s: string): number | null {
  if (!/^\s*[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?\s*$/i.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Một giá trị thô từ PGlite (bộ đọc kiểu đã để numeric/int8/date/timestamp ở dạng CHỮ) ⇒ dạng chuẩn. */
export function chuanHoaGiaTri(v: unknown, kieu?: number): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return Object.is(v, -0) ? 0 : v;
  if (typeof v === 'boolean') return v;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString().replace('T', ' ').replace(/(\.000)?Z$/, '').replace(/ 00:00:00$/, '');
  if (typeof v === 'string') {
    if (kieu !== undefined && KIEU_SO.has(kieu)) {
      const n = soTuChuoi(v);
      return n === null ? v : n;
    }
    if (kieu === KIEU_NGAY) return v.slice(0, 10);
    if (kieu !== undefined && KIEU_GIO.has(kieu)) return v.replace('T', ' ').replace(/\.0+$/, '').replace(/([+-]\d\d)(:\d\d)?$/, '');
    return v;
  }
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}

/** Kết quả PGlite (rowMode 'array') ⇒ BangSql chuẩn. */
export function chuanHoaBang(cot: string[], kieu: number[], hang: unknown[][]): BangSql {
  return { cot: [...cot], hang: hang.map((h) => h.map((v, i) => chuanHoaGiaTri(v, kieu[i]))) };
}

function bangGiaTri(a: unknown, b: unknown, o: Required<Pick<TuyChonSo, 'saiSo' | 'nullBang' | 'catKhoangTrang'>>): boolean {
  if (o.nullBang === 'rong') {
    if (a === null) a = '';
    if (b === null) b = '';
  }
  if (a === null || b === null) return a === b;
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    const x = typeof a === 'boolean' ? (a ? 1 : 0) : a;
    const y = typeof b === 'boolean' ? (b ? 1 : 0) : b;
    return x === y || String(x) === String(y);
  }
  const na = typeof a === 'number' ? a : typeof a === 'string' ? soTuChuoi(a) : null;
  const nb = typeof b === 'number' ? b : typeof b === 'string' ? soTuChuoi(b) : null;
  // so như SỐ khi ít nhất một vế là number và vế kia đọc được thành số (vd CAST(x AS VARCHAR) ⇒ '3.50')
  if ((typeof a === 'number' || typeof b === 'number') && na !== null && nb !== null) {
    return Math.abs(na - nb) <= o.saiSo + 1e-12 * Math.max(Math.abs(na), Math.abs(nb));
  }
  let sa = String(a);
  let sb = String(b);
  if (o.catKhoangTrang) { sa = sa.replace(/\s+$/, ''); sb = sb.replace(/\s+$/, ''); }
  return sa === sb;
}

/** Hiện một giá trị trong thông báo/bảng. */
export function hienGiaTri(v: unknown): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'string') return `'${v}'`;
  return String(v);
}
const hienDong = (h: unknown[]) => `(${h.map(hienGiaTri).join(', ')})`;
const thuong = (s: string) => String(s).toLowerCase();

/**
 * So bảng người học (`thay`) với bảng mong đợi (`mong`). Thông báo song ngữ, ngắn, chỉ ra CHỖ sai đầu
 * tiên: số cột → tên cột → số dòng → dòng thiếu/thừa (hoặc dòng lệch đầu tiên khi so thứ tự).
 */
export function soSanhBang(mong: BangSql, thayGoc: BangSql, tuy: TuyChonSo = {}): KetQuaSo {
  const o = { saiSo: tuy.saiSo ?? 1e-6, nullBang: tuy.nullBang ?? 'chat', catKhoangTrang: tuy.catKhoangTrang ?? true } as const;
  const tenCot = tuy.tenCot ?? true;
  let thay = thayGoc;

  // ── cột ──
  if (thay.cot.length !== mong.cot.length) {
    return {
      dat: false,
      vi: `Số cột sai: bạn trả ${thay.cot.length} cột (${thay.cot.join(', ') || '—'}), đề cần ${mong.cot.length} cột: ${mong.cot.join(', ')}.`,
      en: `Wrong number of columns: you returned ${thay.cot.length} (${thay.cot.join(', ') || '—'}), expected ${mong.cot.length}: ${mong.cot.join(', ')}.`,
    };
  }
  if (tenCot && tuy.boQuaThuTuCot) {
    const viTri = mong.cot.map((c) => thay.cot.findIndex((t) => thuong(t) === thuong(c)));
    const thieu = mong.cot.filter((_, i) => viTri[i] < 0);
    if (thieu.length) {
      return { dat: false, vi: `Thiếu cột: ${thieu.join(', ')} (bạn có: ${thay.cot.join(', ')}). Đặt bí danh bằng AS.`, en: `Missing column(s): ${thieu.join(', ')} (you have: ${thay.cot.join(', ')}). Use AS aliases.` };
    }
    thay = { cot: mong.cot, hang: thay.hang.map((h) => viTri.map((j) => h[j])) };
  } else if (tenCot) {
    const lech = mong.cot.findIndex((c, i) => thuong(c) !== thuong(thay.cot[i]));
    if (lech >= 0) {
      const coDoiCho = mong.cot.every((c) => thay.cot.some((t) => thuong(t) === thuong(c)));
      return {
        dat: false,
        vi: coDoiCho
          ? `Đúng tên cột nhưng SAI THỨ TỰ: đề cần ${mong.cot.join(', ')}; bạn trả ${thay.cot.join(', ')}.`
          : `Cột thứ ${lech + 1} tên "${thay.cot[lech]}", đề cần "${mong.cot[lech]}". Đặt bí danh: … AS ${mong.cot[lech]}.`,
        en: coDoiCho
          ? `Right column names, WRONG ORDER: expected ${mong.cot.join(', ')}; you returned ${thay.cot.join(', ')}.`
          : `Column ${lech + 1} is named "${thay.cot[lech]}", expected "${mong.cot[lech]}". Add an alias: … AS ${mong.cot[lech]}.`,
      };
    }
  }

  // ── dòng ──
  const nM = mong.hang.length;
  const nT = thay.hang.length;
  const bangDong = (a: unknown[], b: unknown[]) => a.length === b.length && a.every((x, i) => bangGiaTri(x, b[i], o));

  if (tuy.thuTu) {
    const n = Math.min(nM, nT);
    for (let i = 0; i < n; i++) {
      if (!bangDong(mong.hang[i], thay.hang[i])) {
        // cùng tập dòng nhưng khác thứ tự? ⇒ nói thẳng là lỗi ORDER BY
        const cungTap = nM === nT && soTap(mong.hang, thay.hang, bangDong).thieu.length === 0;
        return {
          dat: false,
          dongLech: i,
          vi: cungTap
            ? `Đủ dòng nhưng SAI THỨ TỰ từ dòng ${i + 1}: mong ${hienDong(mong.hang[i])}, nhận ${hienDong(thay.hang[i])}. Xem lại ORDER BY (cột nào, ASC/DESC, khoá phụ).`
            : `Dòng ${i + 1} lệch: mong ${hienDong(mong.hang[i])}, nhận ${hienDong(thay.hang[i])}.`,
          en: cungTap
            ? `All rows present but in the WRONG ORDER from row ${i + 1}: expected ${hienDong(mong.hang[i])}, got ${hienDong(thay.hang[i])}. Check ORDER BY (columns, ASC/DESC, tie-breaker).`
            : `Row ${i + 1} differs: expected ${hienDong(mong.hang[i])}, got ${hienDong(thay.hang[i])}.`,
        };
      }
    }
    if (nM !== nT) {
      const thieu = nT < nM ? mong.hang.slice(nT, nT + 10) : [];
      const thua = nT > nM ? thay.hang.slice(nM, nM + 10) : [];
      return {
        dat: false, dongLech: n, thieu, thua,
        vi: `Số dòng sai: nhận ${nT}, mong ${nM}. ${nT < nM ? `Thiếu từ dòng ${nT + 1}: ${hienDong(mong.hang[nT])}` : `Thừa từ dòng ${nM + 1}: ${hienDong(thay.hang[nM])}`}.`,
        en: `Wrong row count: got ${nT}, expected ${nM}. ${nT < nM ? `Missing from row ${nT + 1}: ${hienDong(mong.hang[nT])}` : `Extra from row ${nM + 1}: ${hienDong(thay.hang[nM])}`}.`,
      };
    }
    return { dat: true, vi: `Đúng ${nM} dòng, đúng thứ tự.`, en: `All ${nM} row(s) match, in order.` };
  }

  const { thieu, thua } = soTap(mong.hang, thay.hang, bangDong);
  if (!thieu.length && !thua.length) return { dat: true, vi: `Đúng ${nM} dòng.`, en: `All ${nM} row(s) match.` };
  const phanVi: string[] = [];
  const phanEn: string[] = [];
  if (nM !== nT) { phanVi.push(`nhận ${nT} dòng, mong ${nM}`); phanEn.push(`got ${nT} rows, expected ${nM}`); }
  if (thieu.length) { phanVi.push(`thiếu ${thieu.length} dòng, vd ${hienDong(thieu[0])}`); phanEn.push(`${thieu.length} missing, e.g. ${hienDong(thieu[0])}`); }
  if (thua.length) { phanVi.push(`thừa ${thua.length} dòng, vd ${hienDong(thua[0])}`); phanEn.push(`${thua.length} extra, e.g. ${hienDong(thua[0])}`); }
  // gợi ý theo hình dạng lỗi
  let goiYVi = '';
  let goiYEn = '';
  if (thua.length && !thieu.length && hasDup(thay.hang, bangDong)) {
    goiYVi = ' Có dòng lặp — JOIN nhân bản dòng? Thử DISTINCT hoặc xem lại điều kiện nối.';
    goiYEn = ' Duplicated rows — did a JOIN multiply rows? Try DISTINCT or check the join condition.';
  } else if (thieu.length && !thua.length) {
    goiYVi = ' Thiếu dòng — INNER JOIN làm rơi dòng không có cặp (cần LEFT JOIN?), hay điều kiện WHERE quá chặt / so sánh với NULL bằng = ?';
    goiYEn = ' Missing rows — did an INNER JOIN drop unmatched rows (need LEFT JOIN?), or is WHERE too strict / comparing NULL with = ?';
  }
  return {
    dat: false, thieu: thieu.slice(0, 10), thua: thua.slice(0, 10),
    vi: `Kết quả chưa khớp: ${phanVi.join('; ')}.${goiYVi}`,
    en: `Result differs: ${phanEn.join('; ')}.${goiYEn}`,
  };
}

/** So hai danh sách dòng như multiset (ghép tham lam — đủ cho vài nghìn dòng). */
function soTap(mong: unknown[][], thay: unknown[][], bang: (a: unknown[], b: unknown[]) => boolean): { thieu: unknown[][]; thua: unknown[][] } {
  const dung = new Array(thay.length).fill(false);
  // chỉ mục nhanh theo khoá thô (đa số trùng khít) rồi mới quét sai số
  const theoKhoa = new Map<string, number[]>();
  thay.forEach((h, i) => { const k = khoaDong(h); theoKhoa.set(k, [...(theoKhoa.get(k) ?? []), i]); });
  const thieu: unknown[][] = [];
  for (const h of mong) {
    const ung = (theoKhoa.get(khoaDong(h)) ?? []).find((i) => !dung[i] && bang(h, thay[i]));
    const j = ung ?? thay.findIndex((t, i) => !dung[i] && bang(h, t));
    if (j === undefined || j < 0) thieu.push(h); else dung[j] = true;
  }
  return { thieu, thua: thay.filter((_, i) => !dung[i]) };
}
function khoaDong(h: unknown[]): string {
  return JSON.stringify(h.map((v) => (typeof v === 'string' ? v.replace(/\s+$/, '') : v)));
}
function hasDup(hang: unknown[][], bang: (a: unknown[], b: unknown[]) => boolean): boolean {
  for (let i = 0; i < hang.length && i < 500; i++) for (let j = i + 1; j < hang.length && j < 500; j++) if (bang(hang[i], hang[j])) return true;
  return false;
}

/** Bảng chữ thô (cho `thay` của lượt nộp, ví dụ trong đề, test): tối đa `max` dòng. */
export function bangChu(b: BangSql, max = 8): string {
  const hang = b.hang.slice(0, max).map((h) => h.map((v) => (v === null ? 'NULL' : String(v))));
  const rong = b.cot.map((c, i) => Math.min(28, Math.max(String(c).length, ...hang.map((h) => (h[i] ?? '').length))));
  const dong = (ds: string[]) => ds.map((x, i) => (x.length > rong[i] ? `${x.slice(0, rong[i] - 1)}…` : x.padEnd(rong[i]))).join(' | ');
  const out = [dong(b.cot), rong.map((r) => '-'.repeat(r)).join('-+-'), ...hang.map(dong)];
  if (b.hang.length > max) out.push(`… (${b.hang.length} rows)`);
  return out.join('\n');
}
