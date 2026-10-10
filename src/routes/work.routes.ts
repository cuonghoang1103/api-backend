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
import { AppError, asyncHandler, BadRequestError, UnauthorizedError, NotFoundError } from '../middleware/errorHandler.js';
import { agentForbidden, agentRouteAllowed, clientPortalRouteAllowed, effectiveWorkspaceRole, isClientScoped, loadProjectAccess, portalOnlyWorkspaceIds } from '../services/work/permissions.js';
import { prisma } from '../config/database.js';
import {
  APPROVAL_MODES, APPROVAL_STATUSES, APPROVAL_TARGETS, COMMENT_VISIBILITY, HANDOFF_STATUSES, PORTAL_REQUEST_KINDS, LINK_TYPES, PAGE_STATUSES, PAGE_VISIBILITY, PRIORITY_MAX, PRIORITY_MIN,
  PROJECT_KINDS, PROJECT_ROLES, PROJECT_TEMPLATES, PROJECT_TYPES, PROJECT_VISIBILITY, STUDIO_MODULES, TEAM_ROLES, WORKSPACE_ROLES,
  type WorkspaceRole,
} from '../services/work/constants.js';
import * as issues from '../services/work/issues.service.js';
import { registerWorkNotifications } from '../services/work/notify.js';
import * as projects from '../services/work/projects.service.js';
import * as reports from '../services/work/reports.service.js';
import * as sprints from '../services/work/sprints.service.js';
import * as tests from '../services/work/tests.service.js';
import * as ai from '../services/work/ai.service.js';
import * as aiThreads from '../services/work/aiThreads.service.js';
import { myWork } from '../services/work/myWork.service.js';
import * as custom from '../services/work/customize.service.js';
import * as searchSvc from '../services/work/search.service.js';
import * as globalSearch from '../services/work/globalSearch.service.js';
import * as workspaces from '../services/work/workspaces.service.js';
import * as planning from '../services/work/planning.service.js';
import * as automation from '../services/work/automation.service.js';
import { EMAIL_MODES, getNotifySettings, setNotifySettings } from '../services/work/notify.js';
import { audit, auditProject, listAudit } from '../services/work/audit.js';
import * as github from '../services/work/github.service.js';
import * as projectTracking from '../services/work/projectTracking.service.js';
import * as chatHooks from '../services/work/chatHooks.service.js';
import * as gitlab from '../services/work/gitlab.service.js';
import * as editLock from '../services/work/editLock.service.js';
import * as exchange from '../services/work/exchange.service.js';
import * as share from '../services/work/share.service.js';
import * as apiTokens from '../services/work/apiTokens.service.js';
import * as calendar from '../services/work/calendar.service.js';
import * as trash from '../services/work/trash.service.js';
import * as onboarding from '../services/work/onboarding.service.js';
import * as teams from '../services/work/teams.service.js';
import * as stages from '../services/work/stages.service.js';
import { markdownToTiptap } from '../services/work/docMarkdown.js';
import * as branding from '../services/work/branding.service.js';
import * as approvals from '../services/work/approvals.service.js';
import * as handoffs from '../services/work/handoffs.service.js';
import * as pages from '../services/work/pages.service.js';
import * as portal from '../services/work/portal.service.js';
import { moveIssueToProject } from '../services/work/issueMove.service.js';
import { normalizeIssueRefBody, resolveParentId, typeIdFromKey } from '../services/work/issueRefs.js';
import portfolioRoutes from './work.portfolio.routes.js';
import governanceRoutes from './work.governance.routes.js';
import s4Routes, { s4PublicRoutes } from './work.s4.routes.js';
import deskRoutes from './work.desk.routes.js';
import s5cRoutes from './work.s5c.routes.js';
import s6Routes from './work.s6.routes.js';
import resourcesRoutes from './work.resources.routes.js';
import agentsRoutes from './work.agents.routes.js';
import mcpRoutes from '../mcp/server.js';
import agentsUiRoutes from './work.agentsUi.routes.js';
import fptTestRoutes from './work.fpt.routes.js';
import docs3aRoutes from './work.docs3a.routes.js';
import fptReportRoutes from './work.fptReports.routes.js';
import ctw3cRoutes from './work.ctw3c.routes.js';
import ctw5bRoutes from './work.ctw5b.routes.js'; // CTW đợt 5b K-1: tệp/voice note trong bình luận
import ctw4Routes from './work.ctw4.routes.js';
import ctw4bRoutes from './work.ctw4b.routes.js'; // CTW đợt 4b: SWR302 hồ sơ Wiegers + sáu liên kết
import ctwk3Routes from './work.ctwk3.routes.js'; // CTW K-3: kênh chat dự án
import ctwk3bRoutes from './work.ctwk3b.routes.js'; // CTW K-3b: đồng soạn thảo Docs + bình luận gắn đoạn văn
import uxdRoutes, { uxdPublicRoutes } from './work.uxd.routes.js'; // UX-D: ảnh xem trước link + ảnh bìa dự án
import contribRoutes from './work.contrib.routes.js'; // CTW Đóng góp: chỉ số thành viên + đánh giá chéo
import uxbRoutes from './work.uxb.routes.js'; // UX-B: CFD, cycle time, throughput, aging WIP, release burnup, KPI, dashboard overview
import uxcRoutes from './work.uxc.routes.js'; // UX-C: Team overview, mốc + baseline Timeline, kéo-thả WBS
import diagramRoutes from './work.diagrams.routes.js'; // CTW Diagram: Diagram Studio + AI vẽ sơ đồ
import ctw5Routes from './work.ctw5.routes.js'; // CTW đợt 5: hub giảng viên, lớp học, rubric/điểm, việc định kỳ
import ctwk2Routes from './work.ctwk2.routes.js'; // CTW K-2: họp ghi âm → phiên âm → AI biên bản, RSVP, điểm danh
import ctw6Routes from './work.ctw6.routes.js'; // CTW đợt 6: chất lượng (RV + TST-1)
import ctw6bRoutes, { ctw6bPublicRoutes } from './work.ctw6b.routes.js'; // CTW đợt 6b: SRS chuyên sâu + elicitation & stakeholder
import { TL_ACTIVITIES } from '../services/work/fptReports.js';
import { registerAgentEvents } from '../services/work/agentEvents.js';
import { startAgentJobs } from '../services/work/agents.service.js';

registerWorkNotifications();
tests.registerTestingHooks();
automation.registerAutomation();
chatHooks.registerChatHooks();
// CTW-28: hộp thư sự kiện của AI agent (bus ⇒ work_agent_inbox ⇒ SSE/webhook) + job nền lease 60 s / webhook 5 s.
// Job đặt ở đây thay vì cron.service.ts (ngoài phạm vi đợt A1–A8); vẫn tôn trọng CRON_DISABLED=1, tắt trong test.
registerAgentEvents();
startAgentJobs();

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });

/** Tên người cho dòng audit log. */
async function who(userId: number): Promise<string> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
  return u ? `@${u.username}` : `user #${userId}`;
}

/** Chạy zod; lỗi thành 400 với thông điệp đọc được. */
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      // CTW-4/15: trả ĐỦ mọi lỗi (data.errors) — không chỉ lỗi đầu tiên; trường lạ (.strict) nêu tên.
      // "Expected number, received nan" (z.coerce trên chữ) ⇒ câu người đọc được.
      const human = (m: string) => (/received nan/i.test(m) ? 'Expected a number (an id), got text' : m);
      const errors = err.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: human(i.message) }));
      const more = err.issues.length > 1 ? ` (+${err.issues.length - 1} more — see errors)` : '';
      throw new AppError(`${where}${human(first?.message ?? 'Invalid input')}${more}`, 400, 'VALIDATION_ERROR', { errors });
    }
    throw err;
  }
}

/**
 * CTW-27: PATCH/hành động mà sau khi parse không còn trường nào để đổi ⇒ 400 (thay vì 200 im lặng).
 * Nêu trường lạ nếu có (zod mặc định lột trường lạ — "status" thay vì "statusId" là lỗi hay gặp).
 */
function requireSomeChange(parsed: Record<string, unknown>, raw: unknown, allowed: string[]): void {
  if (Object.values(parsed).some((v) => v !== undefined)) return;
  const unknown = raw && typeof raw === 'object' ? Object.keys(raw as object).filter((k) => !allowed.includes(k) && k !== 'version') : [];
  const msg = unknown.length
    ? `Unknown field(s): ${unknown.join(', ')} — nothing to change. Allowed: ${allowed.join(', ')}`
    : `Nothing to change — send at least one of: ${allowed.join(', ')}`;
  throw new AppError(msg, 400, 'VALIDATION_ERROR', { errors: unknown.length ? unknown.map((k) => ({ path: k, message: 'Unknown field' })) : [{ path: '', message: 'Empty body' }] });
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

// UX-D: thẻ OG công khai (rate-limit riêng) — gắn trước /invites/:token để trần lượt gọi áp cả cho tuyến đó.
router.use(uxdPublicRoutes);

// Xem trước lời mời — trang /work/invite/:token hiện tên không gian cho người chưa đăng nhập.
router.get('/invites/:token', asyncHandler(async (req, res) => {
  ok(res, await workspaces.previewInvite(String(req.params.token)));
}));

// GitHub gọi vào đây — xác thực bằng chữ ký HMAC, không bằng phiên. Thân
// request là Buffer (index.ts gắn express.raw cho đúng đường này).
router.post('/github/webhook/:pid', asyncHandler(async (req, res) => {
  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body ?? {}));
  const event = typeof req.headers['x-github-event'] === 'string' ? req.headers['x-github-event'] : undefined;
  const sig = typeof req.headers['x-hub-signature-256'] === 'string' ? req.headers['x-hub-signature-256'] : undefined;
  ok(res, await github.handleWebhook(idParam(req, 'pid'), event, sig, raw));
}));

// GitLab gọi vào đây — xác thực bằng header X-Gitlab-Token (so thời gian hằng), không bằng phiên.
router.post('/gitlab/webhook/:pid', asyncHandler(async (req, res) => {
  const token = typeof req.headers['x-gitlab-token'] === 'string' ? req.headers['x-gitlab-token'] : undefined;
  let body: unknown = req.body;
  if (Buffer.isBuffer(body)) { try { body = JSON.parse(body.toString('utf8')); } catch { body = null; } }
  ok(res, await gitlab.handleWebhook(idParam(req, 'pid'), token, body));
}));

