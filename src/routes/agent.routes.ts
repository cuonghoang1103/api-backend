/**
 * ============================================================
 * Agent lập trình — gắn ở /api/v1/agent
 * ============================================================
 *
 * Bộ não của mục "Lập trình" trong app desktop. App giữ hội thoại và chạy tool
 * đọc file trên máy người dùng; route này giữ khoá cổng, prompt hệ thống, bộ
 * tool, và cả hai chốt chặn tiền.
 *
 *   POST /agent/turn    một lượt, trả SSE
 *   GET  /agent/tools   bộ tool + trần hiện hành (app đọc lúc khởi động)
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG LẠI /api/v1/ai/chat: đường đó nhận một `message` và trả
 * về chữ. Agent thì gửi lên cả hội thoại có `role:'tool'`, nhận về `tool_calls`
 * để app chạy, rồi gọi lại — khác giao thức, không phải khác tham số. Nhồi vào
 * cùng một handler thì cả hai cùng khó đọc và mọi thay đổi ở một bên đều có
 * khả năng làm hỏng bên kia.
 */
import { Router, type NextFunction, type Response } from 'express';

import { authenticate } from '../middleware/auth.js';
import { isProEffective } from '../services/pro.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { AGENT_TOOLS, ALL_CAPABILITIES } from '../services/agent/tools.js';
import { soGioCuaSo, tranToken, xemHanMuc } from '../services/agent/quota.js';
import { AgentInputError, runAgentTurn, type AgentEvent } from '../services/agent/turn.js';
import { gatewayConfigured, modelFor } from '../services/llm/gateway.js';

const router = Router();
router.use(authenticate);

/**
 * CHỈ TÀI KHOẢN PRO.
 *
 * Chốt ở MÁY CHỦ chứ không phải ở app: app tải về máy người dùng, ẩn một cái
 * nút trong app chỉ là ẩn cái nút. `isProEffective` cũng trả true cho admin,
 * nên không cần thêm ngoại lệ riêng cho quản trị viên.
 *
 * 403 chứ không phải 401 — người dùng ĐÃ đăng nhập, chỉ là chưa đủ gói. Phân
 * biệt hai mã này quan trọng ở phía app: 401 làm nó chạy luồng làm mới token
 * rồi thử lại (và thất bại mãi), 403 thì nó hiện lời mời nâng cấp.
 */
async function chiPro(req: any, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
  try {
    if (await isProEffective(req.userId)) return next();
    res.status(403).json({
      success: false,
      message: 'Chế độ Lập trình là tính năng của tài khoản Pro. Nâng cấp để agent đọc được dự án trên máy bạn.',
      code: 'PRO_REQUIRED',
    });
  } catch (err) {
    next(err);
  }
}

/** Nginx cắt kết nối im lặng ở 60s — nhịp tim phải thưa hơn thế một cách rõ ràng. */
const KEEPALIVE_MS = 25_000;

/**
 * Bộ tool và các trần đang áp dụng.
 *
 * App đọc lúc khởi động để hiện đúng "agent làm được gì" thay vì đoán theo
 * phiên bản app. Cũng chính là route mà `deploy.sh` gõ vào để biết router đã
 * được gắn thật hay chưa (401 khi chưa đăng nhập = đã gắn; 404 = ảnh cũ).
 */
