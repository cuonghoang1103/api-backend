/**
 * Công tắc cổng rambo trên trang admin (18/10/2026) — xem `ramboBat()` ở
 * `gateway.ts`. `gateway.ts` cố ý không đụng CSDL (nó chạy trong test thuần),
 * nên phần đọc/ghi `app_settings` nằm ở đây và chỉ đẩy giá trị vào bộ nhớ.
 *
 * Mặc định TẮT. Đọc hỏng ⇒ giữ giá trị đang có (lần đầu = tắt).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import {
  congAgent, datRamboBatAdmin, docDsModelRamboDaNho, docModelRambo, ketQuaThuRamboGanNhat, lanKiemRamboGanNhat,
  ramboBat, ramboDangNghi, ramboSonic,
} from './gateway.js';

const KHOA = 'rambo_bat';
let nhip: ReturnType<typeof setInterval> | null = null;

export async function docCongTacRambo(): Promise<boolean> {
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    const v = r?.value === '1';
    datRamboBatAdmin(v);
    return v;
  } catch (err) {
    logger.warn('[rambo] không đọc được công tắc — giữ giá trị cũ', { error: (err as Error).message });
    return false;
  }
}

/** Admin bật/tắt. Có hiệu lực ngay ở tiến trình này; tiến trình khác tự đọc lại sau ≤ 60s. */
export async function datCongTacRambo(bat: boolean): Promise<void> {
  const value = bat ? '1' : '0';
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  datRamboBatAdmin(bat);
  logger.info(`[rambo] admin ${bat ? 'BẬT' : 'TẮT'} cổng rambo`);
}

/** Danh sách model rambo đọc lại mỗi 10 phút khi rambo bật (để `ramboSonic()` tự lên Sonnet 5.5 khi cổng mở). */
const DOC_MODEL_MS = 10 * 60_000;
async function capNhatModelRambo(): Promise<void> {
  if (!congAgent()) return;
  const nho = docDsModelRamboDaNho();
  if (nho && Date.now() - nho.luc < DOC_MODEL_MS) return;
  await docModelRambo();
}

/** Gọi một lần lúc khởi động: đọc ngay + đọc lại mỗi 60s (không giữ tiến trình sống). */
export function napCongTacRambo(): void {
  void docCongTacRambo().then(() => capNhatModelRambo());
  if (nhip) return;
  nhip = setInterval(() => { void docCongTacRambo().then(() => capNhatModelRambo()); }, 60_000);
  (nhip as unknown as { unref?: () => void }).unref?.();
}

export interface TrangThaiRambo {
  bat: boolean;
  nguon: 'env' | 'admin';
  coCauHinh: boolean;
  /** Cầu dao đang mở (vừa hỏng, đang nghỉ) ⇒ mọi việc tạm lùi. */
  dangNghi: boolean;
  /** Lần gõ cửa gần nhất (mũi dò / app / nút Thử). */
  kiemGanNhat: { luc: string; song: boolean } | null;
  /** Model Sonnet đang dùng cho CuongMini Default + CT Work (tên thật — CHỈ admin thấy). */
  modelSonic: string;
  dsModel: { luc: string; ids: string[] } | null;
  thuGanNhat: { luc: string; models: Array<{ model: string; ok: boolean; ms: number; loi?: string }> } | null;
}

export function trangThaiRambo(): TrangThaiRambo {
  const env = process.env.RAMBO_BAT?.trim();
  const k = lanKiemRamboGanNhat();
  const ds = docDsModelRamboDaNho();
  const thu = ketQuaThuRamboGanNhat();
  return {
    bat: ramboBat(),
    nguon: env === '1' || env === '0' || env === 'true' || env === 'false' ? 'env' : 'admin',
    coCauHinh: Boolean(process.env.AGENT_GATEWAY_BASE_URL?.trim() && process.env.AGENT_GATEWAY_API_KEY?.trim()),
    dangNghi: ramboDangNghi(),
    kiemGanNhat: k ? { luc: new Date(k.luc).toISOString(), song: k.song } : null,
    modelSonic: ramboSonic(),
    dsModel: ds ? { luc: new Date(ds.luc).toISOString(), ids: ds.ids } : null,
    thuGanNhat: thu ? { luc: new Date(thu.luc).toISOString(), models: thu.models } : null,
  };
}
