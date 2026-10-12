/**
 * CT Work — dự án: tạo từ mẫu, cấu hình, thành viên, nhãn, component.
 */

import { Prisma } from '@prisma/client';
import { CAPSTONE_MODULES, seedCapstone } from './capstone.service.js';
import { SWR302_MODULES, seedSwr302 } from './swr302Project.service.js';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import {
  PROJECT_KEY_RE, type ProjectKind, type ProjectRole, type ProjectTemplate, type ProjectType, type ProjectVisibility, type WorkspaceRole,
} from './constants.js';
import { defaultModulesFor, kindFromTemplate, mergeModules, modulesOf, noModules, projectKindOf, type ModuleMap } from './studio.js';
import { auditProject } from './audit.js';
import { emitWorkEvent, evictFromProject } from './events.js';
import {
  can, deskAccess, docAccess, effectiveProjectRole, effectiveWorkspaceRole, governanceAccess, isClientScoped, loadProjectAccess, portalOnlyUserIds, requireProject, requireWorkspace,
  type ProjectOptions, principalOf } from './permissions.js';
import { financeAccess } from './financeRules.js';
import { clientPeopleIds, filterPeople } from './clientPeople.js';
import { seedProjectConfig } from './templates.js';
import { createOverviewDashboard } from './dashboardDefaults.js';
import { openIssueWhere } from './openIssues.js';
import { defaultCoverFor } from './covers.js'; // UX-D

const MAX_PROJECTS_PER_WORKSPACE = 100;

export async function createProject(
  userId: number,
  workspaceId: number,
  input: {
    key: string; name: string; description?: string | null;
    type: ProjectType; template: ProjectTemplate; visibility?: ProjectVisibility;
    /** Bỏ trống = theo mẫu (SWP391/SWR302 Scrum có sẵn "Sprint 1"). */
    firstSprint?: boolean;
    /**
     * Loại dự án (lớp studio). Có ⇒ mô-đun mặc định theo loại (CLIENT bật 4 mô-đun
     * đợt S1). KHÔNG có (client cũ) ⇒ loại suy từ mẫu, mô-đun TẮT hết như trước.
     */
    kind?: ProjectKind;
    /** Ghi đè bật/tắt từng mô-đun lúc tạo (sau mặc định theo loại). */
    modules?: Partial<Record<string, boolean>>;
  },
) {
  await requireWorkspace(userId, workspaceId, 'workspace.createProject');
  const key = input.key.trim().toUpperCase();
  if (!PROJECT_KEY_RE.test(key)) {
    throw new BadRequestError('Project key must be 2–10 letters or digits and start with a letter (e.g. SWP)', 'WORK_BAD_KEY');
  }
  const name = input.name.trim();
  if (!name) throw new BadRequestError('Project name is required', 'WORK_NAME_REQUIRED');
  const count = await prisma.workProject.count({ where: { workspaceId, deletedAt: null } });
  if (count >= MAX_PROJECTS_PER_WORKSPACE) throw new BadRequestError('This workspace has too many projects', 'WORK_LIMIT');

  try {
    const created = await prisma.$transaction(async (tx) => {
      const project = await tx.workProject.create({
        data: {
          workspaceId, key, name: name.slice(0, 120), description: input.description?.trim() || null,
          type: input.type, template: input.template, visibility: input.visibility ?? 'WORKSPACE', leadId: userId,
          kind: input.kind ?? kindFromTemplate(input.template),
          coverUrl: defaultCoverFor(input.template, input.kind ?? kindFromTemplate(input.template)), // UX-D: bìa hợp mẫu
        },
      });
      // Người tạo luôn là ADMIN của dự án mình tạo — kể cả khi chỉ là MEMBER của không gian.
      await tx.workProjectMember.create({ data: { projectId: project.id, userId, role: 'ADMIN' } });
      await seedProjectConfig(tx, project.id, input.template, input.type, { firstSprint: input.firstSprint });
      // Mô-đun ghi SAU seed (seed đặt settings của mẫu) — gộp, không đè.
      // CTW đợt 3A: mẫu CAPSTONE bật sẵn mô-đun đồ án (giai đoạn, duyệt, Docs, RAID, họp) — ghi đè của người tạo vẫn thắng.
      const baseModules = input.kind ? defaultModulesFor(input.kind) : noModules();
      if (input.template === 'CAPSTONE') for (const m of CAPSTONE_MODULES) baseModules[m] = true;
      // CTW đợt 4b (R27): mẫu SWR302 bật sẵn giai đoạn (tuần 2→9), Docs, RAID, họp, Resources.
      if (input.template === 'SWR302') for (const m of SWR302_MODULES) baseModules[m] = true;
      const modules = mergeModules(baseModules, input.modules ?? {});
      const cur = await tx.workProject.findUniqueOrThrow({ where: { id: project.id }, select: { settings: true } });
      await tx.workProject.update({
        where: { id: project.id },
        data: { settings: { ...((cur.settings as object) ?? {}), modules } as Prisma.InputJsonValue },
      });
      // UX-B: dự án mới có sẵn dashboard "Project overview" (KPI, burndown, CFD, throughput, tải, việc trễ, rủi ro).
      await createOverviewDashboard(tx, project.id, userId);
      return { id: project.id, key: project.key, name: project.name, kind: project.kind as ProjectKind, modules };
    });
    // CTW đợt 3A (A30): giai đoạn Report 1→7, Iteration 1–3, trang Docs mẫu FPT, epic theo Report — sau khi dự án đã có.
    if (input.template === 'CAPSTONE') {
      const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { slug: true } });
      await seedCapstone(userId, created.id, { wsSlug: ws.slug, key: created.key });
    }
    // CTW đợt 4b (R27): tuần 2→9, epic theo 8 deliverable, trang gói SWR302 (lịch, RACI, sáu liên kết) + 5 trang mẫu Wiegers.
    if (input.template === 'SWR302') {
      const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { slug: true } });
      await seedSwr302(userId, created.id, { wsSlug: ws.slug, key: created.key });
    }
    return created;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new ConflictError(`Project key ${key} is already used in this workspace`);
    }
    throw err;
  }
}

