/**
 * CT Work đợt 3C (09/10/2026) — "Dùng được khi KHÔNG có Claude". Gắn trong work.routes.ts (đã qua apiTokenAuth +
 * authenticate + chốt /projects/:pid + chốt cổng khách). Quyền kiểm TRONG service.
 *
 *   Agent dựng sẵn (BUILTIN) — chỉ NGƯỜI (AGENT_DENIED_ROUTES + agentTopRouteAllowed chặn token agent), Pro/admin:
 *     POST /projects/:pid/issues/:num/agent-runs { agentId?, task?, note? }   giao + chạy ("Assign to AI" / "Run again")
 *     GET  /projects/:pid/issues/:num/agent-runs                              lượt chạy của thẻ (trạng thái, bước, chi phí)
 *     POST /projects/:pid/agent-runs/:runId/cancel                            dừng
 *     GET  /workspaces/:wsId/agents/:agentId/runs                             trang agent: lượt chạy + tiền đã dùng
 *     GET/PUT /workspaces/:wsId/builtin-budget                                trần chung không gian (admin sửa)
 *   Xuất Word/PDF bằng LINK (lệnh export_file): GET /projects/:pid/pages/:num/export.(docx|pdf) — bọc
 *     docs3a.exportPage (hàm của đợt 3A; sơ đồ Mermaid chưa kèm ảnh vì ảnh do trình duyệt vẽ).
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as builtin from '../services/work/builtinAgent.service.js';
import { exportPage } from '../services/work/docs3a.service.js';

builtin.registerBuiltinHooks();
builtin.startBuiltinJobs();

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
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

router.post('/projects/:pid/issues/:num/agent-runs', asyncHandler(async (req, res) => {
  const body = parse(z.object({ agentId: id.optional(), task: z.enum(builtin.BUILTIN_TASKS).optional(), note: z.string().max(2000).nullable().optional() }), req.body ?? {});
  const r = await builtin.requestRun(callerId(req), P(req, 'pid'), P(req, 'num'), body);
  ok(res, r, r.existing ? 200 : 201);
}));
router.get('/projects/:pid/issues/:num/agent-runs', asyncHandler(async (req, res) => {
  ok(res, await builtin.listIssueRuns(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/agent-runs/:runId/cancel', asyncHandler(async (req, res) => {
  ok(res, await builtin.cancelRun(callerId(req), P(req, 'pid'), P(req, 'runId')));
}));
router.get('/workspaces/:wsId/agents/:agentId/runs', asyncHandler(async (req, res) => {
  ok(res, await builtin.listAgentRuns(callerId(req), P(req, 'wsId'), P(req, 'agentId')));
}));
router.get('/workspaces/:wsId/builtin-budget', asyncHandler(async (req, res) => {
  ok(res, await builtin.getBudget(callerId(req), P(req, 'wsId')));
}));
router.put('/workspaces/:wsId/builtin-budget', asyncHandler(async (req, res) => {
  const body = parse(z.object({ dailyCapUsd: z.number().min(0).max(1000).optional(), runCapUsd: z.number().min(0.01).max(100).optional(), maxSteps: z.number().int().min(2).max(30).optional() }), req.body ?? {});
  ok(res, await builtin.updateBudget(callerId(req), P(req, 'wsId'), body));
}));

router.get('/projects/:pid/pages/:num/export.:fmt', asyncHandler(async (req, res) => {
  const fmt = parse(z.enum(['docx', 'pdf']), req.params.fmt);
  const out = await exportPage(callerId(req), P(req, 'pid'), P(req, 'num'), { format: fmt });
  res.setHeader('Content-Type', fmt === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}));

export default router;
