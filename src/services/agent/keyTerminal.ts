/**
 * Cầu nối giữa KEY TERMINAL (OpenCode) và ví AI Code của web.
 * ─────────────────────────────────────────────────────────────────────────
 * Vấn đề nó giải: hai đường dùng AI Code đi hai lối hoàn toàn khác nhau —
 *
 *   app desktop : app → backend web → cổng LLM      (ghi vào interviewLLMCallLog)
 *   terminal    : OpenCode → nginx → New API → canh → rambo   (KHÔNG chạm backend)
 *
 * nên trước 14/09/2026 chúng có hai bộ đếm rời nhau: một người mua key
 * terminal rồi dùng hết hạn mức ở đó vẫn còn nguyên ví AI Code trên app, và
 * ngược lại. Người dùng không có cách nào biết mình còn bao nhiêu "tổng".
 *
 * Cách nối: backend HỎI THẲNG New API số đã dùng của key đó. Ba container
 * (backend, newapi, canh) nằm chung mạng docker `cuonghoangdev_backend` nên
 * gọi nội bộ được — đã đo 14/09/2026, `GET /api/status` trả 200.
 *
 * ⚠️ KHÔNG ném lỗi ra ngoài. Cùng nguyên tắc đã viết ở `viTien.ts`: một cái
 * khoá tự sập khi đồng hồ đo hỏng thì tệ hơn là không có khoá. New API chết
 * ⇒ coi phần terminal bằng 0, người dùng vẫn code được bằng app.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** New API quy đổi: 500.000 đơn vị quota = 1 USD (đo thật trên rc.37). */
const QUOTA_MOT_USD = 500_000;

const NEWAPI_URL = process.env.NEWAPI_INTERNAL_URL || 'http://cuonghoangdev_newapi:3000';

/** Nhớ tạm để không hỏi New API mỗi lần dựng ví. */
const NHO_MS = 20_000;
const dem = new Map<number, { luc: number; daTieuUsd: number; tranUsd: number | null }>();

export interface TerminalUsage {
  /** Người này có key terminal đang hiệu lực không. */
  coKey: boolean;
  /** USD đã tiêu qua key terminal TRONG CỬA SỔ hiện tại. */
  daTieuUsd: number;
  /** Hạn mức admin đặt cho key (USD/cửa sổ). null = không đặt. */
  tranKeyUsd: number | null;
}

const RONG: TerminalUsage = { coKey: false, daTieuUsd: 0, tranKeyUsd: null };

/**
 * Điều kiện "gói còn hạn".
 *
 * Key xin tay ở /llm-key không có hạn (`expiresAt` null) — vẫn tính.
 * Key mua ở shop có hạn 30 ngày; hết hạn thì nó KHÔNG còn được tính vào ví
 * chung nữa, nếu không thì một gói đã hết hạn vẫn tiếp tục ăn mất hạn mức
 * AI Code của người dùng trên app desktop.
 */
function conHan() {
  return { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] };
}

/**
 * Số đã tiêu qua key terminal của một người, trong cửa sổ hiện tại.
 *
 * ⚠️ New API trả `used_quota` là CỘNG DỒN từ lúc tạo key, không theo cửa sổ.
 * Số trong cửa sổ này = hạn mức canh vừa nạp − số còn lại. Đây chính là cách
 * `canh/canh.mjs` tính ở `GET /llm/han-muc`; giữ CÙNG một công thức để hai
 * chỗ không bao giờ nói hai con số khác nhau về cùng một key.
 */
export async function xemKeyTerminal(userId: number): Promise<TerminalUsage> {
  const nho = dem.get(userId);
  if (nho && Date.now() - nho.luc < NHO_MS) {
    return { coKey: true, daTieuUsd: nho.daTieuUsd, tranKeyUsd: nho.tranUsd };
  }

  let key: string | null = null;
  let tranKeyUsd: number | null = null;
  try {
    const don = await prisma.llmKeyRequest.findFirst({
      where: { userId, status: 'APPROVED', ...conHan() },
      orderBy: { resolvedAt: 'desc' },
      select: { keyValue: true, quotaUsd: true },
    });
    if (!don?.keyValue) return RONG;
    key = don.keyValue;
    tranKeyUsd = don.quotaUsd;
  } catch (err) {
    logger.warn('[key-terminal] không đọc được đơn key, bỏ qua phần terminal', {
      userId, error: (err as Error).message,
    });
    return RONG;
  }

  try {
    // Dấu `/` cuối là BẮT BUỘC — thiếu thì New API 301 sang trang HTML và
    // `r.json()` ném lỗi. Đo thật trên rc.37, ghi trong canh.mjs.
    const r = await fetch(`${NEWAPI_URL}/api/usage/token/`, {
      headers: { authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6_000),
    });
    const d = (await r.json().catch(() => null)) as
      | { code?: boolean; data?: { total_available?: number; unlimited_quota?: boolean } }
      | null;

    if (!d || d.code !== true || !d.data) {
      // Key bị xoá/khoá trong New API — không phải lỗi của ta, coi như chưa dùng.
      return { coKey: true, daTieuUsd: 0, tranKeyUsd };
    }
    if (d.data.unlimited_quota) {
      // Key không giới hạn ⇒ không đo được phần đã dùng trong cửa sổ.
      return { coKey: true, daTieuUsd: 0, tranKeyUsd };
    }

    const conLaiUsd = Number(d.data.total_available ?? 0) / QUOTA_MOT_USD;
    // Không có trần ghi trong đơn thì không suy ra được phần đã dùng.
    const daTieuUsd = tranKeyUsd == null ? 0 : Math.max(0, tranKeyUsd - conLaiUsd);

    dem.set(userId, { luc: Date.now(), daTieuUsd, tranUsd: tranKeyUsd });
    return { coKey: true, daTieuUsd, tranKeyUsd };
  } catch (err) {
    logger.warn('[key-terminal] không hỏi được New API, bỏ qua phần terminal', {
      userId, error: (err as Error).message,
    });
    return { coKey: true, daTieuUsd: 0, tranKeyUsd };
  }
}

/**
 * Trần cửa sổ RIÊNG của một người, nếu họ có key terminal đã duyệt.
 *
 * Trước đây trần là MỘT con số chung cho mọi người (`AI_COST_WINDOW_USD`).
 * Bán gói theo bậc (60/100/150 USD mỗi cửa sổ) thì mỗi người một trần khác
 * nhau, nên phải đọc theo người. Không có key ⇒ trả null để nơi gọi dùng
 * trần chung như cũ.
 */
export async function tranRiengCuaNguoi(userId: number): Promise<number | null> {
  try {
    const don = await prisma.llmKeyRequest.findFirst({
      where: { userId, status: 'APPROVED', quotaUsd: { not: null }, ...conHan() },
      orderBy: { resolvedAt: 'desc' },
      select: { quotaUsd: true },
    });
    return don?.quotaUsd ?? null;
  } catch {
    return null;
  }
}

/** Xoá nhớ tạm — dùng trong kiểm thử. */
export function xoaNhoKeyTerminal(): void {
  dem.clear();
}