/** Dự án người gọi thấy được trong một không gian, kèm vai trò và số thẻ đang mở. */
export async function listProjects(userId: number, workspaceId: number) {
  const wsRole = await requireWorkspace(userId, workspaceId, 'workspace.view');
  const projects = await prisma.workProject.findMany({
    where: { workspaceId, deletedAt: null },
    orderBy: [{ archivedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'asc' }],
    select: {
      id: true, key: true, name: true, description: true, type: true, template: true, visibility: true, archivedAt: true,
      // CTW-23: nhận diện dự án (sidebar, danh sách dự án).
      avatarUrl: true, iconEmoji: true, color: true,
      coverUrl: true, coverPositionY: true, // UX-D: ảnh bìa trên thẻ dự án
      kind: true, settings: true, clientRequest: { select: { id: true } },
      lead: { select: PUBLIC_USER },
      members: { where: { userId }, select: { role: true } },
      // UX-A P0-2: một định nghĩa "open" dùng chung (openIssues.ts) — không đếm sub-task.
      _count: { select: { issues: { where: openIssueWhere() } } },
    },
  });
  const out = [];
  for (const p of projects) {
    const role = effectiveProjectRole({
      workspaceRole: wsRole,
      projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
      visibility: p.visibility as ProjectVisibility,
    });
    if (!role) continue;
    const { members: _m, _count, settings, clientRequest, kind, ...rest } = p;
    const modules = modulesOf(settings);
    // Khách bị cách ly (cổng khách S2b): chỉ đếm thẻ đã chia sẻ — không lộ quy mô việc nội bộ.
    const openIssues = isClientScoped({ role, modules })
      ? await prisma.workIssue.count({ where: { ...openIssueWhere(), projectId: p.id, clientVisible: true } })
      : _count.issues;
    out.push({
      ...rest, role, openIssues,
      kind: projectKindOf({ kind, template: p.template, fromClientRequest: !!clientRequest }),
      modules,
    });
  }
  return out;
}

