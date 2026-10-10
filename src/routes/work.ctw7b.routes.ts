/**
 * CT Work — CTW đợt 7b (11/10/2026): Forms (C8) · Nhập Trello/Asana/Jira/CSV–Excel (C15) · Kênh ngoài → đề xuất thẻ
 * (C14 / CTW-26) · Knowledge base (C21). Gắn vào work.routes.ts:
 *   `ctw7bPublicRoutes` TRƯỚC authenticate — form công khai + webhook kênh ngoài (chỉ tin token + chữ ký, có trần IP);
 *   `router` SAU authenticate + chốt cổng khách — khách bị cách ly chỉ tới được /projects/:pid/portal/kb/** (danh sách trắng
 *   `/portal/**`), mọi tuyến khác của đợt này trả 403 CLIENT_PORTAL_ONLY trước khi vào service.
 *
 *   Forms     GET|POST /projects/:pid/forms · GET|PATCH|DELETE /projects/:pid/forms/:form · POST …/:form/(status|rotate)
 *             GET …/:form/responses · GET …/:form/responses.xlsx
 *             GET /forms/:token · POST /forms/:token/responses           (đã đăng nhập — form nội bộ / người trong dự án)
 *             GET /public/forms/:token · POST /public/forms/:token/responses   (công khai)
 *   Import    POST /projects/:pid/imports (dryRun mặc định true) · GET /projects/:pid/imports
 *   Intake    GET|POST /projects/:pid/intake/channels · PATCH|DELETE …/:id · POST …/:id/(rotate|simulate)
 *             GET /projects/:pid/intake/proposals · POST …/proposals/:id/decide
 *             POST /intake/email/:token · POST /intake/discord/:token · POST /intake/zalo/:token   (webhook, thân RAW)
 *   KB        GET /projects/:pid/kb · POST|PATCH|DELETE /projects/:pid/kb/categories(/:id) · POST|PATCH|DELETE /projects/:pid/kb/articles(/:id)
 *             GET /projects/:pid/portal/kb · GET …/portal/kb/suggest?q= · GET …/portal/kb/:id · POST …/portal/kb/:id/(vote|deflected)
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as forms from '../services/work/forms.service.js';
import * as importer from '../services/work/importer.service.js';
import * as intake from '../services/work/intake.service.js';
import * as kb from '../services/work/kb.service.js';
import { clientIp } from './work.uxd.routes.js';

const router = Router();
export const ctw7bPublicRoutes = Router();

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
const formRef = (req: Request) => parse(z.string().regex(/^(?:F-?)?\d{1,6}$/i, 'Use a number or "F-3"'), req.params.form);
const asClient = (req: Request) => req.query.as === 'client';
const token = (req: Request) => parse(z.string().regex(/^[A-Za-z0-9_-]{16,48}$/, 'Bad link'), req.params.token);
const noStore = (res: Response) => { res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex'); };
const xlsx = (res: Response, out: { buffer: Buffer; file: string }) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
};

// ═══ Forms ═══════════════════════════════════════════════════════

router.get('/projects/:pid/forms', asyncHandler(async (req, res) => ok(res, await forms.listForms(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/forms', asyncHandler(async (req, res) => ok(res, await forms.createForm(callerId(req), P(req, 'pid'), parse(forms.formInput, req.body)), 201)));
router.get('/projects/:pid/forms/:form/responses.xlsx', asyncHandler(async (req, res) => xlsx(res, await forms.exportResponses(callerId(req), P(req, 'pid'), formRef(req)))));
router.get('/projects/:pid/forms/:form/responses', asyncHandler(async (req, res) => {
  const q = parse(z.object({ limit: z.coerce.number().int().min(1).max(1000).optional() }), req.query);
  ok(res, await forms.formResponses(callerId(req), P(req, 'pid'), formRef(req), q));
}));
router.get('/projects/:pid/forms/:form', asyncHandler(async (req, res) => ok(res, await forms.getForm(callerId(req), P(req, 'pid'), formRef(req)))));
router.patch('/projects/:pid/forms/:form', asyncHandler(async (req, res) => ok(res, await forms.updateForm(callerId(req), P(req, 'pid'), formRef(req), parse(forms.formInput.partial().extend({ rev: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/forms/:form', asyncHandler(async (req, res) => ok(res, await forms.deleteForm(callerId(req), P(req, 'pid'), formRef(req)))));
router.post('/projects/:pid/forms/:form/status', asyncHandler(async (req, res) => ok(res, await forms.setFormStatus(callerId(req), P(req, 'pid'), formRef(req), parse(z.object({ status: z.enum(['OPEN', 'CLOSED', 'DRAFT']) }), req.body).status))));
router.post('/projects/:pid/forms/:form/rotate', asyncHandler(async (req, res) => ok(res, await forms.rotateFormLink(callerId(req), P(req, 'pid'), formRef(req)))));

router.get('/forms/:token', asyncHandler(async (req, res) => { noStore(res); ok(res, await forms.internalForm(callerId(req), token(req))); }));
router.post('/forms/:token/responses', asyncHandler(async (req, res) => { noStore(res); ok(res, await forms.submitInternalForm(callerId(req), token(req), (req.body ?? {}) as forms.SubmitBody, clientIp(req)), 201); }));

// ═══ Import ══════════════════════════════════════════════════════

router.get('/projects/:pid/imports', asyncHandler(async (req, res) => ok(res, await importer.listRuns(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/imports', asyncHandler(async (req, res) => {
  const input = parse(importer.importInput, req.body);
  const out = await importer.runImport(callerId(req), P(req, 'pid'), input);
  ok(res, out, input.dryRun ? 200 : 201);
}));

// ═══ Kênh ngoài → đề xuất ════════════════════════════════════════

router.get('/projects/:pid/intake/channels', asyncHandler(async (req, res) => ok(res, await intake.listChannels(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/intake/channels', asyncHandler(async (req, res) => ok(res, await intake.createChannel(callerId(req), P(req, 'pid'), parse(intake.channelInput, req.body)), 201)));
router.patch('/projects/:pid/intake/channels/:id', asyncHandler(async (req, res) => ok(res, await intake.updateChannel(callerId(req), P(req, 'pid'), P(req, 'id'), parse(intake.channelInput.omit({ kind: true }).partial(), req.body ?? {})))));
router.delete('/projects/:pid/intake/channels/:id', asyncHandler(async (req, res) => ok(res, await intake.deleteChannel(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/intake/channels/:id/rotate', asyncHandler(async (req, res) => ok(res, await intake.rotateChannel(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/intake/channels/:id/simulate', asyncHandler(async (req, res) => {
  const b = parse(z.object({ title: z.string().trim().min(1).max(255), body: z.string().max(20_000).nullable().optional(), senderName: z.string().max(160).nullable().optional(), senderHandle: z.string().max(200).nullable().optional() }), req.body);
  ok(res, await intake.simulate(callerId(req), P(req, 'pid'), P(req, 'id'), b), 201);
}));
router.get('/projects/:pid/intake/proposals', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional() }), req.query);
  ok(res, await intake.listProposals(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/intake/proposals/:id/decide', asyncHandler(async (req, res) => ok(res, await intake.decideProposal(callerId(req), P(req, 'pid'), P(req, 'id'), parse(intake.decideInput, req.body)))));

// ═══ Knowledge base ══════════════════════════════════════════════

router.get('/projects/:pid/kb', asyncHandler(async (req, res) => ok(res, await kb.overview(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/kb/categories', asyncHandler(async (req, res) => ok(res, await kb.createCategory(callerId(req), P(req, 'pid'), parse(kb.categoryInput, req.body)), 201)));
router.patch('/projects/:pid/kb/categories/:id', asyncHandler(async (req, res) => ok(res, await kb.updateCategory(callerId(req), P(req, 'pid'), P(req, 'id'), parse(kb.categoryInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/kb/categories/:id', asyncHandler(async (req, res) => ok(res, await kb.deleteCategory(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/kb/articles', asyncHandler(async (req, res) => ok(res, await kb.addArticle(callerId(req), P(req, 'pid'), parse(kb.articleInput, req.body)), 201)));
router.patch('/projects/:pid/kb/articles/:id', asyncHandler(async (req, res) => ok(res, await kb.updateArticle(callerId(req), P(req, 'pid'), P(req, 'id'), parse(kb.articleInput.omit({ pageNumber: true }).partial(), req.body ?? {})))));
router.delete('/projects/:pid/kb/articles/:id', asyncHandler(async (req, res) => ok(res, await kb.removeArticle(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.get('/projects/:pid/portal/kb', asyncHandler(async (req, res) => {
  const q = parse(z.object({ q: z.string().max(300).optional(), category: z.coerce.number().int().positive().optional() }), req.query);
  ok(res, await kb.browse(callerId(req), P(req, 'pid'), { ...q, asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/kb/suggest', asyncHandler(async (req, res) => {
  const q = parse(z.object({ q: z.string().max(2000).default('') }), req.query);
  ok(res, await kb.suggest(callerId(req), P(req, 'pid'), q.q, { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/kb/:id', asyncHandler(async (req, res) => ok(res, await kb.readArticle(callerId(req), P(req, 'pid'), P(req, 'id'), { asClient: asClient(req) }))));
router.post('/projects/:pid/portal/kb/:id/vote', asyncHandler(async (req, res) => ok(res, await kb.vote(callerId(req), P(req, 'pid'), P(req, 'id'), parse(z.object({ helpful: z.boolean() }), req.body).helpful, { asClient: asClient(req) }))));
router.post('/projects/:pid/portal/kb/:id/deflected', asyncHandler(async (req, res) => ok(res, await kb.markDeflected(callerId(req), P(req, 'pid'), P(req, 'id'), { asClient: asClient(req) }))));

// ═══ Công khai (TRƯỚC authenticate) ══════════════════════════════

const limiter = (envName: string, def: number) => rateLimit({
  windowMs: 60_000, max: () => Number(process.env[envName] || def), standardHeaders: true, legacyHeaders: false, keyGenerator: clientIp, validate: false,
  message: { success: false, message: 'Too many requests. Please try again in a minute.', code: 'RATE_LIMIT_EXCEEDED' },
});
const readLimit = limiter('WORK_PUBLIC_FORM_RPM', 60);
const writeLimit = limiter('WORK_PUBLIC_SUBMIT_RPM', 10);
const hookLimit = limiter('WORK_INTAKE_RPM', 120);

ctw7bPublicRoutes.get('/public/forms/:token', readLimit, asyncHandler(async (req, res) => { noStore(res); ok(res, await forms.publicForm(token(req))); }));
ctw7bPublicRoutes.post('/public/forms/:token/responses', writeLimit, asyncHandler(async (req, res) => {
  noStore(res);
  ok(res, await forms.submitPublicForm(token(req), (req.body ?? {}) as forms.SubmitBody, clientIp(req)), 201);
}));

/** Thân RAW (index.ts gắn express.raw cho /api/v1/work/intake) — chữ ký tính trên đúng từng byte đã gửi. */
const rawBody = (req: Request): Buffer => (Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})));
const h = (req: Request, name: string) => (typeof req.headers[name] === 'string' ? (req.headers[name] as string) : undefined);

ctw7bPublicRoutes.post('/intake/email/:token', hookLimit, asyncHandler(async (req, res) => {
  noStore(res);
  ok(res, await intake.handleEmail(token(req), { id: h(req, 'svix-id') ?? h(req, 'webhook-id'), timestamp: h(req, 'svix-timestamp') ?? h(req, 'webhook-timestamp'), signature: h(req, 'svix-signature') ?? h(req, 'webhook-signature') }, rawBody(req)));
}));
// Discord đọc THẲNG thân trả về (không bọc { success, data }).
ctw7bPublicRoutes.post('/intake/discord/:token', hookLimit, asyncHandler(async (req, res) => {
  noStore(res);
  res.json(await intake.handleDiscord(token(req), { signature: h(req, 'x-signature-ed25519'), timestamp: h(req, 'x-signature-timestamp') }, rawBody(req)));
}));
ctw7bPublicRoutes.post('/intake/zalo/:token', hookLimit, asyncHandler(async (req, res) => {
  noStore(res);
  ok(res, await intake.handleZalo(token(req), h(req, 'x-zevent-signature'), rawBody(req)));
}));

export default router;
