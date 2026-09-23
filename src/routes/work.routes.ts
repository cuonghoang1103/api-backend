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
import * as workspaces from '../services/work/workspaces.service.js';

registerWorkNotifications();
tests.registerTestingHooks();

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

export default router;