export async function resolveProjectKey(userId: number, workspaceSlug: string, key: string) {
  const p = await prisma.workProject.findFirst({
    where: { key: key.toUpperCase(), deletedAt: null, workspace: { slug: workspaceSlug, deletedAt: null } },
    select: { id: true },
  });
  if (!p) throw new NotFoundError('Project not found');
  await requireProject(userId, p.id, 'project.view');
  return p.id;
}

/**
 * Toàn bộ cấu hình client cần để vẽ dự án: quy trình (trạng thái + luồng
 * chuyển), loại thẻ, nhãn, component, thành viên, sprint chưa đóng, cột board.
 * Một lượt gọi cho cả trang — board, danh sách và chi tiết thẻ dùng chung.
 */
export async function getProjectConfig(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const project = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: {
      id: true, key: true, name: true, description: true, type: true, template: true, visibility: true,
      settings: true, archivedAt: true, createdAt: true, leadId: true, kind: true,
      // CTW-23: nhận diện dự án + logo không gian.
      avatarUrl: true, iconEmoji: true, color: true,
      coverUrl: true, coverPositionY: true, // UX-D
      workspace: { select: { id: true, name: true, slug: true, logoUrl: true } },
      // CTW-5: phiên bản cho gợi ý JQL `fixVersion = …`.
      versions: { where: { status: { not: 'ARCHIVED' } }, orderBy: [{ position: 'asc' }, { id: 'asc' }], take: 200, select: { id: true, name: true, status: true } },
      workflows: {
        orderBy: { id: 'asc' },
        select: {
          id: true, name: true, isDefault: true,
          statuses: { orderBy: { position: 'asc' }, select: { id: true, name: true, category: true, color: true, position: true, wipLimit: true } },
          transitions: { select: { id: true, fromStatusId: true, toStatusId: true, name: true, rules: true } },
        },
      },
      issueTypes: { where: { archived: false }, orderBy: { position: 'asc' }, select: { id: true, key: true, name: true, icon: true, color: true, level: true, workflowId: true } },
      labels: { orderBy: { name: 'asc' }, select: { id: true, name: true, color: true } },
      customFields: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, kind: true, options: true, typeKeys: true, required: true, position: true } },
      components: { orderBy: { name: 'asc' }, select: { id: true, name: true, description: true, leadId: true } },
      sprints: {
        where: { state: { not: 'CLOSED' } },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true },
      },
    },
  });
  // Cổng khách (S2b): khách bị cách ly nhận bản RÚT GỌN — không cấu hình nội bộ
  // (settings: chỉ dẫn AI, điều kiện Done…; trường tuỳ chỉnh; component; sprint),
  // và thành viên chỉ là người khách được thấy (clientPeople.ts — một luật cho mọi đường).
  const clientView = isClientScoped(access);
  const members = filterPeople(await projectMembers(projectId), clientView ? await clientPeopleIds(projectId, userId) : null);
  const trimmed = clientView ? { settings: {}, customFields: [], components: [], sprints: [], leadId: null } : {};
  return {
    ...project,
    ...trimmed,
    clientView,
    // Lớp studio: loại hiệu lực (dự án cũ suy từ mẫu) + mô-đun đang bật.
    kind: access.kind,
    kindStored: project.kind,
    modules: access.modules,
    role: access.role,
    workspaceRole: access.workspaceRole,
    permissions: { ...permissionFlags(access.role, access.options), ...docFlags(access), ...govFlags(access), ...(await s4Flags(access, userId)), ...deskFlags(access) },
    boardColumns: boardColumns(project.workflows, project.settings),
    members,
  };
}

