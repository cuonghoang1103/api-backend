/**
 * CT Work 22/10/2026 — THÙNG RÁC DỮ LIỆU 30 ngày + YÊU CẦU XOÁ chờ trưởng nhóm duyệt (sau sự cố SWT301 mất bảng 5.1).
 * Gắn VÀO work.routes.ts (`router.use`, sau authenticate + chốt cổng khách). Tuyến dưới `/projects/:pid/trash/**` ⇒ agent
 * bị chặn sẵn (AGENT_DENIED_ROUTES `/trash`), khách cổng bị chặn (danh sách trắng không có). Tuyến ngoài dự án
 * (`/me/delete-requests`, `/delete-requests/:id/…`) ⇒ agent bị chặn (agentTopRouteAllowed fail-closed).
 *
 *   GET    /projects/:pid/trash/data                 — mục trong thùng rác (người sửa được dự án)
 *   POST   /projects/:pid/trash/data/:id/restore     — khôi phục (người sửa được dự án)
 *   DELETE /projects/:pid/trash/data/:id             — xoá vĩnh viễn (CHỈ ADMIN dự án)
 *   GET    /projects/:pid/trash/requests?status=     — yêu cầu xoá của dự án (+ canDecide)
 *   GET    /me/delete-requests                       — yêu cầu đang chờ TÔI duyệt (mọi dự án / lớp)
 *   POST   /delete-requests/:id/approve|reject       — trưởng nhóm quyết; CHỈ phiên web (token API ⇒ 403: AI không tự duyệt)
 *   POST   /delete-requests/:id/cancel               — người gửi rút lại
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as bin from '../services/work/trashBin.service.js';
import * as reqs from '../services/work/deleteRequests.service.js';
import { dangKyYeuCauXoa } from '../services/work/ai.service.js';
import { runInAiScope } from '../services/work/aiUsage.service.js';

/**
 * Hỏi AI (web): người bấm Apply một đề xuất XOÁ ⇒ chỉ TẠO YÊU CẦU chờ trưởng nhóm duyệt (kể cả khi người bấm là trưởng nhóm —
 * AI có thể hiểu sai). Móc `dangKyYeuCauXoa` do phiên CuongMini-trong-CT-Work để sẵn trong ai.service.
 */
dangKyYeuCauXoa(async (userId, projectId, command, args, summary) => {
  const reg = await import('../services/work/toolRegistry/index.js');
  const t = reg.commandByName(command);
  if (!t?.destructive) throw new AppError(`${command} is not a delete command`, 400, 'WORK_AI_BAD_COMMAND');
  const parsed = reg.parseArgs(t, args, await reg.projectRefOf(projectId));
  const r = await runInAiScope('web', () => reg.queueToolDeletion(reg.personCtx(userId), t, parsed));
  if (r.error !== undefined) throw r.error;
  const out = r.result!;
  return { summary: `${summary ? `${summary} — ` : ''}${out.message}` };
});

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try { return schema.parse(value); } catch (err) {
    if (err instanceof ZodError) throw new AppError(err.issues[0]?.message ?? 'Invalid input', 400, 'VALIDATION_ERROR');
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const note = z.object({ note: z.string().max(500).nullable().optional() });

/** Quyết định xoá là việc của NGƯỜI trên web: token API (kể cả token của trưởng nhóm, kể cả CuongMini) không duyệt được. */
function webOnly(req: Request) {
  if (req.workToken || req.agent) throw new AppError('Deletion requests are approved by a person on the CT Work web, not through an API token or AI.', 403, 'WORK_APPROVE_ON_WEB');
}

router.get('/projects/:pid/trash/data', asyncHandler(async (req, res) => ok(res, await bin.listTrash(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/trash/data/:id/restore', asyncHandler(async (req, res) => ok(res, await bin.restoreTrash(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.delete('/projects/:pid/trash/data/:id', asyncHandler(async (req, res) => {
  webOnly(req);
  await bin.purgeTrash(callerId(req), P(req, 'pid'), P(req, 'id'));
  ok(res, { purged: true });
}));

router.get('/projects/:pid/trash/requests', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'FAILED', 'EXPIRED']).optional() }), req.query);
  ok(res, await reqs.listProjectRequests(callerId(req), P(req, 'pid'), q.status));
}));
router.get('/me/delete-requests', asyncHandler(async (req, res) => ok(res, await reqs.listMyPending(callerId(req)))));
router.post('/delete-requests/:id/approve', asyncHandler(async (req, res) => {
  webOnly(req);
  ok(res, await reqs.approveRequest(callerId(req), P(req, 'id'), parse(note, req.body ?? {}).note));
}));
router.post('/delete-requests/:id/reject', asyncHandler(async (req, res) => {
  webOnly(req);
  ok(res, await reqs.rejectRequest(callerId(req), P(req, 'id'), parse(note, req.body ?? {}).note));
}));
router.post('/delete-requests/:id/cancel', asyncHandler(async (req, res) => ok(res, await reqs.cancelRequest(callerId(req), P(req, 'id')))));

export default router;
