/**
 * CRM nhẹ của studio (CT Work đợt S5b) — hai router:
 *   - admin     /api/v1/admin/crm[...]       CHỈ ADMIN (requireAdmin ⇒ đi qua MFA step-up nếu bật)
 *   - công khai /api/v1/proposals/:token     khách xem đề xuất + Chấp thuận / Từ chối
 *
 * Nghiệp vụ ở services/crm/{crm.service,rules}.ts.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { z, ZodError } from 'zod';
import { getRedis } from '../config/redis.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler, BadRequestError } from '../middleware/errorHandler.js';
import * as crm from '../services/crm/crm.service.js';
import {
  ACTIVITY_TYPES, CHANNELS, CREATE_STAGES, DEAL_STAGES, PACKAGE_IDS, PROPOSAL_TTL_DAYS_DEFAULT, PROPOSAL_TTL_DAYS_MAX,
  QUALIFICATION_CRITERIA, STAGE_PROBABILITY, STALE_DAYS,
} from '../services/crm/rules.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

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

/** IP thật: mục PHẢI CÙNG của X-Forwarded-For do proxy của ta ghi (cùng luật projectRequest.routes.ts). */
function clientIp(req: Request): string | null {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || null;
}

function idParam(req: Request, name = 'id'): number {
  const id = Number(req.params[name]);
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError(`${name} không hợp lệ`);
  return id;
}

const ok = (res: Response<ApiResponse>, data: unknown, status = 200) => res.status(status).json({ success: true, data });

const optText = (max: number) => z.string().trim().max(max).optional().nullable();
const optId = z.number().int().positive().optional().nullable();
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'YYYY-MM-DD').optional().nullable();

// ─── Admin ──────────────────────────────────────────────────────

export const adminCrmRouter = Router();
adminCrmRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));
// Dữ liệu cá nhân của khách — không để proxy/trình duyệt lưu đệm.
adminCrmRouter.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

adminCrmRouter.get('/meta', asyncHandler(async (_req, res) => {
  ok(res, {
    stages: DEAL_STAGES, createStages: CREATE_STAGES, probability: STAGE_PROBABILITY, staleDays: STALE_DAYS,
    packages: PACKAGE_IDS, activityTypes: ACTIVITY_TYPES, channels: CHANNELS, criteria: QUALIFICATION_CRITERIA,
    proposalTtl: { default: PROPOSAL_TTL_DAYS_DEFAULT, max: PROPOSAL_TTL_DAYS_MAX },
    owners: await crm.owners(),
  });
}));

