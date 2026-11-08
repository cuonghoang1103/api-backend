/**
 * CHỦ ĐỀ SÁNG/TỐI — luật thuần, dùng chung cho cửa sổ chính, robot nổi và main (màu nền cửa sổ).
 *
 * Bốn chế độ (08/11/2026):
 *   • `system` — "Mặc định": theo hệ điều hành. Giữ tên cũ để giá trị đã lưu vẫn hợp lệ.
 *   • `light`  — "Sáng".
 *   • `dark`   — "Tối".
 *   • `theo-gio` — "Theo giờ": sáng từ `gioSang` tới trước `gioToi` (mặc định 06:00 → 18:00), còn lại tối.
 *
 * Không phụ thuộc DOM/Electron để test được và để ba nơi trên không tự viết ba phiên bản lệch nhau.
 */

export type CheDoChuDe = 'light' | 'dark' | 'system' | 'theo-gio';
export type ChuDeHien = 'light' | 'dark';

export const GIO_SANG_MAC_DINH = 6;
export const GIO_TOI_MAC_DINH = 18;

/** Giá trị đã lưu (có thể là rác/không có) ⇒ chế độ hợp lệ. Không nhận ra ⇒ `system` (Mặc định). */
export function docCheDo(v: unknown): CheDoChuDe {
  return v === 'light' || v === 'dark' || v === 'system' || v === 'theo-gio' ? v : 'system';
}

/** Giờ hợp lệ 0..23 (số nguyên); sai ⇒ giá trị mặc định. */
export function docGio(v: unknown, macDinh: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isInteger(n) && n >= 0 && n <= 23 ? n : macDinh;
}

/**
 * Giờ `gio` (0..23, có thể lẻ phút: 6.5 = 06:30) có nằm trong khoảng SÁNG không.
 * Khoảng có thể vắt qua nửa đêm (gioSang 20, gioToi 4 ⇒ sáng 20:00 → 04:00). gioSang = gioToi ⇒ luôn sáng.
 */
export function laGioSang(gio: number, gioSang: number, gioToi: number): boolean {
  if (gioSang === gioToi) return true;
  return gioSang < gioToi ? gio >= gioSang && gio < gioToi : gio >= gioSang || gio < gioToi;
}

export interface NguCanhChuDe {
  heThongToi: boolean;
  bayGio?: Date;
  gioSang?: number;
  gioToi?: number;
}

export function giaiChuDe(cheDo: unknown, nc: NguCanhChuDe): ChuDeHien {
  const c = docCheDo(cheDo);
  if (c === 'light' || c === 'dark') return c;
  if (c === 'system') return nc.heThongToi ? 'dark' : 'light';
  const d = nc.bayGio ?? new Date();
  const gio = d.getHours() + d.getMinutes() / 60;
  return laGioSang(gio, nc.gioSang ?? GIO_SANG_MAC_DINH, nc.gioToi ?? GIO_TOI_MAC_DINH) ? 'light' : 'dark';
}

/**
 * Số mili-giây tới mốc đổi kế tiếp (đầu giờ `gioSang` hoặc `gioToi`, giờ ĐỊA PHƯƠNG). Dùng để hẹn một setTimeout
 * thay vì kiểm mỗi giây. Luôn ≥ 1000 để không quay vòng sát mốc.
 */
export function msToiMocKe(bayGio: Date, gioSang: number, gioToi: number): number {
  let tot = Infinity;
  for (const h of [gioSang, gioToi]) {
    const m = new Date(bayGio);
    m.setHours(h, 0, 0, 0);
    if (m.getTime() <= bayGio.getTime()) m.setDate(m.getDate() + 1);
    tot = Math.min(tot, m.getTime() - bayGio.getTime());
  }
  return Math.max(1000, tot);
}
