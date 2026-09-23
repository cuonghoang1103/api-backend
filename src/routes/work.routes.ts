/**
 * CT Work — REST /api/v1/work.
 *
 * Quy ước cho mọi tuyến ở đây:
 *   - người gọi lấy bằng callerId(req) (`req.userId`; KHÔNG `req.user.id`),
 *   - đầu vào kiểm bằng zod (lỗi trả 400 kèm tên trường),
 *   - quyền kiểm TRONG service (services/work/*), không kiểm ở route —
 *     để trợ lý AI gọi cùng service cũng bị kiểm đúng như vậy,
 *   - chữ trả về cho người dùng bằng tiếng Anh.
 */

import type { Prisma } from '@prisma/client';
import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  LINK_TYPES, PRIORITY_MAX, PRIORITY_MIN, PROJECT_ROLES, PROJECT_TEMPLATES, PROJECT_TYPES,
  PROJECT_VISIBILITY, WORKSPACE_ROLES,
} from '../services/work/constants.js';
import * as issues from '../services/work/issues.service.js';
import { registerWorkNotifications } from '../services/work/notify.js';
import * as projects from '../services/work/projects.service.js';
import * as reports from '../services/work/reports.service.js';
import * as sprints from '../services/work/sprints.service.js';
import * as tests from '../services/work/tests.service.js';
import * as ai from '../services/work/ai.service.js';
import { myWork } from '../services/work/myWork.service.js';
import * as custom from '../services/work/customize.service.js';
import * as searchSvc from '../services/work/search.service.js';
import * as workspaces from '../services/work/workspaces.service.js';
import * as planning from '../services/work/planning.service.js';
import * as automation from '../services/work/automation.service.js';
import { EMAIL_MODES, getNotifySettings, setNotifySettings } from '../services/work/notify.js';

registerWorkNotifications();
tests.registerTestingHooks();
automation.registerAutomation();

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });

/** Chạy zod; lỗi thành 400 với thông điệp đọc được. */
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
const idParam = (req: Request, name: string) => parse(id, req.params[name]);

/** "1,2,3" hoặc mảng ⇒ number[] */
const idList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? undefined : (Array.isArray(v) ? v : v.split(',')).map((x) => Number(x)).filter((n) => Number.isInteger(n) && n >= 0)));

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .transform((s) => new Date(`${s}T00:00:00.000Z`))
  .nullable();

/** JSON TipTap: một object có type 'doc'. Trần kích thước để không ai nhét 50MB vào một thẻ. */
const tiptapDoc = z
  .object({ type: z.literal('doc') })
  .passthrough()
  .refine((v) => JSON.stringify(v).length <= 500_000, 'Content is too large')
  .transform((v) => v as Prisma.InputJsonValue);

// ═══ Công khai (trước authenticate) ════════════════════════════════

// Xem trước lời mời — trang /work/invite/:token hiện tên không gian cho người chưa đăng nhập.
router.get('/invites/:token', asyncHandler(async (req, res) => {
  ok(res, await workspaces.previewInvite(String(req.params.token)));
}));

router.use(authenticate);

// ═══ Không gian ═════════════════════════════════════════════════════

router.get('/workspaces', asyncHandler(async (req, res) => {
  const userId = callerId(req);
  const rows = await prisma.workMember.findMany({
    where: { userId, workspace: { deletedAt: null } },
    orderBy: { joinedAt: 'asc' },
    select: {
      role: true,
      workspace: {
        select: {
          id: true, name: true, slug: true, description: true,
          _count: { select: { projects: { where: { deletedAt: null } }, members: true } },
        },
      },
    },
  });
  ok(res, rows.map((r) => ({
    id: r.workspace.id, name: r.workspace.name, slug: r.workspace.slug, description: r.workspace.description,
    role: r.role, projectCount: r.workspace._count.projects, memberCount: r.workspace._count.members,
  })));
}));

const workspaceBody = z.object({ name: z.string().min(1).max(100), description: z.string().max(2000).nullable().optional() });

router.post('/workspaces', asyncHandler(async (req, res) => {
  ok(res, await workspaces.createWorkspace(callerId(req), parse(workspaceBody, req.body)), 201);
}));

router.get('/workspaces/by-slug/:slug', asyncHandler(async (req, res) => {
  const userId = callerId(req);
  const wsId = await workspaces.resolveWorkspaceSlug(userId, String(req.params.slug));
  const [ws, list] = await Promise.all([workspaces.getWorkspace(userId, wsId), projects.listProjects(userId, wsId)]);
  ok(res, { ...ws, projects: list });
}));

router.patch('/workspaces/:wsId', asyncHandler(async (req, res) => {
  ok(res, await workspaces.updateWorkspace(callerId(req), idParam(req, 'wsId'), parse(workspaceBody.partial(), req.body)));
}));

router.delete('/workspaces/:wsId', asyncHandler(async (req, res) => {
  const { confirmName } = parse(z.object({ confirmName: z.string() }), req.body);
  await workspaces.deleteWorkspace(callerId(req), idParam(req, 'wsId'), confirmName);
  ok(res, { deleted: true });
}));

router.get('/workspaces/:wsId/members', asyncHandler(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  ok(res, await workspaces.listMembers(callerId(req), idParam(req, 'wsId'), q));
}));

router.patch('/workspaces/:wsId/members/:userId', asyncHandler(async (req, res) => {
  const { role } = parse(z.object({ role: z.enum(WORKSPACE_ROLES) }), req.body);
  await workspaces.updateMemberRole(callerId(req), idParam(req, 'wsId'), idParam(req, 'userId'), role);
  ok(res, { updated: true });
}));

router.delete('/workspaces/:wsId/members/:userId', asyncHandler(async (req, res) => {
  await workspaces.removeMember(callerId(req), idParam(req, 'wsId'), idParam(req, 'userId'));
  ok(res, { removed: true });
}));