const dealFilterSchema = z.object({
  q: z.string().trim().max(100).optional(),
  stage: z.enum(DEAL_STAGES).optional(),
  owner: z.coerce.number().int().positive().optional(),
  source: z.string().trim().max(100).optional(),
  package: z.string().trim().max(40).optional(),
  stale: z.enum(['0', '1']).optional(),
  roleplay: z.enum(['only', 'exclude']).optional(),
  org: z.coerce.number().int().positive().optional(),
  contact: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
const toFilter = (f: z.infer<typeof dealFilterSchema>): crm.DealFilter => ({
  q: f.q, stage: f.stage, ownerId: f.owner, source: f.source, packageId: f.package, stale: f.stale === '1',
  roleplay: f.roleplay, orgId: f.org, contactId: f.contact,
});

adminCrmRouter.get('/pipeline', asyncHandler(async (req, res) => {
  ok(res, await crm.pipeline(toFilter(parse(dealFilterSchema, req.query))));
}));

adminCrmRouter.get('/deals', asyncHandler(async (req, res) => {
  const f = parse(dealFilterSchema, req.query);
  ok(res, await crm.listDeals(toFilter(f), f.page, f.limit));
}));

const dealFields = {
  orgId: optId,
  contactId: optId,
  packageId: z.string().max(40).optional().nullable(),
  valueAmount: z.number().nonnegative().max(1e15).optional().nullable(),
  currency: z.string().trim().regex(/^[A-Za-z]{3}$/, 'Mã tiền tệ 3 chữ (VND, USD…)').optional(),
  probability: z.number().int().min(0).max(100).optional().nullable(),
  expectedCloseAt: dateStr,
  ownerId: optId,
  source: optText(100),
  ndaSigned: z.boolean().optional(),
  ndaSignedAt: dateStr,
};

adminCrmRouter.post('/deals', asyncHandler(async (req, res) => {
  const body = parse(z.object({ title: z.string().trim().min(2).max(200), stage: z.enum(DEAL_STAGES).optional(), ...dealFields }), req.body);
  ok(res, await crm.createDeal(req.userId!, body), 201);
}));

adminCrmRouter.post('/backfill', asyncHandler(async (_req, res) => {
  ok(res, await crm.backfillFromRequests());
}));

adminCrmRouter.get('/deals/:id', asyncHandler(async (req, res) => {
  ok(res, await crm.getDeal(idParam(req)));
}));

adminCrmRouter.patch('/deals/:id', asyncHandler(async (req, res) => {
  const body = parse(z.object({ title: z.string().trim().min(2).max(200).optional(), ...dealFields }), req.body);
  ok(res, await crm.updateDeal(req.userId!, idParam(req), body));
}));

adminCrmRouter.delete('/deals/:id', asyncHandler(async (req, res) => {
  await crm.deleteDeal(idParam(req));
  ok(res, { deleted: true });
}));

adminCrmRouter.post('/deals/:id/stage', asyncHandler(async (req, res) => {
  const body = parse(z.object({ stage: z.enum(DEAL_STAGES), lostReason: optText(5000) }), req.body);
  ok(res, await crm.changeStage(req.userId!, idParam(req), body.stage, body.lostReason));
}));

const score = z.union([z.literal(0), z.literal(1), z.literal(2)]).nullable();
adminCrmRouter.put('/deals/:id/qualification', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    scores: z.record(z.string().regex(/^\d{1,2}$/), score),
    notes: z.record(z.string().regex(/^\d{1,2}$/), z.string().max(1000)).optional(),
    risks: optText(5000),
    decision: z.enum(['GO', 'GO_CONDITIONAL', 'NO_GO']).nullable().optional(),
    conditions: optText(2000),
    reason: optText(2000),
  }), req.body);
  ok(res, await crm.saveQualification(req.userId!, idParam(req), body));
}));

const ndaUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 16 * 1024 * 1024, files: 1 } });
adminCrmRouter.post('/deals/:id/nda', ndaUpload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) throw new BadRequestError('Missing file', 'CRM_NO_FILE');
  ok(res, await crm.uploadNda(req.userId!, idParam(req), req.file));
}));
adminCrmRouter.get('/deals/:id/nda/url', asyncHandler(async (req, res) => {
  ok(res, { url: await crm.ndaUrl(idParam(req)) });
}));
adminCrmRouter.delete('/deals/:id/nda', asyncHandler(async (req, res) => {
  ok(res, await crm.deleteNda(req.userId!, idParam(req)));
}));

adminCrmRouter.post('/deals/:id/create-work-project', asyncHandler(async (req, res) => {
  const r = await crm.createWorkProjectFromDeal(req.userId!, idParam(req));
  ok(res, r, r.alreadyExisted ? 200 : 201);
}));

adminCrmRouter.post('/deals/:id/proposals', asyncHandler(async (req, res) => {
  const body = parse(z.object({ fromVersion: z.number().int().positive().optional().nullable() }), req.body ?? {});
  ok(res, await crm.createProposal(req.userId!, idParam(req), body.fromVersion), 201);
}));

