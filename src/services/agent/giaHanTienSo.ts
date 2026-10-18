/**
 * SỔ MÃ GIA HẠN THEO $ — chỉ ĐỌC tổng đã cấp (19/10/2026).
 *
 * Tách khỏi `maGiaHanTien.ts` để các trần (`tranModel.ts`, `viTien.ts`, `anthropicChinhHang/hanMuc.ts`,
 * `hanMucNhom.ts`) cộng phần gia hạn vào trần của chúng mà KHÔNG nhập vòng (`maGiaHanTien.ts` nhập ngược các trần
 * đó để kiểm "đã chạm thật chưa").
 *
 * Một lượt `DA_CAP` tính cho kỳ mà nó được CẤP (`capLuc`): kỳ ngày ⇒ từ 0 giờ hôm nay (giờ VN), kỳ tháng ⇒ từ đầu
 * tháng, kỳ cửa sổ trượt (ví AI Code 5 giờ) ⇒ trong cửa sổ vừa qua — trôi ra ngoài là hết tính, đúng như tiền đã
 * tiêu trôi ra. Đọc hỏng ⇒ 0 (về trần gốc): gia hạn là phần THÊM, hỏng thì không bao giờ được nới.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type KyGiaHan = 'ngay' | 'thang' | 'cuaSo';
export const DS_KY: readonly KyGiaHan[] = ['ngay', 'thang', 'cuaSo'];

const VN_MS = 7 * 3600_000;
/** 0 giờ hôm nay giờ Việt Nam (chép từ `anthropicChinhHang/hanMuc.ts` — tránh nhập vòng). */
export function dauNgayVnSo(luc = new Date()): Date {
  const vn = new Date(luc.getTime() + VN_MS);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - VN_MS);
}
export function dauThangVnSo(luc = new Date()): Date {
  const vn = new Date(luc.getTime() + VN_MS);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), 1) - VN_MS);
}

/** Đầu KỲ của một trần: ngày/tháng lịch giờ VN, hoặc cửa sổ trượt `soGio` giờ. */
export function dauKy(ky: KyGiaHan, luc = new Date(), soGio = 5): Date {
  if (ky === 'ngay') return dauNgayVnSo(luc);
  if (ky === 'thang') return dauThangVnSo(luc);
  return new Date(luc.getTime() - soGio * 3_600_000);
}

export interface LuotDaCap { ky: string; soUsd: number; capLuc: Date | null }

/** THUẦN: các lượt đã cấp ⇒ tổng USD còn tính theo từng kỳ ở thời điểm `luc`. */
export function tongTheoKy(ds: LuotDaCap[], luc = new Date(), soGio = 5): Record<KyGiaHan, number> {
  const ra: Record<KyGiaHan, number> = { ngay: 0, thang: 0, cuaSo: 0 };
  for (const r of ds) {
    if (!r.capLuc || !(DS_KY as readonly string[]).includes(r.ky)) continue;
    const ky = r.ky as KyGiaHan;
    const t = r.capLuc.getTime();
    if (t < dauKy(ky, luc, soGio).getTime() || t > luc.getTime()) continue;
    ra[ky] += Number(r.soUsd) || 0;
  }
  for (const k of DS_KY) ra[k] = Math.round(ra[k] * 10_000) / 10_000;
  return ra;
}

/**
 * Tổng USD đã CẤP (đang tính) cho một trần của một người. `soGio` chỉ dùng cho kỳ cửa sổ trượt.
 * Đọc từ đầu tháng (kỳ dài nhất) — hoặc đầu cửa sổ nếu cửa sổ dài hơn.
 */
export async function tienGiaHanTheoKy(userId: number, tran: string, luc = new Date(), soGio = 5): Promise<Record<KyGiaHan, number>> {
  try {
    const tu = new Date(Math.min(dauThangVnSo(luc).getTime(), luc.getTime() - soGio * 3_600_000));
    const ds = await prisma.agentGiaHanTien.findMany({
      where: { userId, tran, trangThai: 'DA_CAP', capLuc: { gte: tu } },
      select: { ky: true, soUsd: true, capLuc: true },
      take: 500,
    });
    return tongTheoKy(ds, luc, soGio);
  } catch (err) {
    logger.warn('[gia-han-tien] không đọc được sổ gia hạn — dùng trần gốc', { error: (err as Error).message });
    return { ngay: 0, thang: 0, cuaSo: 0 };
  }
}
