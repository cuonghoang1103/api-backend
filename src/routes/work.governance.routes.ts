/**
 * CT Work — đợt S3b (04/10/2026): YÊU CẦU THAY ĐỔI · SỔ RAID · CUỘC HỌP. Gắn VÀO
 * work.routes.ts (một dòng `router.use`, sau authenticate + chốt cổng khách), nên mọi
 * tuyến /projects/:pid/** ở đây đã qua `clientPortalRouteAllowed`: khách bị cách ly gọi
 * /changes, /raid, /meetings ⇒ 403 CLIENT_PORTAL_ONLY. Khách chỉ có /portal/meetings/**
 * (đã nằm trong danh sách trắng `/portal/**` từ S2b — không thêm mẫu tuyến khách nào).
 *
 * Quyền + mô-đun kiểm trong service (governanceDb.govCtx ⇒ 403 MODULE_DISABLED /
 * WORK_INTERNAL_ONLY) — route chỉ kiểm đầu vào bằng zod.
 */

import type { Prisma } from '@prisma/client';
import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import {
  APPROVAL_MODES, CR_LINK_ROLES, CR_STATUSES, CR_URGENCY, MEETING_STATUSES, MEETING_TYPES, RAID_RESPONSES, RAID_TYPES,
} from '../services/work/constants.js';
import * as approvals from '../services/work/approvals.service.js';
import * as crs from '../services/work/changeRequests.service.js';
import * as meetings from '../services/work/meetings.service.js';
import * as raid from '../services/work/raid.service.js';
import { resolveParentId } from '../services/work/issueRefs.js';

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').transform((s) => new Date(`${s}T00:00:00.000Z`));
const text = (max: number) => z.string().max(max).nullable().optional();
const tiptap = (max: number) => z
  .object({ type: z.literal('doc') })
  .passthrough()
  .refine((v) => JSON.stringify(v).length <= max, 'Content is too large')
  .transform((v) => v as Prisma.InputJsonValue);
const asClient = (req: Request) => req.query.as === 'client';

function sendIcs(res: Response, f: { body: string; filename: string }) {
  res.set({
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': `attachment; filename="${f.filename.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
    'Cache-Control': 'private, no-store',
  });
  res.send(f.body);
}

// ═══ Yêu cầu thay đổi (mô-đun changeRequests) ═══════════════════════

const crFields = {
  descriptionJson: tiptap(500_000).nullable().optional(),
  reason: text(10_000),
  urgency: z.enum(CR_URGENCY).optional(),
  impactScope: text(10_000),
  scheduleDays: z.number().int().min(-3650).max(3650).nullable().optional(),
  costAmount: z.number().finite().min(-1e12).max(1e12).nullable().optional(),
  costCurrency: text(16),
  impactRisk: text(10_000),
  alternatives: text(10_000),
  ownerId: id.nullable().optional(),
  requesterId: id.nullable().optional(),
};

