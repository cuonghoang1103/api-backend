/**
 * CTW K-3b (10/10/2026) — ĐỒNG SOẠN THẢO Docs + bình luận gắn đoạn văn. Gắn trong work.routes.ts (sau apiTokenAuth +
 * authenticate + editLockGuard + chốt /projects/:pid: phạm vi token agent, cổng khách — khách bị cách ly không gọi được
 * tuyến nào ở đây vì không nằm trong danh sách trắng). Quyền kiểm TRONG service (collab.service.ts).
 *
 *   GET  /projects/:pid/pages/:num/collab                 trạng thái + mã phiên WebSocket (/notes-collaboration/work-docs)
 *   PUT  /projects/:pid/pages/:num/collab                 { enabled } — chủ trang / ADMIN
 *   POST /projects/:pid/pages/:num/collab/flush           ghi ngay bản đang sống (trước khi xuất)
 *   GET  /projects/:pid/pages/:num/collab/authors         tác giả theo đoạn
 *   PUT  /projects/:pid/docs/collab                       { enabled } — ADMIN dự án (mặc định bật)
 *   POST /projects/:pid/pages/:num/inline-comments        { anchorId, quote, bodyJson }
 *   POST /projects/:pid/pages/:num/inline-comments/:cid/resolve  { resolved }
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as collab from '../services/work/collab.service.js';

const router = Router();

function callerId(req: Request): number {
  const v = req.userId ?? req.user?.userId;
  if (!v) throw new UnauthorizedError();
  return v;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);

router.get('/projects/:pid/pages/:num/collab', asyncHandler(async (req, res) => {
  ok(res, await collab.collabSession(callerId(req), P(req, 'pid'), P(req, 'num'), !!req.workToken));
}));
router.put('/projects/:pid/pages/:num/collab', asyncHandler(async (req, res) => {
  const { enabled } = parse(z.object({ enabled: z.boolean() }), req.body);
  ok(res, await collab.setPageCollab(callerId(req), P(req, 'pid'), P(req, 'num'), enabled));
}));
router.post('/projects/:pid/pages/:num/collab/flush', asyncHandler(async (req, res) => {
  ok(res, await collab.flushCollab(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.get('/projects/:pid/pages/:num/collab/authors', asyncHandler(async (req, res) => {
  ok(res, await collab.pageAuthors(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.put('/projects/:pid/docs/collab', asyncHandler(async (req, res) => {
  const { enabled } = parse(z.object({ enabled: z.boolean() }), req.body);
  ok(res, await collab.setProjectCollab(callerId(req), P(req, 'pid'), enabled));
}));
router.post('/projects/:pid/pages/:num/inline-comments', asyncHandler(async (req, res) => {
  const body = parse(z.object({ anchorId: z.string().min(6).max(40), quote: z.string().min(1).max(5000), bodyJson: z.unknown() }), req.body);
  ok(res, await collab.addInlineComment(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.post('/projects/:pid/pages/:num/inline-comments/:cid/resolve', asyncHandler(async (req, res) => {
  const { resolved } = parse(z.object({ resolved: z.boolean() }), req.body);
  ok(res, await collab.resolveInlineComment(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'cid'), resolved));
}));

export default router;
