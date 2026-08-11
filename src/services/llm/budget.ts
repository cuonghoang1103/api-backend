/**
 * CẦU DAO NGÂN SÁCH NGÀY — chốt chặn cuối cùng của ví tiền.
 * ─────────────────────────────────────────────────────────────────────
 * Trần token theo người dùng (`checkTokenQuota`) chặn được MỘT người tiêu
 * nhiều. Nó không chặn được thứ đắt hơn nhiều: một vòng lặp hỏng trong việc
 * chạy nền. Không ai bấm nút, không ai nhìn màn hình, và mỗi lần thử lại là
 * một lời gọi có hoá đơn — trên production ngày 21/07 đã có 1.840 lời gọi nền
 * thất bại trong MỘT ngày, và cái duy nhất phát hiện ra là biểu đồ chi phí.
 *
 * Hai mức, cố ý khác nhau:
 *
 *   MỀM (mặc định 15 $/ngày) — dừng việc CHẠY NGẦM: sinh nội dung hàng loạt,
 *   bản tin sáng. Người dùng thật không thấy gì cả, vì họ không chờ mấy việc
 *   đó. Đây là mức sẽ chạm thật trong đời thường, và chạm cũng không sao.
 *
 *   CỨNG (mặc định 40 $/ngày) — dừng TẤT CẢ, kể cả người đang ngồi bấm nút.
 *   Đây là cầu dao chống thảm hoạ. Chạm tới đây nghĩa là có gì đó thực sự
 *   hỏng, và một trang web câm trong vài giờ vẫn rẻ hơn một cái ví rỗng.
 *
 * ⚠️ Số tiền ở đây là ƯỚC LƯỢNG: cổng gộp bán theo bảng giá riêng của nó và
 * không công khai giá, nên `cost_usd` trong sổ được tính bằng giá niêm yết của
 * nhà cung cấp gốc (xem `gateway.ts`). Dùng nó để BẮT BẤT THƯỜNG — gấp mười
 * lần hôm qua thì chắc chắn có chuyện — chứ đừng đối chiếu với hoá đơn thật.
 * Có số đúng thì đặt `LLM_PRICE_OVERRIDES`.
 *
 * Đặt cả hai biến `LLM_DAILY_COST_SOFT_USD` / `LLM_DAILY_COST_HARD_USD` bằng 0
 * để tắt hẳn cầu dao.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** Việc chạy nền (không ai ngồi chờ) hay việc người dùng đang bấm. */
export type LlmCallKind = 'background' | 'interactive';

const DEFAULT_SOFT_USD = 15;
const DEFAULT_HARD_USD = 40;

function capFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function softCapUsd(): number {
  return capFromEnv('LLM_DAILY_COST_SOFT_USD', DEFAULT_SOFT_USD);
}
export function hardCapUsd(): number {
  return capFromEnv('LLM_DAILY_COST_HARD_USD', DEFAULT_HARD_USD);
}

// Đếm tiền là một lần đọc DB. Gọi nó trước MỖI lời gọi LLM thì bản thân cái
// chốt chặn trở thành gánh nặng, nên nhớ trong 60 giây. Sai số tối đa là số
// tiền tiêu được trong một phút — nhỏ hơn nhiều so với khoảng cách giữa hai
// mức trần.
const CACHE_MS = 60_000;
let cache: { at: number; usd: number } | null = null;

/** Tổng chi phí (ước lượng) đã ghi sổ kể từ 00:00 hôm nay, cả hai sổ. */
export async function todaySpendUsd(force = false): Promise<number> {
  const now = Date.now();
  if (!force && cache && now - cache.at < CACHE_MS) return cache.usd;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [core, cv] = await Promise.all([
    prisma.interviewLLMCallLog.aggregate({ where: { createdAt: { gte: start }, success: true }, _sum: { costUsd: true } }),
    prisma.cvLLMCallLog.aggregate({ where: { createdAt: { gte: start }, success: true }, _sum: { costUsd: true } }),
  ]);
  const usd = Number(core._sum.costUsd ?? 0) + Number(cv._sum.costUsd ?? 0);
  cache = { at: now, usd };
  return usd;
}

/** Xoá bộ nhớ đệm — dùng sau khi admin đổi trần, và trong kiểm thử. */
export function resetBudgetCache(): void {
  cache = null;
}

export interface BudgetVerdict {
  allowed: boolean;
  spentUsd: number;
  softUsd: number;
  hardUsd: number;
  /** Vì sao bị chặn — để thông báo nói đúng chuyện. */
  reason?: 'soft' | 'hard';
}

/**
 * Lời gọi này có được phép đi không.
 *
 * Không bao giờ ném lỗi vì lỗi DB: chốt chặn hỏng thì cho đi tiếp. Một cái
 * cầu dao tự nhảy khi đồng hồ đo hỏng còn tệ hơn là không có cầu dao.
 */
export async function checkBudget(kind: LlmCallKind): Promise<BudgetVerdict> {
  const soft = softCapUsd();
  const hard = hardCapUsd();
  if (soft <= 0 && hard <= 0) return { allowed: true, spentUsd: 0, softUsd: soft, hardUsd: hard };

  let spent = 0;
  try {
    spent = await todaySpendUsd();
  } catch (err) {
    logger.warn('llm budget: không đọc được sổ chi phí, cho lời gọi đi tiếp', { error: (err as Error).message });
    return { allowed: true, spentUsd: 0, softUsd: soft, hardUsd: hard };
  }

  if (hard > 0 && spent >= hard) return { allowed: false, spentUsd: spent, softUsd: soft, hardUsd: hard, reason: 'hard' };
  if (kind === 'background' && soft > 0 && spent >= soft) {
    return { allowed: false, spentUsd: spent, softUsd: soft, hardUsd: hard, reason: 'soft' };
  }
  return { allowed: true, spentUsd: spent, softUsd: soft, hardUsd: hard };
}

/** Câu giải thích cho người đọc log / người dùng. */
export function budgetMessage(v: BudgetVerdict): string {
  const spent = v.spentUsd.toFixed(2);
  return v.reason === 'hard'
    ? `Đã chạm trần chi phí AI trong ngày (~$${spent} / $${v.hardUsd}). Mọi lời gọi AI tạm dừng tới 00:00.`
    : `Đã chạm trần chi phí cho việc chạy nền (~$${spent} / $${v.softUsd}). Việc sinh nội dung hàng loạt tạm dừng; tính năng người dùng bấm vẫn chạy.`;
}
