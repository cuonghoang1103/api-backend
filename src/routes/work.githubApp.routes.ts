/**
 * CT Work 27/10/2026 — GitHub App "CT Work by CuongThai" (githubApp.service.ts, docs/ctw-github-app.md).
 *
 * CÔNG KHAI (mount TRƯỚC authenticate trong work.routes.ts — GitHub / trình duyệt gọi, xác thực bằng chữ ký / state HMAC):
 *   POST /github/webhook/app                    webhook chung của app (thân raw — index.ts gắn express.raw cho /github/webhook)
 *   GET  /github-app/manifest/callback?code&state  GitHub chuyển về sau "Create GitHub App" ⇒ lưu khoá (mã hoá) ⇒ về trang admin
 *   GET  /github-app/setup?code&installation_id&state  sau khi cài app ⇒ xác minh người cài ⇒ về trang chọn repo
 * SAU ĐĂNG NHẬP:
 *   GET  /github-app/status | POST /github-app/manifest   (site ADMIN) trạng thái app / dữ liệu form manifest
 *   GET  /projects/:pid/github-app                       trạng thái của dự án + link cài (ADMIN dự án)
 *   GET  /projects/:pid/github-app/repos?ticket          repo của bản cài vừa cài (vé ký 30 phút)
 *   POST /projects/:pid/github-app/link {ticket, repoId} · DELETE /projects/:pid/github-app
 * Agent: tuyến dự án `/github-app` nằm trong AGENT_DENIED_ROUTES; tuyến cấp trên ngoài danh sách trắng của agent.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { frontendUrl } from '../services/work/common.js';
import * as app from '../services/work/githubApp.service.js';

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) throw new BadRequestError(err.issues[0]?.message ?? 'Invalid input', 'VALIDATION_ERROR');
    throw err;
  }
}
function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const pid = (req: Request) => parse(z.coerce.number().int().positive(), req.params.pid);
const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, 2000) : undefined);

// ─── Công khai ────────────────────────────────────────────────────

export const githubAppPublicRoutes = Router();

githubAppPublicRoutes.post('/github/webhook/app', asyncHandler(async (req, res) => {
  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body ?? {}));
  const event = typeof req.headers['x-github-event'] === 'string' ? req.headers['x-github-event'] : undefined;
  const sig = typeof req.headers['x-hub-signature-256'] === 'string' ? req.headers['x-hub-signature-256'] : undefined;
  ok(res, await app.handleAppWebhook(event, sig, raw));
}));

githubAppPublicRoutes.get('/github-app/manifest/callback', asyncHandler(async (req, res) => {
  try {
    const r = await app.manifestCallback(String(req.query.code ?? ''), String(req.query.state ?? ''));
    res.redirect(302, frontendUrl(`/admin/ctwork-github?created=${encodeURIComponent(r.slug)}`));
  } catch (err) {
    logger.warn('[work] GitHub App manifest callback lỗi', { err: (err as Error).message });
    res.redirect(302, frontendUrl(`/admin/ctwork-github?error=${encodeURIComponent((err as Error).message.slice(0, 160))}`));
  }
}));

githubAppPublicRoutes.get('/github-app/setup', asyncHandler(async (req, res) => {
  const to = await app.setupCallback({ code: str(req.query.code), installation_id: str(req.query.installation_id), setup_action: str(req.query.setup_action), state: str(req.query.state) })
    .catch((err) => { logger.warn('[work] GitHub App setup lỗi', { err: (err as Error).message }); return frontendUrl('/work/github-app/done?error=setup'); });
  res.redirect(302, to);
}));

// ─── Sau đăng nhập ───────────────────────────────────────────────

const router = Router();

router.get('/github-app/status', requireAdmin(), asyncHandler(async (_req, res) => {
  ok(res, await app.appStatus());
}));
router.post('/github-app/manifest', requireAdmin(), asyncHandler(async (req, res) => {
  const { org } = parse(z.object({ org: z.string().max(39).nullable().optional() }), req.body ?? {});
  ok(res, app.manifestForm(callerId(req), org ?? null));
}));

router.get('/projects/:pid/github-app', asyncHandler(async (req, res) => {
  ok(res, await app.projectAppInfo(callerId(req), pid(req)));
}));
router.get('/projects/:pid/github-app/repos', asyncHandler(async (req, res) => {
  const { ticket } = parse(z.object({ ticket: z.string().min(10).max(2000) }), req.query);
  ok(res, await app.installationRepos(callerId(req), pid(req), ticket));
}));
router.post('/projects/:pid/github-app/link', asyncHandler(async (req, res) => {
  const b = parse(z.object({ ticket: z.string().min(10).max(2000), repoId: z.number().int().positive() }), req.body ?? {});
  ok(res, await app.linkRepo(callerId(req), pid(req), b.ticket, b.repoId));
}));
router.delete('/projects/:pid/github-app', asyncHandler(async (req, res) => {
  ok(res, await app.unlinkApp(callerId(req), pid(req)));
}));

export default router;