router.post('/workspaces/:wsId/transfer', asyncHandler(async (req, res) => {
  const { userId } = parse(z.object({ userId: id }), req.body);
  await workspaces.transferOwnership(callerId(req), idParam(req, 'wsId'), userId);
  ok(res, { transferred: true });
}));

const inviteBase = z.object({
  role: z.enum(WORKSPACE_ROLES).default('MEMBER'),
  projectId: id.nullable().optional(),
  projectRole: z.enum(PROJECT_ROLES).nullable().optional(),
});

router.get('/workspaces/:wsId/invites', asyncHandler(async (req, res) => {
  ok(res, await workspaces.listInvites(callerId(req), idParam(req, 'wsId')));
}));

router.post('/workspaces/:wsId/invites', asyncHandler(async (req, res) => {
  const body = parse(inviteBase.extend({ emails: z.array(z.string().email('Invalid email')).min(1).max(50) }), req.body);
  ok(res, await workspaces.inviteByEmail(callerId(req), idParam(req, 'wsId'), body), 201);
}));

router.post('/workspaces/:wsId/invite-links', asyncHandler(async (req, res) => {
  const body = parse(inviteBase.extend({ maxUses: z.number().int().min(1).max(200).optional(), expiresInDays: z.number().int().min(1).max(30).optional() }), req.body);
  ok(res, await workspaces.createInviteLink(callerId(req), idParam(req, 'wsId'), body), 201);
}));

router.delete('/workspaces/:wsId/invites/:inviteId', asyncHandler(async (req, res) => {
  await workspaces.revokeInvite(callerId(req), idParam(req, 'wsId'), idParam(req, 'inviteId'));
  ok(res, { revoked: true });
}));

router.post('/invites/:token/accept', asyncHandler(async (req, res) => {
  ok(res, await workspaces.acceptInvite(callerId(req), String(req.params.token)));
}));

// ═══ Dự án ══════════════════════════════════════════════════════════

router.get('/workspaces/:wsId/projects', asyncHandler(async (req, res) => {
  ok(res, await projects.listProjects(callerId(req), idParam(req, 'wsId')));
}));

router.post('/workspaces/:wsId/projects', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    key: z.string().min(2).max(10),
    name: z.string().min(1).max(120),
    description: z.string().max(5000).nullable().optional(),
    type: z.enum(PROJECT_TYPES).default('SCRUM'),
    template: z.enum(PROJECT_TEMPLATES).default('BLANK'),
    visibility: z.enum(PROJECT_VISIBILITY).optional(),
  }), req.body);
  ok(res, await projects.createProject(callerId(req), idParam(req, 'wsId'), body), 201);
}));

// /work/<slug>/<KEY> trên web ⇒ id dự án.
router.get('/resolve/:slug/:key', asyncHandler(async (req, res) => {
  ok(res, { projectId: await projects.resolveProjectKey(callerId(req), String(req.params.slug), String(req.params.key)) });
}));

router.get('/projects/:pid', asyncHandler(async (req, res) => {
  ok(res, await projects.getProjectConfig(callerId(req), idParam(req, 'pid')));
}));

router.patch('/projects/:pid', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(5000).nullable().optional(),
    visibility: z.enum(PROJECT_VISIBILITY).optional(),
    leadId: id.nullable().optional(),
    settings: z.record(z.unknown()).optional(),
  }), req.body);
  ok(res, await projects.updateProject(callerId(req), idParam(req, 'pid'), body));
}));

router.post('/projects/:pid/archive', asyncHandler(async (req, res) => {
  const { archived } = parse(z.object({ archived: z.boolean() }), req.body);
  await projects.setProjectArchived(callerId(req), idParam(req, 'pid'), archived);
  ok(res, { archived });
}));

router.delete('/projects/:pid', asyncHandler(async (req, res) => {
  const { confirmKey } = parse(z.object({ confirmKey: z.string() }), req.body);
  await projects.deleteProject(callerId(req), idParam(req, 'pid'), confirmKey);
  ok(res, { deleted: true });
}));

router.put('/projects/:pid/members/:userId', asyncHandler(async (req, res) => {
  const { role } = parse(z.object({ role: z.enum(PROJECT_ROLES) }), req.body);
  await projects.setProjectMember(callerId(req), idParam(req, 'pid'), idParam(req, 'userId'), role);
  ok(res, { updated: true });
}));

router.delete('/projects/:pid/members/:userId', asyncHandler(async (req, res) => {
  await projects.removeProjectMember(callerId(req), idParam(req, 'pid'), idParam(req, 'userId'));
  ok(res, { removed: true });
}));

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex colour like #3b82f6');

router.post('/projects/:pid/labels', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(50), color: hexColor.optional() }), req.body);
  ok(res, await projects.upsertLabel(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/labels/:labelId', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(50), color: hexColor.optional() }), req.body);
  ok(res, await projects.upsertLabel(callerId(req), idParam(req, 'pid'), { ...body, id: idParam(req, 'labelId') }));
}));
router.delete('/projects/:pid/labels/:labelId', asyncHandler(async (req, res) => {
  await projects.deleteLabel(callerId(req), idParam(req, 'pid'), idParam(req, 'labelId'));
  ok(res, { deleted: true });
}));