/** Cờ quyền gửi cho client để ẩn/hiện nút. Chỉ để hiển thị — API vẫn kiểm lại. */
export function permissionFlags(role: ProjectRole, opts: ProjectOptions = {}) {
  return {
    editIssues: can(role, 'issue.edit'),
    createIssues: can(role, 'issue.create'),
    transition: can(role, 'issue.transition'),
    deleteIssues: can(role, 'issue.delete'),
    comment: can(role, 'comment.create'),
    attach: can(role, 'attachment.add'),
    manageSprints: can(role, 'sprint.manage', opts),
    settings: can(role, 'project.settings'),
    manageMembers: can(role, 'project.members'),
    useAi: can(role, 'ai.use'),
    // Lớp studio — chỉ là quyền theo VAI; mô-đun tắt thì route vẫn 403 MODULE_DISABLED.
    configureStudio: can(role, 'studio.configure'),
    manageStages: can(role, 'stage.manage'),
    requestGate: can(role, 'stage.requestGate'),
    createApprovals: can(role, 'approval.create'),
    beApprover: can(role, 'approval.decide'),
    manageApprovals: can(role, 'approval.manage'),
    createHandoffs: can(role, 'handoff.create'),
    manageHandoffs: can(role, 'handoff.manage'),
  };
}

/** Cờ tài liệu (đợt S2a) — phụ thuộc cả vai không gian (khách GUEST chỉ đọc trang CLIENT). */
function docFlags(access: { role: ProjectRole; workspaceRole: WorkspaceRole }) {
  const d = docAccess(access.role, access.workspaceRole);
  return { viewAllDocs: d.view === 'ALL', editDocs: d.edit, manageDocs: d.manage };
}

/** Cờ service desk (đợt S5a) — phần nội bộ (hàng đợi, đồng hồ SLA, Problem, báo cáo) chỉ cho người của đội. */
function deskFlags(access: { role: ProjectRole; workspaceRole: WorkspaceRole }) {
  const d = deskAccess(access.role, access.workspaceRole);
  return { viewDesk: d.view, workDesk: d.work, configureDesk: d.configure };
}

/** Cờ CR / RAID / họp (đợt S3b) — khách và GUEST (trừ giảng viên) không thấy phần nội bộ. */
function govFlags(access: { role: ProjectRole; workspaceRole: WorkspaceRole }) {
  const g = governanceAccess(access.role, access.workspaceRole);
  return { viewGovernance: g.view, editGovernance: g.edit };
}

/**
 * Cờ đợt S4 — tài chính (financeRules.financeAccess: ADMIN thấy tiền; MEMBER chỉ giờ của mình; trưởng
 * bộ phận duyệt giờ bộ phận), báo cáo/thuyết trình (người của đội — như governance), xuất trọn (ADMIN).
 * Chỉ là quyền theo VAI; mô-đun tắt thì API vẫn 403 MODULE_DISABLED.
 */
async function s4Flags(access: { role: ProjectRole; workspaceRole: WorkspaceRole; workspaceId: number }, userId: number) {
  const staff = access.role !== 'CLIENT' && access.workspaceRole !== 'GUEST';
  const isLead = staff && (await prisma.workTeamMember.count({ where: { userId, role: 'LEAD', team: { workspaceId: access.workspaceId, archivedAt: null } } })) > 0;
  const f = financeAccess(access.role, access.workspaceRole, isLead);
  const g = governanceAccess(access.role, access.workspaceRole);
  return {
    viewFinance: f.manage || f.ownTimesheet || f.review !== null,
    manageFinance: f.manage,
    reviewTimesheets: f.review !== null,
    viewReports: g.view,
    sendClientReports: g.edit,
    exportProject: access.role === 'ADMIN' && staff,
  };
}

/** Mọi người vào được dự án kèm vai trò hiệu lực — dùng cho ô chọn người, @nhắc tên. */
export async function projectMembers(projectId: number) {
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspaceId: true, visibility: true } });
  const [wsMembers, projMembers, portalOnly] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: project.workspaceId }, select: { role: true, user: { select: PUBLIC_USER } } }),
    prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, role: true } }),
    portalOnlyUserIds(project.workspaceId),
  ]);
  const explicit = new Map(projMembers.map((m) => [m.userId, m.role as ProjectRole]));
  const out: Array<(typeof wsMembers)[number]['user'] & { role: ProjectRole; explicit: boolean }> = [];
  for (const m of wsMembers) {
    const role = effectiveProjectRole({
      // MEMBER chỉ là khách cổng ⇒ GUEST: không hiện như thành viên ngầm của dự án mở cho không gian.
      workspaceRole: effectiveWorkspaceRole(m.role as WorkspaceRole, portalOnly.has(m.user.id)),
      projectRole: explicit.get(m.user.id) ?? null,
      visibility: project.visibility as ProjectVisibility,
    });
    if (role) out.push({ ...m.user, role, explicit: explicit.has(m.user.id) });
  }
  return out.sort((a, b) => a.username.localeCompare(b.username));
}

