/**
 * Bộ XOAY VÒNG bài "Học mỗi ngày" — phần THUẦN (không DB/mạng), kiểm thử được.
 * ─────────────────────────────────────────────────────────────────────────
 * Vấn đề cũ (đo prod 10/11/2026): 47 bài bot từ 19/10, 21 bài cùng là
 * "Claude Code vs Antigravity", mọi bài cùng một khung chữ và một tấm bìa.
 * Ở đây mỗi lần chọn bài phải qua bốn luật, theo thứ tự:
 *
 *   1. KHÔNG LẶP: id đã đăng thì không đăng lại khi thư viện còn bài mới; hết
 *      bài mới thì chỉ cho đăng lại bài đã cũ hơn `KHONG_LAP_NGAY` ngày.
 *   2. TRẦN công cụ AI: nhóm 'cong-cu-ai' tối đa 1 bài trong `CUA_SO_AI` bài
 *      gần nhất (≈ ≤ 7%) — người dùng chán bài so sánh AI.
 *   3. HẠN MỨC NHÓM: ưu tiên nhóm đang THIẾU nhiều nhất so với tỉ trọng mục
 *      tiêu `TI_TRONG`, tính trên `CUA_SO` bài gần nhất.
 *   4. ĐỔI ĐỊNH DẠNG + ĐỔI MẪU ẢNH: không trùng định dạng với 2 bài gần nhất,
 *      không trùng mẫu ảnh với bài ngay trước (nới luật nếu không còn lựa chọn).
 *
 * Hoà điểm ⇒ băm (ngày, lượt, id) — xác định, tái lập được.
 */
import type { BaiHoc, DinhDang, NhomChuDe } from './kieu.js';

export const KHONG_LAP_NGAY = 120;
export const CUA_SO = 30;
export const CUA_SO_AI = 14;

/** Tỉ trọng mục tiêu theo nhóm (tổng = 1). Công cụ AI cố ý nhỏ nhất. */
export const TI_TRONG: Record<NhomChuDe, number> = {
  'cs-sau': 0.24,
  bug: 0.13,
  til: 0.11,
  'phong-van': 0.09,
  'so-sanh': 0.09,
  'su-nghiep': 0.09,
  'fun-fact': 0.06,
  'lich-su': 0.05,
  'case-study': 0.05,
  'tai-nguyen': 0.05,
  'cong-cu-ai': 0.04,
};

export interface DaDang {
  id: string;
  nhom: NhomChuDe;
  dinhDang: DinhDang;
  mau: string;
  /** ms epoch */
  luc: number;
}

function bam(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

export interface ChonKetQua { bai: BaiHoc; lyDo: string[] }

/**
 * Chọn bài kế tiếp. `lichSu` = bài ĐÃ đăng, MỚI NHẤT TRƯỚC.
 * Trả null khi không còn bài nào hợp lệ (mọi bài đều đăng trong KHONG_LAP_NGAY).
 */
export function chonBaiKeTiep(
  thuVien: BaiHoc[],
  lichSu: DaDang[],
  opts: { bayGio: number; khoaNgay: string; luot: number },
): ChonKetQua | null {
  const daDang = new Map<string, number>(); // id -> lần đăng gần nhất
  for (const h of lichSu) if (!daDang.has(h.id)) daDang.set(h.id, h.luc);

  const chuaDang = thuVien.filter((b) => !daDang.has(b.id));
  const nguong = opts.bayGio - KHONG_LAP_NGAY * 86_400_000;
  let ungVien = chuaDang.length
    ? chuaDang
    : thuVien.filter((b) => (daDang.get(b.id) ?? 0) < nguong);
  const lyDo: string[] = [chuaDang.length ? `còn ${chuaDang.length} bài chưa đăng` : 'đã hết bài mới ⇒ đăng lại bài cũ'];
  if (!ungVien.length) return null;

  // 2. Trần công cụ AI.
  const ganDayAi = lichSu.slice(0, CUA_SO_AI).filter((h) => h.nhom === 'cong-cu-ai').length;
  if (ganDayAi >= 1) {
    const bot = ungVien.filter((b) => b.nhom !== 'cong-cu-ai');
    if (bot.length) { ungVien = bot; lyDo.push('đã có bài công cụ AI gần đây ⇒ loại nhóm AI'); }
  }

  // 4. Đổi định dạng / mẫu ảnh (lọc mềm: chỉ áp khi còn lựa chọn).
  const dd2 = new Set(lichSu.slice(0, 2).map((h) => h.dinhDang));
  const mau1 = lichSu[0]?.mau;
  const locDd = ungVien.filter((b) => !dd2.has(b.dinhDang));
  if (locDd.length) ungVien = locDd;
  const locMau = ungVien.filter((b) => b.anh.mau !== mau1);
  if (locMau.length) ungVien = locMau;

  // 3. Hạn mức nhóm: điểm = tỉ trọng mục tiêu − tỉ lệ thực trong cửa sổ.
  const cuaSo = lichSu.slice(0, CUA_SO);
  const dem: Partial<Record<NhomChuDe, number>> = {};
  for (const h of cuaSo) dem[h.nhom] = (dem[h.nhom] ?? 0) + 1;
  const n = Math.max(1, cuaSo.length);
  const diem = (b: BaiHoc) => TI_TRONG[b.nhom] - (dem[b.nhom] ?? 0) / n;

  const xep = [...ungVien].sort((a, b) =>
    diem(b) - diem(a) ||
    bam(`${opts.khoaNgay}|${opts.luot}|${a.id}`) - bam(`${opts.khoaNgay}|${opts.luot}|${b.id}`));
  const bai = xep[0];
  lyDo.push(`nhóm ${bai.nhom} (thiếu ${(diem(bai) * 100).toFixed(0)}%)`, `định dạng ${bai.dinhDang}`, `mẫu ảnh ${bai.anh.mau}`);
  return { bai, lyDo };
}

/** Khung giờ VN đăng bài học trong ngày, theo số bài/ngày (1–5). */
export const KHUNG_HOC: Record<number, string[]> = {
  1: ['18:00'],
  2: ['10:00', '18:00'],
  3: ['07:00', '15:00', '22:00'],
  4: ['07:00', '10:00', '15:00', '22:00'],
  5: ['07:00', '10:00', '15:00', '18:00', '22:00'],
};

export function soBaiMoiNgay(raw: string | undefined): number {
  const n = Math.round(Number(raw ?? 3));
  return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : 3;
}

/** Lượt thứ mấy trong ngày cho khung giờ này, hoặc -1 nếu khung không đăng. */
export function luotCuaKhung(slot: string, soBai: number): number {
  return (KHUNG_HOC[soBai] ?? KHUNG_HOC[3]).indexOf(slot);
}
