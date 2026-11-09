/**
 * Nhóm cuộc trò chuyện ở thanh bên theo NGÀY, kiểu Claude:
 * Đã ghim · Hôm nay · 7 ngày qua · 30 ngày qua · Cũ hơn.
 *
 * Thuần, không React — để kiểm bằng vitest (`CtcNhomNgay.test.ts`). Mốc "hôm
 * nay" là 0 giờ theo giờ MÁY, không phải 24 giờ trước: cuộc lúc 23h hôm qua
 * nằm ở "7 ngày qua" chứ không lẫn vào "Hôm nay".
 */

export type KhoaNhom = 'ghim' | 'homNay' | 'tuan' | 'thang' | 'cu';

/** Nhãn tiếng Việt — dịch ở chỗ DỰNG (`useCtcChu`), không ở đây. */
export const NHAN_NHOM: Record<KhoaNhom, string> = {
  ghim: 'Đã ghim',
  homNay: 'Hôm nay',
  tuan: '7 ngày qua',
  thang: '30 ngày qua',
  cu: 'Cũ hơn',
};

const THU_TU: KhoaNhom[] = ['ghim', 'homNay', 'tuan', 'thang', 'cu'];

export function khoaNgay(iso: string, bayGio: number): Exclude<KhoaNhom, 'ghim'> {
  const luc = new Date(iso).getTime();
  if (!Number.isFinite(luc)) return 'cu';
  const d = new Date(bayGio);
  const dauHomNay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (luc >= dauHomNay) return 'homNay';
  const NGAY = 86_400_000;
  if (luc >= dauHomNay - 7 * NGAY) return 'tuan';
  if (luc >= dauHomNay - 30 * NGAY) return 'thang';
  return 'cu';
}

/**
 * Gom theo nhóm, GIỮ thứ tự máy chủ trả trong từng nhóm (máy chủ sắp mới nhất
 * lên đầu). Nhóm rỗng bị bỏ.
 */
export function nhomTheoNgay<T extends { updatedAt: string; pinned?: boolean }>(
  ds: T[],
  bayGio: number = Date.now(),
): Array<{ khoa: KhoaNhom; ds: T[] }> {
  const m = new Map<KhoaNhom, T[]>();
  for (const p of ds) {
    const k: KhoaNhom = p.pinned === true ? 'ghim' : khoaNgay(p.updatedAt, bayGio);
    const cu = m.get(k);
    if (cu) cu.push(p); else m.set(k, [p]);
  }
  return THU_TU.filter((k) => m.has(k)).map((k) => ({ khoa: k, ds: m.get(k)! }));
}
