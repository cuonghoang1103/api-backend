/**
 * Xưởng Remix — AI kèm cặp.
 *
 *   GET  /xuong-remix/trang-thai   cổng LLM có sẵn sàng không (KHÔNG cần đăng nhập)
 *   POST /xuong-remix/kem-cap      hỏi một câu, kèm số đo của bài
 *
 * ─── Vì sao `trang-thai` KHÔNG cần đăng nhập ───
 * Hai lý do, cả hai đều thật:
 *
 *  1. App desktop gọi nó lúc mở trang để biết có hiện ô hỏi AI hay không. Chặn
 *     ở đây thì app chỉ nhận 401 và không phân biệt được "chưa đăng nhập" với
 *     "máy chủ chưa cắm khoá" — hai thứ cần hai câu nhắc khác hẳn nhau.
 *  2. `deploy.sh` smoke-test cần một route GET KHÔNG tham số, KHÔNG cần auth
 *     của mỗi router mới để phát hiện bản dựng cũ (404 = route chưa mount).
 *     Luật đó ghi trong CLAUDE.md, và `kem-cap` là POST nên không dùng được.
 *
 * Nó không tiết lộ gì: chỉ một cờ boolean và tên model, đúng như `/agent/tools`
 * vốn đã trả về cho mọi người.
 */
import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { gatewayConfigured, modelFor } from '../services/llm/gateway.js';
import { kemCap, type SoDoBai } from '../services/xuongRemix.service.js';

const router = Router();

router.get('/trang-thai', (_req, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    data: { sanSang: gatewayConfigured(), model: modelFor('remix_coach') },
  });
});

/** Ép một số về `number` hữu hạn; thiếu hay rác thì thành 0. */
function so(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Đọc số đo một bài từ payload.
 *
 * Tự ép kiểu thay vì tin client: đây là số ĐI THẲNG vào lời nhắc, và một chuỗi
 * lạ lọt vào đó là một đường bơm chữ vào prompt. Ép về number thì mọi thứ
 * không phải số đều thành 0, và 0 thì vô hại.
 *
 * `ten` là chuỗi duy nhất còn lại, nên nó bị cắt ngắn cứng.
 */
function docSoDo(raw: unknown): SoDoBai | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.ten !== 'string' || !o.ten.trim()) return null;

  const dai: Record<string, number> = {};
  if (o.dai && typeof o.dai === 'object') {
    for (const [f, v] of Object.entries(o.dai as Record<string, unknown>)) {
      // Khoá phải là một tần số; bỏ mọi khoá lạ thay vì chuyển tiếp nguyên văn.
      if (!/^\d+(\.\d+)?$/.test(f)) continue;
      dai[f] = so(v);
    }
  }

  return {
    ten: o.ten.trim().slice(0, 200),
    giay: so(o.giay),
    bpm: so(o.bpm),
    bpmTinCay: so(o.bpmTinCay),
    tong: typeof o.tong === 'string' ? o.tong.slice(0, 12) : '',
    tongCamelot: typeof o.tongCamelot === 'string' ? o.tongCamelot.slice(0, 4) : '',
    tongTinCay: so(o.tongTinCay),
    lufs: so(o.lufs),
    dinhThat: so(o.dinhThat),
    daiDong: so(o.daiDong),
    rongStereo: so(o.rongStereo),
    dai,
  };
}

router.post('/kem-cap', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const bai = docSoDo(req.body?.bai);
    if (!bai) {
      res.status(400).json({ success: false, message: 'Thiếu số đo của bài' });
      return;
    }
    const banMau = docSoDo(req.body?.banMau) ?? undefined;

    /* Chênh lệch do app tính sẵn. Cắt cả số dòng lẫn độ dài mỗi dòng: đây là
       chuỗi tự do đi thẳng vào lời nhắc, và không có trần thì một client bị
       chiếm có thể nhồi cả nghìn dòng để đẩy luật hệ thống ra khỏi ngữ cảnh. */
    const chenh = Array.isArray(req.body?.chenh)
      ? (req.body.chenh as unknown[])
          .filter((c): c is string => typeof c === 'string')
          .slice(0, 12)
          .map((c) => c.slice(0, 200))
      : undefined;

    const cauHoi = typeof req.body?.cauHoi === 'string' ? req.body.cauHoi.trim() : undefined;

    res.json({
      success: true,
      data: await kemCap(req.userId, {
        bai,
        banMau,
        chenh,
        ...(cauHoi ? { cauHoi } : {}),
      }),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