// ─── Cột board ───────────────────────────────────────────────────

interface WfLite { id: number; isDefault: boolean; statuses: Array<{ id: number; name: string; category: string; wipLimit: number | null }> }

/**
 * Cột của board = trạng thái của quy trình mặc định. Trạng thái của quy trình
 * khác (vd vòng đời Bug) được xếp vào cột: trùng tên trước, rồi theo nhóm —
 * TODO vào cột TODO đầu tiên, IN_PROGRESS/DONE vào cột CUỐI của nhóm đó
 * (Fixed, Retest rơi vào "In Review"; Closed vào "Done").
 * settings.boardColumns (đợt 5) sẽ cho người dùng tự chia cột.
 */
export function boardColumns(workflows: WfLite[], settings: unknown) {
  const custom = (settings as { boardColumns?: Array<{ name: string; statusIds: number[]; wipLimit?: number | null }> } | null)?.boardColumns;
  const main = workflows.find((w) => w.isDefault) ?? workflows[0];
  if (!main) return [];
  if (custom?.length) {
    // Nhóm của cột tuỳ chỉnh = nhóm của trạng thái đầu tiên trong cột (board dùng
    // nó để biết cột "xong" — không cho thêm nhanh thẻ vào đó).
    const all = workflows.flatMap((w) => w.statuses);
    // Trạng thái đã bị xoá sau khi cấu hình cột thì bỏ qua, không làm vỡ board.
    return custom.map((c, i) => {
      const ids = c.statusIds.filter((id) => all.some((s) => s.id === id));
      return { key: `c${i}`, name: c.name, statusIds: ids, category: all.find((s) => s.id === ids[0])?.category ?? 'TODO', wipLimit: c.wipLimit ?? null };
    });
  }
  const cols = main.statuses.map((s) => ({ key: `s${s.id}`, name: s.name, category: s.category, statusIds: [s.id], wipLimit: s.wipLimit }));
  for (const wf of workflows) {
    if (wf.id === main.id) continue;
    for (const s of wf.statuses) {
      let col = cols.find((c) => c.name.toLowerCase() === s.name.toLowerCase());
      if (!col) {
        const same = cols.filter((c) => c.category === s.category);
        col = s.category === 'TODO' ? same[0] : same[same.length - 1];
      }
      (col ?? cols[0]).statusIds.push(s.id);
    }
  }
  return cols;
}

// ─── Sửa dự án ───────────────────────────────────────────────────