router.get('/projects/:pid/changes', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(CR_STATUSES).optional() }), req.query);
  ok(res, await crs.listChangeRequests(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/changes', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().min(1, 'Title is required').max(255),
    ...crFields,
    sourceIssueNumber: id.nullable().optional(),
    useTemplate: z.boolean().optional(),
  }), req.body);
  ok(res, await crs.createChangeRequest(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/changes/:num', asyncHandler(async (req, res) => {
  ok(res, await crs.getChangeRequest(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/changes/:num', asyncHandler(async (req, res) => {
  const { version, ...body } = parse(z.object({ title: z.string().max(255).optional(), ...crFields, version: z.number().int().min(0).optional() }), req.body);
  ok(res, await crs.updateChangeRequest(callerId(req), P(req, 'pid'), P(req, 'num'), body, version));
}));
router.delete('/projects/:pid/changes/:num', asyncHandler(async (req, res) => {
  ok(res, await crs.deleteChangeRequest(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/changes/:num/status', asyncHandler(async (req, res) => {
  const { status } = parse(z.object({ status: z.enum(CR_STATUSES) }), req.body);
  ok(res, await crs.setChangeRequestStatus(callerId(req), P(req, 'pid'), P(req, 'num'), status));
}));
router.put('/projects/:pid/changes/:num/client-visible', asyncHandler(async (req, res) => {
  const { visible } = parse(z.object({ visible: z.boolean() }), req.body);
  ok(res, await crs.setChangeRequestClientVisible(callerId(req), P(req, 'pid'), P(req, 'num'), visible));
}));
router.post('/projects/:pid/changes/:num/approval', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().min(1).max(200).optional(),
    description: text(5000),
    mode: z.enum(APPROVAL_MODES).optional(),
    approverIds: z.array(id).min(1).max(10),
    dueAt: z.coerce.date().nullable().optional(),
  }), req.body);
  ok(res, await approvals.createCrApproval(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.post('/projects/:pid/changes/:num/links', asyncHandler(async (req, res) => {
  const body = parse(z.object({ role: z.enum(CR_LINK_ROLES).optional(), issueNumber: id.optional(), stageId: id.optional(), versionId: id.optional() }), req.body);
  ok(res, await crs.addChangeRequestLink(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/changes/:num/links/:linkId', asyncHandler(async (req, res) => {
  ok(res, await crs.removeChangeRequestLink(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'linkId')));
}));
router.post('/projects/:pid/changes/:num/implement', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({
    items: z.array(z.object({
      title: z.string().min(1).max(255),
      description: text(10_000),
      typeKey: z.string().max(20).optional(),
      assigneeId: id.nullable().optional(),
      dueDate: day.nullable().optional(),
    })).min(1).max(20),
  }), req.body);
  ok(res, await crs.createImplementationIssues(callerId(req), P(req, 'pid'), P(req, 'num'), items), 201);
}));
// Khu "Change requests" + "Risks" trong chi tiết thẻ (mô-đun tắt ⇒ null, không lỗi).
router.get('/projects/:pid/issues/:num/governance', asyncHandler(async (req, res) => {
  ok(res, await crs.issueGovernance(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

// ═══ Sổ RAID (mô-đun raid) ════════════════════════════════════════════

const scale = z.number().int().min(1).max(5).nullable().optional();
const raidFields = {
  description: text(20_000),
  category: text(60),
  ownerId: id.nullable().optional(),
  status: z.string().max(16).optional(),
  probability: scale,
  impact: scale,
  response: z.enum(RAID_RESPONSES).nullable().optional(),
  mitigation: text(20_000),
  trigger: text(5000),
  reviewDate: day.nullable().optional(),
  // Đợt S4: rủi ro được nêu trong báo cáo tuần cho khách (raid.service chỉ nhận với loại RISK).
  clientVisible: z.boolean().optional(),
};

router.get('/projects/:pid/raid', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    type: z.enum(RAID_TYPES).optional(), status: z.string().max(16).optional(),
    p: z.coerce.number().int().min(1).max(5).optional(), i: z.coerce.number().int().min(1).max(5).optional(),
  }), req.query);
  ok(res, await raid.listRaid(callerId(req), P(req, 'pid'), { type: q.type, status: q.status, probability: q.p, impact: q.i }));
}));
router.get('/projects/:pid/raid/top', asyncHandler(async (req, res) => {
  const q = parse(z.object({ limit: z.coerce.number().int().min(1).max(20).optional() }), req.query);
  ok(res, await raid.topRisks(callerId(req), P(req, 'pid'), q.limit));
}));
router.post('/projects/:pid/raid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ type: z.enum(RAID_TYPES), title: z.string().min(1, 'Title is required').max(255), ...raidFields }), req.body);
  ok(res, await raid.createRaid(callerId(req), P(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/raid/starter', asyncHandler(async (req, res) => {
  ok(res, await raid.importStarterRisks(callerId(req), P(req, 'pid')), 201);
}));
router.get('/projects/:pid/raid/:num', asyncHandler(async (req, res) => {
  ok(res, await raid.getRaid(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/raid/:num', asyncHandler(async (req, res) => {
  const { version, ...body } = parse(z.object({ type: z.enum(RAID_TYPES).optional(), title: z.string().max(255).optional(), ...raidFields, version: z.number().int().min(0).optional() }), req.body);
  ok(res, await raid.updateRaid(callerId(req), P(req, 'pid'), P(req, 'num'), body, version));
}));
router.delete('/projects/:pid/raid/:num', asyncHandler(async (req, res) => {
  ok(res, await raid.deleteRaid(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/raid/:num/links', asyncHandler(async (req, res) => {
  const body = parse(z.object({ issueNumber: id.optional(), stageId: id.optional(), crNumber: id.optional() }), req.body);
  ok(res, await raid.addRaidLink(callerId(req), P(req, 'pid'), P(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/raid/:num/links/:linkId', asyncHandler(async (req, res) => {
  ok(res, await raid.removeRaidLink(callerId(req), P(req, 'pid'), P(req, 'num'), P(req, 'linkId')));
}));

// ═══ Cuộc họp (mô-đun meetings) ══════════════════════════════════════

const meetingFields = {
  type: z.enum(MEETING_TYPES).optional(),
  timezone: z.string().min(1).max(64).optional(),
  location: text(255),
  meetingUrl: z.string().max(500).nullable().optional(),
  agendaJson: tiptap(500_000).nullable().optional(),
  minutesJson: tiptap(1_000_000).nullable().optional(),
  decisions: z.array(z.string().max(500)).max(50).optional(),
};

router.get('/projects/:pid/meetings', asyncHandler(async (req, res) => {
  const q = parse(z.object({ scope: z.enum(['upcoming', 'past', 'all']).optional() }), req.query);
  ok(res, await meetings.listMeetings(callerId(req), P(req, 'pid'), q));
}));
router.post('/projects/:pid/meetings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().min(1, 'Title is required').max(255),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    ...meetingFields,
    attendeeIds: z.array(id).max(100).optional(),
    useTemplate: z.boolean().optional(),
    sendInvites: z.boolean().optional(),
    templateKey: z.string().max(24).nullable().optional(), // CTW đợt 8c: mẫu chương trình (daily, sprint-planning…)
  }), req.body);
  ok(res, await meetings.createMeeting(callerId(req), P(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/meetings/:num', asyncHandler(async (req, res) => {
  ok(res, await meetings.getMeeting(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.patch('/projects/:pid/meetings/:num', asyncHandler(async (req, res) => {
  const { version, ...body } = parse(z.object({
    title: z.string().max(255).optional(), status: z.enum(MEETING_STATUSES).optional(),
    startsAt: z.coerce.date().optional(), endsAt: z.coerce.date().optional(),
    ...meetingFields, version: z.number().int().min(0).optional(),
  }), req.body);
  ok(res, await meetings.updateMeeting(callerId(req), P(req, 'pid'), P(req, 'num'), body, version));
}));
router.delete('/projects/:pid/meetings/:num', asyncHandler(async (req, res) => {
  ok(res, await meetings.deleteMeeting(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.put('/projects/:pid/meetings/:num/attendees', asyncHandler(async (req, res) => {
  const { userIds } = parse(z.object({ userIds: z.array(id).max(100) }), req.body);
  ok(res, await meetings.setAttendees(callerId(req), P(req, 'pid'), P(req, 'num'), userIds));
}));
router.put('/projects/:pid/meetings/:num/actions', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({
    items: z.array(z.object({ id: id.optional(), text: z.string().min(1).max(500), assigneeId: id.nullable().optional(), dueDate: day.nullable().optional() })).max(100),
  }), req.body);
  ok(res, await meetings.setActions(callerId(req), P(req, 'pid'), P(req, 'num'), items));
}));
router.post('/projects/:pid/meetings/:num/actions/issues', asyncHandler(async (req, res) => {
  // CTW-17: `defaults` (tuỳ chọn) — trường không gửi ⇒ kế thừa từ cuộc họp (sprint/giai đoạn đang chạy, bộ phận
  // của người được giao); null ⇒ để trống. Epic nhận parentId / parentNumber / parentKey ("FP-1") như mọi chỗ (CTW-15).
  const { actionIds, defaults } = parse(z.object({
    actionIds: z.array(id).max(100).optional(),
    defaults: z.object({
      sprintId: id.nullable().optional(),
      stageId: id.nullable().optional(),
      teamId: id.nullable().optional(),
      parentId: id.nullable().optional(),
      parentNumber: id.nullable().optional(),
      parentKey: z.string().max(32).nullable().optional(),
      labelIds: z.array(id).max(30).optional(),
    }).strict().optional(),
  }), req.body ?? {});
  const { parentId: pId, parentNumber, parentKey, ...rest } = defaults ?? {};
  const parentId = await resolveParentId(P(req, 'pid'), { parentId: pId, parentNumber, parentKey });
  ok(res, await meetings.createIssuesFromActions(callerId(req), P(req, 'pid'), P(req, 'num'), actionIds, { ...rest, ...(parentId !== undefined ? { parentId } : {}) }), 201);
}));
router.post('/projects/:pid/meetings/:num/actions/suggest', asyncHandler(async (req, res) => {
  ok(res, await meetings.suggestActions(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.post('/projects/:pid/meetings/:num/share', asyncHandler(async (req, res) => {
  const { shared } = parse(z.object({ shared: z.boolean() }), req.body);
  ok(res, await meetings.shareMinutes(callerId(req), P(req, 'pid'), P(req, 'num'), shared));
}));
router.post('/projects/:pid/meetings/:num/duplicate', asyncHandler(async (req, res) => {
  const { weeks } = parse(z.object({ weeks: z.number().int().min(1).max(52).optional() }), req.body ?? {});
  ok(res, await meetings.duplicateMeeting(callerId(req), P(req, 'pid'), P(req, 'num'), weeks), 201);
}));
router.post('/projects/:pid/meetings/:num/invites', asyncHandler(async (req, res) => {
  ok(res, await meetings.sendInvites(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.get('/projects/:pid/meetings/:num/ics', asyncHandler(async (req, res) => {
  sendIcs(res, await meetings.meetingIcs(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

// Cổng khách: cuộc họp CÓ MỜI khách (đã thuộc `/portal/**` trong danh sách trắng S2b).
router.get('/projects/:pid/portal/meetings', asyncHandler(async (req, res) => {
  ok(res, await meetings.portalMeetings(callerId(req), P(req, 'pid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/meetings/:num', asyncHandler(async (req, res) => {
  ok(res, await meetings.portalMeeting(callerId(req), P(req, 'pid'), P(req, 'num'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/meetings/:num/ics', asyncHandler(async (req, res) => {
  sendIcs(res, await meetings.portalMeetingIcs(callerId(req), P(req, 'pid'), P(req, 'num'), { asClient: asClient(req) }));
}));

export default router;
