/**
 * TRẦN CHI TIÊU cổng Claude chính hãng — theo GÓI và theo NGƯỜI.
 *
 * Hai phần tách riêng, mỗi phần có trần THÁNG và (tuỳ chọn) trần NGÀY:
 *   free — CuongMini Free (tự bật khi rambo hỏng, không cần mật khẩu)
 *   cao  — model cao (cần vé mật khẩu)
 *
 * Gói thật của web (đọc `pro.service.ts` + `keyTerminal.ts`): admin · pro ·
 * key_terminal (tài khoản thường có key terminal còn hạn). Không có "bậc Pro"
 * nào khác — `ProPlan` chỉ khác số tháng.
 *
 * Thứ tự áp: admin ⇒ KHÔNG GIỚI HẠN (vẫn đếm) · trần RIÊNG của người (bảng
 * `anthropic_user_caps`, trường null = theo gói) · trần GÓI (`app_settings`
 * khoá `anthropic_chinh_hang_tran_goi`, JSON) · mặc định trong mã.
 *
 * Tháng/ngày tính theo LỊCH giờ Việt Nam (đầu tháng / 00:00), không trượt —
 * vì người dùng hiểu "trần tháng" theo lịch, và credit Anthropic cũng làm mới
 * theo tháng.
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import type { HangChinhHang } from './cauHinh.js';
import { tienGiaHanTheoKy } from '../giaHanTienSo.js';

export type GoiTaiKhoan = 'admin' | 'pro' | 'key_terminal' | 'khac';
export const GOI_CO_TRAN = ['pro', 'key_terminal'] as const;
export type GoiCoTran = (typeof GOI_CO_TRAN)[number];

export interface TranCap { thang: number | null; ngay: number | null }
export type TranGoi = Record<HangChinhHang, TranCap>;

const KHOA_TRAN_GOI = 'anthropic_chinh_hang_tran_goi';
const VN_MS = 7 * 3600_000;

/** Mặc định khi admin chưa đặt — đủ chặt để một vòng lặp hỏng không đốt hết credit. */
export const TRAN_MAC_DINH: Record<GoiCoTran, TranGoi> = {
  // 18/10/2026: nhóm free (Sonic 5.5 + Heshin 5.5) nâng theo trần ×10 của từng model (100 + 80 $/tháng, 20 $/ngày).
  pro: { free: { thang: 180, ngay: 40 }, cao: { thang: 20, ngay: null } },
  key_terminal: { free: { thang: 2, ngay: 0.3 }, cao: { thang: 10, ngay: null } },
};

export async function goiCuaNguoi(userId: number): Promise<GoiTaiKhoan> {
  const { getProStatus } = await import('../../pro.service.js');
  const s = await getProStatus(userId);
  if (s.isAdmin) return 'admin';
  if (s.effective) return 'pro';
  const { coKeyTerminalHieuLuc } = await import('../keyTerminal.js');
  return (await coKeyTerminalHieuLuc(userId)) ? 'key_terminal' : 'khac';
}

function docCap(v: unknown, mac: TranCap): TranCap {
  const so = (x: unknown, m: number | null) =>
    x === null ? null : typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : m;
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return { thang: so(o.thang, mac.thang), ngay: so(o.ngay, mac.ngay) };
}

export async function docTranGoi(): Promise<Record<GoiCoTran, TranGoi>> {
  let dat: Record<string, unknown> = {};
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA_TRAN_GOI } });
    if (r?.value) dat = JSON.parse(r.value) as Record<string, unknown>;
  } catch { /* hỏng ⇒ mặc định */ }
  const ra = {} as Record<GoiCoTran, TranGoi>;
  for (const g of GOI_CO_TRAN) {
    const o = (dat[g] && typeof dat[g] === 'object' ? dat[g] : {}) as Record<string, unknown>;
    ra[g] = { free: docCap(o.free, TRAN_MAC_DINH[g].free), cao: docCap(o.cao, TRAN_MAC_DINH[g].cao) };
  }
  return ra;
}

