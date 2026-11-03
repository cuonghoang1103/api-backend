/**
 * ============================================================
 * CÔNG TẮC TỔNG "CHẶN TẤT CẢ (trừ admin + CT Work)" — bảo trì CuongMini (03/11/2026)
 * ============================================================
 *
 * Chủ app muốn một công tắc tổng để, khi tải/chi phí vọt, CẮT mọi dịch vụ AI cho NGƯỜI DÙNG THƯỜNG
 * (AI trợ giảng `course_tutor`, codelab coach, chat, thi, ngoại ngữ, ghi chú, phỏng vấn, AI Code `agent_code`…),
 * nhưng VẪN CHỪA ba thứ:
 *   1. Tài khoản ADMIN (để admin còn vận hành + thống kê).
 *   2. AI trong CT Work (mọi purpose `work_*` — gói riêng, trả trọn, không được phép chết theo).
 *   3. AI thống kê của chính admin (`admin_thong_ke`) — việc này đi cổng chính hãng riêng (`goi.ts`),
 *      KHÔNG qua `llmComplete`, nên tự nhiên không bị chốt này đụng tới; vẫn ghi vào danh sách CHỪA cho rõ.
 *
 * Người bị chặn nhận đúng MỘT câu tiếng Việt (KHÔNG kèm tiếng Anh), và lượt bị ném lỗi NGAY — TRƯỚC khi chọn
 * endpoint / model / cổng dự phòng — nên không tốn một kết nối mạng nào.
 *
 * Khuôn giống `src/services/llm/congTacRambo.ts` (công tắc rambo): giá trị sống trong RAM, nạp từ `app_settings`
 * lúc boot + đọc lại mỗi 60s; env `CUONGMINI_BAO_TRI=1/0` THẮNG như `ramboBat()`. MẶC ĐỊNH TẮT.
 *
 * ⚠️ Module này chỉ phụ thuộc prisma + logger (không import gateway) để tránh vòng import — `llmComplete`
 * (`interview/llm/index.ts`) và agent AI Code (`agent/turn.ts`) đều import từ đây.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const KHOA = 'cuongmini_bao_tri';

export const MA_LOI_BAO_TRI = 'CUONGMINI_BAO_TRI';
/** Câu DUY NHẤT người bị chặn thấy (tiếng Việt, không kèm tiếng Anh — chủ app chốt). */
export const CAU_BAO_TRI = 'CuongMini đã quá tải hoặc đang bảo trì xin vui lòng thử lại sau';

/** Trạng thái admin đặt (đọc từ `app_settings`), chỉ giá trị trong RAM — xem đầu file vì sao. */
let batRam = false;
let nhip: ReturnType<typeof setInterval> | null = null;

/** Công tắc có đang BẬT không. Env `CUONGMINI_BAO_TRI` (nếu đặt) thắng giá trị admin, như `ramboBat()`. */
export function cuongMiniBaoTri(): boolean {
  const env = process.env.CUONGMINI_BAO_TRI?.trim();
  if (env === '1' || env === 'true') return true;
  if (env === '0' || env === 'false') return false;
  return batRam;
}

/** Nguồn đang quyết định giá trị: 'env' (cứng, admin không đổi được) hay 'admin'. */
export function nguonBaoTri(): 'env' | 'admin' {
  const env = process.env.CUONGMINI_BAO_TRI?.trim();
  return env === '1' || env === '0' || env === 'true' || env === 'false' ? 'env' : 'admin';
}

/** Đẩy giá trị vào RAM (dùng khi nạp từ app_settings + khi admin bật/tắt). Chỉ test gọi trực tiếp. */
export function datCuongMiniBaoTri(v: boolean): void {
  batRam = v;
}

/** Đọc từ `app_settings` → RAM. Đọc hỏng ⇒ giữ giá trị đang có (lần đầu = tắt). */
export async function docCuongMiniBaoTri(): Promise<boolean> {
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    batRam = r?.value === '1';
  } catch (err) {
    logger.warn('[cuongmini-bao-tri] không đọc được công tắc — giữ giá trị cũ', { error: (err as Error).message });
  }
  return batRam;
}

