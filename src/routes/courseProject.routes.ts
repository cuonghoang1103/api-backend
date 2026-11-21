/**
 * "Dự án xuyên suốt khoá" (21/11/2026) — docs/du-an-xuyen-suot-khoa.md §4, service: src/services/duAn/duAn.service.ts.
 * Mount trong course.routes.ts (`router.use('/:slug/du-an', …)`) — KHÔNG đụng src/index.ts:
 *
 *   GET   /api/v1/courses/:slug/du-an                          đề tài + mốc + rubric (công khai) + "của tôi" (đăng nhập)
 *   POST  /api/v1/courses/:slug/du-an/chon                     { deTaiSlug } | { tuChonDaDuyet: true }
 *   POST  /api/v1/courses/:slug/du-an/tu-chon                  { ten, moTa, tinhNang[] } ⇒ AI duyệt (trần lượt/ngày)
 *   POST  /api/v1/courses/:slug/du-an/moc/:mocSlug             { repoUrl?, demoUrl?, anhUrl?, ghiChu?, tuKiem[], xong }
 *   POST  /api/v1/courses/:slug/du-an/bao-ve                   mở phiên (hoặc tiếp phiên dở) — JSON
 *   POST  /api/v1/courses/:slug/du-an/bao-ve-stream            như trên, SSE
 *   GET   /api/v1/courses/:slug/du-an/bao-ve/:id               một phiên
 *   POST  /api/v1/courses/:slug/du-an/bao-ve/:id/tra-loi       { traLoi } — JSON
 *   POST  /api/v1/courses/:slug/du-an/bao-ve/:id/tra-loi-stream  { traLoi } — SSE: delta… rồi done{phien} | error
 *   POST  /api/v1/courses/:slug/du-an/bao-ve/:id/hoi-lai       lượt hỏi hỏng giữa chừng ⇒ hỏi lại
 *   POST  /api/v1/courses/:slug/du-an/bao-ve/:id/ket-thuc      kết thúc sớm + chấm (≥ 2 câu) / bỏ dở
 */
import { Router, type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { ZodError, type ZodTypeAny, type z } from 'zod';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  batDauBaoVe, chonDeTai, hoiLaiBaoVe, ketThucBaoVe, layDuAn, layPhienBaoVe, nopMoc, traLoiBaoVe, tuChonDeTai,
} from '../services/duAn/duAn.service.js';
import { schemaBatDauBaoVe, schemaChon, schemaNopMoc, schemaTraLoi, schemaTuChon } from '../services/duAn/quyTac.js';

/** mergeParams ⇒ đọc được `:slug` của router cha. */
export const courseProjectRouter = Router({ mergeParams: true });

// Lưới thô theo IP trước khi chạm CSDL/AI; trần thật (lượt duyệt, phiên bảo vệ / người / ngày) đếm trong service.
const tranGhi = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Thao tác hơi nhanh — đợi một chút nhé.', code: 'DU_AN_RATE_LIMIT' },
});

function parse<S extends ZodTypeAny>(schema: S, v: unknown): z.infer<S> {
  try {
    return schema.parse(v ?? {});
  } catch (e) {
    if (e instanceof ZodError) {
      const dau = e.issues[0];
      throw new AppError(`Dữ liệu chưa hợp lệ: ${dau?.path.join('.') || 'body'} — ${dau?.message ?? ''}`.trim(), 400, 'VALIDATION');
    }
    throw e;
  }
}

function soId(v: unknown): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new AppError('id không hợp lệ', 400, 'VALIDATION');
  return n;
}

const slugCua = (req: Request) => String(req.params.slug);