export async function updateProject(
  userId: number,
  projectId: number,
  input: {
    name?: string; description?: string | null; visibility?: ProjectVisibility; leadId?: number | null; settings?: Record<string, unknown>;
    /** CTW-23: ảnh tải lên qua /avatar/presign + /avatar/complete; ở đây chỉ nhận null (gỡ ảnh). */
    avatarUrl?: null; iconEmoji?: string | null; color?: string | null;
  },
) {
  await requireProject(userId, projectId, 'project.settings');
  const data: Prisma.WorkProjectUncheckedUpdateInput = {};
  if (input.avatarUrl === null) data.avatarUrl = null;
  if (input.iconEmoji !== undefined) data.iconEmoji = input.iconEmoji?.trim() || null;
  if (input.color !== undefined) data.color = input.color?.toLowerCase() || null;
  if (input.name !== undefined) {
    const n = input.name.trim();
    if (!n) throw new BadRequestError('Project name is required', 'WORK_NAME_REQUIRED');
    data.name = n.slice(0, 120);
  }
  if (input.description !== undefined) data.description = input.description?.trim() || null;
  if (input.visibility !== undefined) data.visibility = input.visibility;
  if (input.leadId !== undefined) {
    if (input.leadId !== null) {
      const a = await loadProjectAccess(input.leadId, projectId);
      if (!a || !can(a.role, 'issue.edit')) throw new BadRequestError('The project lead must be a project member', 'WORK_BAD_LEAD');
    }
    data.leadId = input.leadId;
  }
  if (input.settings !== undefined) {
    // Khoá của lớp studio chỉ đổi qua PUT /projects/:pid/studio (có kiểm + audit).
    const { modules: _mod, stageGate: _gate, ...rest } = input.settings;
    input.settings = rest;
    // Điều kiện Done: chỉ nhận trường của CHÍNH dự án này, loại thẻ là chuỗi.
    if ('doneRequirements' in input.settings) {
      const raw = input.settings.doneRequirements as { fieldIds?: unknown; typeKeys?: unknown } | null;
      if (raw !== null) {
        const ids = Array.isArray(raw?.fieldIds) ? [...new Set(raw.fieldIds.filter((x): x is number => Number.isInteger(x)))] : [];
        const own = ids.length ? await prisma.workCustomField.count({ where: { projectId, id: { in: ids } } }) : 0;
        if (own !== ids.length) throw new BadRequestError('Some required fields do not belong to this project', 'WORK_BAD_FIELD');
        const typeKeys = Array.isArray(raw?.typeKeys) ? raw.typeKeys.filter((x): x is string => typeof x === 'string').slice(0, 20) : null;
        input.settings = { ...input.settings, doneRequirements: { fieldIds: ids, typeKeys: typeKeys?.length ? typeKeys : null } };
      }
    }
    // CTW-8/14: ngôn ngữ cho chữ máy chủ tự sinh (báo cáo AI cho khách, tiêu đề phê duyệt). null = tự đoán.
    if ('language' in input.settings) {
      const v = input.settings.language;
      if (v !== null && v !== 'vi' && v !== 'en') throw new BadRequestError('Language must be "vi", "en" or null (auto)', 'WORK_BAD_LANGUAGE');
    }
    // Chỉ dẫn cho trợ lý AI (ai.service đọc): chuỗi, trần 20.000 ký tự; null/rỗng = xoá.
    if ('aiInstructions' in input.settings) {
      const v = input.settings.aiInstructions;
      if (v !== null && typeof v !== 'string') throw new BadRequestError('AI instructions must be text', 'WORK_BAD_AI_INSTRUCTIONS');
      const t = typeof v === 'string' ? v.trim() : '';
      if (t.length > 20_000) throw new BadRequestError('AI instructions are limited to 20,000 characters', 'WORK_BAD_AI_INSTRUCTIONS');
      input.settings = { ...input.settings, aiInstructions: t || null };
    }
    const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    data.settings = { ...((cur.settings as object) ?? {}), ...input.settings } as Prisma.InputJsonValue;
  }
  const p = await prisma.workProject.update({ where: { id: projectId }, data, select: { id: true, key: true, name: true } });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return p;
}

export async function setProjectArchived(userId: number, projectId: number, archived: boolean) {
  await requireProject(userId, projectId, 'project.settings');
  await prisma.workProject.update({ where: { id: projectId }, data: { archivedAt: archived ? new Date() : null } });
}

export async function deleteProject(userId: number, projectId: number, confirmKey: string) {
  const access = await requireProject(userId, projectId, 'project.delete');
  if (confirmKey.trim().toUpperCase() !== access.key) throw new BadRequestError('Type the project key exactly to confirm', 'WORK_CONFIRM_KEY');
  await prisma.workProject.update({ where: { id: projectId }, data: { deletedAt: new Date() } });
}

// ─── Thành viên dự án ────────────────────────────────────────────