/** Admin bật/tắt: ghi app_settings + cập nhật RAM ngay; tiến trình khác tự đọc lại sau ≤ 60s. */
export async function datVaLuuCuongMiniBaoTri(bat: boolean): Promise<void> {
  const value = bat ? '1' : '0';
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  datCuongMiniBaoTri(bat);
  logger.info(`[cuongmini-bao-tri] admin ${bat ? 'BẬT' : 'TẮT'} công tắc chặn tất cả (trừ admin + CT Work)`);
}

/** Gọi một lần lúc khởi động: đọc ngay + đọc lại mỗi 60s (không giữ tiến trình sống). */
export function napCuongMiniBaoTri(): void {
  void docCuongMiniBaoTri();
  if (nhip) return;
  nhip = setInterval(() => { void docCuongMiniBaoTri(); }, 60_000);
  (nhip as unknown as { unref?: () => void }).unref?.();
}

export interface TrangThaiBaoTri {
  bat: boolean;
  nguon: 'env' | 'admin';
}

export function trangThaiBaoTri(): TrangThaiBaoTri {
  return { bat: cuongMiniBaoTri(), nguon: nguonBaoTri() };
}

// ─── Tập CHỪA (không bao giờ bị chốt này chặn) ──────────────────────────────

/**
 * Purpose được CHỪA: mọi việc CT Work (`work_*`) + AI thống kê của admin (`admin_thong_ke`).
 * `work_*` gồm work_assistant, work_spec_review, work_digest, work_setup, work_agent… (khai bằng tiền tố để
 * purpose CT Work thêm sau cũng tự được chừa). `admin_thong_ke` KHÔNG phải một `LlmPurpose` (nó đi cổng chính
 * hãng riêng, không qua llmComplete) nhưng vẫn kể ra đây cho rõ ý.
 */
export function purposeDuocChua(purpose: string | undefined | null): boolean {
  if (!purpose) return false;
  return purpose.startsWith('work_') || purpose === 'admin_thong_ke';
}

// ─── Miễn admin (đệm 30s giống cuongMiniChan.ts) ────────────────────────────

const DEM_MS = 30_000;
const demAdmin = new Map<number, { laAdmin: boolean; luc: number }>();

/**
 * Người này có phải ADMIN không — để miễn chốt bảo trì. Vai trò đọc từ CSDL như `requireAdmin`
 * (role name, bỏ tiền tố ROLE_, so 'ADMIN'). Đệm 30s vì mỗi bước agent là một lời gọi.
 * CSDL hỏng ⇒ coi như KHÔNG admin (fail-closed: thà chặn nhầm admin còn hơn mở toang cho mọi người lúc bảo trì).
 */
export async function laAdmin(userId: number | undefined | null): Promise<boolean> {
  if (!userId) return false;
  const c = demAdmin.get(userId);
  if (c && Date.now() - c.luc < DEM_MS) return c.laAdmin;
  try {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { roles: { select: { role: { select: { name: true } } } } },
    });
    const la = Boolean(u?.roles.some((ur) => ur.role.name.toUpperCase().replace('ROLE_', '') === 'ADMIN'));
    demAdmin.set(userId, { laAdmin: la, luc: Date.now() });
    return la;
  } catch (err) {
    logger.warn('[cuongmini-bao-tri] không đọc được vai trò — coi như không admin', { userId, error: (err as Error).message });
    return false;
  }
}

/** Chỉ dùng trong test. */
export function _xoaDemAdmin(): void { demAdmin.clear(); }
/** Chỉ dùng trong test: nạp sẵn đệm vai trò để khỏi chạm CSDL. */
export function _datDemAdmin(userId: number, la: boolean): void { demAdmin.set(userId, { laAdmin: la, luc: Date.now() }); }

/**
 * CHỐT trung tâm: lượt này có bị công tắc bảo trì chặn không?
 *   BẬT + purpose KHÔNG được chừa + người gọi KHÔNG phải admin ⇒ true (chặn).
 * Tắt / purpose work_ hoặc admin_thong_ke / admin ⇒ false (cho qua).
 */
export async function chanBoiBaoTri(purpose: string | undefined | null, userId: number | undefined | null): Promise<boolean> {
  if (!cuongMiniBaoTri()) return false;
  if (purposeDuocChua(purpose)) return false;
  if (await laAdmin(userId)) return false;
  return true;
}