courseProjectRouter.get('/', optionalAuth, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.set('Cache-Control', 'private, no-store');
    res.json({ success: true, data: await layDuAn(slugCua(req), req.userId ?? null) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/chon', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await chonDeTai(req.userId!, slugCua(req), parse(schemaChon, req.body)) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/tu-chon', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await tuChonDeTai(req.userId!, slugCua(req), parse(schemaTuChon, req.body)) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/moc/:mocSlug', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const mocSlug = String(req.params.mocSlug || '').slice(0, 120);
    res.json({ success: true, data: await nopMoc(req.userId!, slugCua(req), mocSlug, parse(schemaNopMoc, req.body)) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/bao-ve', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const v = parse(schemaBatDauBaoVe, req.body);
    res.json({ success: true, data: await batDauBaoVe(req.userId!, slugCua(req), v.ngonNgu ?? 'vi') });
  } catch (e) { next(e); }
});

courseProjectRouter.get('/bao-ve/:id', authenticate, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.set('Cache-Control', 'private, no-store');
    res.json({ success: true, data: await layPhienBaoVe(req.userId!, slugCua(req), soId(req.params.id)) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/bao-ve/:id/tra-loi', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const v = parse(schemaTraLoi, req.body);
    res.json({ success: true, data: await traLoiBaoVe(req.userId!, slugCua(req), soId(req.params.id), v.traLoi) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/bao-ve/:id/hoi-lai', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await hoiLaiBaoVe(req.userId!, slugCua(req), soId(req.params.id)) });
  } catch (e) { next(e); }
});

courseProjectRouter.post('/bao-ve/:id/ket-thuc', authenticate, tranGhi, async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    res.json({ success: true, data: await ketThucBaoVe(req.userId!, slugCua(req), soId(req.params.id)) });
  } catch (e) { next(e); }
});

/* ── SSE: cùng khung với `/lessons/:id/ai/ask-stream` — {type:'delta',text}… {type:'done',data} | {type:'error',error,code} ── */

function moSse(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // tắt buffer của Nginx cho SSE
  res.flushHeaders?.();
  const send = (obj: unknown): void => { if (!res.writableEnded) res.write(`data: ${JSON.stringify(obj)}\n\n`); };
  const keepalive = setInterval(() => { if (!res.writableEnded) res.write(': ka\n\n'); }, 15_000);
  req.on('close', () => clearInterval(keepalive));
  const xong = () => { clearInterval(keepalive); if (!res.writableEnded) res.end(); };
  const loi = (e: unknown) => {
    const ae = e instanceof AppError ? e : null;
    const status = ae?.statusCode ?? (e as { statusCode?: number })?.statusCode ?? 500;
    // Lỗi 5xx không phải AppError: không lộ chữ nội bộ ra ngoài (cùng luật errorHandler).
    const thongBao = ae || status < 500 ? (e as Error).message : 'Hội đồng AI đang bận — thử lại sau ít phút.';
    send({ type: 'error', error: thongBao, code: ae?.code ?? (e as { code?: string })?.code ?? null, status });
  };
  return { send, xong, loi };
}

courseProjectRouter.post('/bao-ve-stream', authenticate, tranGhi, async (req: Request, res: Response) => {
  let v: z.infer<typeof schemaBatDauBaoVe>;
  try { v = parse(schemaBatDauBaoVe, req.body); } catch (e) { const s = moSse(req, res); s.loi(e); s.xong(); return; }
  const s = moSse(req, res);
  try {
    const data = await batDauBaoVe(req.userId!, slugCua(req), v.ngonNgu ?? 'vi', (t) => s.send({ type: 'delta', text: t }));
    s.send({ type: 'done', data });
  } catch (e) { s.loi(e); }
  s.xong();
});

courseProjectRouter.post('/bao-ve/:id/tra-loi-stream', authenticate, tranGhi, async (req: Request, res: Response) => {
  let id = 0;
  let traLoi = '';
  try { id = soId(req.params.id); traLoi = parse(schemaTraLoi, req.body).traLoi; } catch (e) { const s = moSse(req, res); s.loi(e); s.xong(); return; }
  const s = moSse(req, res);
  try {
    const data = await traLoiBaoVe(req.userId!, slugCua(req), id, traLoi, {
      onToken: (t) => s.send({ type: 'delta', text: t }),
      onDangCham: () => s.send({ type: 'grading' }),
    });
    s.send({ type: 'done', data });
  } catch (e) { s.loi(e); }
  s.xong();
});
