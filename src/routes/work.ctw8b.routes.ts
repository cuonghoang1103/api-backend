/**
 * CT Work — CTW đợt 8b (12/10/2026): Notion · Slack · Trình soạn báo cáo (Reports → Builder) · Lịch tự gửi. Gắn vào
 * work.routes.ts: `ctw8bPublicRoutes` TRƯỚC authenticate (webhook Slack — chỉ tin chữ ký v0, thân RAW vì index.ts gắn
 * express.raw cho /api/v1/work/intake/**); `router` SAU authenticate + chốt cổng khách + chốt agent.
 *
 *   Builder   GET  /projects/:pid/report-builder/templates · GET …/templates/:ref (builtin:weekly | id)
 *             POST …/templates · PATCH|DELETE …/templates/:id · POST …/preview · POST …/export (pdf|docx) · POST …/ai
 *   Lịch gửi  GET|POST /projects/:pid/report-plans · PATCH|DELETE …/:id · POST …/:id/send · POST …/:id/recipients/decide
 *             GET …/report-plans/deliveries · GET …/deliveries/:id/file
 *   Notion    GET /notion/status · POST /notion/search
 *             POST /projects/:pid/notion/import-page · POST …/notion/export-page · POST …/notion/import-database (dryRun mặc định)
 *   Slack     GET|DELETE /workspaces/:wsid/slack · POST /workspaces/:wsid/slack/link
 *             GET /projects/:pid/slack · GET …/slack/available · POST …/slack/channels · PATCH|DELETE …/slack/channels/:id · POST …/:id/test
 *             POST /intake/slack/commands · POST /intake/slack/events   (công khai, chữ ký)
 *   OAuth (start/callback/ngắt kết nối) là tuyến CHUNG của 8a: /integrations/notion|slack/… (work.ctw8a.routes.ts).
 *
 * Agent: mọi tuyến dự án ở đây nằm trong AGENT_DENIED_ROUTES; tuyến ngoài /projects/:pid bị chặn sẵn (agentTopRouteAllowed
 * fail-closed). Quyền chi tiết kiểm TRONG service.
 */

import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, ForbiddenError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as builder from '../services/work/reportBuilder.service.js';
import * as plans from '../services/work/reportSchedule.service.js';
import * as notion from '../services/work/notion.service.js';
import * as slack from '../services/work/slack.service.js';
import { clientIp } from './work.uxd.routes.js';

const router = Router();
export const ctw8bPublicRoutes = Router();