// Lịch đăng ký (.ics) — ứng dụng lịch không gửi được đăng nhập, nên bí mật nằm trong URL (calendar.service.ts).
router.get('/calendar/:file', asyncHandler(async (req, res) => {
  const file = String(req.params.file);
  if (!file.endsWith('.ics')) throw new NotFoundError('Calendar not found');
  const body = await calendar.renderCalendar(file.slice(0, -4));
  res.set({ 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=300', 'Content-Disposition': 'inline; filename="ct-work.ics"', 'X-Robots-Tag': 'noindex' });
  res.send(body);
}));

// Link công khai chỉ đọc — ai có link là xem được, không cần tài khoản.
router.get('/share/:token', asyncHandler(async (req, res) => {
  ok(res, await share.publicSummary(String(req.params.token)));
}));
router.get('/share/:token/issues', asyncHandler(async (req, res) => {
  const { section } = parse(z.object({ section: z.enum(['board', 'backlog']).default('board') }), req.query);
  ok(res, await share.publicIssues(String(req.params.token), section));
}));
router.get('/share/:token/issues/:num', asyncHandler(async (req, res) => {
  ok(res, await share.publicIssue(String(req.params.token), idParam(req, 'num')));
}));
router.get('/share/:token/reports', asyncHandler(async (req, res) => {
  ok(res, await share.publicReports(String(req.params.token)));
}));
router.get('/share/:token/tests', asyncHandler(async (req, res) => {
  ok(res, await share.publicTests(String(req.params.token)));
}));
// Đợt 6a: ảnh trong mô tả thẻ qua link công khai — chỉ ảnh của thẻ link đọc được (share.publicImage).
router.get('/share/:token/images/:iid', asyncHandler(async (req, res) => {
  const img = await share.publicImage(String(req.params.token), idParam(req, 'iid'));
  res.setHeader('Content-Type', img.mime);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `inline; filename="${img.fileName.replace(/[^\x20-\x7e]/g, '_')}"`);
  // Link có thể bị thu hồi ⇒ cache ngắn, không chia sẻ giữa người dùng.
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.send(img.buffer);
}));

// Đợt S4: tải tệp xuất trọn dự án qua link ký HMAC hạn 15 phút — không cần đăng nhập (đứng TRƯỚC authenticate).
router.use(s4PublicRoutes);
// CTW đợt 6b: khảo sát công khai + link khách xác nhận prototype (chỉ tin token, có trần lượt gọi).
router.use(ctw6bPublicRoutes);

// CTW-28 A9: MCP server (Streamable HTTP, không phiên) — tự xác thực bằng token ctw_ và tự chốt từng tool (src/mcp).
// Đứng TRƯỚC apiTokenAuth: MCP luôn POST nên chốt "POST = ghi" của REST dời xuống từng tool ghi (không nới).
router.use('/mcp', mcpRoutes);

// API token cá nhân (Bearer ctw_…) đi trước; không phải token thì JWT như cũ.
router.use(apiTokens.apiTokenAuth);
router.use((req, res, next) => (req.workToken ? next() : authenticate(req, res, next)));
// Khoá chỉnh sửa cá nhân: lệnh ghi trong dự án đang khoá ⇒ 423 (xem editLock.service.ts).
router.use(editLock.editLockGuard());

// Cổng khách (đợt S2b): khách bị cách ly (vai CLIENT ở dự án bật clientPortal) chỉ
// gọi được tuyến trong DANH SÁCH TRẮNG (permissions.ts clientPortalRouteAllowed).
// Một chốt cho MỌI tuyến /projects/:pid/** — tuyến thêm sau này mặc định bị chặn
// với khách. Tuyến được mở vẫn tự lọc dữ liệu trong service.
router.use('/projects/:pid', asyncHandler(async (req, _res, next) => {
  const pid = Number(req.params.pid);
  const uid = req.userId ?? req.user?.userId;
  if (!uid || !Number.isInteger(pid) || pid <= 0) return next();
  // CTW-28: token agent — (1) phạm vi dự án của token ⇒ 404 (không cho biết dự án tồn tại), (2) tuyến đối ngoại
  // (khách, tiền, xoá, cấu hình) ⇒ 403. Tầng hành động trong service chặn lần nữa (permissions.ts).
  if (req.agent) {
    if (req.agent.projectIds && !req.agent.projectIds.includes(pid)) throw new NotFoundError('Project not found');
    if (!agentRouteAllowed(req.method, req.path)) {
      throw await agentForbidden(req.agent.userId, 'use this part of a project (client, finance, settings, deletion or approvals)');
    }
  }
  const access = await loadProjectAccess(uid, pid);
  if (access && isClientScoped(access) && !clientPortalRouteAllowed(req.method, req.path)) {
    throw new AppError('This part of the project is not available in the client portal', 403, 'CLIENT_PORTAL_ONLY');
  }
  next();
}));

router.get('/projects/:pid/edit-lock', asyncHandler(async (req, res) => {
  ok(res, await editLock.getLock(callerId(req), idParam(req, 'pid')));
}));
router.put('/projects/:pid/edit-lock', asyncHandler(async (req, res) => {
  const { locked } = parse(z.object({ locked: z.boolean() }), req.body);
  ok(res, await editLock.setLock(callerId(req), idParam(req, 'pid'), locked));
}));

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
          id: true, name: true, slug: true, description: true, logoUrl: true,
          _count: { select: { projects: { where: { deletedAt: null } }, members: true } },
        },
      },
    },
  });
  const out = [];
  // MEMBER chỉ là khách cổng ⇒ GUEST (permissions.portalOnlyWorkspaceIds) — cùng luật với loadWorkspaceRole.
  const portalOnlyWs = await portalOnlyWorkspaceIds(userId);
  for (const r of rows) {
    let projectCount = r.workspace._count.projects;
    let memberCount = r.workspace._count.members;
    const role = effectiveWorkspaceRole(r.role as WorkspaceRole, portalOnlyWs.has(r.workspace.id));
    // Khách của cổng (S2b): không lộ quy mô không gian — chỉ đếm những gì họ thấy được.
    const only = role === 'GUEST' ? await workspaces.guestPeopleScope(userId, r.workspace.id, role) : null;
    if (only) {
      memberCount = only.length;
      projectCount = (await projects.listProjects(userId, r.workspace.id)).length;
    }
    out.push({
      id: r.workspace.id, name: r.workspace.name, slug: r.workspace.slug, description: r.workspace.description, logoUrl: r.workspace.logoUrl,
      role, projectCount, memberCount,
    });
  }
  ok(res, out);
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
  ok(res, await workspaces.updateWorkspace(callerId(req), idParam(req, 'wsId'), parse(workspaceBody.partial().extend({ logoUrl: z.null().optional() }), req.body)));
}));

// CTW-23: logo không gian (ảnh công khai trên R2, ≤ 2 MB) — presign ⇒ PUT thẳng lên R2 ⇒ complete.
const brandPresign = z.object({ contentType: z.string().min(1).max(100), size: z.number().int().min(1) });
router.post('/workspaces/:wsId/logo/presign', asyncHandler(async (req, res) => {
  ok(res, await branding.presignWorkspaceLogo(callerId(req), idParam(req, 'wsId'), parse(brandPresign, req.body)));
}));
router.post('/workspaces/:wsId/logo/complete', asyncHandler(async (req, res) => {
  ok(res, await branding.completeWorkspaceLogo(callerId(req), idParam(req, 'wsId'), parse(z.object({ key: z.string().min(1).max(500) }), req.body)));
}));
router.delete('/workspaces/:wsId/logo', asyncHandler(async (req, res) => {
  ok(res, await branding.removeWorkspaceLogo(callerId(req), idParam(req, 'wsId')));
}));

router.delete('/workspaces/:wsId', asyncHandler(async (req, res) => {
  const { confirmName } = parse(z.object({ confirmName: z.string() }), req.body);
  await workspaces.deleteWorkspace(callerId(req), idParam(req, 'wsId'), confirmName);
  await audit({ workspaceId: idParam(req, 'wsId'), actorId: callerId(req), action: 'workspace.delete', targetType: 'workspace', targetId: idParam(req, 'wsId'), summary: 'Deleted the workspace (can be restored by the owner)' });
  ok(res, { deleted: true });
}));

router.get('/workspaces/:wsId/members', asyncHandler(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  ok(res, await workspaces.listMembers(callerId(req), idParam(req, 'wsId'), q));
}));

router.patch('/workspaces/:wsId/members/:userId', asyncHandler(async (req, res) => {
  const { role } = parse(z.object({ role: z.enum(WORKSPACE_ROLES) }), req.body);
  await workspaces.updateMemberRole(callerId(req), idParam(req, 'wsId'), idParam(req, 'userId'), role);
  await audit({ workspaceId: idParam(req, 'wsId'), actorId: callerId(req), action: 'workspace.member_role', targetType: 'user', targetId: idParam(req, 'userId'), summary: `Changed ${await who(idParam(req, 'userId'))}'s workspace role to ${role}` });
  ok(res, { updated: true });
}));

router.delete('/workspaces/:wsId/members/:userId', asyncHandler(async (req, res) => {
  await workspaces.removeMember(callerId(req), idParam(req, 'wsId'), idParam(req, 'userId'));
  await audit({ workspaceId: idParam(req, 'wsId'), actorId: callerId(req), action: 'workspace.member_remove', targetType: 'user', targetId: idParam(req, 'userId'), summary: `Removed ${await who(idParam(req, 'userId'))} from the workspace` });
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
    firstSprint: z.boolean().optional(),
    // Lớp studio: loại dự án ⇒ mô-đun mặc định; `modules` ghi đè từng mô-đun.
    kind: z.enum(PROJECT_KINDS).optional(),
    modules: z.record(z.enum(STUDIO_MODULES), z.boolean()).optional(),
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
    // CTW-23: emoji (một biểu tượng ngắn) + màu #rrggbb; ảnh đổi qua /avatar/*, ở đây chỉ gỡ (null).
    iconEmoji: z.string().max(16).nullable().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must look like #2563eb').nullable().optional(),
    avatarUrl: z.null().optional(),
  }), req.body);
  if (body.avatarUrl === null) await branding.removeProjectAvatar(callerId(req), idParam(req, 'pid'));
  const { avatarUrl: _drop, ...rest } = body;
  ok(res, await projects.updateProject(callerId(req), idParam(req, 'pid'), rest));
}));

// CTW-23: ảnh dự án — presign ⇒ PUT thẳng lên R2 ⇒ complete (máy chủ HEAD kiểm loại + cỡ).
router.post('/projects/:pid/avatar/presign', asyncHandler(async (req, res) => {
  ok(res, await branding.presignProjectAvatar(callerId(req), idParam(req, 'pid'), parse(brandPresign, req.body)));
}));
router.post('/projects/:pid/avatar/complete', asyncHandler(async (req, res) => {
  ok(res, await branding.completeProjectAvatar(callerId(req), idParam(req, 'pid'), parse(z.object({ key: z.string().min(1).max(500) }), req.body)));
}));
router.delete('/projects/:pid/avatar', asyncHandler(async (req, res) => {
  ok(res, await branding.removeProjectAvatar(callerId(req), idParam(req, 'pid')));
}));

