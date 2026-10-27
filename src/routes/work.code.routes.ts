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
 *   GET  /projects/:pid/code/source/pull/:n | pull/:n/files | compare?base&head   (27/10/2026)
 *   POST /projects/:pid/code/review                         { pr | issue, notify? } — CuongMini review (codeReview.service)
 *   POST /projects/:pid/code/review/queue(/apply) · GET|PUT /code/review/auto · POST /code/review/auto/:rid/undo — làm thay trưởng nhóm
 *   GET  /me/nudges · GET /projects/:pid/nudges · POST /projects/:pid/nudges/:num/apply|snooze — CuongMini hỏi nhanh
 *   PUT  /projects/:pid/(github|gitlab)/read-token            { token|null } — ADMIN; token không bao giờ trả về
 *   PUT  /projects/:pid/(github|gitlab)/activity              { chatChannelId?, notify? } — ADMIN
 *   POST /projects/:pid/(github|gitlab)/test                  gửi thử — ADMIN
 *   GET  /projects/:pid/figma                                 { hasToken, handle, savedAt, canEdit } (19/10/2026)
 *   PUT  /projects/:pid/figma/token                           { token|null } — ADMIN; token Figma CHỈ ĐỌC cho trợ lý AI,
 *                                                             mã hoá, không bao giờ trả về (linkNgoaiDuAn.ts)
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as code from '../services/work/code.service.js';
import * as linkNgoai from '../services/work/linkNgoaiDuAn.js';

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

// 27/10/2026: PR/MR + so sánh nhánh (CuongMini đọc code để review). Cùng chốt `codeGate({source})`; agent bị chặn ở
// AGENT_DENIED_ROUTES (`/code/source/**`) + service.
router.get('/projects/:pid/code/source/pull/:n', asyncHandler(async (req, res) => {
  ok(res, await code.sourcePull(callerId(req), P(req, 'pid'), P(req, 'n'), parse(srcQ, req.query).provider));
}));
router.get('/projects/:pid/code/source/pull/:n/files', asyncHandler(async (req, res) => {
  ok(res, await code.sourcePullFiles(callerId(req), P(req, 'pid'), P(req, 'n'), parse(srcQ, req.query).provider));
}));
router.get('/projects/:pid/code/source/compare', asyncHandler(async (req, res) => {
  const q = parse(z.object({ provider, base: z.string().max(200).optional(), head: z.string().min(1).max(200) }), req.query);
  ok(res, await code.sourceCompare(callerId(req), P(req, 'pid'), q));
}));

// 27/10/2026: CuongMini review code (PR số `pr`, hoặc thẻ `issue` ⇒ PR/nhánh của thẻ). Quyền + trần ở codeReview.service;
// kết quả là phiên review (GET /reviews/:num như cũ) + bình luận nội bộ vào thẻ. Agent bị chặn ở AGENT_DENIED_ROUTES + service.
router.post('/projects/:pid/code/review', asyncHandler(async (req, res) => {
  const body = parse(z.object({ pr: id.optional(), issue: id.optional(), notify: z.boolean().optional(), postToGithub: z.boolean().optional() }).refine((b) => b.pr || b.issue, 'Pick a pull request or an issue'), req.body ?? {});
  const { runCodeReview } = await import('../services/work/codeReview.service.js');
  ok(res, await runCodeReview(callerId(req), P(req, 'pid'), body), 201);
}));

// ─── CuongMini làm thay trưởng nhóm (27/10/2026, reviewHangLoat.service): review các thẻ ở cột Review ──
// (A) theo yêu cầu: gói đề xuất ⇒ người bấm chọn dòng ⇒ apply dưới quyền người bấm. (B) tự động: cờ dự án, mặc định tắt.
const decision = z.enum(['DONE', 'BACK', 'KEEP']);
router.post('/projects/:pid/code/review/queue', asyncHandler(async (req, res) => {
  const body = parse(z.object({ numbers: z.array(id).max(20).optional(), max: z.number().int().min(1).max(10).optional() }), req.body ?? {});
  const m = await import('../services/work/reviewHangLoat.service.js');
  ok(res, await m.reviewQueue(callerId(req), P(req, 'pid'), body));
}));
router.post('/projects/:pid/code/review/queue/apply', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(z.object({ number: id, decision, comment: z.string().max(6000).nullable().optional() })).min(1).max(20) }), req.body ?? {});
  const m = await import('../services/work/reviewHangLoat.service.js');
  ok(res, await m.applyQueue(callerId(req), P(req, 'pid'), items));
}));
router.get('/projects/:pid/code/review/auto', asyncHandler(async (req, res) => {
  const m = await import('../services/work/reviewHangLoat.service.js');
  ok(res, await m.autoReviewStatus(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/code/review/auto', asyncHandler(async (req, res) => {
  const { enabled } = parse(z.object({ enabled: z.boolean() }), req.body ?? {});
  const m = await import('../services/work/reviewHangLoat.service.js');
  ok(res, await m.setAutoReview(callerId(req), P(req, 'pid'), enabled));
}));
router.post('/projects/:pid/code/review/auto/:rid/undo', asyncHandler(async (req, res) => {
  const m = await import('../services/work/reviewHangLoat.service.js');
  ok(res, await m.undoAutoReview(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));

// ─── CuongMini "hỏi nhanh": gợi ý chuyển trạng thái thẻ của CHÍNH mình (27/10/2026, goiYChuyenThe.service) ──
// Nằm ở file này cho gọn đợt; agent bị chặn ở AGENT_DENIED_ROUTES (`/nudges`) + `/me/nudges` ngoài danh sách trắng + service.
router.get('/me/nudges', asyncHandler(async (req, res) => {
  const { limit } = parse(z.object({ limit: z.coerce.number().int().min(1).max(20).optional() }), req.query);
  const { goiYCuaToi } = await import('../services/work/goiYChuyenThe.service.js');
  ok(res, await goiYCuaToi(callerId(req), { limit }));
}));
router.get('/projects/:pid/nudges', asyncHandler(async (req, res) => {
  const { limit } = parse(z.object({ limit: z.coerce.number().int().min(1).max(20).optional() }), req.query);
  const { goiYChuyenThe } = await import('../services/work/goiYChuyenThe.service.js');
  ok(res, await goiYChuyenThe(callerId(req), P(req, 'pid'), { limit }));
}));
router.post('/projects/:pid/nudges/:num/apply', asyncHandler(async (req, res) => {
  const body = parse(z.object({ note: z.string().max(2000).nullable().optional(), attachmentIds: z.array(id).max(10).optional() }), req.body ?? {});
  const { applyGoiY } = await import('../services/work/goiYChuyenThe.service.js');
  ok(res, await applyGoiY(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.post('/projects/:pid/nudges/:num/snooze', asyncHandler(async (req, res) => {
  const { snoozeGoiY } = await import('../services/work/goiYChuyenThe.service.js');
  ok(res, await snoozeGoiY(callerId(req), P(req, 'pid'), P(req, 'num')));
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

// ─── Figma (19/10/2026): token CHỈ ĐỌC để trợ lý AI đọc link Figma trong thẻ ──
router.get('/projects/:pid/figma', asyncHandler(async (req, res) => {
  ok(res, await linkNgoai.trangThaiFigma(callerId(req), P(req, 'pid')));
}));

router.put('/projects/:pid/figma/token', asyncHandler(async (req, res) => {
  const { token } = parse(z.object({ token: z.string().max(400).nullable() }), req.body ?? {});
  ok(res, await linkNgoai.datTokenFigma(callerId(req), P(req, 'pid'), token));
}));

export default router;