export async function setProjectMember(userId: number, projectId: number, targetUserId: number, role: ProjectRole) {
  const access = await requireProject(userId, projectId, 'project.members');
  const inWs = await prisma.workMember.findFirst({ where: { workspaceId: access.workspaceId, userId: targetUserId }, select: { role: true } });
  if (!inWs) throw new BadRequestError('Invite this person to the workspace first', 'WORK_NOT_IN_WORKSPACE');
  // CTW-28: vai dự án của AI agent chỉ được MEMBER hoặc VIEWER (không ADMIN/CLIENT/TEACHER).
  if (!(['MEMBER', 'VIEWER'] as string[]).includes(role) && (await principalOf(targetUserId)) === 'AGENT') {
    throw new BadRequestError('An AI agent can only be a project Member or Viewer', 'WORK_AGENT_ROLE');
  }
  if ((inWs.role === 'OWNER' || inWs.role === 'ADMIN') && role !== 'ADMIN') {
    throw new ForbiddenError('Workspace admins are always project admins');
  }
  if (targetUserId === userId && role !== 'ADMIN') {
    // Không tự hạ quyền mình — dự án có thể mất người quản trị cuối cùng.
    throw new ForbiddenError('You cannot lower your own role');
  }
  await prisma.workProjectMember.upsert({
    where: { uk_work_project_member: { projectId, userId: targetUserId } },
    create: { projectId, userId: targetUserId, role },
    update: { role },
  });
  evictFromProject(projectId, targetUserId); // vào lại phòng với quyền mới
}

export async function removeProjectMember(userId: number, projectId: number, targetUserId: number) {
  await requireProject(userId, projectId, 'project.members');
  if (targetUserId === userId) throw new ForbiddenError('You cannot remove yourself from the project');
  const r = await prisma.workProjectMember.deleteMany({ where: { projectId, userId: targetUserId } });
  if (!r.count) throw new NotFoundError('This person has no project-specific role');
  evictFromProject(projectId, targetUserId);
}

// ─── Nhãn & component ────────────────────────────────────────────