router.post('/projects/:pid/archive', asyncHandler(async (req, res) => {
  const { archived } = parse(z.object({ archived: z.boolean() }), req.body);
  await projects.setProjectArchived(callerId(req), idParam(req, 'pid'), archived);
  await auditProject(idParam(req, 'pid'), { actorId: callerId(req), action: archived ? 'project.archive' : 'project.unarchive', targetType: 'project', targetId: idParam(req, 'pid'), summary: archived ? 'Archived the project' : 'Unarchived the project' });
  ok(res, { archived });
}));

router.delete('/projects/:pid', asyncHandler(async (req, res) => {
  const { confirmKey } = parse(z.object({ confirmKey: z.string() }), req.body);
  await projects.deleteProject(callerId(req), idParam(req, 'pid'), confirmKey);
  await auditProject(idParam(req, 'pid'), { actorId: callerId(req), action: 'project.delete', targetType: 'project', targetId: idParam(req, 'pid'), summary: `Deleted project ${confirmKey.toUpperCase()} (restorable from workspace trash)` });
  ok(res, { deleted: true });
}));

router.put('/projects/:pid/members/:userId', asyncHandler(async (req, res) => {
  const { role } = parse(z.object({ role: z.enum(PROJECT_ROLES) }), req.body);
  await projects.setProjectMember(callerId(req), idParam(req, 'pid'), idParam(req, 'userId'), role);
  await auditProject(idParam(req, 'pid'), { actorId: callerId(req), action: 'project.member_role', targetType: 'user', targetId: idParam(req, 'userId'), summary: `Set ${await who(idParam(req, 'userId'))}'s project role to ${role}` });
  ok(res, { updated: true });
}));

router.delete('/projects/:pid/members/:userId', asyncHandler(async (req, res) => {
  await projects.removeProjectMember(callerId(req), idParam(req, 'pid'), idParam(req, 'userId'));
  await auditProject(idParam(req, 'pid'), { actorId: callerId(req), action: 'project.member_remove', targetType: 'user', targetId: idParam(req, 'userId'), summary: `Removed ${await who(idParam(req, 'userId'))} from the project` });
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
    status: idList, type: idList, assignee: idList, label: idList, team: idList,
    stage: id.optional(),
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
    teamIds: q.team, stageId: q.stage,
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
  // Lớp studio — chỉ ghi được khi mô-đun teams/stages bật (issueChange.ts kiểm, 403 MODULE_DISABLED).
  teamId: id.nullable(),
  stageId: id.nullable(),
  statusId: id,
  // Đợt S6: gắn / gỡ nhãn "AI-assisted" bằng tay.
  aiAssisted: z.boolean(),
  labelIds: z.array(id).max(30),
  componentIds: z.array(id).max(30),
};

/** CTW-15: cha theo số thẻ / khoá thẻ (ngoài parentId nội bộ) + loại thẻ theo khoá — xem issueRefs.ts. */
const issueRefFields = {
  parentNumber: id.nullable(),
  parentKey: z.string().max(32).nullable(),
  typeKey: z.string().min(1).max(16),
};

/** Gộp parentId/parentNumber/parentKey + typeKey ⇒ id nội bộ (lỗi 400 nêu đúng trường). */
async function resolveIssueRefs<T extends { parentId?: number | null; parentNumber?: number | null; parentKey?: string | null; typeKey?: string; typeId?: number }>(
  pid: number, body: T,
): Promise<Omit<T, 'parentNumber' | 'parentKey' | 'typeKey'>> {
  const { parentNumber, parentKey, typeKey, ...rest } = body;
  const parentId = await resolveParentId(pid, { parentId: body.parentId, parentNumber, parentKey });
  const out = { ...rest } as Omit<T, 'parentNumber' | 'parentKey' | 'typeKey'> & { parentId?: number | null; typeId?: number };
  if (parentId !== undefined) out.parentId = parentId;
  if (typeKey !== undefined) {
    const tid = await typeIdFromKey(pid, typeKey);
    if (body.typeId !== undefined && body.typeId !== tid) throw new BadRequestError('typeId and typeKey point to different issue types — send only one of them', 'WORK_BAD_TYPE');
    out.typeId = tid;
  }
  return out;
}

router.post('/projects/:pid/issues', asyncHandler(async (req, res) => {
  const parsed = parse(
    z.object({ ...issueFields, ...issueRefFields, typeId: id }).partial().required({ title: true })
      .refine((b) => b.typeId !== undefined || b.typeKey !== undefined, { message: 'Required — send typeId (number) or typeKey (e.g. "STORY")', path: ['typeId'] }),
    normalizeIssueRefBody(req.body),
  );
  const body = await resolveIssueRefs(idParam(req, 'pid'), parsed);
  const issue = await issues.createIssueAs(callerId(req), idParam(req, 'pid'), body as issues.CreateIssueBody);
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), issue.number), 201);
}));

router.get('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

router.patch('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  const raw = normalizeIssueRefBody(req.body);
  const { version, typeKey, ...parsed } = parse(z.object({ ...issueFields, ...issueRefFields, version: z.number().int().min(0).optional() }).partial(), raw);
  // CTW-27 (rà endpoint tương tự): thân rỗng / chỉ có trường lạ (vd. "status") ⇒ zod lột sạch ⇒ trước đây 200 mà không đổi gì.
  requireSomeChange({ ...parsed, typeKey }, raw, [...Object.keys(issueFields), 'parentNumber', 'parentKey']);
  // Đổi loại thẻ không đi qua PATCH (có luồng riêng) — typeKey ở đây chỉ để báo lỗi rõ thay vì lặng lẽ bỏ.
  if (typeKey !== undefined) throw new BadRequestError('Changing the issue type is not supported here — typeKey is only accepted when creating an issue', 'WORK_BAD_TYPE');
  const body = await resolveIssueRefs(idParam(req, 'pid'), parsed);
  await issues.updateIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body, version);
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

router.post('/projects/:pid/issues/:num/move', asyncHandler(async (req, res) => {
  // CTW-27: thân rỗng / statusId undefined (JSON bỏ undefined ⇒ {}) trước đây trả 200 mà không đổi gì ⇒
  // client tưởng đã chuyển trạng thái. Bắt buộc ít nhất một trường di chuyển; trường lạ (vd. "status") ⇒ 400 nêu tên.
  const body = parse(z.object({
    statusId: id.optional(),
    sprintId: id.nullable().optional(),
    beforeIssueId: id.nullable().optional(),
    afterIssueId: id.nullable().optional(),
    version: z.number().int().min(0).optional(),
  }).strict().refine(
    (b) => b.statusId !== undefined || b.sprintId !== undefined || b.beforeIssueId !== undefined || b.afterIssueId !== undefined,
    { message: 'Nothing to move: send statusId (number), sprintId (number or null) and/or beforeIssueId/afterIssueId', path: ['statusId'] },
  ), req.body);
  const { version, ...rest } = body;
  const moved = await issues.moveIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { ...rest, expectedVersion: version });
  ok(res, moved);
}));

router.delete('/projects/:pid/issues/:num', asyncHandler(async (req, res) => {
  await issues.deleteIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'));
  await auditProject(idParam(req, 'pid'), { actorId: callerId(req), action: 'issue.delete', targetType: 'issue', summary: `Moved issue #${idParam(req, 'num')} to trash` });
  ok(res, { deleted: true });
}));

// Nhân bản thẻ ("Clone" trong menu ⋯) — trả chi tiết thẻ MỚI.
router.post('/projects/:pid/issues/:num/clone', asyncHandler(async (req, res) => {
  const issue = await issues.cloneIssueAs(callerId(req), idParam(req, 'pid'), idParam(req, 'num'));
  ok(res, await issues.getIssueDetail(callerId(req), idParam(req, 'pid'), issue.number), 201);
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

// CTW-11: cờ "Bị chặn" — PUT cắm (bắt buộc lý do), DELETE gỡ.
router.put('/projects/:pid/issues/:num/flag', asyncHandler(async (req, res) => {
  const body = parse(z.object({ reason: z.string().min(1).max(450), raidNumber: id.nullable().optional() }).strict(), req.body);
  ok(res, await issues.setIssueFlag(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { flagged: true, ...body }));
}));
router.delete('/projects/:pid/issues/:num/flag', asyncHandler(async (req, res) => {
  ok(res, await issues.setIssueFlag(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { flagged: false }));
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
  // visibility (cổng khách S2b): INTERNAL = ghi chú nội bộ (mặc định) · PUBLIC = trả lời khách.
  // K-1 (đợt 5b): parentId = trả lời theo luồng · attachmentIds = tệp/voice note đã tải từ ô bình luận.
  const { bodyJson, visibility, parentId, attachmentIds } = parse(z.object({
    bodyJson: tiptapDoc, visibility: z.enum(COMMENT_VISIBILITY).optional(),
    parentId: id.nullable().optional(), attachmentIds: z.array(id).max(10).optional(),
  }), req.body);
  ok(res, await issues.addComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), bodyJson, 'USER', visibility, { parentId, attachmentIds }), 201);
}));
router.patch('/projects/:pid/issues/:num/comments/:cid', asyncHandler(async (req, res) => {
  const { bodyJson } = parse(z.object({ bodyJson: tiptapDoc }), req.body);
  ok(res, await issues.editComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'), bodyJson));
}));
router.post('/projects/:pid/issues/:num/comments/:cid/report', asyncHandler(async (req, res) => {
  const body = parse(z.object({ reason: z.enum(issues.COMMENT_REPORT_REASONS), details: z.string().max(1000).nullable().optional() }), req.body);
  ok(res, await issues.reportComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'), body), 201);
}));
router.delete('/projects/:pid/issues/:num/comments/:cid', asyncHandler(async (req, res) => {
  await issues.deleteComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'));
  ok(res, { deleted: true });
}));

router.post('/projects/:pid/issues/:num/attachments/presign', asyncHandler(async (req, res) => {
  const body = parse(z.object({ fileName: z.string().min(1).max(255), contentType: z.string().max(100), size: z.number().int().positive(), forComment: z.boolean().optional() }), req.body);
  ok(res, await issues.presignAttachment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body));
}));
router.post('/projects/:pid/issues/:num/attachments/complete', asyncHandler(async (req, res) => {
  const body = parse(z.object({ key: z.string().min(1).max(500), fileName: z.string().min(1).max(255), runId: id.nullable().optional(), forComment: z.boolean().optional() }), req.body);
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
      // CTW-15: cha theo số thẻ / khoá thẻ.
      parentNumber: id.nullable().optional(),
      parentKey: z.string().max(32).nullable().optional(),
      addLabelIds: z.array(id).max(30).optional(),
      delete: z.literal(true).optional(),
    }).refine((p) => Object.keys(p).length > 0, 'Nothing to change'),
  }), { ...req.body, patch: normalizeIssueRefBody(req.body?.patch) });
  const { parentNumber, parentKey, ...patch } = body.patch;
  const parentId = await resolveParentId(idParam(req, 'pid'), { parentId: patch.parentId, parentNumber, parentKey });
  if (parentId !== undefined) patch.parentId = parentId;
  ok(res, await sprints.bulkUpdate(callerId(req), idParam(req, 'pid'), body.numbers, patch));
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
    threadId: id.nullable().optional(),
  }), req.body);
  ok(res, await ai.chat(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/quick', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    task: z.enum(['write_story', 'split', 'generate_tests', 'improve_bug', 'summarize', 'review_story', 'meeting_notes', 'req_review', 'team_health', 'draft_srs', 'summarize_page']),
    issueNumber: id.nullable().optional(),
    pageNumber: id.nullable().optional(), // đợt S5c: summarize_page
    text: z.string().max(20000).nullable().optional(),
    threadId: id.nullable().optional(),
    label: z.string().max(120).nullable().optional(),
  }), req.body);
  ok(res, await ai.quick(callerId(req), idParam(req, 'pid'), body));
}));

