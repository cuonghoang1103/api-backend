/**
 * Giao diện chung của web do ADMIN đặt (27/10/2026) — lưu một dòng JSON ở `app_settings` (khoá `giao_dien_web`).
 *   · chuDeMacDinh — chủ đề 4 mùa cho người CHƯA tự chọn (mặc định 'macDinh' = web như cũ).
 *   · epTatCa      — true ⇒ áp chủ đề của admin cho MỌI người, đè lựa chọn riêng.
 *   · nenAdmin     — nền trang admin: 'nau' (đen nâu dịu, mặc định) · 'xanh' (kiểu aidev) · 'mua' (theo mùa).
 * Đọc có đệm 60 s; CSDL hỏng ⇒ trả mặc định (không làm hỏng trang).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export const CHU_DE_HOP_LE = ['macDinh', 'tuDong', 'xuan', 'ha', 'thu', 'dong'] as const;
export type ChuDeWeb = (typeof CHU_DE_HOP_LE)[number];
export const NEN_ADMIN_HOP_LE = ['nau', 'xanh', 'mua'] as const;
export type NenAdmin = (typeof NEN_ADMIN_HOP_LE)[number];

export interface GiaoDienWeb { chuDeMacDinh: ChuDeWeb; epTatCa: boolean; nenAdmin: NenAdmin; capNhat: string | null }

const KHOA = 'giao_dien_web';
export const GIAO_DIEN_MAC_DINH: GiaoDienWeb = { chuDeMacDinh: 'macDinh', epTatCa: false, nenAdmin: 'nau', capNhat: null };

let dem: { v: GiaoDienWeb; luc: number } | null = null;
const DEM_MS = 60_000;

/** Chuẩn hoá dữ liệu bất kỳ thành GiaoDienWeb hợp lệ (trường lạ/sai ⇒ mặc định). */
export function chuanHoaGiaoDien(raw: unknown, capNhat: string | null = null): GiaoDienWeb {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const cd = CHU_DE_HOP_LE.includes(o.chuDeMacDinh as ChuDeWeb) ? (o.chuDeMacDinh as ChuDeWeb) : GIAO_DIEN_MAC_DINH.chuDeMacDinh;
  const na = NEN_ADMIN_HOP_LE.includes(o.nenAdmin as NenAdmin) ? (o.nenAdmin as NenAdmin) : GIAO_DIEN_MAC_DINH.nenAdmin;
  return { chuDeMacDinh: cd, epTatCa: o.epTatCa === true && cd !== 'macDinh', nenAdmin: na, capNhat };
}

export async function docGiaoDienWeb(): Promise<GiaoDienWeb> {
  if (dem && Date.now() - dem.luc < DEM_MS) return dem.v;
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    let raw: unknown = {};
    try { raw = r?.value ? JSON.parse(r.value) : {}; } catch { raw = {}; }
    const v = chuanHoaGiaoDien(raw, r?.updatedAt?.toISOString() ?? null);
    dem = { v, luc: Date.now() };
    return v;
  } catch (err) {
    logger.warn('[giao-dien] không đọc được cài đặt — dùng mặc định', { error: (err as Error).message });
    return dem?.v ?? GIAO_DIEN_MAC_DINH;
  }
}

export async function datGiaoDienWeb(moi: Partial<GiaoDienWeb>): Promise<GiaoDienWeb> {
  const cu = await docGiaoDienWeb();
  const v = chuanHoaGiaoDien({ ...cu, ...moi });
  const value = JSON.stringify({ chuDeMacDinh: v.chuDeMacDinh, epTatCa: v.epTatCa, nenAdmin: v.nenAdmin });
  const r = await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  const out = { ...v, capNhat: r.updatedAt.toISOString() };
  dem = { v: out, luc: Date.now() };
  logger.info('[giao-dien] admin đổi giao diện web', out);
  return out;
}

/** Chỉ dùng trong test. */
export function _xoaDemGiaoDien(): void { dem = null; }
