/**
 * ============================================================
 * DANH SÁCH CHẶN CUONGMINI (27/10/2026)
 * ============================================================
 *
 * Chủ app: một số người dùng lạm dụng, phụ thuộc quá mức hoặc chửi/chê CuongMini ⇒ admin cần CHẶN và MỞ KHOÁ.
 * Hai phạm vi độc lập:
 *   • `AI_CODE` — app desktop AI Code + extension VS Code + CuongMini CLI (cả ba đi chung cửa `/api/v1/agent/*`).
 *   • `CTWORK`  — CuongMini trong CT Work (web + app CT Work).
 * Bị chặn ⇒ 403 `CUONGMINI_BI_CHAN` với câu rõ ràng; phần còn lại của tài khoản (học, CT Work không AI…) KHÔNG ảnh hưởng.
 * Kiểm có bộ nhớ đệm 30 giây (mỗi bước agent là một lời gọi) — chặn/mở trên admin xoá đệm ngay ở tiến trình này.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type PhamViChan = 'AI_CODE' | 'CTWORK';
export const PHAM_VI_CHAN: readonly PhamViChan[] = ['AI_CODE', 'CTWORK'];
export function laPhamViChan(v: unknown): v is PhamViChan {
  return v === 'AI_CODE' || v === 'CTWORK';
}

export const MA_LOI_CHAN = 'CUONGMINI_BI_CHAN';
export function cauBiChan(p: PhamViChan): string {
  return p === 'CTWORK'
    ? 'Tài khoản của bạn đang bị tạm dừng dùng CuongMini trong CT Work. Liên hệ quản trị viên nếu cần mở lại. / Your account is currently blocked from using CuongMini in CT Work. Contact an admin to have it restored.'
    : 'Tài khoản của bạn đang bị tạm dừng dùng CuongMini (AI Code, CLI, VS Code). Liên hệ quản trị viên nếu cần mở lại. / Your account is currently blocked from using CuongMini (AI Code, CLI, VS Code). Contact an admin to have it restored.';
}

const DEM_MS = 30_000;
const dem = new Map<string, { biChan: boolean; luc: number }>();
const khoa = (userId: number, p: PhamViChan) => `${p}:${userId}`;

/** Người này có bị chặn ở phạm vi `p` không. CSDL hỏng ⇒ KHÔNG chặn (không làm sập AI của mọi người vì một truy vấn lỗi). */
export async function biChanCuongMini(userId: number | undefined | null, p: PhamViChan): Promise<boolean> {
  if (!userId) return false;
  const k = khoa(userId, p);
  const c = dem.get(k);
  if (c && Date.now() - c.luc < DEM_MS) return c.biChan;
  try {
    const r = await prisma.cuongMiniChan.findUnique({ where: { uk_cuongmini_chan_user_pham_vi: { userId, phamVi: p } }, select: { id: true } });
    dem.set(k, { biChan: Boolean(r), luc: Date.now() });
    return Boolean(r);
  } catch (err) {
    logger.warn('[cuongmini-chan] không đọc được danh sách chặn — cho qua', { error: (err as Error).message });
    return false;
  }
}

export interface DongChan {
  userId: number; username: string | null; email: string | null; ten: string | null;
  phamVi: PhamViChan; lyDo: string | null; chanBoi: string | null; luc: string;
}

/** Danh sách đang bị chặn (mới nhất trước). */
export async function dsChan(p?: PhamViChan): Promise<DongChan[]> {
  const rows = await prisma.cuongMiniChan.findMany({
    where: p ? { phamVi: p } : {}, orderBy: { createdAt: 'desc' }, take: 1000,
  });
  const ids = [...new Set(rows.flatMap((r) => [r.userId, ...(r.chanBoiId ? [r.chanBoiId] : [])]))];
  const users = ids.length
    ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, email: true, fullName: true } })
    : [];
  const by = new Map(users.map((u) => [u.id, u]));
  return rows.map((r) => {
    const u = by.get(r.userId);
    const a = r.chanBoiId ? by.get(r.chanBoiId) : undefined;
    return {
      userId: r.userId, username: u?.username ?? null, email: u?.email ?? null, ten: u?.fullName ?? null,
      phamVi: r.phamVi as PhamViChan, lyDo: r.lyDo, chanBoi: a?.username ?? null, luc: r.createdAt.toISOString(),
    };
  });
}

/** Chặn (đã chặn thì cập nhật lý do). */
export async function chanNguoi(userId: number, p: PhamViChan, lyDo: string | null, adminId: number | null): Promise<void> {
  const ly = lyDo?.trim().slice(0, 500) || null;
  await prisma.cuongMiniChan.upsert({
    where: { uk_cuongmini_chan_user_pham_vi: { userId, phamVi: p } },
    create: { userId, phamVi: p, lyDo: ly, chanBoiId: adminId },
    update: { lyDo: ly, chanBoiId: adminId },
  });
  dem.delete(khoa(userId, p));
  logger.info('[cuongmini-chan] chặn', { userId, phamVi: p, adminId });
}

/** Mở khoá. Trả `true` nếu có bản ghi để xoá. */
export async function moChanNguoi(userId: number, p: PhamViChan, adminId: number | null): Promise<boolean> {
  const r = await prisma.cuongMiniChan.deleteMany({ where: { userId, phamVi: p } });
  dem.delete(khoa(userId, p));
  logger.info('[cuongmini-chan] mở khoá', { userId, phamVi: p, adminId, xoa: r.count });
  return r.count > 0;
}

/** Chỉ dùng trong test. */
export function _xoaDemChan(): void { dem.clear(); }
