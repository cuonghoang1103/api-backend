/**
 * CT Work đợt 8B (19/10/2026) — AI USAGE: ai đang dùng AI nối CT Work (CuongMini qua MCP, AI khác qua MCP, trợ lý AI web,
 * agent), lần gần nhất, số lượt, token, chi phí theo nguồn, model (tên CuongMini), thao tác ghi của AI.
 *
 *   GET /workspaces/:wsId/ai-usage   ?from=YYYY-MM-DD&to=YYYY-MM-DD&userId=&projectId=
 *   GET /projects/:pid/ai-usage      ?from=&to=&userId=
 *
 * Quyền ở service (aiUsage.service.ts): ADMIN dự án / OWNER-ADMIN không gian xem tất; thành viên chỉ phần của mình;
 * khách cổng + agent ⇒ 403 (agent còn bị chặn ở tầng tuyến: AGENT_DENIED_ROUTES `/ai-usage`, agentTopRouteAllowed).
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import { projectAiUsage, workspaceAiUsage } from '../services/work/aiUsage.service.js';

const router = Router();

function callerId(req: Request): number {
  const v = req.userId ?? req.user?.userId;
  if (!v) throw new UnauthorizedError();
  return v;
}
const ok = (r: Response, data: unknown) => r.status(200).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) throw new AppError(err.issues[0]?.message ?? 'Invalid input', 400, 'VALIDATION_ERROR');
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const query = z.object({ from: ymd.optional(), to: ymd.optional(), userId: id.optional(), projectId: id.optional() });

router.get('/workspaces/:wsId/ai-usage', asyncHandler(async (req, res) => {
  ok(res, await workspaceAiUsage(callerId(req), parse(id, req.params.wsId), parse(query, req.query)));
}));

router.get('/projects/:pid/ai-usage', asyncHandler(async (req, res) => {
  const q = parse(query.omit({ projectId: true }), req.query);
  ok(res, await projectAiUsage(callerId(req), parse(id, req.params.pid), q));
}));

export default router;