// ─── Hội thoại AI lưu ở server, dùng chung trong dự án ───
router.get('/projects/:pid/ai/threads', asyncHandler(async (req, res) => {
  const q = parse(z.object({ scope: z.enum(['all', 'mine']).optional(), q: z.string().max(200).optional() }), req.query);
  ok(res, await aiThreads.listThreads(callerId(req), idParam(req, 'pid'), q));
}));
// Luyện bảo vệ: tạo hội thoại chế độ DEFENSE, AI (hội đồng) hỏi câu đầu tiên.
router.post('/projects/:pid/ai/defense', asyncHandler(async (req, res) => {
  const body = parse(z.object({ focus: z.string().max(8).nullable().optional(), visibility: z.enum(['PROJECT', 'PRIVATE']).optional() }), req.body ?? {});
  ok(res, await ai.startDefense(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/threads', asyncHandler(async (req, res) => {
  const body = parse(z.object({ title: z.string().min(1).max(2000), issueNumber: id.nullable().optional(), visibility: z.enum(['PROJECT', 'PRIVATE']).optional() }), req.body);
  ok(res, await aiThreads.createThread(callerId(req), idParam(req, 'pid'), body));
}));
router.get('/projects/:pid/ai/threads/:tid', asyncHandler(async (req, res) => {
  ok(res, await aiThreads.getThread(callerId(req), idParam(req, 'pid'), idParam(req, 'tid')));
}));
router.patch('/projects/:pid/ai/threads/:tid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ title: z.string().min(1).max(160).optional(), visibility: z.enum(['PROJECT', 'PRIVATE']).optional() }), req.body);
  ok(res, await aiThreads.updateThread(callerId(req), idParam(req, 'pid'), idParam(req, 'tid'), body));
}));
router.delete('/projects/:pid/ai/threads/:tid', asyncHandler(async (req, res) => {
  ok(res, await aiThreads.deleteThread(callerId(req), idParam(req, 'pid'), idParam(req, 'tid')));
}));
router.post('/projects/:pid/ai/messages/:mid/retry', asyncHandler(async (req, res) => {
  ok(res, await ai.chat(callerId(req), idParam(req, 'pid'), { message: '', retryMessageId: idParam(req, 'mid') }));
}));
router.post('/projects/:pid/ai/messages/:mid/actions/:idx/apply', asyncHandler(async (req, res) => {
  const idx = parse(z.coerce.number().int().min(0).max(49), req.params.idx);
  const { action } = parse(z.object({ action: ai.actionSchema.optional() }), req.body ?? {});
  ok(res, await ai.applyStoredAction(callerId(req), idParam(req, 'pid'), idParam(req, 'mid'), idx, action));
}));
router.patch('/projects/:pid/ai/messages/:mid/actions/:idx', asyncHandler(async (req, res) => {
  const idx = parse(z.coerce.number().int().min(0).max(49), req.params.idx);
  const { status } = parse(z.object({ status: z.enum(['dismissed', 'pending']) }), req.body);
  ok(res, await ai.setStoredActionStatus(callerId(req), idParam(req, 'pid'), idParam(req, 'mid'), idx, status));
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
router.post('/projects/:pid/ai/plan-sprint', asyncHandler(async (req, res) => {
  // CTW-10: test case + ticket desk mặc định không vào backlog lập kế hoạch (bật lại bằng hai cờ).
  const body = parse(z.object({ sprintId: id, explain: z.boolean().optional(), language: z.enum(['en', 'vi']).optional(), includeTestCases: z.boolean().optional(), includeDeskTickets: z.boolean().optional() }), req.body);
  ok(res, await ai.planSprint(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/retro', asyncHandler(async (req, res) => {
  const body = parse(z.object({ sprintId: id, notes: z.string().max(20_000).nullable().optional(), language: z.enum(['en', 'vi']).optional() }), req.body);
  ok(res, await ai.retro(callerId(req), idParam(req, 'pid'), body));
}));
router.post('/projects/:pid/ai/daily-brief', asyncHandler(async (req, res) => {
  const body = parse(z.object({ language: z.enum(['en', 'vi']).optional() }), req.body ?? {});
  ok(res, await ai.dailyBrief(callerId(req), idParam(req, 'pid'), body));
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
    transitions: z.array(z.object({
      from: id.nullable(), to: id,
      // Luật của luồng chuyển (đợt S1): cần phê duyệt / chỉ bộ phận X.
      rules: z.object({ requireApproval: z.boolean().optional(), teamIds: z.array(id).max(20).optional() }).nullable().optional(),
    })).max(500).optional(),
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
  versionId: id.nullable().optional(), // UX-B: widget release_burnup
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
    activity: z.enum(TL_ACTIVITIES).nullable().optional(), workProduct: z.string().max(120).nullable().optional(), // CTW đợt 4 (A24)
  }), req.body);
  ok(res, await planning.addWorklog(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body), 201);
}));
router.delete('/projects/:pid/issues/:num/worklogs/:logId', asyncHandler(async (req, res) => {
  await planning.deleteWorklog(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'logId'));
  ok(res, { deleted: true });
}));
router.get('/projects/:pid/reports/time', asyncHandler(async (req, res) => {
  // A12: principal=HUMAN|AGENT|ALL tách giờ người / giờ agent (mặc định ALL — hành vi cũ).
  const q = parse(z.object({ from: ymd, to: ymd, userId: id.optional(), principal: z.enum(['HUMAN', 'AGENT', 'ALL']).optional() }), req.query);
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
  // CTW-7: mặc định CHẠY THỬ (không ghi gì lên thẻ); `execute: true` mới chạy thật.
  const { number, execute } = parse(z.object({ number: id, execute: z.boolean().optional() }), req.body);
  ok(res, await automation.testRule(callerId(req), idParam(req, 'pid'), idParam(req, 'ruleId'), number, { execute }));
}));

router.get('/me/notify-settings', asyncHandler(async (req, res) => {
  ok(res, await getNotifySettings(callerId(req)));
}));
router.put('/me/notify-settings', asyncHandler(async (req, res) => {
  const hour = z.number().int().min(0).max(23).nullable();
  const body = parse(z.object({ emailMode: z.enum(EMAIL_MODES).optional(), quietStart: hour.optional(), quietEnd: hour.optional() }), req.body);
  ok(res, await setNotifySettings(callerId(req), body));
}));

// ═══ Tích hợp, quản trị, chia sẻ (đợt 7) ═══════════════════════════

// ─── Thông báo ra kênh chat (Discord / Slack / Google Chat) — chỉ ADMIN dự án ───
router.get('/projects/:pid/chat-hooks', asyncHandler(async (req, res) => {
  ok(res, await chatHooks.listHooks(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/chat-hooks', asyncHandler(async (req, res) => {
  const body = parse(z.object({ kind: z.enum(chatHooks.CHAT_KINDS), name: z.string().max(80).optional(), url: z.string().min(10).max(600), events: z.array(z.enum(chatHooks.CHAT_EVENTS)).max(10).optional() }), req.body);
  ok(res, await chatHooks.createHook(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/chat-hooks/:hid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().max(80).optional(), url: z.string().max(600).optional(), events: z.array(z.enum(chatHooks.CHAT_EVENTS)).max(10).optional(), enabled: z.boolean().optional() }), req.body);
  ok(res, await chatHooks.updateHook(callerId(req), idParam(req, 'pid'), idParam(req, 'hid'), body));
}));
router.delete('/projects/:pid/chat-hooks/:hid', asyncHandler(async (req, res) => {
  ok(res, await chatHooks.deleteHook(callerId(req), idParam(req, 'pid'), idParam(req, 'hid')));
}));
router.post('/projects/:pid/chat-hooks/:hid/test', asyncHandler(async (req, res) => {
  ok(res, await chatHooks.testHook(callerId(req), idParam(req, 'pid'), idParam(req, 'hid')));
}));

router.get('/projects/:pid/github', asyncHandler(async (req, res) => {
  ok(res, await github.getConnection(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/github', asyncHandler(async (req, res) => {
  const { rotate } = parse(z.object({ rotate: z.boolean().optional() }), req.body ?? {});
  ok(res, await github.connect(callerId(req), idParam(req, 'pid'), rotate ?? false), 201);
}));
router.patch('/projects/:pid/github', asyncHandler(async (req, res) => {
  const body = parse(z.object({ repoFullName: z.string().max(200).nullable().optional(), prOpenedStatusId: id.nullable().optional(), prMergedStatusId: id.nullable().optional() }), req.body);
  ok(res, await github.updateConnection(callerId(req), idParam(req, 'pid'), body));
}));
router.delete('/projects/:pid/github', asyncHandler(async (req, res) => {
  await github.disconnect(callerId(req), idParam(req, 'pid'));
  ok(res, { disconnected: true });
}));

router.get('/projects/:pid/gitlab', asyncHandler(async (req, res) => {
  ok(res, await gitlab.getConnection(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/gitlab', asyncHandler(async (req, res) => {
  const { rotate } = parse(z.object({ rotate: z.boolean().optional() }), req.body ?? {});
  ok(res, await gitlab.connect(callerId(req), idParam(req, 'pid'), rotate ?? false), 201);
}));
router.patch('/projects/:pid/gitlab', asyncHandler(async (req, res) => {
  const body = parse(z.object({ repoPath: z.string().max(200).nullable().optional(), mrOpenedStatusId: id.nullable().optional(), mrMergedStatusId: id.nullable().optional() }), req.body);
  ok(res, await gitlab.updateConnection(callerId(req), idParam(req, 'pid'), body));
}));
router.delete('/projects/:pid/gitlab', asyncHandler(async (req, res) => {
  await gitlab.disconnect(callerId(req), idParam(req, 'pid'));
  ok(res, { disconnected: true });
}));
router.get('/projects/:pid/issues/:num/dev', asyncHandler(async (req, res) => {
  ok(res, await github.devActivity(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));

// Project Tracking theo mẫu SWP391 (sheet Product + Summary theo PIC); đợt 3B: ?variant=SEP490|SWP391_T1|ISSUES
router.get('/projects/:pid/export/project-tracking', asyncHandler(async (req, res) => {
  const q = parse(z.object({ variant: z.enum(projectTracking.TRACKING_VARIANTS).default('SWP391') }), req.query);
  const out = await projectTracking.projectTrackingXlsx(callerId(req), idParam(req, 'pid'), q.variant);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file}.xlsx"`);
  res.send(out.buffer);
}));
router.get('/projects/:pid/export', asyncHandler(async (req, res) => {
  const q = parse(z.object({ format: z.enum(['csv', 'xlsx', 'pdf']).default('csv'), jql: z.string().max(4000).default('') }), req.query);
  const data = await exchange.exportRows(callerId(req), idParam(req, 'pid'), q.jql);
  const stamp = new Date().toISOString().slice(0, 10);
  const file = `${data.key}-issues-${stamp}`;
  if (q.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.csv"`);
    res.send(exchange.toCsv(data.rows));
  } else if (q.format === 'xlsx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.xlsx"`);
    res.send(exchange.toXlsx(data.rows, data.key));
  } else {
    const pdf = await exchange.toPdf(`${data.name} (${data.key})`, `${data.rows.length} issues · ${q.jql || 'all issues'} · exported ${stamp}`, data.rows);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.pdf"`);
    res.send(pdf);
  }
}));
// Báo cáo một test cycle (SWT301: nộp kèm Excel/PDF): tóm tắt + từng lần chạy.
router.get('/projects/:pid/test-cycles/:cycleId/export', asyncHandler(async (req, res) => {
  const { format } = parse(z.object({ format: z.enum(['csv', 'xlsx', 'pdf']).default('xlsx') }), req.query);
  const pid = idParam(req, 'pid');
  const c = await tests.getCycle(callerId(req), pid, idParam(req, 'cycleId'));
  const cfg = await projects.getProjectConfig(callerId(req), pid);
  const name = (u: { displayName: string | null; fullName: string | null; username: string } | null) => (u ? u.displayName || u.fullName || u.username : '');
  const assignee = (idv: number | null) => name(cfg.members.find((m) => m.id === idv) ?? null);
  const headers = ['Test', 'Title', 'Priority', 'Status', 'Assignee', 'Executed by', 'Executed at', 'Steps', 'Defects', 'Comment'];
  const pri = ['', 'Highest', 'High', 'Medium', 'Low', 'Lowest'];
  const rows = c.runs.map((r) => [
    `${cfg.key}-${r.test.number}`, r.test.title, pri[r.test.priority] ?? '', r.status, assignee(r.assigneeId), name(r.executedBy),
    r.executedAt ? new Date(r.executedAt).toISOString().replace('T', ' ').slice(0, 16) : '', r.stepCount,
    r.defects.map((d) => `${cfg.key}-${d.number}`).join(', '), r.comment ?? '',
  ]);
  const summary = [
    ['Cycle', c.name], ['Environment', c.environment ?? ''], ['Build', c.build ?? ''], ['State', c.state],
    ['Tests', String(c.total)], ['Executed', `${c.executed} / ${c.total}`],
    ['Pass rate', c.passRate === null ? '—' : `${c.passRate}%`],
    ['Results', Object.entries(c.counts).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(' · ')],
  ];
  const file = `${cfg.key}-test-cycle-${c.id}-${new Date().toISOString().slice(0, 10)}`;
  if (format === 'xlsx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.xlsx"`);
    res.send(exchange.xlsxTable(headers, rows, 'Test cycle', [12, 44, 10, 12, 18, 18, 17, 7, 16, 40], summary));
  } else if (format === 'pdf') {
    const cols = [{ label: 'Test', w: 58 }, { label: 'Title', w: 250 }, { label: 'Status', w: 64 }, { label: 'Executed by', w: 90 }, { label: 'Executed at', w: 86 }, { label: 'Defects', w: 80 }, { label: 'Comment', w: 142 }];
    const pdf = await exchange.pdfTable(
      `Test cycle report — ${c.name}`, `${cfg.name} (${cfg.key}) · exported ${new Date().toISOString().slice(0, 10)}`,
      cols, rows.map((r) => [r[0], r[1], r[3], r[5], r[6], r[8], r[9]].map(String)), summary.map(([k, v]) => `${k}: ${v}`), 'This cycle has no tests.',
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.pdf"`);
    res.send(pdf);
  } else {
    const esc = (v: unknown) => { let x = String(v ?? ''); if (/^[=+\-@]/.test(x)) x = `'${x}`; return /[",\n\r]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x; };
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${file}.csv"`);
    res.send(`﻿${[...summary.map((l) => l.map(esc).join(',')), '', headers.join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n')}\r\n`);
  }
}));
router.post('/projects/:pid/import', asyncHandler(async (req, res) => {
  const body = parse(z.object({ csv: z.string().min(1).max(8_000_000), dryRun: z.boolean().default(true) }), req.body);
  ok(res, await exchange.importCsv(callerId(req), idParam(req, 'pid'), body));
}));

router.get('/workspaces/:wsId/audit', asyncHandler(async (req, res) => {
  const q = parse(z.object({ projectId: id.optional(), action: z.string().max(48).optional(), before: id.optional(), limit: z.coerce.number().int().min(1).max(200).optional() }), req.query);
  ok(res, await listAudit(callerId(req), idParam(req, 'wsId'), q));
}));

router.get('/projects/:pid/trash', asyncHandler(async (req, res) => {
  ok(res, await trash.listDeletedIssues(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/trash/:num/restore', asyncHandler(async (req, res) => {
  await trash.restoreIssue(callerId(req), idParam(req, 'pid'), idParam(req, 'num'));
  ok(res, { restored: true });
}));
router.delete('/projects/:pid/trash/:num', asyncHandler(async (req, res) => {
  await trash.purgeIssue(callerId(req), idParam(req, 'pid'), idParam(req, 'num'));
  ok(res, { purged: true });
}));
router.get('/workspaces/:wsId/trash', asyncHandler(async (req, res) => {
  ok(res, await trash.listDeletedProjects(callerId(req), idParam(req, 'wsId')));
}));
router.post('/workspaces/:wsId/trash/projects/:pid/restore', asyncHandler(async (req, res) => {
  await trash.restoreProject(callerId(req), idParam(req, 'wsId'), idParam(req, 'pid'));
  ok(res, { restored: true });
}));
router.get('/me/trash/workspaces', asyncHandler(async (req, res) => {
  ok(res, await trash.listDeletedWorkspaces(callerId(req)));
}));
router.post('/me/trash/workspaces/:wsId/restore', asyncHandler(async (req, res) => {
  await trash.restoreWorkspace(callerId(req), idParam(req, 'wsId'));
  ok(res, { restored: true });
}));

router.get('/projects/:pid/share-links', asyncHandler(async (req, res) => {
  ok(res, await share.listLinks(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/share-links', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    label: z.string().max(100).nullable().optional(),
    options: z.object({ board: z.boolean(), backlog: z.boolean(), reports: z.boolean(), tests: z.boolean(), descriptions: z.boolean() }).partial().optional(),
    expiresInDays: z.number().int().min(1).max(365).nullable().optional(),
  }), req.body);
  ok(res, await share.createLink(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.delete('/projects/:pid/share-links/:linkId', asyncHandler(async (req, res) => {
  await share.revokeLink(callerId(req), idParam(req, 'pid'), idParam(req, 'linkId'));
  ok(res, { revoked: true });
}));

router.get('/me/api-tokens', asyncHandler(async (req, res) => {
  ok(res, await apiTokens.listTokens(callerId(req)));
}));
router.post('/me/api-tokens', asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(100), scopes: z.array(z.enum(apiTokens.TOKEN_SCOPES)).max(2).default(['read']), expiresInDays: z.number().int().min(1).max(365).nullable().optional() }), req.body);
  ok(res, await apiTokens.createToken(callerId(req), body), 201);
}));
router.delete('/me/api-tokens/:tokenId', asyncHandler(async (req, res) => {
  await apiTokens.revokeToken(callerId(req), idParam(req, 'tokenId'));
  ok(res, { revoked: true });
}));

// Link lịch (.ics) của chính mình — tạo mới = thu hồi link cũ; token chỉ trả về một lần.
router.get('/me/calendar-link', asyncHandler(async (req, res) => {
  ok(res, await calendar.calendarLinkStatus(callerId(req)));
}));
router.post('/me/calendar-link', asyncHandler(async (req, res) => {
  ok(res, await calendar.createCalendarLink(callerId(req)), 201);
}));
router.delete('/me/calendar-link', asyncHandler(async (req, res) => {
  await calendar.revokeCalendarLink(callerId(req));
  ok(res, { revoked: true });
}));

// ═══ Lần chạy đầu (onboarding) — dữ liệu mẫu + danh sách Getting started ═══
// Khối riêng (23/09): quyền kiểm trong onboarding.service (ADMIN mới rải/gỡ mẫu).

router.get('/projects/:pid/onboarding', asyncHandler(async (req, res) => {
  ok(res, await onboarding.onboardingStatus(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/sample-data', asyncHandler(async (req, res) => {
  ok(res, await onboarding.addSampleData(callerId(req), idParam(req, 'pid')), 201);
}));
router.delete('/projects/:pid/sample-data', asyncHandler(async (req, res) => {
  ok(res, await onboarding.removeSampleData(callerId(req), idParam(req, 'pid')));
}));

// ═══ Bố cục sơ đồ quy trình (24/09) — toạ độ nút, chỉ ADMIN (kiểm trong service) ═══

router.put('/projects/:pid/workflows/:wfId/layout', asyncHandler(async (req, res) => {
  const pos = z.object({ x: z.number().finite(), y: z.number().finite() });
  const { positions } = parse(z.object({ positions: z.record(z.string().regex(/^\d+$/), pos).nullable() }), req.body);
  if (positions && Object.keys(positions).length > 200) throw new BadRequestError('Too many statuses', 'WORK_BAD_LAYOUT');
  ok(res, await custom.setWorkflowLayout(callerId(req), idParam(req, 'pid'), idParam(req, 'wfId'), positions));
}));

// ═══ Cảm xúc bình luận + mẫu mô tả theo loại thẻ (24/09) ═══════════
// Khối riêng. Quyền kiểm trong service: cảm xúc cần comment.create (VIEWER
// không bấm được), đọc mẫu cần project.view, sửa mẫu cần project.settings.

router.put('/projects/:pid/issues/:num/comments/:cid/reactions/:emoji', asyncHandler(async (req, res) => {
  const { active } = parse(z.object({ active: z.boolean().optional() }), req.body ?? {});
  ok(res, await issues.toggleReaction(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid'), String(req.params.emoji ?? ''), active));
}));

router.get('/projects/:pid/issue-templates', asyncHandler(async (req, res) => {
  ok(res, await issues.listIssueTemplates(callerId(req), idParam(req, 'pid')));
}));
router.put('/projects/:pid/issue-templates/:typeKey', asyncHandler(async (req, res) => {
  const typeKey = parse(z.string().regex(/^[A-Z0-9_]{1,16}$/, 'Invalid issue type key'), req.params.typeKey);
  // Trần thô ở đây chỉ chặn body khổng lồ; trần thật (20 KB) + kiểm node nằm trong service.
  const { doc } = parse(z.object({
    doc: z.object({ type: z.literal('doc') }).passthrough()
      .refine((v) => JSON.stringify(v).length <= 200_000, 'Template is too large')
      .transform((v) => v as Prisma.InputJsonValue)
      .nullable(),
  }), req.body);
  await custom.setIssueTemplate(callerId(req), idParam(req, 'pid'), typeKey, doc);
  const all = await issues.listIssueTemplates(callerId(req), idParam(req, 'pid'));
  ok(res, all.find((t) => t.typeKey === typeKey) ?? null);
}));

// ═══ Tìm thẻ mọi dự án (/work/search + ⌘K) ═══════════════════════════
// Khối riêng (24/09): quyền lọc trong globalSearch.service (chỉ dự án xem được).

router.get('/search/facets', asyncHandler(async (req, res) => {
  ok(res, await globalSearch.searchFacets(callerId(req)));
}));
router.get('/search', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    jql: z.string().max(4000).default(''),
    q: z.string().max(200).default(''),
    limit: z.coerce.number().int().min(1).max(globalSearch.MAX_LIMIT).optional(),
    offset: z.coerce.number().int().min(0).max(globalSearch.MAX_DEPTH - 1).optional(),
  }), req.query);
  ok(res, await globalSearch.globalSearch(callerId(req), q));
}));

// ═══ LỚP STUDIO đợt S1 (04/10/2026) ═══════════════════════════════════
// Loại dự án + mô-đun · bộ phận · giai đoạn + cổng · phê duyệt · bàn giao ·
// chuyển thẻ sang dự án khác. Quyền + mô-đun kiểm trong service
// (permissions.ts + studio.ts assertModule ⇒ 403 MODULE_DISABLED).

router.get('/projects/:pid/studio', asyncHandler(async (req, res) => {
  ok(res, await projects.getStudioConfig(callerId(req), idParam(req, 'pid')));
}));
router.put('/projects/:pid/studio', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    kind: z.enum(PROJECT_KINDS).optional(),
    applyKindDefaults: z.boolean().optional(),
    modules: z.record(z.enum(STUDIO_MODULES), z.boolean()).optional(),
    stageGate: z.object({ approverIds: z.array(id).max(10).optional(), mode: z.enum(APPROVAL_MODES).optional() }).nullable().optional(),
  }), req.body);
  ok(res, await projects.updateStudioConfig(callerId(req), idParam(req, 'pid'), body));
}));

// ─── Bộ phận (cấp không gian) ──────────────────────────────────────

const teamBody = z.object({
  key: z.string().min(2).max(16),
  name: z.string().min(1).max(80),
  color: hexColor.optional(),
  description: z.string().max(2000).nullable().optional(),
  leadIds: z.array(id).max(20).optional(),
  memberIds: z.array(id).max(200).optional(),
});

router.get('/workspaces/:wsId/teams', asyncHandler(async (req, res) => {
  ok(res, await teams.listTeams(callerId(req), idParam(req, 'wsId'), { includeArchived: req.query.includeArchived === 'true' }));
}));
router.post('/workspaces/:wsId/teams', asyncHandler(async (req, res) => {
  ok(res, await teams.createTeam(callerId(req), idParam(req, 'wsId'), parse(teamBody, req.body)), 201);
}));
router.get('/workspaces/:wsId/teams/:teamId', asyncHandler(async (req, res) => {
  ok(res, await teams.getTeam(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId')));
}));
router.patch('/workspaces/:wsId/teams/:teamId', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(80).optional(), color: hexColor.optional(),
    description: z.string().max(2000).nullable().optional(), archived: z.boolean().optional(),
  }), req.body);
  ok(res, await teams.updateTeam(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'), body));
}));
router.delete('/workspaces/:wsId/teams/:teamId', asyncHandler(async (req, res) => {
  await teams.deleteTeam(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'));
  ok(res, { deleted: true });
}));
router.put('/workspaces/:wsId/teams/:teamId/members/:userId', asyncHandler(async (req, res) => {
  const { role } = parse(z.object({ role: z.enum(TEAM_ROLES).default('MEMBER') }), req.body ?? {});
  ok(res, await teams.setTeamMember(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'), idParam(req, 'userId'), role));
}));
router.delete('/workspaces/:wsId/teams/:teamId/members/:userId', asyncHandler(async (req, res) => {
  ok(res, await teams.removeTeamMember(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'), idParam(req, 'userId')));
}));
router.get('/workspaces/:wsId/teams/:teamId/queue', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    projectId: id.optional(),
    status: z.enum(['open', 'done', 'all']).optional(),
    unassigned: z.enum(['true', 'false']).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
    offset: z.coerce.number().int().min(0).max(100_000).optional(),
  }), req.query);
  ok(res, await teams.teamQueue(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'), { ...q, unassigned: q.unassigned === 'true' }));
}));
router.put('/workspaces/:wsId/teams/:teamId/queue/:issueId/assignee', asyncHandler(async (req, res) => {
  const { assigneeId } = parse(z.object({ assigneeId: id.nullable() }), req.body);
  ok(res, await teams.assignFromQueue(callerId(req), idParam(req, 'wsId'), idParam(req, 'teamId'), idParam(req, 'issueId'), assigneeId));
}));

// ─── Giai đoạn + cổng ──────────────────────────────────────────────

const stageSlug = z.string().min(1).max(80);
router.get('/projects/:pid/stages', asyncHandler(async (req, res) => {
  ok(res, await stages.listStages(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/stages', asyncHandler(async (req, res) => {
  const body = parse(z.object({ n: z.number().int().min(0).max(999).optional(), slug: stageSlug, name: z.string().min(1).max(160), gateIssueNumber: id.nullable().optional() }), req.body);
  ok(res, await stages.createStage(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.patch('/projects/:pid/stages/:sid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ n: z.number().int().min(0).max(999).optional(), slug: stageSlug.optional(), name: z.string().min(1).max(160).optional(), gateIssueNumber: id.nullable().optional() }), req.body);
  ok(res, await stages.updateStage(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), body));
}));
router.delete('/projects/:pid/stages/:sid', asyncHandler(async (req, res) => {
  await stages.deleteStage(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'));
  ok(res, { deleted: true });
}));
router.post('/projects/:pid/stages/:sid/activate', asyncHandler(async (req, res) => {
  const body = parse(z.object({ override: z.object({ reason: z.string().min(1).max(1000) }).nullable().optional() }), req.body ?? {});
  ok(res, await stages.activateStage(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), body));
}));
router.post('/projects/:pid/stages/:sid/request-gate', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    description: z.string().max(5000).nullable().optional(), dueAt: z.coerce.date().nullable().optional(),
    // Đợt S6: ADMIN vượt cổng Spec Fidelity (bắt buộc lý do, ghi audit).
    override: z.object({ reason: z.string().min(1).max(1000) }).nullable().optional(),
    // CTW-1: lời nhắn cho KHÁCH + bằng chứng ghim (như UAT).
    clientNote: z.string().max(5000).nullable().optional(),
    issueNumbers: z.array(id).max(100).optional(),
    pageNumbers: z.array(id).max(100).optional(),
    attachmentIds: z.array(id).max(100).optional(),
    // CTW-13: còn thẻ mở mà vẫn gửi.
    acknowledgeOpen: z.boolean().optional(),
    openReason: z.string().max(1000).nullable().optional(),
  }).strict(), req.body ?? {});
  ok(res, await stages.requestGate(callerId(req), idParam(req, 'pid'), idParam(req, 'sid'), body), 201);
}));

// ─── Phê duyệt ─────────────────────────────────────────────────────

router.get('/me/approvals', asyncHandler(async (req, res) => {
  ok(res, await approvals.myPendingApprovals(callerId(req)));
}));
router.get('/projects/:pid/approvals', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    status: z.enum(APPROVAL_STATUSES).optional(), targetType: z.enum(APPROVAL_TARGETS).optional(),
    issue: id.optional(), stage: id.optional(), page: id.optional(), limit: z.coerce.number().int().min(1).max(200).optional(),
  }), req.query);
  ok(res, await approvals.listApprovals(callerId(req), idParam(req, 'pid'), { status: q.status, targetType: q.targetType, issueNumber: q.issue, stageId: q.stage, pageNumber: q.page, limit: q.limit }));
}));
router.post('/projects/:pid/approvals', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    // DOC (đợt S2a): duyệt một trang tài liệu — cần pageNumber thay vì issueNumber.
    targetType: z.enum(['ISSUE', 'DOC']).default('ISSUE'),
    issueNumber: id.optional(),
    pageNumber: id.optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    mode: z.enum(APPROVAL_MODES).optional(),
    approverIds: z.array(id).min(1).max(10),
    dueAt: z.coerce.date().nullable().optional(),
  }), req.body);
  ok(res, await approvals.createApproval(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/approvals/:aid', asyncHandler(async (req, res) => {
  ok(res, await approvals.getApproval(callerId(req), idParam(req, 'pid'), idParam(req, 'aid')));
}));
router.post('/projects/:pid/approvals/:aid/decide', asyncHandler(async (req, res) => {
  const body = parse(z.object({ decision: z.enum(['APPROVE', 'REJECT']), comment: z.string().max(5000).nullable().optional() }), req.body);
  ok(res, await approvals.decideApproval(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), body, { ip: req.ip ?? null }));
}));
router.post('/projects/:pid/approvals/:aid/cancel', asyncHandler(async (req, res) => {
  const { reason } = parse(z.object({ reason: z.string().max(1000).nullable().optional() }), req.body ?? {});
  ok(res, await approvals.cancelApproval(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), reason));
}));