const componentBody = z.object({ name: z.string().min(1).max(60), description: z.string().max(2000).nullable().optional(), leadId: id.nullable().optional() });
router.post('/projects/:pid/components', asyncHandler(async (req, res) => {
  ok(res, await projects.upsertComponent(callerId(req), idParam(req, 'pid'), parse(componentBody, req.body)), 201);
}));
router.patch('/projects/:pid/components/:cid', asyncHandler(async (req, res) => {
  ok(res, await projects.upsertComponent(callerId(req), idParam(req, 'pid'), { ...parse(componentBody, req.body), id: idParam(req, 'cid') }));
}));
router.delete('/projects/:pid/components/:cid', asyncHandler(async (req, res) => {
  await projects.deleteComponent(callerId(req), idParam(req, 'pid'), idParam(req, 'cid'));
  ok(res, { deleted: true });
}));

// ═══ Thẻ ════════════════════════════════════════════════════════════

router.get('/projects/:pid/board', asyncHandler(async (req, res) => {
  const sprintId = req.query.sprintId ? parse(id, req.query.sprintId) : undefined;
  ok(res, await issues.getBoard(callerId(req), idParam(req, 'pid'), sprintId));
}));

router.get('/projects/:pid/issues', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    status: idList, type: idList, assignee: idList, label: idList,
    sprint: z.union([z.literal('backlog'), z.literal('open'), id]).optional(),
    parent: id.optional(),
    q: z.string().max(200).optional(),
    includeDone: z.enum(['true', 'false']).optional(),
    excludeEpics: z.enum(['true', 'false']).optional(),
    limit: z.coerce.number().int().min(1).max(1000).optional(),
    cursor: z.string().max(64).optional(),
  }), req.query);
  ok(res, await issues.listIssues(callerId(req), idParam(req, 'pid'), {
    statusIds: q.status, typeIds: q.type, assigneeIds: q.assignee, labelIds: q.label,
    sprint: q.sprint, parentId: q.parent, q: q.q,
    includeDone: q.includeDone === undefined ? undefined : q.includeDone === 'true',
    excludeEpics: q.excludeEpics === 'true',
    limit: q.limit, cursor: q.cursor,
  }));
}));

const issueFields = {
  title: z.string().min(1, 'Title is required').max(255),
  descriptionJson: tiptapDoc.nullable(),
  priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX),
  assigneeId: id.nullable(),
  storyPoints: z.number().min(0).max(1000).nullable(),
  originalEstimateMin: z.number().int().min(0).max(100_000).nullable(),
  remainingEstimateMin: z.number().int().min(0).max(100_000).nullable(),
  startDate: dateOnly,
  dueDate: dateOnly,
  parentId: id.nullable(),
  sprintId: id.nullable(),
  fixVersionId: id.nullable(),
  statusId: id,
  labelIds: z.array(id).max(30),
  componentIds: z.array(id).max(30),
};

router.post('/projects/:pid/issues', asyncHandler(async (req, res) => {
  const body = parse(z.object({ ...issueFields, typeId: id }).partial().required({ title: true, typeId: true }), req.body);
  const issue = await issues.createIssueAs(callerId(req), idParam(req, 'pid'), body as issues.CreateIssueBody);
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), issue.number), 201);
}));

router.get('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

router.patch('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  const { version, ...body } = parse(z.object({ ...issueFields, version: z.number().int().min(0).optional() }).partial(), req.body);
  await issues.updateIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body, version);
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

router.post('/projects/:pid/issues/:num/move', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    statusId: id.optional(),
    sprintId: id.nullable().optional(),
    beforeIssueId: id.nullable().optional(),
    afterIssueId: id.nullable().optional(),
    version: z.number().int().min(0).optional(),
  }), req.body);
  const { version, ...rest } = body;
  const moved = await issues.moveIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { ...rest, expectedVersion: version });
  ok(res, moved);
}));

router.delete('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  await issues.deleteIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'));
  ok(res, { deleted: true });
}));

router.get('/projects/:pid/issues/:num/history', asyncHandler(async (req, res) => {
  ok(res, await issues.listHistory(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

router.post('/projects/:pid/issues/:num/links', asyncHandler(async (req, res) => {
  const body = parse(z.object({ type: z.enum(LINK_TYPES), targetKey: z.string().min(3).max(20) }), req.body);
  ok(res, await issues.addLink(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/issues/:num/links/:linkId', asyncHandler(async (req, res) => {
  await issues.removeLink(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'linkId'));
  ok(res, { removed: true });
}));

router.put('/projects/:pid/issues/:num/watch', asyncHandler(async (req, res) => {
  await issues.setWatching(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), true);
  ok(res, { watching: true });
}));
router.delete('/projects/:pid/issues/:num/watch', asyncHandler(async (req, res) => {
  await issues.setWatching(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), false);
  ok(res, { watching: false });
}));

router.get('/projects/:pid/issues/:num/comments', asyncHandler(async (req, res) => {
  ok(res, await issues.listComments(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.post('/projects/:pid/issues/:num/comments', asyncHandler(async (req, res) => {
  const { bodyJson } = parse(z.object({ bodyJson: tiptapDoc }), req.body);
  ok(res, await issues.addComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), bodyJson), 201);
}));
router.patch('/projects/:pid/issues/:num/comments/:cid', asyncHandler(async (req, res) => {
  const { bodyJson } = parse(z.object({ bodyJson: tiptapDoc }), req.body);
  ok(res, await issues.editComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'), bodyJson));
}));
router.delete('/projects/:pid/issues/:num/comments/:cid', asyncHandler(async (req, res) => {
  await issues.deleteComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'));
  ok(res, { deleted: true });
}));

router.post('/projects/:pid/issues/:num/attachments/presign', asyncHandler(async (req, res) => {
  const body = parse(z.object({ fileName: z.string().min(1).max(255), contentType: z.string().max(100), size: z.number().int().positive() }), req.body);
  ok(res, await issues.presignAttachment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body));
}));
router.post('/projects/:pid/issues/:num/attachments/complete', asyncHandler(async (req, res) => {
  const body = parse(z.object({ key: z.string().min(1).max(500), fileName: z.string().min(1).max(255) }), req.body);
  ok(res, await issues.completeAttachment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body), 201);
}));
// Trả URL ký sẵn (không 302): client dùng cho cả <img> xem trước lẫn nút tải.
router.get('/projects/:pid/attachments/:aid/url', asyncHandler(async (req, res) => {
  ok(res, { url: await issues.attachmentDownloadUrl(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), req.query.inline === '1') });
}));
router.delete('/projects/:pid/attachments/:aid', asyncHandler(async (req, res) => {
  await issues.deleteAttachment(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'));
  ok(res, { deleted: true });
}));

// ═══ Sprint & backlog (đợt 2) ══════════════════════════════════════

const dateTime = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date').transform((v) => new Date(v));

router.get('/projects/:pid/sprints', asyncHandler(async (req, res) => {
  ok(res, await sprints.listSprints(callerId(req), idParam(req, 'pid'), req.query.includeClosed === 'true'));
}));

router.post('/projects/:pid/sprints', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().max(100).optional(), goal: z.string().max(5000).nullable().optional() }), req.body ?? {});
  ok(res, await sprints.createSprint(callerId(req), idParam(req, 'pid'), body), 201);
}));

router.patch('/projects/:pid/sprints/:sid', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(100).optional(),
    goal: z.string().max(5000).nullable().optional(),
    startAt: dateTime.nullable().optional(),
    endAt: dateTime.nullable().optional(),
  }), req.body);
  ok(res, await sprints.updateSprint(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), body));
}));

