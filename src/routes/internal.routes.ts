/**
 * Lối NỘI BỘ cho cụm cong-llm hỏi backend.
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/internal
 *
 * Chỉ có một việc: `canh` (services/cong-llm/) hỏi "người cầm key này đã tiêu
 * bao nhiêu USD ở AI Code trên APP DESKTOP trong cửa sổ hiện tại?", để cộng
 * với phần đã tiêu qua key terminal rồi quyết định có khoá key hay không.
 * Thiếu con số này thì hai đường dùng chung một gói lại có hai hạn mức tách
 * rời, và người mua được gấp đôi thứ họ trả tiền.
 *
 * ⚠️ BẢO VỆ, theo thứ tự:
 *
 *  1. `INTERNAL_API_TOKEN` — không đặt thì mọi route ở đây trả 404, coi như
 *     không tồn tại. FAIL CLOSED: quên cấu hình thì tính năng tắt, KHÔNG
 *     phải mở toang. Route này đọc được key của người khác nên không có
 *     trạng thái "tạm mở".
 *  2. So khoá bằng `timingSafeEqual` — so bằng `===` để lộ độ dài và thời
 *     gian khớp từng ký tự.
 *
 * ⚠️ KHÔNG bao giờ trả về `keyValue`. Nơi gọi ĐƯA key vào, ta chỉ trả con số.
 */
import crypto from 'crypto';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { soGioViTien } from '../services/agent/viTien.js';

const router = Router();

function khoaNoiBo(): string {
  return process.env.INTERNAL_API_TOKEN || '';
}

function soSanhAnToan(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

/** Chặn cửa. Thiếu cấu hình ⇒ 404, không phải 401 — đừng lộ là route có tồn tại. */
function chiNoiBo(req: Request, res: Response, next: NextFunction): void {
  const mong = khoaNoiBo();
  if (!mong) { res.status(404).json({ success: false, message: 'Not found' }); return; }
  const nhan = String(req.headers['x-internal-token'] || '');
  if (!nhan || !soSanhAnToan(nhan, mong)) {
    res.status(404).json({ success: false, message: 'Not found' });
    return;
  }
  next();
}

router.use(chiNoiBo);

/**
 * POST /api/v1/internal/ai-code-usage
 * Body: { keys: string[] }  →  { [key]: { userId, daTieuUsd, tranUsd, hetHanLuc, gopVi } }
 *
 * `hetHanLuc` (giây epoch, hoặc null) là hạn của GÓI đã bán. canh lấy nó đặt
 * `expired_time` cho key con ở New API — nếu không, gói "30 ngày" chạy mãi.
 * Ta trả hạn của CẢ key đã quá hạn để canh còn đóng chúng lại.
 *
 * ⚠️⚠️ `gopVi` phân biệt HAI LOẠI KEY, và canh phải tôn trọng nó:
 *   · `true`  — key XIN theo quyền lợi Pro (`source: 'REQUEST'`): dùng chung
 *     ví với AI Code trên app desktop, nên canh cộng hai đường rồi khoá khi
 *     chạm trần. Không làm thế thì một người Pro được hai suất.
 *   · `false` — key MUA BẰNG TIỀN THẬT ở /shop: hạn mức RIÊNG, canh KHÔNG
 *     được cộng vào ví web. Trừ chung nghĩa là khách bỏ tiền mua 60$/5h mà
 *     không được thêm gì so với ví Pro họ vốn đã có.
 * Hạn gói (`hetHanLuc`) thì áp cho CẢ HAI — mua hay xin đều có thời hạn.
 *
 * Nhận NHIỀU key một lượt: canh chạy mỗi phút và có thể có hàng chục key —
 * hỏi từng cái là hàng chục vòng mỗi phút, không đáng.
 */
router.post('/ai-code-usage', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const keys = Array.isArray((req.body as { keys?: unknown })?.keys)
      ? ((req.body as { keys: unknown[] }).keys.filter((k) => typeof k === 'string') as string[]).slice(0, 200)
      : [];
    if (keys.length === 0) { res.json({ success: true, data: {} }); return; }

    const dons = await prisma.llmKeyRequest.findMany({
      where: { keyValue: { in: keys }, status: 'APPROVED' },
      select: { keyValue: true, userId: true, quotaUsd: true, expiresAt: true, source: true },
    });
    if (dons.length === 0) { res.json({ success: true, data: {} }); return; }

    const soGio = soGioViTien();
    const tu = new Date(Date.now() - soGio * 3_600_000);

    // Một truy vấn gộp cho tất cả người, thay vì mỗi người một lượt.
    const tong = await prisma.interviewLLMCallLog.groupBy({
      by: ['userId'],
      where: { userId: { in: dons.map((d) => d.userId) }, feature: 'agent', createdAt: { gte: tu } },
      _sum: { costUsd: true },
    });
    const theoNguoi = new Map(tong.map((t) => [t.userId, Number(t._sum.costUsd ?? 0)]));

    const ra: Record<string, {
      userId: number; daTieuUsd: number; tranUsd: number | null;
      hetHanLuc: number | null; gopVi: boolean;
    }> = {};
    for (const d of dons) {
      if (!d.keyValue) continue;
      const gopVi = d.source === 'REQUEST';
      ra[d.keyValue] = {
        userId: d.userId,
        // Key mua ở shop KHÔNG gộp ví ⇒ số đã tiêu ở app desktop không liên
        // quan tới nó. Trả 0 để dù canh có đọc nhầm cũng không khoá oan key
        // của người đã trả tiền.
        daTieuUsd: gopVi ? Math.round((theoNguoi.get(d.userId) ?? 0) * 10000) / 10000 : 0,
        tranUsd: d.quotaUsd,
        hetHanLuc: d.expiresAt ? Math.floor(d.expiresAt.getTime() / 1000) : null,
        gopVi,
      };
    }
    res.json({ success: true, data: ra });
  } catch (err) {
    logger.error('[internal] ai-code-usage lỗi', { error: err instanceof Error ? err.message : String(err) });
    next(err);
  }
});

/** Cho canh biết cửa sổ của web dài bao lâu, để hai bên dùng cùng một mốc. */
router.get('/ai-code-window', (_req: Request, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { soGio: soGioViTien() } });
});

export default router;