/** Ghi đè trần gói. `null` ở một ô = không giới hạn ô đó. */
export async function datTranGoi(moi: unknown): Promise<Record<GoiCoTran, TranGoi>> {
  const cu = await docTranGoi();
  const o = (moi && typeof moi === 'object' ? moi : {}) as Record<string, any>;
  for (const g of GOI_CO_TRAN) {
    if (!o[g]) continue;
    cu[g] = { free: docCap(o[g].free, cu[g].free), cao: docCap(o[g].cao, cu[g].cao) };
  }
  const value = JSON.stringify(cu);
  await prisma.appSetting.upsert({ where: { key: KHOA_TRAN_GOI }, update: { value }, create: { key: KHOA_TRAN_GOI, value } });
  return cu;
}

export function dauThangVn(luc = new Date()): Date {
  const vn = new Date(luc.getTime() + VN_MS);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), 1) - VN_MS);
}

export function dauNgayVn(luc = new Date()): Date {
  const vn = new Date(luc.getTime() + VN_MS);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - VN_MS);
}

export async function daDungNguoi(userId: number, hang: HangChinhHang, tu: Date): Promise<number> {
  const s = await prisma.anthropicUsage.aggregate({
    /* Đợt 8A: lượt do ADMIN WEB tài trợ (`viec = agent_taitro`) không ăn trần chính hãng riêng của người dùng.
       20/10/2026: "Create with CuongMini" (`work_setup`) có hạn mức RIÊNG (taoCuongMini/goiModel.ts) — không ăn trần AI Code.
       24/10/2026: chấm bài phòng thi (`exam_grade`) có trần RIÊNG (exam/aiChamCong.ts) — không ăn trần AI Code. */
    where: { userId, hang, createdAt: { gte: tu }, viec: { notIn: ['agent_taitro', 'work_setup', 'work_ai', 'admin_thong_ke', 'exam_grade'] } },
    _sum: { costUsd: true },
  });
  return s._sum.costUsd ?? 0;
}

export interface HanMucChinhHang {
  hang: HangChinhHang;
  goi: GoiTaiKhoan;
  khongGioiHan: boolean;
  nguon: 'admin' | 'rieng' | 'goi';
  daDungThang: number;
  daDungNgay: number;
  tranThang: number | null;
  tranNgay: number | null;
  /** Chạm trần ⇒ chặn lượt mới ở hạng này. */
  het: boolean;
  /** Mã gia hạn theo $ (19/10/2026, CHỈ hạng free): phần đã cấp trong kỳ — `tranThang/Ngay` đã cộng sẵn. */
  giaHanThang?: number;
  giaHanNgay?: number;
  tranThangGoc?: number | null;
  tranNgayGoc?: number | null;
}