router.delete('/projects/:pid/sprints/:sid', asyncHandler(async (req, res) => {
  await sprints.deleteSprint(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'));
  ok(res, { deleted: true });
}));

router.post('/projects/:pid/sprints/:sid/start', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().max(100).optional(),
    goal: z.string().max(5000).nullable().optional(),
    startAt: dateTime,
    endAt: dateTime,
  }), req.body);
  ok(res, await sprints.startSprint(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), body));
}));

router.post('/projects/:pid/sprints/:sid/complete', asyncHandler(async (req, res) => {
  const { moveTo } = parse(z.object({ moveTo: z.union([z.literal('backlog'), z.literal('new'), id]) }), req.body);
  ok(res, await sprints.completeSprint(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), moveTo));
}));

router.get('/projects/:pid/backlog', asyncHandler(async (req, res) => {
  ok(res, await sprints.getBacklog(callerId(req), idParam(req, 'pid')));
}));

router.post('/projects/:pid/issues/bulk', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    numbers: z.array(id).min(1).max(200),
    patch: z.object({
      sprintId: id.nullable().optional(),
      assigneeId: id.nullable().optional(),
      priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(),
      statusId: id.optional(),
      parentId: id.nullable().optional(),
      addLabelIds: z.array(id).max(30).optional(),
      delete: z.literal(true).optional(),
    }).refine((p) => Object.keys(p).length > 0, 'Nothing to change'),
  }), req.body);
  ok(res, await sprints.bulkUpdate(callerId(req), idParam(req, 'pid'), body.numbers, body.patch));
}));

// ═══ Báo cáo ════════════════════════════════════════════════════════

router.get('/projects/:pid/reports/burndown', asyncHandler(async (req, res) => {
  ok(res, await reports.burndown(callerId(req), idParam(req, 'pid'), parse(id, req.query.sprintId)));
}));
router.get('/projects/:pid/reports/velocity', asyncHandler(async (req, res) => {
  ok(res, await reports.velocity(callerId(req), idParam(req, 'pid')));
}));
router.get('/projects/:pid/reports/sprint', asyncHandler(async (req, res) => {
  ok(res, await reports.sprintReport(callerId(req), idParam(req, 'pid'), parse(id, req.query.sprintId)));
}));
router.get('/projects/:pid/reports/epics', asyncHandler(async (req, res) => {
  ok(res, await reports.epicReport(callerId(req), idParam(req, 'pid')));
}));
router.get('/projects/:pid/reports/contributions', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: dateTime.optional(), to: dateTime.optional(), sprintId: id.optional() }), req.query);
  ok(res, await reports.contributions(callerId(req), idParam(req, 'pid'), q));
}));

// ═══ Kiểm thử (đợt 3) ═══════════════════════════════════════════════

const stepBody = z.object({ action: z.string().max(5000), data: z.string().max(5000).nullable().optional(), expected: z.string().max(5000).nullable().optional() });
const testBody = z.object({
  title: z.string().min(1).max(255).optional(),
  preconditions: z.string().max(10000).nullable().optional(),
  kind: z.enum(['MANUAL', 'GHERKIN']).optional(),
  gherkin: z.string().max(50000).nullable().optional(),
  steps: z.array(stepBody).max(100).optional(),
  requirementKeys: z.array(z.string().max(20)).max(50).optional(),
  priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(),
  labelIds: z.array(id).max(30).optional(),
  assigneeId: id.nullable().optional(),
});

