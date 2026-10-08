/**
 * CT Work — CTW đợt 3A (09/10/2026): TÀI LIỆU. Gắn vào work.routes.ts bằng một dòng `router.use` ở cuối (sau authenticate
 * + chốt cổng khách) ⇒ khách bị cách ly không gọi được tuyến nào ở đây (403 CLIENT_PORTAL_ONLY).
 *
 *   POST /projects/:pid/images?name=…            thân = byte ảnh (image/* hoặc octet-stream, ≤ 10 MB) ⇒ { id, url, width, height }
 *   GET  /projects/:pid/images/:id               ảnh (quyền xem dự án)
 *   POST /projects/:pid/pages/:num/export        { format: 'docx'|'pdf', diagrams?: (dataURL PNG|null)[] } ⇒ tệp
 *   GET  /projects/:pid/pages/:num/record-of-changes   ⇒ dòng Record of Changes tự sinh từ lịch sử phiên bản
 *   POST /projects/:pid/pages/:num/autofill      { version?, sections? } ⇒ { filled, page }
 *
 * Quyền kiểm TRONG service (docs3a.service.ts) — route chỉ kiểm đầu vào.
 */

import express, { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as docs from '../services/work/docs3a.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);

// ─── Ảnh ─────────────────────────────────────────────────────────
const rawImage = express.raw({ type: () => true, limit: docs.MAX_IMAGE_BYTES + 1024 });
router.post('/projects/:pid/images', rawImage, asyncHandler(async (req, res) => {
  const q = parse(z.object({ name: z.string().max(200).default('image') }), req.query);
  const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
  ok(res, await docs.uploadImage(callerId(req), P(req, 'pid'), buf, q.name), 201);
}));
router.get('/projects/:pid/images/:iid', asyncHandler(async (req, res) => {
  const img = await docs.readImage(callerId(req), P(req, 'pid'), P(req, 'iid'));
  res.setHeader('Content-Type', img.mime);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `inline; filename="${img.fileName.replace(/[^\x20-\x7e]/g, '_')}"`);
  // Nội dung theo id không bao giờ đổi ⇒ cache riêng tư dài (quyền vẫn kiểm mỗi lần trình duyệt hỏi lại).
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.send(img.buffer);
}));

// ─── Xuất .docx / PDF ────────────────────────────────────────────
const exportBody = z.object({
  format: z.enum(['docx', 'pdf']),
  diagrams: z.array(z.string().max(6_000_000).nullable()).max(60).optional(),
  stripGuides: z.boolean().optional(),
  toc: z.boolean().optional(),
  cover: z.boolean().optional(),
});
// Thân JSON đi qua parser chung của app (trần 10 MB) — client tự bỏ bớt ảnh sơ đồ nếu tổng vượt ~8 MB.
router.post('/projects/:pid/pages/:num/export', asyncHandler(async (req, res) => {
  const body = parse(exportBody, req.body);
  const out = await docs.exportPage(callerId(req), P(req, 'pid'), P(req, 'num'), body);
  res.setHeader('Content-Type', body.format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}));

// ─── Record of Changes + điền từ dữ liệu dự án ───────────────────
router.get('/projects/:pid/pages/:num/record-of-changes', asyncHandler(async (req, res) => {
  ok(res, await docs.pageRecordOfChanges(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/pages/:num/autofill', asyncHandler(async (req, res) => {
  const body = parse(z.object({ version: z.number().int().nonnegative().optional(), sections: z.array(z.enum(docs.FILL_SECTIONS)).max(10).optional() }), req.body ?? {});
  ok(res, await docs.autofillPage(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));

export default router;