router.get('/tools', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    // CỐ Ý không chặn Pro ở đây. App gọi route này lúc khởi động để biết có
    // hiện chế độ Lập trình hay không; chặn thì app chỉ nhận 403 và không phân
    // biệt được "chưa đủ gói" với "máy chủ hỏng". Trả `pro: false` thì app hiện
    // được lời mời nâng cấp — một câu mời rõ ràng thay cho một lỗi.
    const pro = await isProEffective(req.userId).catch(() => false);
    res.json({
      success: true,
      data: {
        pro,
        configured: gatewayConfigured(),
        model: modelFor('agent_code'),
        capabilities: ALL_CAPABILITIES,
        limits: { tokenCap: tranToken(), windowHours: soGioCuaSo() },
        tools: AGENT_TOOLS.map((t) => ({
          name: t.name,
          ring: t.ring,
          capability: t.capability ?? null,
          description: t.description,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Hạn mức 5 giờ còn lại. App gọi khi mở màn hình để vẽ thanh đo ngay, không
 * phải chờ tới lượt agent đầu tiên mới biết mình còn bao nhiêu.
 *
 * (Trong lúc chạy thì KHÔNG cần gọi lại: mỗi khung `done` đã mang theo `quota`.)
 */
router.get('/usage', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const h = await xemHanMuc(req.userId);
    res.json({
      success: true,
      data: {
        pro: await isProEffective(req.userId).catch(() => false),
        daDung: h.daDung,
        tran: h.tran,
        conLai: h.conLai,
        phanTram: h.phanTram,
        soGio: h.soGio,
        hetHan: h.hetHan,
        hoiLucNao: h.hoiLucNao?.toISOString() ?? null,
        hoiHetLuc: h.hoiHetLuc?.toISOString() ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Một lượt agent.
 *
 * Thân yêu cầu:
 *   {
 *     messages: [{role:'user'|'assistant'|'tool', …}],   // TOÀN BỘ hội thoại
 *     capabilities: ['fs_read','git_read'],              // app chạy được gì
 *     workspace: { name?, platform?, branch? }           // chỉ để nhắc ngữ cảnh
 *   }
 *
 * Trả về SSE. Khung `done` mang `append` — app nối NGUYÊN VĂN vào cuối hội
 * thoại của mình. Đừng tự dựng lại tin nhắn assistant từ các khung `text`:
 * khung `text` đã bị cắt rác của cổng và không mang `tool_calls`, nối bằng nó
 * thì lượt sau cổng từ chối vì thiếu tin nhắn trả lời cho tool_call.
 */
router.post('/turn', chiPro, async (req: any, res: Response) => {
  // ─── 1. Kiểm đầu vào TRƯỚC khi mở SSE ────────────────────────
  // Mở SSE rồi mới thấy đầu vào sai thì lỗi phải đi trong một khung sự kiện,
  // và app nhận HTTP 200 cho một yêu cầu hỏng. Sai sớm thì sai bằng mã HTTP.
  const body = req.body as {
    messages?: unknown; capabilities?: unknown; workspace?: unknown;
    ghiChuDuAn?: unknown; mucNoLuc?: unknown;
  };
  if (!Array.isArray(body?.messages)) {
    res.status(400).json({ success: false, message: 'Thiếu "messages"', code: 'BAD_MESSAGES' });
    return;
  }

  const workspace = typeof body.workspace === 'object' && body.workspace
    ? {
        name: str((body.workspace as any).name, 120),
        platform: str((body.workspace as any).platform, 20),
        branch: str((body.workspace as any).branch, 120),
      }
    : undefined;

  // Ghi chú dự án: nhận NGUYÊN VĂN rồi cắt ở `runAgentTurn`. Trần thô ở đây chỉ
  // để một app hỏng không đẩy được 50MB vào thân yêu cầu.
  const gc = body.ghiChuDuAn;
  const ghiChuDuAn = gc && typeof gc === 'object'
    && typeof (gc as any).ten === 'string' && typeof (gc as any).noiDung === 'string'
    ? { ten: String((gc as any).ten).slice(0, 80), noiDung: String((gc as any).noiDung).slice(0, 200_000) }
    : undefined;

  // ─── 2. Mở SSE ───────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // tắt đệm của Nginx, nếu không chữ về theo cục
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.flushHeaders();

  const guiKhung = (e: AgentEvent): void => {
    if (res.writableEnded) return;
    res.write(`data: ${JSON.stringify(e)}\n\n`);
  };

  const nhipTim = setInterval(() => {
    if (!res.writableEnded) res.write(': keepalive\n\n');
  }, KEEPALIVE_MS);

  // Người dùng bấm dừng hoặc đóng app ⇒ huỷ luôn lời gọi tới cổng. Không có
  // dòng này thì lượt vẫn chạy tiếp tới cùng và vẫn bị tính tiền, chỉ khác là
  // không ai đọc kết quả.
  const dungLai = new AbortController();
  req.on('close', () => {
    clearInterval(nhipTim);
    dungLai.abort();
  });

  try {
    await runAgentTurn(
      {
        messages: body.messages,
        capabilities: body.capabilities,
        workspace,
        ...(ghiChuDuAn ? { ghiChuDuAn } : {}),
        mucNoLuc: body.mucNoLuc,
        userId: req.userId,
      },
      guiKhung,
      dungLai.signal,
    );
  } catch (err) {
    if (err instanceof AgentInputError) {
      guiKhung({ type: 'error', error: err.message, code: err.code });
    } else {
      logger.error('agent/turn hỏng', { error: (err as Error).message, userId: req.userId });
      guiKhung({ type: 'error', error: 'Lỗi máy chủ khi chạy agent.', code: 'INTERNAL' });
    }
  } finally {
    clearInterval(nhipTim);
    if (!res.writableEnded) res.end();
  }
});

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
}

export default router;