router.post('/projects/:pid/tests/enable', asyncHandler(async (req, res) => {
  ok(res, await tests.enableTesting(callerId(req), idParam(req, 'pid')));
}));
router.get('/projects/:pid/tests', asyncHandler(async (req, res) => {
  ok(res, await tests.listTests(callerId(req), idParam(req, 'pid'), typeof req.query.q === 'string' ? req.query.q : undefined));
}));
router.post('/projects/:pid/tests', asyncHandler(async (req, res) => {
  const body = parse(testBody.required({ title: true }), req.body);
  ok(res, await tests.createTest(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/tests/import', asyncHandler(async (req, res) => {
  const { rows } = parse(z.object({ rows: z.array(testBody.extend({ title: z.string().max(255) })).min(1).max(500) }), req.body);
  ok(res, await tests.importTests(callerId(req), idParam(req, 'pid'), rows), 201);
}));
router.get('/projects/:pid/tests/:num', asyncHandler(async (req, res) => {
  ok(res, await tests.getTest(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.put('/projects/:pid/tests/:num', asyncHandler(async (req, res) => {
  ok(res, await tests.updateTest(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), parse(testBody, req.body)));
}));

router.get('/projects/:pid/test-plans', asyncHandler(async (req, res) => {
  ok(res, await tests.listPlans(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/test-plans', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(120), description: z.string().max(5000).nullable().optional(), numbers: z.array(id).max(1000).optional() }), req.body);
  ok(res, await tests.createPlan(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/test-plans/:planId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(120).optional(), description: z.string().max(5000).nullable().optional(), archived: z.boolean().optional(),
    addNumbers: z.array(id).max(1000).optional(), removeNumbers: z.array(id).max(1000).optional(),
  }), req.body);
  await tests.updatePlan(callerId(req), idParam(req, 'pid'), idParam(req, 'planId'), body);
  ok(res, { updated: true });
}));
router.delete('/projects/:pid/test-plans/:planId', asyncHandler(async (req, res) => {
  await tests.deletePlan(callerId(req), idParam(req, 'pid'), idParam(req, 'planId'));
  ok(res, { deleted: true });
}));

router.get('/projects/:pid/test-cycles', asyncHandler(async (req, res) => {
  ok(res, await tests.listCycles(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/test-cycles', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(120), environment: z.string().max(120).nullable().optional(), build: z.string().max(80).nullable().optional(),
    planId: id.nullable().optional(), numbers: z.array(id).max(1000).optional(),
  }), req.body);
  ok(res, await tests.createCycle(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/test-cycles/:cycleId', asyncHandler(async (req, res) => {
  ok(res, await tests.getCycle(callerId(req), idParam(req, 'pid'), idParam(req, 'cycleId')));
}));
router.patch('/projects/:pid/test-cycles/:cycleId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(120).optional(), environment: z.string().max(120).nullable().optional(), build: z.string().max(80).nullable().optional(),
    state: z.enum(tests.CYCLE_STATES).optional(), addNumbers: z.array(id).max(1000).optional(), removeRunIds: z.array(id).max(1000).optional(),
  }), req.body);
  await tests.updateCycle(callerId(req), idParam(req, 'pid'), idParam(req, 'cycleId'), body);
  ok(res, { updated: true });
}));
router.delete('/projects/:pid/test-cycles/:cycleId', asyncHandler(async (req, res) => {
  await tests.deleteCycle(callerId(req), idParam(req, 'pid'), idParam(req, 'cycleId'));
  ok(res, { deleted: true });
}));

router.get('/projects/:pid/test-runs/:runId', asyncHandler(async (req, res) => {
  ok(res, await tests.getRun(callerId(req), idParam(req, 'pid'), idParam(req, 'runId')));
}));
router.patch('/projects/:pid/test-runs/:runId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    status: z.enum(tests.RUN_STATUSES).optional(), comment: z.string().max(10000).nullable().optional(),
    assigneeId: id.nullable().optional(), reset: z.boolean().optional(),
  }), req.body);
  ok(res, await tests.updateRun(callerId(req), idParam(req, 'pid'), idParam(req, 'runId'), body));
}));
router.patch('/projects/:pid/test-runs/:runId/steps/:stepId', asyncHandler(async (req, res) => {
  const body = parse(z.object({ status: z.enum(tests.STEP_STATUSES).optional(), actual: z.string().max(10000).nullable().optional() }), req.body);
  ok(res, await tests.updateStepResult(callerId(req), idParam(req, 'pid'), idParam(req, 'runId'), idParam(req, 'stepId'), body));
}));
router.post('/projects/:pid/test-runs/:runId/defects', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().max(255).optional(), stepResultId: id.nullable().optional(),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(), assigneeId: id.nullable().optional(),
  }), req.body ?? {});
  ok(res, await tests.createDefect(callerId(req), idParam(req, 'pid'), idParam(req, 'runId'), body), 201);
}));
router.put('/projects/:pid/test-runs/:runId/defects/:num', asyncHandler(async (req, res) => {
  await tests.linkDefect(callerId(req), idParam(req, 'pid'), idParam(req, 'runId'), idParam(req, 'num'));
  ok(res, { linked: true });
}));
router.delete('/projects/:pid/test-runs/:runId/defects/:num', asyncHandler(async (req, res) => {
  await tests.unlinkDefect(callerId(req), idParam(req, 'pid'), idParam(req, 'runId'), idParam(req, 'num'));
  ok(res, { unlinked: true });
}));

router.get('/projects/:pid/reports/traceability', asyncHandler(async (req, res) => {
  ok(res, await tests.traceability(callerId(req), idParam(req, 'pid')));
}));

// ═══ Trợ lý AI (đợt 4) ══════════════════════════════════════════════