// ── Hoạt động ──
adminCrmRouter.get('/activities/due', asyncHandler(async (req, res) => {
  const days = Math.min(90, Math.max(0, Number(req.query.days ?? 7) || 7));
  ok(res, await crm.dueTasks(days));
}));
adminCrmRouter.post('/activities', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    dealId: optId, contactId: optId, type: z.enum(ACTIVITY_TYPES), subject: z.string().trim().min(1).max(200),
    body: optText(20_000), dueAt: z.string().datetime({ offset: true }).optional().nullable(), done: z.boolean().optional(),
  }), req.body);
  ok(res, await crm.createActivity(req.userId!, body), 201);
}));
adminCrmRouter.patch('/activities/:id', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    subject: z.string().trim().min(1).max(200).optional(), body: optText(20_000),
    dueAt: z.string().datetime({ offset: true }).optional().nullable(), done: z.boolean().optional(),
  }), req.body);
  ok(res, await crm.updateActivity(req.userId!, idParam(req), body));
}));
adminCrmRouter.delete('/activities/:id', asyncHandler(async (req, res) => {
  await crm.deleteActivity(idParam(req));
  ok(res, { deleted: true });
}));

// ── Đề xuất ──
adminCrmRouter.patch('/proposals/:id', asyncHandler(async (req, res) => {
  const body = parse(z.object({ title: z.string().trim().min(2).max(200).optional(), content: z.string().max(200_000).optional() }), req.body);
  ok(res, await crm.updateProposal(idParam(req), body));
}));
adminCrmRouter.delete('/proposals/:id', asyncHandler(async (req, res) => {
  await crm.deleteProposal(idParam(req));
  ok(res, { deleted: true });
}));
adminCrmRouter.post('/proposals/:id/send', asyncHandler(async (req, res) => {
  const body = parse(z.object({ expiresInDays: z.number().int().min(1).max(PROPOSAL_TTL_DAYS_MAX).optional() }), req.body ?? {});
  ok(res, await crm.sendProposal(req.userId!, idParam(req), body.expiresInDays));
}));
adminCrmRouter.post('/proposals/:id/revoke', asyncHandler(async (req, res) => {
  ok(res, await crm.revokeProposal(req.userId!, idParam(req)));
}));