// ─── Bàn giao ──────────────────────────────────────────────────────

router.get('/me/handoffs', asyncHandler(async (req, res) => {
  ok(res, await handoffs.myPendingHandoffs(callerId(req)));
}));
router.get('/projects/:pid/handoffs', asyncHandler(async (req, res) => {
  const q = parse(z.object({ status: z.enum(HANDOFF_STATUSES).optional(), limit: z.coerce.number().int().min(1).max(200).optional() }), req.query);
  ok(res, await handoffs.listProjectHandoffs(callerId(req), idParam(req, 'pid'), q));
}));
router.get('/projects/:pid/issues/:num/handoffs', asyncHandler(async (req, res) => {
  ok(res, await handoffs.listIssueHandoffs(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.post('/projects/:pid/issues/:num/handoffs', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    toTeamId: id.nullable().optional(),
    toUserId: id.nullable().optional(),
    checklist: z.array(z.object({ text: z.string().min(1).max(300), done: z.boolean().optional() })).max(30).optional(),
    note: z.string().max(5000).nullable().optional(),
  }), req.body);
  ok(res, await handoffs.createHandoff(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body), 201);
}));
router.post('/projects/:pid/handoffs/:hid/accept', asyncHandler(async (req, res) => {
  const body = parse(z.object({ checklist: z.array(z.boolean()).max(30).optional() }), req.body ?? {});
  ok(res, await handoffs.acceptHandoff(callerId(req), idParam(req, 'pid'), idParam(req, 'hid'), body));
}));
router.post('/projects/:pid/handoffs/:hid/return', asyncHandler(async (req, res) => {
  const body = parse(z.object({ reason: z.string().min(1).max(5000) }), req.body);
  ok(res, await handoffs.returnHandoff(callerId(req), idParam(req, 'pid'), idParam(req, 'hid'), body));
}));
router.post('/projects/:pid/handoffs/:hid/cancel', asyncHandler(async (req, res) => {
  ok(res, await handoffs.cancelHandoff(callerId(req), idParam(req, 'pid'), idParam(req, 'hid')));
}));