router.get('/ai/quota', asyncHandler(async (req, res) => {
  ok(res, await ai.aiQuota(callerId(req)));
}));
router.post('/projects/:pid/ai/chat', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    message: z.string().min(1).max(8000),
    history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(12000) })).max(20).optional(),
    issueNumber: id.nullable().optional(),
  }), req.body);
  ok(res, await ai.chat(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/quick', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    task: z.enum(['write_story', 'split', 'generate_tests', 'improve_bug', 'summarize', 'review_story', 'meeting_notes']),
    issueNumber: id.nullable().optional(),
    text: z.string().max(20000).nullable().optional(),
  }), req.body);
  ok(res, await ai.quick(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/filter', asyncHandler(async (req, res) => {
  const { question } = parse(z.object({ question: z.string().min(2).max(500) }), req.body);
  ok(res, await ai.naturalFilter(callerId(req), idParam(req, 'pid'), question));
}));
router.post('/projects/:pid/ai/apply', asyncHandler(async (req, res) => {
  const { action } = parse(z.object({ action: ai.actionSchema }), req.body);
  ok(res, await ai.applyAction(callerId(req), idParam(req, 'pid'), action));
}));
router.post('/projects/:pid/ai/weekly-report', asyncHandler(async (req, res) => {
  const body = parse(z.object({ audience: z.enum(['teacher', 'client', 'team']).default('team'), language: z.enum(['en', 'vi']).optional() }), req.body ?? {});
  ok(res, await ai.weeklyReport(callerId(req), idParam(req, 'pid'), body));
}));
router.get('/projects/:pid/insights', asyncHandler(async (req, res) => {
  ok(res, await ai.insights(callerId(req), idParam(req, 'pid')));
}));
router.get('/projects/:pid/similar', asyncHandler(async (req, res) => {
  const title = typeof req.query.title === 'string' ? req.query.title.slice(0, 255) : '';
  ok(res, await ai.similarIssues(callerId(req), idParam(req, 'pid'), title));
}));
router.get('/projects/:pid/suggest-assignee', asyncHandler(async (req, res) => {
  const q = parse(z.object({ parentId: id.optional(), labels: idList }), req.query);
  ok(res, await ai.suggestAssignee(callerId(req), idParam(req, 'pid'), { parentId: q.parentId, labelIds: q.labels }));
}));

router.get('/me/work', asyncHandler(async (req, res) => {
  ok(res, await myWork(callerId(req)));
}));

// ═══ Tuỳ biến & tìm kiếm (đợt 5) ════════════════════════════════════

router.post('/projects/:pid/workflows', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(80), copyFrom: id.nullable().optional() }), req.body);
  ok(res, await custom.createWorkflow(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/workflows/:wfId/statuses', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(60), category: z.enum(custom.STATUS_CATEGORIES), color: hexColor.optional() }), req.body);
  ok(res, await custom.addStatus(callerId(req), idParam(req, 'pid'), idParam(req, 'wfId'), body), 201);
}));
router.put('/projects/:pid/workflows/:wfId/order', asyncHandler(async (req, res) => {
  const { statusIds } = parse(z.object({ statusIds: z.array(id).min(1).max(50) }), req.body);
  await custom.reorderStatuses(callerId(req), idParam(req, 'pid'), idParam(req, 'wfId'), statusIds);
  ok(res, { updated: true });
}));
router.put('/projects/:pid/workflows/:wfId/transitions', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    mode: z.enum(['free', 'restricted']),
    transitions: z.array(z.object({ from: id.nullable(), to: id })).max(500).optional(),
  }), req.body);
  await custom.setTransitions(callerId(req), idParam(req, 'pid'), idParam(req, 'wfId'), body);
  ok(res, { updated: true });
}));
router.patch('/projects/:pid/statuses/:statusId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(60).optional(), category: z.enum(custom.STATUS_CATEGORIES).optional(),
    color: hexColor.optional(), wipLimit: z.number().int().min(1).max(500).nullable().optional(),
  }), req.body);
  await custom.updateStatus(callerId(req), idParam(req, 'pid'), idParam(req, 'statusId'), body);
  ok(res, { updated: true });
}));
router.delete('/projects/:pid/statuses/:statusId', asyncHandler(async (req, res) => {
  const moveTo = req.query.moveTo ? parse(id, req.query.moveTo) : undefined;
  await custom.deleteStatus(callerId(req), idParam(req, 'pid'), idParam(req, 'statusId'), moveTo);
  ok(res, { deleted: true });
}));
router.put('/projects/:pid/board-columns', asyncHandler(async (req, res) => {
  const { columns } = parse(z.object({
    columns: z.array(z.object({ name: z.string().min(1).max(40), statusIds: z.array(id).max(50), wipLimit: z.number().int().min(1).max(500).nullable().optional() })).max(20).nullable(),
  }), req.body);
  await custom.setBoardColumns(callerId(req), idParam(req, 'pid'), columns);
  ok(res, { updated: true });
}));
router.post('/projects/:pid/issue-types', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(40), level: z.union([z.literal(0), z.literal(-1), z.literal(1)]),
    color: hexColor.optional(), icon: z.string().max(24).optional(), workflowId: id.nullable().optional(),
  }), req.body);
  ok(res, await custom.addIssueType(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/issue-types/:typeId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(40).optional(), color: hexColor.optional(), icon: z.string().max(24).optional(),
    archived: z.boolean().optional(), workflowId: id.nullable().optional(),
  }), req.body);
  await custom.updateIssueType(callerId(req), idParam(req, 'pid'), idParam(req, 'typeId'), body);
  ok(res, { updated: true });
}));