export async function upsertLabel(userId: number, projectId: number, input: { id?: number; name: string; color?: string }) {
  // Tạo nhãn mới ngay trong ô chọn nhãn của thẻ là thao tác của người sửa thẻ (như Jira).
  await requireProject(userId, projectId, input.id ? 'project.settings' : 'issue.edit');
  const name = input.name.trim().slice(0, 50);
  if (!name) throw new BadRequestError('Label name is required', 'WORK_NAME_REQUIRED');
  try {
    if (input.id) {
      return await prisma.workLabel.update({ where: { id: input.id, projectId }, data: { name, color: input.color }, select: { id: true, name: true, color: true } });
    }
    return await prisma.workLabel.create({ data: { projectId, name, color: input.color ?? '#64748b' }, select: { id: true, name: true, color: true } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A label with that name already exists');
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') throw new NotFoundError('Label not found');
    throw err;
  }
}

export async function deleteLabel(userId: number, projectId: number, labelId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workLabel.deleteMany({ where: { id: labelId, projectId } });
  if (!r.count) throw new NotFoundError('Label not found');
}

export async function upsertComponent(userId: number, projectId: number, input: { id?: number; name: string; description?: string | null; leadId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new BadRequestError('Component name is required', 'WORK_NAME_REQUIRED');
  const data = { name, description: input.description?.trim() || null, leadId: input.leadId ?? null };
  try {
    if (input.id) return await prisma.workComponent.update({ where: { id: input.id, projectId }, data });
    return await prisma.workComponent.create({ data: { projectId, ...data } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A component with that name already exists');
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') throw new NotFoundError('Component not found');
    throw err;
  }
}

export async function deleteComponent(userId: number, projectId: number, componentId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workComponent.deleteMany({ where: { id: componentId, projectId } });
  if (!r.count) throw new NotFoundError('Component not found');
}


// ─── Lớp studio: loại dự án + mô-đun + người duyệt cổng ──────────

/** Cấu hình người duyệt cổng giai đoạn (settings.stageGate). Trống = mặc định ADMIN dự án. */
export interface StageGateConfig { approverIds: number[]; mode: 'SEQUENTIAL' | 'PARALLEL' }

export function stageGateOf(settings: unknown): StageGateConfig {
  const g = ((settings ?? {}) as { stageGate?: { approverIds?: unknown; mode?: unknown } }).stageGate;
  const ids = Array.isArray(g?.approverIds) ? [...new Set(g!.approverIds.filter((x): x is number => Number.isInteger(x) && x > 0))] : [];
  return { approverIds: ids, mode: g?.mode === 'PARALLEL' ? 'PARALLEL' : 'SEQUENTIAL' };
}

export async function getStudioConfig(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { kind: true, settings: true } });
  return { kind: access.kind, kindStored: p.kind, modules: access.modules, stageGate: stageGateOf(p.settings) };
}

/**
 * Đổi loại dự án / bật-tắt mô-đun / người duyệt cổng. Chỉ ADMIN dự án. Đổi loại
 * KHÔNG tự bật/tắt mô-đun (tránh một cú bấm làm mất board của cả nhóm) — client
 * gửi kèm `applyKindDefaults: true` nếu muốn lấy bộ mặc định của loại mới.
 * Tắt mô-đun không xoá dữ liệu: bật lại là thấy lại.
 */
export async function updateStudioConfig(
  userId: number,
  projectId: number,
  input: { kind?: ProjectKind; applyKindDefaults?: boolean; modules?: Partial<Record<string, boolean>>; stageGate?: { approverIds?: number[]; mode?: 'SEQUENTIAL' | 'PARALLEL' } | null },
) {
  const access = await requireProject(userId, projectId, 'studio.configure');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { kind: true, settings: true, template: true } });
  const settings = { ...((p.settings as Record<string, unknown>) ?? {}) };
  const before: ModuleMap = modulesOf(settings);
  let modules = before;
  const kind = input.kind ?? null;
  if (kind && input.applyKindDefaults) modules = defaultModulesFor(kind);
  if (input.modules) modules = mergeModules(modules, input.modules);
  settings.modules = modules;

  if (input.stageGate !== undefined) {
    if (input.stageGate === null) delete settings.stageGate;
    else {
      const ids = [...new Set(input.stageGate.approverIds ?? [])];
      for (const uid of ids) {
        const a = await loadProjectAccess(uid, projectId);
        if (!a || !can(a.role, 'approval.decide')) throw new BadRequestError('Every gate approver must be a project member who can approve (not a viewer)', 'WORK_BAD_APPROVER');
      }
      settings.stageGate = { approverIds: ids, mode: input.stageGate.mode === 'PARALLEL' ? 'PARALLEL' : 'SEQUENTIAL' };
    }
  }

  await prisma.workProject.update({
    where: { id: projectId },
    data: { ...(kind ? { kind } : {}), settings: settings as Prisma.InputJsonValue },
  });
  const changed = Object.keys(modules).filter((k) => modules[k as keyof ModuleMap] !== before[k as keyof ModuleMap]);
  if (kind || changed.length || input.stageGate !== undefined) {
    await auditProject(projectId, {
      actorId: userId, action: 'project.studio', targetType: 'project', targetId: projectId,
      summary: [
        kind && kind !== access.kind ? `Changed project type to ${kind}` : null,
        changed.length ? `Modules: ${changed.map((k) => `${k} ${modules[k as keyof ModuleMap] ? 'on' : 'off'}`).join(', ')}` : null,
        input.stageGate !== undefined ? 'Updated stage gate approvers' : null,
      ].filter(Boolean).join(' · ') || 'Updated studio settings',
      detail: { kind, modules, stageGate: settings.stageGate ?? null },
    });
  }
  // Bật/tắt cổng khách đổi phòng realtime của khách (phòng riêng ↔ phòng dự án) — đuổi ra để vào lại đúng phòng.
  if (modules.clientPortal !== before.clientPortal) {
    const clients = await prisma.workProjectMember.findMany({ where: { projectId, role: 'CLIENT' }, select: { userId: true } });
    for (const c of clients) evictFromProject(projectId, c.userId);
  }
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return getStudioConfig(userId, projectId);
}