// ─── Chuyển thẻ sang dự án khác (cùng không gian) ─────────────────

router.post('/projects/:pid/issues/:num/move-project', asyncHandler(async (req, res) => {
  const body = parse(z.object({ targetProjectId: id, version: z.number().int().min(0).optional() }), req.body);
  ok(res, await moveIssueToProject(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body));
}));

// ═══ TÀI LIỆU DỰ ÁN đợt S2a (04/10/2026, mô-đun `docs`) ══════════════
// Quyền + mô-đun kiểm trong pages.service (docAccess — khách chỉ đọc trang CLIENT).

/** TipTap của trang tài liệu: trần 2MB (mẫu SRS/SDD có bảng lớn hơn mô tả thẻ nhiều). */
const pageDoc = z
  .object({ type: z.literal('doc') })
  .passthrough()
  .refine((v) => JSON.stringify(v).length <= 2_000_000, 'Document is too large')
  .transform((v) => v as Prisma.InputJsonValue);

/** CTW-4: Markdown của một trang (≤ 1 MB chữ). */
const pageMarkdown = z.string().max(1_000_000, 'Markdown is too large (1 MB max)');

/**
 * CTW-4: `markdown` ⇒ `contentJson` bằng CHÍNH bộ chuyển của mẫu tài liệu (docMarkdown.ts, qua mdast —
 * không qua HTML). Không có tiêu đề ⇒ lấy tiêu đề mức 1 đầu tiên làm tiêu đề trang (và bỏ khỏi nội dung).
 * Gửi cả `markdown` lẫn `contentJson` ⇒ 400 (không đoán cái nào thắng).
 */