const optionBody = z.object({ id: z.string().max(40).optional(), label: z.string().min(1).max(60), color: hexColor.optional() });
router.get('/projects/:pid/custom-fields', asyncHandler(async (req, res) => {
  ok(res, await custom.listCustomFields(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/custom-fields', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(60), kind: z.enum(custom.CUSTOM_KINDS), options: z.array(optionBody).max(100).optional(),
    typeKeys: z.array(z.string().max(20)).max(20).nullable().optional(), required: z.boolean().optional(),
  }), req.body);
  ok(res, await custom.createCustomField(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/custom-fields/:fieldId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(60).optional(), options: z.array(optionBody).max(100).optional(),
    typeKeys: z.array(z.string().max(20)).max(20).nullable().optional(), required: z.boolean().optional(), position: z.number().int().min(0).optional(),
  }), req.body);
  await custom.updateCustomField(callerId(req), idParam(req, 'pid'), idParam(req, 'fieldId'), body);
  ok(res, { updated: true });
}));
router.delete('/projects/:pid/custom-fields/:fieldId', asyncHandler(async (req, res) => {
  await custom.deleteCustomField(callerId(req), idParam(req, 'pid'), idParam(req, 'fieldId'));
  ok(res, { deleted: true });
}));
router.get('/projects/:pid/issues/:num/custom-values', asyncHandler(async (req, res) => {
  ok(res, await custom.getCustomValues(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.put('/projects/:pid/issues/:num/custom-values', asyncHandler(async (req, res) => {
  const { values } = parse(z.object({ values: z.record(z.unknown()) }), req.body);
  ok(res, await custom.setCustomValues(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), values));
}));

router.get('/projects/:pid/search', asyncHandler(async (req, res) => {
  const q = parse(z.object({ jql: z.string().max(4000).default(''), limit: z.coerce.number().int().min(1).max(500).optional(), offset: z.coerce.number().int().min(0).optional() }), req.query);
  ok(res, await searchSvc.search(callerId(req), idParam(req, 'pid'), q.jql, { limit: q.limit, offset: q.offset }));
}));
router.get('/projects/:pid/stats', asyncHandler(async (req, res) => {
  const q = parse(z.object({ jql: z.string().max(4000).default(''), groupBy: z.enum(searchSvc.GROUP_BYS) }), req.query);
  ok(res, await searchSvc.stats(callerId(req), idParam(req, 'pid'), q.jql, q.groupBy));
}));
router.get('/projects/:pid/stats/created-resolved', asyncHandler(async (req, res) => {
  const q = parse(z.object({ days: z.coerce.number().int().min(7).max(90).default(30), jql: z.string().max(4000).default('') }), req.query);
  ok(res, await searchSvc.createdVsResolved(callerId(req), idParam(req, 'pid'), q.days, q.jql));
}));
router.get('/projects/:pid/filters', asyncHandler(async (req, res) => {
  ok(res, await searchSvc.listFilters(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/filters', asyncHandler(async (req, res) => {
  const body = parse(z.object({ id: id.optional(), name: z.string().min(1).max(100), query: z.string().max(4000), shared: z.boolean().optional() }), req.body);
  ok(res, await searchSvc.saveFilter(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.delete('/projects/:pid/filters/:filterId', asyncHandler(async (req, res) => {
  await searchSvc.deleteFilter(callerId(req), idParam(req, 'pid'), idParam(req, 'filterId'));
  ok(res, { deleted: true });
}));
const widgetBody = z.object({
  id: z.string().max(40).default(''), kind: z.enum(searchSvc.WIDGET_KINDS), title: z.string().max(80).default(''),
  query: z.string().max(4000).optional(), groupBy: z.enum(searchSvc.GROUP_BYS).optional(), sprintId: id.nullable().optional(),
  days: z.number().int().min(7).max(90).optional(), text: z.string().max(5000).optional(), size: z.enum(['half', 'full']).optional(),
});
router.get('/projects/:pid/dashboards', asyncHandler(async (req, res) => {
  ok(res, await searchSvc.listDashboards(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/dashboards', asyncHandler(async (req, res) => {
  const body = parse(z.object({ id: id.optional(), name: z.string().min(1).max(100), shared: z.boolean().optional(), widgets: z.array(widgetBody).max(30) }), req.body);
  ok(res, await searchSvc.saveDashboard(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.delete('/projects/:pid/dashboards/:dashId', asyncHandler(async (req, res) => {
  await searchSvc.deleteDashboard(callerId(req), idParam(req, 'pid'), idParam(req, 'dashId'));
  ok(res, { deleted: true });
}));

// ═══ Kế hoạch dài hạn & tự động hoá (đợt 6) ══════════════════════════

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

router.get('/projects/:pid/versions', asyncHandler(async (req, res) => {
  ok(res, await planning.listVersions(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/versions', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(60), description: z.string().max(5000).nullable().optional(), startDate: ymd.nullable().optional(), releaseDate: ymd.nullable().optional() }), req.body);
  ok(res, await planning.createVersion(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/versions/:versionId', asyncHandler(async (req, res) => {
  ok(res, await planning.versionDetail(callerId(req), idParam(req, 'pid'), idParam(req, 'versionId')));
}));
router.patch('/projects/:pid/versions/:versionId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(60).optional(), description: z.string().max(5000).nullable().optional(),
    startDate: ymd.nullable().optional(), releaseDate: ymd.nullable().optional(),
    status: z.enum(['UNRELEASED', 'ARCHIVED']).optional(), releaseNotes: z.string().max(50_000).nullable().optional(),
  }), req.body);
  ok(res, await planning.updateVersion(callerId(req), idParam(req, 'pid'), idParam(req, 'versionId'), body));
}));
router.post('/projects/:pid/versions/:versionId/release', asyncHandler(async (req, res) => {
  const body = parse(z.object({ moveUnresolvedTo: id.nullable(), releaseDate: ymd.nullable().optional() }), req.body);
  ok(res, await planning.releaseVersion(callerId(req), idParam(req, 'pid'), idParam(req, 'versionId'), body));
}));
router.delete('/projects/:pid/versions/:versionId', asyncHandler(async (req, res) => {
  await planning.deleteVersion(callerId(req), idParam(req, 'pid'), idParam(req, 'versionId'));
  ok(res, { deleted: true });
}));
router.post('/projects/:pid/versions/:versionId/ai-notes', asyncHandler(async (req, res) => {
  const body = parse(z.object({ audience: z.enum(['users', 'team']).default('users'), language: z.enum(['en', 'vi']).optional() }), req.body ?? {});
  ok(res, await ai.releaseNotes(callerId(req), idParam(req, 'pid'), idParam(req, 'versionId'), body));
}));

router.get('/projects/:pid/timeline', asyncHandler(async (req, res) => {
  ok(res, await planning.timeline(callerId(req), idParam(req, 'pid')));
}));
router.put('/projects/:pid/issues/:num/schedule', asyncHandler(async (req, res) => {
  const body = parse(z.object({ startDate: ymd.nullable(), dueDate: ymd.nullable(), version: z.number().int().min(0).optional() }), req.body);
  ok(res, await planning.scheduleIssue(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body));
}));

router.get('/projects/:pid/capacity', asyncHandler(async (req, res) => {
  const q = parse(z.object({ sprintId: id.optional(), from: ymd.optional(), to: ymd.optional() }), req.query);
  ok(res, await planning.capacity(callerId(req), idParam(req, 'pid'), q));
}));
router.put('/projects/:pid/capacity/:userId', asyncHandler(async (req, res) => {
  const { hoursPerDay } = parse(z.object({ hoursPerDay: z.number().min(0).max(24).nullable() }), req.body);
  await planning.setCapacity(callerId(req), idParam(req, 'pid'), idParam(req, 'userId'), hoursPerDay);
  ok(res, { updated: true });
}));
router.get('/workspaces/:wsId/time-off', asyncHandler(async (req, res) => {
  ok(res, await planning.listTimeOff(callerId(req), idParam(req, 'wsId')));
}));
router.post('/workspaces/:wsId/time-off', asyncHandler(async (req, res) => {
  const body = parse(z.object({ userId: id.optional(), startDate: ymd, endDate: ymd, note: z.string().max(200).nullable().optional() }), req.body);
  ok(res, await planning.addTimeOff(callerId(req), idParam(req, 'wsId'), body), 201);
}));
router.delete('/workspaces/:wsId/time-off/:offId', asyncHandler(async (req, res) => {
  await planning.deleteTimeOff(callerId(req), idParam(req, 'wsId'), idParam(req, 'offId'));
  ok(res, { deleted: true });
}));

router.get('/projects/:pid/issues/:num/worklogs', asyncHandler(async (req, res) => {
  ok(res, await planning.listWorklogs(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.post('/projects/:pid/issues/:num/worklogs', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    minutes: z.number().int().min(1).max(1440), startedAt: z.string().datetime({ offset: true }).optional(), note: z.string().max(1000).nullable().optional(),
    remaining: z.union([z.enum(['auto', 'keep']), z.number().int().min(0).max(100_000)]).optional(),
  }), req.body);
  ok(res, await planning.addWorklog(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/issues/:num/worklogs/:logId', asyncHandler(async (req, res) => {
  await planning.deleteWorklog(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'logId'));
  ok(res, { deleted: true });
}));
router.get('/projects/:pid/reports/time', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: ymd, to: ymd, userId: id.optional() }), req.query);
  ok(res, await planning.timeReport(callerId(req), idParam(req, 'pid'), q));
}));

const ruleAction = z.object({
  kind: z.enum(automation.ACTION_KINDS), statusId: id.optional(),
  assignee: z.union([id, z.literal('reporter'), z.null()]).optional(), priority: z.number().int().min(1).max(5).optional(),
  labelId: id.optional(), text: z.string().max(2000).optional(), title: z.string().max(255).optional(),
  to: z.array(z.union([z.enum(['assignee', 'reporter', 'watchers']), id])).max(20).optional(),
});
const ruleConfig = z.object({
  toStatusIds: z.array(id).max(50).optional(), fromStatusIds: z.array(id).max(50).optional(),
  fields: z.array(z.string().max(40)).max(20).optional(), jql: z.string().max(4000).optional(),
  conditions: z.array(z.object({ jql: z.string().min(1).max(4000) })).max(10).optional(),
  actions: z.array(ruleAction).min(1).max(10),
});
router.get('/projects/:pid/automation', asyncHandler(async (req, res) => {
  ok(res, await automation.listRules(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/automation', asyncHandler(async (req, res) => {
  const body = parse(z.object({ id: id.optional(), name: z.string().min(1).max(100), enabled: z.boolean().optional(), trigger: z.enum(automation.TRIGGERS), config: ruleConfig }), req.body);
  ok(res, await automation.saveRule(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/automation/:ruleId', asyncHandler(async (req, res) => {
  const { enabled } = parse(z.object({ enabled: z.boolean() }), req.body);
  await automation.setRuleEnabled(callerId(req), idParam(req, 'pid'), idParam(req, 'ruleId'), enabled);
  ok(res, { updated: true });
}));
router.delete('/projects/:pid/automation/:ruleId', asyncHandler(async (req, res) => {
  await automation.deleteRule(callerId(req), idParam(req, 'pid'), idParam(req, 'ruleId'));
  ok(res, { deleted: true });
}));
router.get('/projects/:pid/automation-logs', asyncHandler(async (req, res) => {
  const ruleId = req.query.ruleId ? parse(id, req.query.ruleId) : undefined;
  ok(res, await automation.ruleLogs(callerId(req), idParam(req, 'pid'), ruleId));
}));
router.post('/projects/:pid/automation/:ruleId/test', asyncHandler(async (req, res) => {
  const { number } = parse(z.object({ number: id }), req.body);
  ok(res, await automation.testRule(callerId(req), idParam(req, 'pid'), idParam(req, 'ruleId'), number));
}));

router.get('/me/notify-settings', asyncHandler(async (req, res) => {
  ok(res, await getNotifySettings(callerId(req)));
}));
router.put('/me/notify-settings', asyncHandler(async (req, res) => {
  const hour = z.number().int().min(0).max(23).nullable();
  const body = parse(z.object({ emailMode: z.enum(EMAIL_MODES).optional(), quietStart: hour.optional(), quietEnd: hour.optional() }), req.body);
  ok(res, await setNotifySettings(callerId(req), body));
}));

export default router;