export async function xemHanMucChinhHang(userId: number, hang: HangChinhHang, luc = new Date()): Promise<HanMucChinhHang> {
  const goi = await goiCuaNguoi(userId).catch(() => 'khac' as GoiTaiKhoan);
  const [daDungThang, daDungNgay] = await Promise.all([
    daDungNguoi(userId, hang, dauThangVn(luc)),
    daDungNguoi(userId, hang, dauNgayVn(luc)),
  ]).catch((err) => {
    logger.warn('[anthropic] không đọc được sổ để tính trần', { error: (err as Error).message });
    return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  });
  if (goi === 'admin') {
    return { hang, goi, khongGioiHan: true, nguon: 'admin', daDungThang: Number.isFinite(daDungThang) ? daDungThang : 0,
      daDungNgay: Number.isFinite(daDungNgay) ? daDungNgay : 0, tranThang: null, tranNgay: null, het: false };
  }

  let tran: TranCap = { thang: 0, ngay: 0 };
  let nguon: HanMucChinhHang['nguon'] = 'goi';
  if (goi === 'pro' || goi === 'key_terminal') tran = (await docTranGoi())[goi][hang];
  const rieng = await prisma.anthropicUserCap.findUnique({ where: { userId } }).catch(() => null);
  if (rieng) {
    const t = hang === 'free' ? { thang: rieng.freeThangUsd, ngay: rieng.freeNgayUsd } : { thang: rieng.tranThangUsd, ngay: rieng.tranNgayUsd };
    if (t.thang !== null || t.ngay !== null) {
      nguon = 'rieng';
      tran = { thang: t.thang ?? tran.thang, ngay: t.ngay ?? tran.ngay };
    }
  }
  /* Mã gia hạn theo $ (19/10/2026): CHỈ nhóm free (Sonic/Heshin) của gói có trần thật — nhóm cao (model trả phí) không nới. */
  const goc = { ...tran };
  const g = hang === 'free' && (goi === 'pro' || goi === 'key_terminal')
    ? await tienGiaHanTheoKy(userId, 'chinhHang:free', luc) : { ngay: 0, thang: 0, cuaSo: 0 };
  if (tran.thang !== null) tran = { ...tran, thang: tran.thang + g.thang };
  if (tran.ngay !== null) tran = { ...tran, ngay: tran.ngay + g.ngay };
  /* Sổ hỏng ⇒ CHẶN (vô cực ≥ mọi trần): đây là tiền thật của chủ app. */
  const het = (tran.thang !== null && daDungThang >= tran.thang) || (tran.ngay !== null && daDungNgay >= tran.ngay);
  return {
    hang, goi, khongGioiHan: false, nguon,
    daDungThang: Number.isFinite(daDungThang) ? daDungThang : 0,
    daDungNgay: Number.isFinite(daDungNgay) ? daDungNgay : 0,
    tranThang: tran.thang, tranNgay: tran.ngay, het,
    ...(hang === 'free' ? { giaHanThang: g.thang, giaHanNgay: g.ngay, tranThangGoc: goc.thang, tranNgayGoc: goc.ngay } : {}),
  };
}

const usd = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;

export function loiHetHanMucChinhHang(h: HanMucChinhHang): string {
  const ten = h.hang === 'free' ? 'CuongMini Free' : 'model Claude chính hãng';
  const ngay = h.tranNgay !== null && h.daDungNgay >= h.tranNgay;
  return ngay
    ? `Bạn đã dùng hết hạn mức ${ten} hôm nay (${usd(h.daDungNgay)}/${usd(h.tranNgay!)}). Hạn mức làm mới lúc 0 giờ (giờ Việt Nam).`
    : `Bạn đã dùng hết hạn mức ${ten} tháng này (${usd(h.daDungThang)}/${usd(h.tranThang ?? 0)}). Hạn mức làm mới đầu tháng sau — hoặc nhờ quản trị nới trần.`;
}

// ─── Trần riêng của người (admin) ────────────────────────────────────

export async function datTranRieng(userId: number, d: {
  tranThangUsd?: unknown; tranNgayUsd?: unknown; freeThangUsd?: unknown; freeNgayUsd?: unknown; ghiChu?: unknown;
}): Promise<void> {
  const so = (v: unknown): number | null | undefined => {
    if (v === undefined) return undefined;
    if (v === null || v === '') return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || n > 100_000) throw new Error('Trần phải là số 0–100.000 hoặc để trống.');
    return n;
  };
  const data = {
    tranThangUsd: so(d.tranThangUsd), tranNgayUsd: so(d.tranNgayUsd),
    freeThangUsd: so(d.freeThangUsd), freeNgayUsd: so(d.freeNgayUsd),
    ...(d.ghiChu !== undefined ? { ghiChu: d.ghiChu ? String(d.ghiChu).slice(0, 200) : null } : {}),
  };
  const sach = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
  await prisma.anthropicUserCap.upsert({ where: { userId }, update: sach, create: { userId, ...sach } });
}

export async function xoaTranRieng(userId: number): Promise<void> {
  await prisma.anthropicUserCap.deleteMany({ where: { userId } });
}