slack.registerSlackNotifications();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const noAgent = (req: Request) => { if (req.agent) throw new ForbiddenError('AI agents cannot use this'); };
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
const sendFile = (res: Response, out: { buffer: Buffer; file: string; mime: string }) => {
  res.setHeader('Content-Type', out.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
};

// ═══ Trình soạn báo cáo ══════════════════════════════════════════

const tplBody = z.object({ name: z.string().trim().min(1).max(120), description: z.string().max(500).nullable().optional(), layout: z.unknown() });
const source = z.object({ layout: z.unknown().optional(), ref: z.string().regex(/^(builtin:\w+|\d+)$/).optional() });

router.get('/projects/:pid/report-builder/templates', asyncHandler(async (req, res) => ok(res, await builder.listTemplates(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/report-builder/templates/:ref', asyncHandler(async (req, res) => ok(res, await builder.getTemplate(callerId(req), P(req, 'pid'), parse(z.string().regex(/^(builtin:\w+|\d+)$/), req.params.ref)))));
router.post('/projects/:pid/report-builder/templates', asyncHandler(async (req, res) => ok(res, await builder.createTemplate(callerId(req), P(req, 'pid'), parse(tplBody, req.body) as { name: string; description?: string | null; layout: unknown }), 201)));
router.patch('/projects/:pid/report-builder/templates/:id', asyncHandler(async (req, res) => ok(res, await builder.updateTemplate(callerId(req), P(req, 'pid'), P(req, 'id'), parse(tplBody.partial(), req.body ?? {})))));
router.delete('/projects/:pid/report-builder/templates/:id', asyncHandler(async (req, res) => ok(res, await builder.deleteTemplate(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/report-builder/preview', asyncHandler(async (req, res) => ok(res, await builder.preview(callerId(req), P(req, 'pid'), parse(source, req.body ?? {})))));
router.post('/projects/:pid/report-builder/export', asyncHandler(async (req, res) => {
  noAgent(req);
  const b = parse(source.extend({ format: z.enum(['pdf', 'docx']) }), req.body);
  sendFile(res, await builder.exportReport(callerId(req), P(req, 'pid'), b));
}));
router.post('/projects/:pid/report-builder/ai', asyncHandler(async (req, res) => {
  noAgent(req);
  ok(res, await builder.aiCommentary(callerId(req), P(req, 'pid'), parse(z.object({ audience: z.enum(['team', 'teacher', 'client']).default('team'), language: z.enum(['en', 'vi']).optional() }), req.body ?? {})));
}));

// ═══ Lịch tự gửi ═════════════════════════════════════════════════

router.get('/projects/:pid/report-plans', asyncHandler(async (req, res) => ok(res, await plans.listPlans(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/report-plans/deliveries', asyncHandler(async (req, res) => ok(res, await plans.listDeliveries(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/report-plans/deliveries/:id/file', asyncHandler(async (req, res) => sendFile(res, await plans.deliveryFile(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/report-plans', asyncHandler(async (req, res) => { noAgent(req); ok(res, await plans.createPlan(callerId(req), P(req, 'pid'), parse(plans.planInput, req.body)), 201); }));
router.patch('/projects/:pid/report-plans/:id', asyncHandler(async (req, res) => { noAgent(req); ok(res, await plans.updatePlan(callerId(req), P(req, 'pid'), P(req, 'id'), parse(plans.planInput.partial(), req.body ?? {}))); }));
router.delete('/projects/:pid/report-plans/:id', asyncHandler(async (req, res) => { noAgent(req); ok(res, await plans.deletePlan(callerId(req), P(req, 'pid'), P(req, 'id'))); }));
router.post('/projects/:pid/report-plans/:id/send', asyncHandler(async (req, res) => { noAgent(req); ok(res, await plans.sendNow(callerId(req), P(req, 'pid'), P(req, 'id'))); }));
router.post('/projects/:pid/report-plans/:id/recipients/decide', asyncHandler(async (req, res) => {
  noAgent(req);
  ok(res, await plans.decideRecipient(callerId(req), P(req, 'pid'), P(req, 'id'), parse(z.object({ email: z.string().max(254), approve: z.boolean() }), req.body)));
}));

// ═══ Notion ══════════════════════════════════════════════════════

router.get('/notion/status', asyncHandler(async (req, res) => { noAgent(req); ok(res, await notion.status(callerId(req))); }));
router.post('/notion/search', asyncHandler(async (req, res) => {
  noAgent(req);
  ok(res, await notion.search(callerId(req), parse(z.object({ query: z.string().max(200).optional(), kind: z.enum(['page', 'database']).default('page') }), req.body ?? {})));
}));
router.post('/projects/:pid/notion/import-page', asyncHandler(async (req, res) => {
  noAgent(req);
  ok(res, await notion.importPage(callerId(req), P(req, 'pid'), parse(z.object({ pageId: z.string().min(8).max(300), includeChildren: z.boolean().default(false), parentNumber: z.number().int().positive().nullable().optional() }), req.body)), 201);
}));
router.post('/projects/:pid/notion/export-page', asyncHandler(async (req, res) => {
  noAgent(req);
  const b = parse(z.object({ pageNumber: z.number().int().positive(), parentPageId: z.string().min(8).max(300) }), req.body);
  ok(res, await notion.exportPage(callerId(req), P(req, 'pid'), b.pageNumber, { parentPageId: b.parentPageId }), 201);
}));
router.post('/projects/:pid/notion/import-database', asyncHandler(async (req, res) => {
  noAgent(req);
  const b = parse(z.object({
    databaseId: z.string().min(8).max(300),
    mapping: z.record(z.string().max(40), z.number().int().min(0).max(200).nullable()).optional(),
    people: z.record(z.string().max(260), z.number().int().positive().nullable()).optional(),
    statuses: z.record(z.string().max(120), z.number().int().positive()).optional(),
    dryRun: z.boolean().default(true),
  }), req.body);
  const out = await notion.importDatabase(callerId(req), P(req, 'pid'), b);
  ok(res, out, b.dryRun ? 200 : 201);
}));

// ═══ Slack ═══════════════════════════════════════════════════════

router.get('/workspaces/:wsid/slack', asyncHandler(async (req, res) => { noAgent(req); ok(res, await slack.workspaceStatus(callerId(req), P(req, 'wsid'))); }));
router.post('/workspaces/:wsid/slack/link', asyncHandler(async (req, res) => { noAgent(req); ok(res, await slack.linkInstall(callerId(req), P(req, 'wsid'))); }));
router.delete('/workspaces/:wsid/slack', asyncHandler(async (req, res) => { noAgent(req); ok(res, await slack.unlinkInstall(callerId(req), P(req, 'wsid'))); }));
router.get('/projects/:pid/slack', asyncHandler(async (req, res) => ok(res, await slack.projectSlack(callerId(req), P(req, 'pid')))));
router.get('/projects/:pid/slack/available', asyncHandler(async (req, res) => ok(res, await slack.availableChannels(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/slack/channels', asyncHandler(async (req, res) => ok(res, await slack.addChannel(callerId(req), P(req, 'pid'), parse(slack.channelInput, req.body)), 201)));
router.patch('/projects/:pid/slack/channels/:id', asyncHandler(async (req, res) => ok(res, await slack.updateChannel(callerId(req), P(req, 'pid'), P(req, 'id'), parse(slack.channelInput.pick({ events: true, intake: true, enabled: true }).partial(), req.body ?? {})))));
router.delete('/projects/:pid/slack/channels/:id', asyncHandler(async (req, res) => ok(res, await slack.removeChannel(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/slack/channels/:id/test', asyncHandler(async (req, res) => ok(res, await slack.testChannel(callerId(req), P(req, 'pid'), P(req, 'id')))));

// ═══ Webhook Slack (công khai — TRƯỚC authenticate) ══════════════

const hookLimit = rateLimit({
  windowMs: 60_000, max: () => Number(process.env.WORK_INTAKE_RPM || 120), standardHeaders: true, legacyHeaders: false, keyGenerator: clientIp, validate: false,
  message: { success: false, message: 'Too many requests. Please try again in a minute.', code: 'RATE_LIMIT_EXCEEDED' },
});
const rawBody = (req: Request): Buffer => (Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === 'string' ? req.body : ''));
const h = (req: Request, name: string) => (typeof req.headers[name] === 'string' ? (req.headers[name] as string) : undefined);
const slackHeaders = (req: Request) => ({ signature: h(req, 'x-slack-signature'), timestamp: h(req, 'x-slack-request-timestamp'), retryNum: h(req, 'x-slack-retry-num') });

// Slack đọc THẲNG thân trả về (không bọc { success, data }).
ctw8bPublicRoutes.post('/intake/slack/commands', hookLimit, asyncHandler(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(await slack.handleCommand(slackHeaders(req), rawBody(req)));
}));
ctw8bPublicRoutes.post('/intake/slack/events', hookLimit, asyncHandler(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(await slack.handleEvents(slackHeaders(req), rawBody(req)));
}));

export default router;