function markdownContent(markdown: string | undefined, body: { title?: string; contentJson?: unknown }, patch = false): { title?: string; contentJson?: Prisma.InputJsonValue } {
  if (markdown === undefined) return {};
  if (body.contentJson !== undefined) throw new BadRequestError('Send either "markdown" or "contentJson", not both', 'VALIDATION_ERROR');
  const first = /^\s*#\s+(.+?)\s*#*\s*$/m.exec(markdown.split('\n').find((l) => l.trim()) ?? '');
  const h1 = first?.[1]?.trim() ?? '';
  const useH1 = !body.title?.trim() && !patch;
  const dropTitle = !!h1 && (useH1 || body.title?.trim() === h1);
  const conv = markdownToTiptap(markdown, { dropTitle });
  return { ...(useH1 && conv.title ? { title: conv.title.slice(0, 255) } : {}), contentJson: conv.doc as unknown as Prisma.InputJsonValue };
}

router.get('/search/docs', asyncHandler(async (req, res) => {
  const q = parse(z.object({ q: z.string().max(200).default(''), limit: z.coerce.number().int().min(1).max(50).optional() }), req.query);
  ok(res, await pages.searchDocsGlobal(callerId(req), q.q, q.limit));
}));
router.get('/projects/:pid/doc-templates', asyncHandler(async (req, res) => {
  ok(res, await pages.templateLibrary(callerId(req), idParam(req, 'pid')));
}));
router.get('/projects/:pid/doc-templates/:key', asyncHandler(async (req, res) => {
  const key = parse(z.string().regex(/^[a-z0-9-]{1,64}$/), req.params.key);
  ok(res, await pages.templatePreview(callerId(req), idParam(req, 'pid'), key));
}));
router.get('/projects/:pid/pages', asyncHandler(async (req, res) => {
  const q = parse(z.object({ stage: id.optional() }), req.query);
  ok(res, await pages.listPages(callerId(req), idParam(req, 'pid'), { stageId: q.stage }));
}));
router.post('/projects/:pid/pages', asyncHandler(async (req, res) => {
  // CTW-4: .strict() — trường lạ (vd. "content", "body") là 400 nêu tên, không còn lặng lẽ tạo trang rỗng.
  const body = parse(z.object({
    title: z.string().max(255).optional(),
    parentNumber: id.nullable().optional(),
    templateKey: z.string().regex(/^[a-z0-9-]{1,64}$/).nullable().optional(),
    stageId: id.nullable().optional(),
    contentJson: pageDoc.optional(),
    markdown: pageMarkdown.optional(),
    visibility: z.enum(PAGE_VISIBILITY).optional(),
  }).strict(), req.body ?? {});
  const { markdown, ...rest } = body;
  ok(res, await pages.createPage(callerId(req), idParam(req, 'pid'), { ...rest, ...markdownContent(markdown, rest) }), 201);
}));
router.get('/projects/:pid/pages/search', asyncHandler(async (req, res) => {
  const q = parse(z.object({ q: z.string().max(200).default(''), limit: z.coerce.number().int().min(1).max(50).optional() }), req.query);
  ok(res, await pages.searchPages(callerId(req), idParam(req, 'pid'), q.q, q.limit));
}));
router.get('/projects/:pid/pages/:num', asyncHandler(async (req, res) => {
  ok(res, await pages.getPage(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.patch('/projects/:pid/pages/:num', asyncHandler(async (req, res) => {
  const parsed = parse(z.object({
    title: z.string().max(255).optional(),
    contentJson: pageDoc.optional(),
    // CTW-4: thay nội dung bằng Markdown (cùng bộ chuyển với xuất .md).
    markdown: pageMarkdown.optional(),
    status: z.enum(PAGE_STATUSES).optional(),
    visibility: z.enum(PAGE_VISIBILITY).optional(),
    ownerId: id.optional(),
    stageId: id.nullable().optional(),
    version: z.number().int().min(0).optional(),
    versionNote: z.string().max(500).nullable().optional(),
    aiAssisted: z.boolean().optional(),
  }).strict(), req.body);
  const { markdown, ...body } = parsed;
  ok(res, await pages.updatePage(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { ...body, ...markdownContent(markdown, body, true) }));
}));
// CTW-20: lối tắt gửi duyệt một trang — y hệt POST /approvals {targetType:'DOC', pageNumber}; trang ⇒ IN_REVIEW.
router.post('/projects/:pid/pages/:num/request-approval', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    mode: z.enum(APPROVAL_MODES).optional(),
    approverIds: z.array(id).min(1, 'Pick at least one approver (approverIds)').max(10),
    dueAt: z.coerce.date().nullable().optional(),
  }).strict(), req.body);
  ok(res, await approvals.createApproval(callerId(req), idParam(req, 'pid'), { ...body, targetType: 'DOC', pageNumber: idParam(req, 'num') }), 201);
}));
router.post('/projects/:pid/pages/:num/move', asyncHandler(async (req, res) => {
  const body = parse(z.object({ parentNumber: id.nullable(), index: z.number().int().min(0).max(10_000) }), req.body);
  ok(res, await pages.movePage(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), body));
}));
router.delete('/projects/:pid/pages/:num', asyncHandler(async (req, res) => {
  ok(res, await pages.deletePage(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.get('/projects/:pid/pages/:num/markdown', asyncHandler(async (req, res) => {
  ok(res, await pages.exportMarkdown(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.get('/projects/:pid/pages/:num/versions', asyncHandler(async (req, res) => {
  ok(res, await pages.listVersions(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.get('/projects/:pid/pages/:num/versions/compare', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: id, to: z.union([z.literal('current'), id]).default('current') }), req.query);
  ok(res, await pages.compareVersions(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), q.from, q.to));
}));
router.get('/projects/:pid/pages/:num/versions/:n', asyncHandler(async (req, res) => {
  ok(res, await pages.getVersion(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'n')));
}));
router.post('/projects/:pid/pages/:num/versions/:n/restore', asyncHandler(async (req, res) => {
  ok(res, await pages.restoreVersion(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'n')));
}));
router.post('/projects/:pid/pages/:num/issues', asyncHandler(async (req, res) => {
  const { issueNumber } = parse(z.object({ issueNumber: id }), req.body);
  ok(res, await pages.linkIssue(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), issueNumber), 201);
}));
router.delete('/projects/:pid/pages/:num/issues/:issueNum', asyncHandler(async (req, res) => {
  ok(res, await pages.unlinkIssue(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'issueNum')));
}));
router.get('/projects/:pid/issues/:num/pages', asyncHandler(async (req, res) => {
  ok(res, await pages.issuePages(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.get('/projects/:pid/pages/:num/comments', asyncHandler(async (req, res) => {
  ok(res, await pages.listComments(callerId(req), idParam(req, 'pid'), idParam(req, 'num')));
}));
router.post('/projects/:pid/pages/:num/comments', asyncHandler(async (req, res) => {
  const { bodyJson, parentId } = parse(z.object({ bodyJson: tiptapDoc, parentId: id.nullable().optional() }), req.body); // K-1: parentId
  ok(res, await pages.addComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), bodyJson, parentId), 201);
}));
router.delete('/projects/:pid/pages/:num/comments/:cid', asyncHandler(async (req, res) => {
  ok(res, await pages.deleteComment(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), idParam(req, 'cid')));
}));

// ═══ CỔNG KHÁCH đợt S2b (04/10/2026, mô-đun `clientPortal`) ══════════
// Quyền + mô-đun kiểm trong portal.service / issues.service. `?as=client` =
// "Preview as client" của nhân viên (chỉ đọc). Khách bị cách ly chỉ gọi được
// tuyến trong danh sách trắng (chốt ở đầu file) — /portal/** nằm trong đó.

const asClient = (req: Request) => req.query.as === 'client';

// Nhân viên: chia sẻ thẻ / tệp với khách.
router.put('/projects/:pid/issues/:num/client-visible', asyncHandler(async (req, res) => {
  const { visible } = parse(z.object({ visible: z.boolean() }), req.body);
  ok(res, await issues.setIssueClientVisible(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), visible));
}));
router.patch('/projects/:pid/attachments/:aid/client', asyncHandler(async (req, res) => {
  const body = parse(z.object({ clientVisible: z.boolean().optional(), deliverable: z.boolean().optional() }).refine((b) => b.clientVisible !== undefined || b.deliverable !== undefined, 'Nothing to change'), req.body);
  ok(res, await issues.setAttachmentClient(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), body));
}));

router.get('/projects/:pid/portal/overview', asyncHandler(async (req, res) => {
  ok(res, await portal.overview(callerId(req), idParam(req, 'pid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/requests', asyncHandler(async (req, res) => {
  const q = parse(z.object({ filter: z.enum(['all', 'open', 'done', 'mine']).optional() }), req.query);
  ok(res, await portal.listRequests(callerId(req), idParam(req, 'pid'), { asClient: asClient(req), filter: q.filter }));
}));
router.post('/projects/:pid/portal/requests', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    kind: z.enum(PORTAL_REQUEST_KINDS),
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(20_000).nullable().optional(),
    priority: z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX).optional(),
  }), req.body);
  if (asClient(req)) throw new BadRequestError('Preview as client is read-only', 'WORK_PREVIEW_READONLY');
  ok(res, await portal.submitRequest(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.get('/projects/:pid/portal/requests/:num', asyncHandler(async (req, res) => {
  ok(res, await portal.getRequest(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/approvals', asyncHandler(async (req, res) => {
  ok(res, await portal.listPortalApprovals(callerId(req), idParam(req, 'pid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/approvals/:aid', asyncHandler(async (req, res) => {
  ok(res, await portal.getPortalApproval(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/documents', asyncHandler(async (req, res) => {
  ok(res, await portal.documents(callerId(req), idParam(req, 'pid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/documents/:num', asyncHandler(async (req, res) => {
  ok(res, await portal.portalPage(callerId(req), idParam(req, 'pid'), idParam(req, 'num'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/deliverables', asyncHandler(async (req, res) => {
  ok(res, await portal.deliverables(callerId(req), idParam(req, 'pid'), { asClient: asClient(req) }));
}));
router.get('/projects/:pid/portal/activity', asyncHandler(async (req, res) => {
  const q = parse(z.object({ limit: z.coerce.number().int().min(1).max(200).optional() }), req.query);
  ok(res, await portal.activity(callerId(req), idParam(req, 'pid'), { asClient: asClient(req), limit: q.limit }));
}));
router.get('/projects/:pid/portal/clients', asyncHandler(async (req, res) => {
  ok(res, await portal.listClients(callerId(req), idParam(req, 'pid')));
}));
router.post('/projects/:pid/portal/invite', asyncHandler(async (req, res) => {
  const { emails } = parse(z.object({ emails: z.array(z.string().email('Invalid email')).min(1).max(20) }), req.body);
  ok(res, await portal.inviteClients(callerId(req), idParam(req, 'pid'), emails), 201);
}));
router.post('/projects/:pid/portal/uat', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    versionId: id.nullable().optional(),
    stageId: id.nullable().optional(),
    issueNumbers: z.array(id).min(1).max(300),
    pageNumbers: z.array(id).max(50).optional(),
    attachmentIds: z.array(id).max(100).optional(),
    approverIds: z.array(id).min(1).max(10),
    mode: z.enum(APPROVAL_MODES).optional(),
    environment: z.string().max(200).nullable().optional(),
    build: z.string().max(120).nullable().optional(),
    dueAt: z.coerce.date().nullable().optional(),
  }), req.body);
  ok(res, await portal.createUat(callerId(req), idParam(req, 'pid'), body), 201);
}));
router.post('/projects/:pid/portal/uat/:aid/decide', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    decision: z.enum(['APPROVE', 'REJECT']),
    comment: z.string().max(5000).nullable().optional(),
    conditions: z.string().max(5000).nullable().optional(),
    points: z.array(z.object({ title: z.string().min(1).max(255), kind: z.enum(['BUG', 'CHANGE']), detail: z.string().max(5000).nullable().optional() })).max(30).optional(),
  }), req.body);
  if (asClient(req)) throw new BadRequestError('Preview as client is read-only', 'WORK_PREVIEW_READONLY');
  ok(res, await portal.decideUat(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), body, { ip: req.ip ?? null }));
}));
router.get('/projects/:pid/portal/uat/:aid/certificate', asyncHandler(async (req, res) => {
  ok(res, await portal.uatCertificate(callerId(req), idParam(req, 'pid'), idParam(req, 'aid'), { asClient: asClient(req) }));
}));

// Đợt S3a: Portfolio + Workload (cấp không gian, chỉ đọc) — tuyến ở work.portfolio.routes.ts.
router.use(portfolioRoutes);
// Đợt S3b: CR · sổ RAID · cuộc họp — tuyến ở work.governance.routes.ts (qua chốt cổng khách ở trên).
router.use(governanceRoutes);
// Đợt S4: tài chính · báo cáo khách/steering · thuyết trình · xuất trọn — tuyến ở work.s4.routes.ts (qua chốt cổng khách ở trên).
router.use(s4Routes);
// Đợt S5a: service desk & SLA — tuyến ở work.desk.routes.ts (qua chốt cổng khách ở trên; khách chỉ /portal/desk/**).
router.use(deskRoutes);
// Đợt S5c: mô-đun mới cho dự án cũ · thùng rác Docs · nhập lại dự án từ ZIP — tuyến ở work.s5c.routes.ts (qua chốt cổng khách ở trên).
router.use(s5cRoutes);
// Đợt S6: Spec Fidelity (chấm đặc tả, lịch sử, áp dụng gợi ý, cổng giai đoạn, luật AI) — tuyến ở work.s6.routes.ts (qua chốt cổng khách ở trên).
router.use(s6Routes);
// Resources (06/10/2026): thư viện link của dự án + Web links trên thẻ — tuyến ở work.resources.routes.ts (qua chốt cổng khách ở trên).
router.use(resourcesRoutes);
// CTW-28 (GĐ1 A2–A8): AI agent thành viên — quản lý, token, lease, hộp thư/SSE, webhook — tuyến ở work.agents.routes.ts.
router.use(agentsRoutes);
// CTW-28 (GĐ1 A13–A14): tuyến ĐỌC cho giao diện agent (chip lease, khối Agent activity, "My agents need you").
router.use(agentsUiRoutes);
// Đợt 1b (08/10/2026): tài liệu kiểm thử chuẩn FPT (Report 5.1 Unit + 5.2 Integration, xuất/nhập Excel) — work.fpt.routes.ts.
router.use(fptTestRoutes);
// CTW đợt 3A (09/10/2026): ảnh trong trình soạn thảo · xuất .docx/PDF · Record of Changes · điền Report từ dữ liệu — work.docs3a.routes.ts.
router.use(docs3aRoutes);
// CTW đợt 3B (09/10/2026): WBS + bảng quy đổi, Weekly Report, AI Usage Report, thông tin môn học — work.fptReports.routes.ts.
router.use(fptReportRoutes);
// CTW đợt 3C (09/10/2026): agent dựng sẵn (BUILTIN) — lượt chạy, dừng, trần chi phí; link tải Word/PDF — work.ctw3c.routes.ts.
router.use(ctw3cRoutes);
// CTW đợt 5b K-1: tệp + voice note trong bình luận (work.ctw5b.routes.ts).
router.use(ctw5bRoutes);
// CTW đợt 4: SRS có cấu trúc, RTM, defect log, Q&A, Report 7, activity worklog (work.ctw4.routes.ts).
router.use(ctw4Routes);
// CTW đợt 4b: SWR302 — feature FE-n, phân loại/vòng đời yêu cầu, bảng ưu tiên Wiegers, glossary, data dictionary, sáu liên kết, mẫu Wiegers.
router.use(ctw4bRoutes);
router.use(uxdRoutes); // UX-D: ảnh bìa dự án (chỉ ADMIN dự án)
// CTW Đóng góp (A26/A27): đóng góp & hiệu suất thành viên, đánh giá chéo, xuất xlsx/PDF (work.contrib.routes.ts).
router.use(contribRoutes);
// UX-B: báo cáo dòng chảy + KPI + dashboard "Project overview" (work.uxb.routes.ts — số liệu ở flowReports.service.ts).
router.use(uxbRoutes);
// UX-C: Team overview + mốc/baseline Timeline + kéo-thả WBS (work.uxc.routes.ts — số liệu ở uxc.service.ts).
router.use(uxcRoutes);
// CTW K-3: kênh chat dự án (work.ctwk3.routes.ts — quyền trong chat.service.ts).
router.use(ctwk3Routes);
// CTW K-3b: đồng soạn thảo Docs (Yjs) + bình luận gắn đoạn văn (work.ctwk3b.routes.ts).
router.use(ctwk3bRoutes);
// CTW Diagram: Diagram Studio (sơ đồ Mermaid/Excalidraw, phiên bản, AI vẽ từ dữ liệu dự án) — work.diagrams.routes.ts.
router.use(diagramRoutes);
// CTW đợt 5: hub giảng viên (/teaching), lớp học (/classes), rubric + điểm, tuần 1, việc định kỳ — work.ctw5.routes.ts.
router.use(ctw5Routes);
// CTW K-2: agenda có cấu trúc, RSVP, điểm danh, ghi âm có đồng ý, phiên âm, biên bản AI (work.ctwk2.routes.ts).
router.use(ctwk2Routes);
// CTW đợt 6b: stakeholder/RACI, phiên elicitation (+ AI đề xuất yêu cầu), khảo sát, mô hình SRS, prototype, checklist chất lượng, NFR
router.use(ctw6bRoutes);
// CTW đợt 6: review/inspection + baseline + CR↔yêu cầu; thiết kế test, giám sát test, rủi ro, TSR, thăm dò (work.ctw6.routes.ts).
router.use(ctw6Routes);

export default router;