// ── Tổ chức ──
const orgFields = {
  industry: optText(120), size: optText(30), website: optText(300),
  taxCode: z.string().trim().regex(/^[0-9-]{0,20}$/, 'MST chỉ gồm số và -').optional().nullable(), note: optText(20_000),
};
const listQ = z.object({
  q: z.string().trim().max(100).optional(),
  org: z.coerce.number().int().positive().optional(),
  anonymized: z.enum(['0', '1']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
adminCrmRouter.get('/orgs', asyncHandler(async (req, res) => {
  const f = parse(listQ, req.query);
  ok(res, await crm.listOrgs(f.q, f.page, f.limit));
}));
adminCrmRouter.post('/orgs', asyncHandler(async (req, res) => {
  ok(res, await crm.createOrg(parse(z.object({ name: z.string().trim().min(1).max(200), ...orgFields }), req.body)), 201);
}));
adminCrmRouter.get('/orgs/:id', asyncHandler(async (req, res) => { ok(res, await crm.getOrg(idParam(req))); }));
adminCrmRouter.patch('/orgs/:id', asyncHandler(async (req, res) => {
  ok(res, await crm.updateOrg(idParam(req), parse(z.object({ name: z.string().trim().min(1).max(200).optional(), ...orgFields }), req.body)));
}));
adminCrmRouter.delete('/orgs/:id', asyncHandler(async (req, res) => {
  await crm.deleteOrg(idParam(req));
  ok(res, { deleted: true });
}));

// ── Người liên hệ + quyền chủ thể dữ liệu ──
const contactFields = {
  orgId: optId, title: optText(120), email: z.string().trim().email().max(254).optional().nullable().or(z.literal('')),
  phone: z.string().trim().max(30).regex(/^[0-9+().\s-]*$/, 'SĐT chỉ gồm số và + ( ) . -').optional().nullable(),
  preferredChannel: z.enum(CHANNELS).optional().nullable(), consent: z.boolean().optional(), consentSource: optText(120), note: optText(20_000),
};
adminCrmRouter.get('/contacts', asyncHandler(async (req, res) => {
  const f = parse(listQ, req.query);
  ok(res, await crm.listContacts(f.q, f.org, f.page, f.limit, f.anonymized === '1'));
}));
adminCrmRouter.post('/contacts', asyncHandler(async (req, res) => {
  ok(res, await crm.createContact(parse(z.object({ name: z.string().trim().min(1).max(120), ...contactFields }), req.body)), 201);
}));
adminCrmRouter.get('/contacts/:id', asyncHandler(async (req, res) => { ok(res, await crm.getContact(idParam(req))); }));
adminCrmRouter.patch('/contacts/:id', asyncHandler(async (req, res) => {
  ok(res, await crm.updateContact(idParam(req), parse(z.object({ name: z.string().trim().min(1).max(120).optional(), ...contactFields }), req.body)));
}));
/** Quyền truy cập dữ liệu: tải về MỌI dữ liệu về một người (JSON). */
adminCrmRouter.get('/contacts/:id/export', asyncHandler(async (req, res) => {
  const id = idParam(req);
  const data = await crm.exportContact(id);
  res.setHeader('Content-Disposition', `attachment; filename="contact-${id}-export.json"`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify({ success: true, data }, null, 2));
}));
/** Quyền xoá: ẩn danh hoá (mặc định) hoặc xoá hẳn — số liệu deal giữ nguyên. */
adminCrmRouter.post('/contacts/:id/erase', asyncHandler(async (req, res) => {
  const body = parse(z.object({ mode: z.enum(['anonymize', 'delete']).default('anonymize'), confirm: z.literal(true) }), req.body);
  ok(res, await crm.eraseContact(req.userId!, idParam(req), body.mode));
}));

// ── Báo cáo ──
adminCrmRouter.get('/reports', asyncHandler(async (req, res) => {
  const f = parse(z.object({ from: z.string().optional(), to: z.string().optional(), roleplay: z.enum(['0', '1']).optional() }), req.query);
  const d = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00+07:00`) : undefined);
  ok(res, await crm.report({ from: d(f.from), to: d(f.to), includeRoleplay: f.roleplay === '1' }));
}));

// ─── Công khai: khách xem đề xuất ───────────────────────────────

/** Bộ đếm Redis theo IP, FAIL-OPEN khi Redis chết (cùng khuôn lookupLimiter của projectRequest.routes.ts). */
function ipLimiter(prefix: string, windowMs: number, max: number): RequestHandler {
  const limiter = rateLimit({
    windowMs, max,
    store: new RedisStore({
      sendCommand: (async (...args: string[]) => (await getRedis()).sendCommand(args)) as never,
      prefix,
    }),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `ip:${clientIp(req) ?? 'unknown'}`,
    message: { success: false, message: 'Quá nhiều yêu cầu — thử lại sau ít phút. / Too many requests — try again shortly.', code: 'RATE_LIMIT_EXCEEDED' },
  });
  return (req, res, next) => limiter(req, res, (err?: unknown) => {
    if (err) logger.warn('[rate-limit] store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
}

export const publicProposalRouter = Router();
publicProposalRouter.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

publicProposalRouter.get('/:token', ipLimiter('rl:proposal-view:', 15 * 60_000, 120), asyncHandler(async (req, res) => {
  ok(res, await crm.publicProposal(String(req.params.token)));
}));

publicProposalRouter.post('/:token/respond', ipLimiter('rl:proposal-respond:', 15 * 60_000, 10), asyncHandler(async (req, res) => {
  const body = parse(z.object({
    decision: z.enum(['ACCEPT', 'DECLINE']),
    name: z.string().trim().min(2, 'Nhập họ tên / Enter your name').max(120),
    note: optText(5000),
    contentHash: z.string().regex(/^[0-9a-f]{64}$/),
  }), req.body);
  ok(res, await crm.respondProposal(String(req.params.token), body, {
    ip: clientIp(req), userAgent: (req.headers['user-agent'] as string | undefined) ?? null,
  }));
}));
