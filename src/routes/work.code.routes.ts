/**
 * CT Work — trang "Code" của dự án (18/10/2026). Mọi tuyến sau authenticate, quyền ở code.service `codeGate`
 * (thành viên dự án; vai CLIENT 403; người ngoài 404). Khách cổng bị chặn trước ở chốt cổng khách (tuyến /code không
 * nằm trong danh sách trắng). Agent: đọc hoạt động được; `/code/source/**` bị chặn ở AGENT_DENIED_ROUTES + service.
 *
 *   GET  /projects/:pid/code/status                           { connected } — rẻ, cho thanh bên
 *   GET  /projects/:pid/code/overview                         repo + số liệu (commit 7 ngày, PR mở, người, biểu đồ)
 *   GET  /projects/:pid/code/activity?actor&branch&from&to&kind&before&limit
 *   GET  /projects/:pid/code/branches
 *   GET  /projects/:pid/code/pulls?state=open|merged|closed|all
 *   GET  /projects/:pid/code/issues/:num                      panel Development (commit nhóm theo PR/nhánh)
 *   GET  /projects/:pid/code/source/meta|refs|tree|blob|commits?provider&ref&path
 *   GET  /projects/:pid/code/source/commit/:sha
 *   PUT  /projects/:pid/(github|gitlab)/read-token            { token|null } — ADMIN; token không bao giờ trả về
 *   PUT  /projects/:pid/(github|gitlab)/activity              { chatChannelId?, notify? } — ADMIN
 *   POST /projects/:pid/(github|gitlab)/test                  gửi thử — ADMIN
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as code from '../services/work/code.service.js';

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const provider = z.enum(['GITHUB', 'GITLAB']).optional();
const providerOf = (req: Request): code.Provider => (req.params.host === 'gitlab' ? 'GITLAB' : 'GITHUB');

router.get('/projects/:pid/code/status', asyncHandler(async (req, res) => {
  ok(res, await code.status(callerId(req), P(req, 'pid')));
}));

router.get('/projects/:pid/code/overview', asyncHandler(async (req, res) => {
  ok(res, await code.overview(callerId(req), P(req, 'pid')));
}));

router.get('/projects/:pid/code/activity', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    actor: z.string().max(220).optional(), branch: z.string().max(255).optional(), from: day.optional(), to: day.optional(),
    kind: z.enum(['push', 'branch', 'pr']).optional(), before: z.string().max(40).optional(), limit: z.coerce.number().int().min(1).max(100).optional(),
  }), req.query);
  ok(res, await code.activity(callerId(req), P(req, 'pid'), q));
}));

router.get('/projects/:pid/code/branches', asyncHandler(async (req, res) => {
  ok(res, await code.branches(callerId(req), P(req, 'pid')));
}));

router.get('/projects/:pid/code/pulls', asyncHandler(async (req, res) => {
  const { state } = parse(z.object({ state: z.enum(['open', 'merged', 'closed', 'all']).default('all') }), req.query);
  ok(res, await code.pulls(callerId(req), P(req, 'pid'), state));
}));

router.get('/projects/:pid/code/issues/:num', asyncHandler(async (req, res) => {
  ok(res, await code.issueDev(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

// ─── Mã nguồn (proxy GitHub/GitLab) ──────────────────────────────

const srcQ = z.object({ provider, ref: z.string().max(200).optional(), path: z.string().max(500).optional() });
router.get('/projects/:pid/code/source/meta', asyncHandler(async (req, res) => {
  ok(res, await code.sourceMeta(callerId(req), P(req, 'pid'), parse(srcQ, req.query).provider));
}));
router.get('/projects/:pid/code/source/refs', asyncHandler(async (req, res) => {
  ok(res, await code.sourceRefs(callerId(req), P(req, 'pid'), parse(srcQ, req.query).provider));
}));
router.get('/projects/:pid/code/source/tree', asyncHandler(async (req, res) => {
  ok(res, await code.sourceTree(callerId(req), P(req, 'pid'), parse(srcQ, req.query)));
}));
router.get('/projects/:pid/code/source/blob', asyncHandler(async (req, res) => {
  ok(res, await code.sourceBlob(callerId(req), P(req, 'pid'), parse(srcQ, req.query)));
}));
router.get('/projects/:pid/code/source/commits', asyncHandler(async (req, res) => {
  ok(res, await code.sourceCommits(callerId(req), P(req, 'pid'), parse(srcQ, req.query)));
}));
router.get('/projects/:pid/code/source/commit/:sha', asyncHandler(async (req, res) => {
  ok(res, await code.sourceCommit(callerId(req), P(req, 'pid'), String(req.params.sha), parse(srcQ, req.query).provider));
}));

// ─── Cài đặt (ADMIN) — nằm dưới /github|/gitlab nên agent bị chặn sẵn (AGENT_DENIED_ROUTES) ──

router.put('/projects/:pid/:host(github|gitlab)/read-token', asyncHandler(async (req, res) => {
  const { token } = parse(z.object({ token: z.string().max(400).nullable() }), req.body ?? {});
  ok(res, await code.setReadToken(callerId(req), P(req, 'pid'), providerOf(req), token));
}));
router.put('/projects/:pid/:host(github|gitlab)/activity', asyncHandler(async (req, res) => {
  const body = parse(z.object({ chatChannelId: id.nullable().optional(), notify: z.boolean().optional() }), req.body ?? {});
  ok(res, await code.setActivitySettings(callerId(req), P(req, 'pid'), providerOf(req), body));
}));
router.post('/projects/:pid/:host(github|gitlab)/test', asyncHandler(async (req, res) => {
  ok(res, await code.testSend(callerId(req), P(req, 'pid'), providerOf(req)));
}));

export default router;
