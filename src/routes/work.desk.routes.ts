/**
 * CT Work — đợt S5a (04/10/2026): SERVICE DESK & SLA. Gắn VÀO work.routes.ts (một dòng `router.use`, sau
 * authenticate + chốt cổng khách), nên mọi tuyến /projects/:pid/** ở đây đã qua `clientPortalRouteAllowed`:
 * khách bị cách ly gọi /desk/** hay /issues/:num/desk ⇒ 403 CLIENT_PORTAL_ONLY. Khách chỉ có /portal/desk/**
 * (đã nằm trong danh sách trắng `/portal/**` — KHÔNG thêm mẫu tuyến khách nào).
 *
 * Quyền + mô-đun kiểm trong service (serviceDesk.service.ts deskCtx / portalCtx) — route chỉ kiểm đầu vào bằng zod.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as desk from '../services/work/serviceDesk.service.js';
import { DESK_LEVELS, DESK_PRIORITIES, PROBLEM_STATUSES, REQUEST_TYPE_KEYS } from '../services/work/slaRules.js';

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
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new BadRequestError(`${where}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const level = z.enum(DESK_LEVELS);
const prio = z.enum(DESK_PRIORITIES);
const rtype = z.enum(REQUEST_TYPE_KEYS);
const asClient = (req: Request) => req.query.as === 'client';
const fields = z.record(z.string().max(32), z.string().max(5000)).nullable().optional();

// ═══ Cấu hình ═════════════════════════════════════════════════════════

router.get('/projects/:pid/desk/settings', asyncHandler(async (req, res) => {
  ok(res, await desk.getSettings(callerId(req), P(req, 'pid')));
}));

const goal = z.object({ firstResponseMin: z.number().int().min(1).max(525_600).optional(), resolutionMin: z.number().int().min(1).max(525_600).optional(), calendar: z.enum(['BUSINESS', 'ALWAYS']).optional() });
router.put('/projects/:pid/desk/settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    timezone: z.string().min(1).max(64).optional(),
    workDays: z.array(z.number().int().min(1).max(7)).max(7).optional(),
    workStart: z.number().int().min(0).max(1439).optional(),
    workEnd: z.number().int().min(1).max(1440).optional(),
    holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')).max(400).optional(),
    goals: z.record(prio, goal).optional(),
    matrix: z.record(level, z.record(level, prio)).optional(),
    requestTypes: z.array(z.object({
      key: rtype, enabled: z.boolean().optional(), name: z.string().max(60).optional(), description: z.string().max(200).optional(),
      defaultImpact: level.optional(), defaultUrgency: level.optional(), askImpact: z.boolean().optional(), useChangeRequest: z.boolean().optional(),
      fields: z.array(z.object({ key: z.string().regex(/^[a-z][a-z0-9_]{0,31}$/, 'Field keys: lowercase letters, digits, _'), label: z.string().min(1).max(120), kind: z.enum(['text', 'textarea', 'date']), required: z.boolean() })).max(8).optional(),
    })).max(4).optional(),
    pauseStatusIds: z.array(id).max(50).optional(),
    responseStatusIds: z.array(id).max(50).optional(),
    atRiskPercent: z.number().int().min(10).max(99).optional(),
  }), req.body);
  ok(res, await desk.updateSettings(callerId(req), P(req, 'pid'), body));
}));

// ═══ Hàng đợi + yêu cầu ═══════════════════════════════════════════════

router.get('/projects/:pid/desk/queue', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    view: z.enum(desk.QUEUE_VIEWS).optional(), teamId: id.optional(), requestType: rtype.optional(), priority: prio.optional(),
    q: z.string().max(200).optional(), sort: z.enum(['sla', 'priority', 'created', 'updated']).optional(),
  }), req.query);
  ok(res, await desk.queue(callerId(req), P(req, 'pid'), q));
}));

router.post('/projects/:pid/desk/tickets', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    requestType: rtype, impact: level, urgency: level, priority: prio.nullable().optional(), requesterId: id.nullable().optional(), fields,
    issueNumber: id.nullable().optional(), title: z.string().max(255).nullable().optional(), description: z.string().max(20_000).nullable().optional(),
  }), req.body);
  ok(res, await desk.staffCreate(callerId(req), P(req, 'pid'), body), 201);
}));

router.get('/projects/:pid/issues/:num/desk', asyncHandler(async (req, res) => {
  ok(res, await desk.issueDesk(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/issues/:num/desk', asyncHandler(async (req, res) => {
  const body = parse(z.object({ requestType: rtype.optional(), impact: level.optional(), urgency: level.optional(), priority: prio.nullable().optional() }), req.body);
  ok(res, await desk.updateTicket(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));
router.post('/projects/:pid/issues/:num/desk/waiting', asyncHandler(async (req, res) => {
  const { waiting } = parse(z.object({ waiting: z.boolean() }), req.body);
  ok(res, await desk.setWaiting(callerId(req), P(req, 'pid'), P(req, 'num'), waiting));
}));

// ═══ Problem + postmortem ═════════════════════════════════════════════

const problemBody = {
  title: z.string().max(255).optional(), description: z.string().max(20_000).nullable().optional(), status: z.enum(PROBLEM_STATUSES).optional(),
  rootCause: z.string().max(20_000).nullable().optional(), workaround: z.string().max(20_000).nullable().optional(), ownerId: id.nullable().optional(),
  incidentNumbers: z.array(id).max(200).optional(),
};
router.get('/projects/:pid/desk/problems', asyncHandler(async (req, res) => {
  ok(res, await desk.listProblems(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/desk/problems', asyncHandler(async (req, res) => {
  const body = parse(z.object({ ...problemBody, title: z.string().min(1, 'Title is required').max(255) }), req.body);
  ok(res, await desk.createProblem(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/desk/problems/:num', asyncHandler(async (req, res) => {
  ok(res, await desk.getProblem(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/desk/problems/:num', asyncHandler(async (req, res) => {
  ok(res, await desk.updateProblem(callerId(req), P(req, 'pid'), P(req, 'num'), parse(z.object(problemBody), req.body)));
}));
router.delete('/projects/:pid/desk/problems/:num', asyncHandler(async (req, res) => {
  ok(res, await desk.deleteProblem(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/desk/problems/:num/incidents', asyncHandler(async (req, res) => {
  const { issueNumbers } = parse(z.object({ issueNumbers: z.array(id).min(1).max(200) }), req.body);
  ok(res, await desk.linkIncidents(callerId(req), P(req, 'pid'), P(req, 'num'), issueNumbers));
}));
router.delete('/projects/:pid/desk/problems/:num/incidents/:inum', asyncHandler(async (req, res) => {
  ok(res, await desk.unlinkIncident(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'inum')));
}));
router.post('/projects/:pid/desk/problems/:num/postmortem', asyncHandler(async (req, res) => {
  ok(res, await desk.createPostmortem(callerId(req), P(req, 'pid'), P(req, 'num')), 201);
}));

// ═══ Báo cáo ═════════════════════════════════════════════════════════

router.get('/projects/:pid/desk/report', asyncHandler(async (req, res) => {
  const q = parse(z.object({ months: z.coerce.number().int().min(1).max(24).optional() }), req.query);
  ok(res, await desk.report(callerId(req), P(req, 'pid'), q));
}));
router.get('/projects/:pid/desk/report.xlsx', asyncHandler(async (req, res) => {
  const q = parse(z.object({ months: z.coerce.number().int().min(1).max(24).optional() }), req.query);
  const f = await desk.reportXlsx(callerId(req), P(req, 'pid'), q);
  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="${f.file.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
    'Cache-Control': 'private, no-store',
  });
  res.send(f.buffer);
}));

// ═══ Cổng khách (/portal/** — đã trong danh sách trắng) ═══════════════

router.get('/projects/:pid/portal/desk', asyncHandler(async (req, res) => {
  ok(res, await desk.portalForm(callerId(req), P(req, 'pid'), { asClient: asClient(req) }));
}));
router.post('/projects/:pid/portal/desk/requests', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    requestType: rtype, title: z.string().max(255), description: z.string().max(20_000).nullable().optional(),
    impact: level.nullable().optional(), urgency: level.nullable().optional(), fields,
  }), req.body);
  ok(res, await desk.portalSubmit(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/portal/desk/requests/:num', asyncHandler(async (req, res) => {
  ok(res, await desk.portalTicket(callerId(req), P(req, 'pid'), P(req, 'num'), { asClient: asClient(req) }));
}));
router.post('/projects/:pid/portal/desk/requests/:num/csat', asyncHandler(async (req, res) => {
  const body = parse(z.object({ rating: z.number().int().min(1).max(5), comment: z.string().max(2000).nullable().optional() }), req.body);
  ok(res, await desk.submitCsat(callerId(req), P(req, 'pid'), P(req, 'num'), body));
}));

export default router;
