/**
 * CT Work — NƠI DUY NHẤT quyết định quyền.
 *
 * Mọi route và mọi tool của trợ lý AI đều hỏi ở đây. Không route nào tự so
 * sánh chuỗi vai trò. Hai lý do, cả hai đã từng xảy ra trong repo này:
 *   - "ẩn UI không phải ẩn API": nút bị ẩn nhưng API vẫn nhận lệnh.
 *   - "hai chỗ kiểm một quyền thì thành hai luật": sửa một chỗ, chỗ kia lệch.
 *
 * Tách làm hai tầng:
 *   1. `effectiveProjectRole()` + `can()` — HÀM THUẦN, không chạm DB, test được
 *      bằng bảng (permissions.test.ts).
 *   2. `loadProjectAccess()` / `requireProject()` — đọc DB rồi gọi tầng 1.
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import type { CommentVisibility, ProjectKind, ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import { modulesOf, projectKindOf, type ModuleMap } from './studio.js';

/** Mọi hành động có kiểm quyền. Thêm hành động mới thì thêm vào đây VÀ vào MATRIX. */
export type ProjectAction =
  | 'project.view'
  | 'project.settings'      // sửa tên, quy trình, loại thẻ, nhãn, component
  | 'project.members'       // thêm/bớt/đổi vai trò thành viên dự án
  | 'project.delete'
  | 'issue.create'
  | 'issue.edit'            // sửa mọi trường của thẻ
  | 'issue.transition'      // kéo sang cột khác
  | 'issue.delete'          // xoá bất kỳ thẻ nào (người báo tự xoá thẻ mình: xem canDeleteIssue)
  | 'comment.create'
  | 'comment.moderate'      // xoá bình luận của người khác
  | 'attachment.add'
  | 'sprint.manage'         // tạo/bắt đầu/kết thúc sprint, xếp backlog
  | 'ai.use'                // gọi trợ lý AI trong dự án (hạn mức kiểm riêng)
  // ── Lớp studio (đợt S1, 04/10/2026) ──
  | 'studio.configure'      // đổi loại dự án, bật/tắt mô-đun, người duyệt cổng
  | 'stage.manage'          // tạo/sửa giai đoạn, kích hoạt, ghi đè thứ tự (có lý do)
  | 'stage.requestGate'     // gửi giai đoạn đi duyệt cổng
  | 'approval.create'       // tạo yêu cầu phê duyệt
  | 'approval.decide'       // ĐƯỢC ĐỨNG TÊN người duyệt (vẫn chỉ quyết bước của CHÍNH mình)
  | 'approval.manage'       // huỷ yêu cầu của người khác
  | 'handoff.create'        // bàn giao thẻ cho bộ phận/người khác
  | 'handoff.manage'        // nhận/trả lại/huỷ bàn giao THAY người nhận
  // ── Tài liệu dự án (đợt S2a, mô-đun docs) ──
  | 'page.edit'             // tạo/sửa/di chuyển trang, liên kết thẻ (chỉ người thấy MỌI trang — xem docAccess)
  | 'page.manage';          // xoá / khôi phục phiên bản / đổi chế độ hiển thị của trang NGƯỜI KHÁC

export type WorkspaceAction =
  | 'workspace.view'
  | 'workspace.settings'
  | 'workspace.members'
  | 'workspace.createProject'
  | 'workspace.delete'
  | 'workspace.teams';      // tạo/sửa/xoá bộ phận, đổi thành viên bộ phận

const ALL_PROJECT_ROLES: readonly ProjectRole[] = ['ADMIN', 'MEMBER', 'VIEWER', 'TEACHER', 'CLIENT'];

/**
 * Bảng quyền dự án. Đọc theo hàng: hành động → những vai trò được làm.
 *
 * TEACHER (giảng viên) và CLIENT (khách hàng) xem được mọi thứ và bình luận
 * được — đó là lý do họ có mặt. CLIENT được tạo thẻ (báo lỗi, gửi yêu cầu);
 * TEACHER thì không, để thẻ trong đồ án luôn là công của sinh viên.
 * VIEWER chỉ xem.
 */
const PROJECT_MATRIX: Record<ProjectAction, readonly ProjectRole[]> = {
  'project.view': ALL_PROJECT_ROLES,
  'project.settings': ['ADMIN'],
  'project.members': ['ADMIN'],
  'project.delete': ['ADMIN'],
  'issue.create': ['ADMIN', 'MEMBER', 'CLIENT'],
  'issue.edit': ['ADMIN', 'MEMBER'],
  'issue.transition': ['ADMIN', 'MEMBER'],
  'issue.delete': ['ADMIN'],
  'comment.create': ['ADMIN', 'MEMBER', 'TEACHER', 'CLIENT'],
  'comment.moderate': ['ADMIN'],
  'attachment.add': ['ADMIN', 'MEMBER', 'CLIENT'],
  'sprint.manage': ['ADMIN'],
  'ai.use': ['ADMIN', 'MEMBER'],
  'studio.configure': ['ADMIN'],
  'stage.manage': ['ADMIN'],
  'stage.requestGate': ['ADMIN', 'MEMBER'],
  'approval.create': ['ADMIN', 'MEMBER'],
  // Khách hàng và giảng viên ĐƯỢC đứng tên duyệt (khách duyệt nghiệm thu, thầy
  // duyệt cổng đồ án) — nhưng chỉ bước của chính họ, xem canDecideApprovalStep.
  'approval.decide': ['ADMIN', 'MEMBER', 'TEACHER', 'CLIENT'],
  'approval.manage': ['ADMIN'],
  'handoff.create': ['ADMIN', 'MEMBER'],
  'handoff.manage': ['ADMIN'],
  'page.edit': ['ADMIN', 'MEMBER'],
  'page.manage': ['ADMIN'],
};

const WORKSPACE_MATRIX: Record<WorkspaceAction, readonly WorkspaceRole[]> = {
  'workspace.view': ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'],
  'workspace.settings': ['OWNER', 'ADMIN'],
  'workspace.members': ['OWNER', 'ADMIN'],
  'workspace.createProject': ['OWNER', 'ADMIN', 'MEMBER'],
  'workspace.delete': ['OWNER'],
  'workspace.teams': ['OWNER', 'ADMIN'],
};

/**
 * Vai trò thật của một người trong một dự án, gộp từ vai trò không gian,
 * vai trò dự án (nếu có dòng) và chế độ hiển thị của dự án.
 *
 *   - Không phải thành viên không gian ⇒ null (không thấy gì), kể cả khi
 *     còn sót dòng work_project_members — rời không gian là mất hết.
 *   - OWNER/ADMIN không gian ⇒ luôn ADMIN mọi dự án (người quản trị không
 *     thể tự khoá mình ra ngoài).
 *   - Có dòng dự án ⇒ dùng đúng vai trò đó.
 *   - Không có dòng: dự án WORKSPACE cho MEMBER quyền MEMBER; GUEST không
 *     thấy gì; dự án PRIVATE không ai thấy.
 */
export function effectiveProjectRole(input: {
  workspaceRole: WorkspaceRole | null;
  projectRole: ProjectRole | null;
  visibility: ProjectVisibility;
}): ProjectRole | null {
  const { workspaceRole, projectRole, visibility } = input;
  if (!workspaceRole) return null;
  if (workspaceRole === 'OWNER' || workspaceRole === 'ADMIN') return 'ADMIN';
  if (projectRole) return projectRole;
  if (workspaceRole === 'MEMBER' && visibility === 'WORKSPACE') return 'MEMBER';
  return null;
}

export function can(role: ProjectRole | null, action: ProjectAction, opts: ProjectOptions = {}, principal: Principal = 'HUMAN'): boolean {
  if (role === null) return false;
  // CTW-28: lớp phủ AI agent — chặn TRƯỚC bảng vai trò, không tuỳ chọn dự án nào nới được.
  if (principal === 'AGENT' && AGENT_DENIED_ACTIONS.has(action)) return false;
  if (PROJECT_MATRIX[action].includes(role)) return true;
  // Tuỳ chọn của dự án nới quyền (chỉ nới, không bao giờ siết dưới bảng gốc).
  if (action === 'sprint.manage' && role === 'MEMBER' && opts.membersManageSprints === true) return true;
  return false;
}

/** Tuỳ chọn quyền lưu trong WorkProject.settings. */
export interface ProjectOptions {
  /** "Allow members to manage sprints" — MEMBER được tạo/bắt đầu/kết thúc sprint. */
  membersManageSprints?: boolean;
}

/** Đọc tuỳ chọn quyền từ settings JSON (thiếu/sai kiểu ⇒ mặc định chặt). */
export function projectOptionsOf(settings: unknown): ProjectOptions {
  const s = (settings ?? {}) as Record<string, unknown>;
  return { membersManageSprints: s.membersManageSprints === true };
}

export function canWorkspace(role: WorkspaceRole | null, action: WorkspaceAction, principal: Principal = 'HUMAN'): boolean {
  // CTW-28: agent chỉ ĐỌC ở cấp không gian (xem danh sách, thành viên, dự án, bộ phận) — mọi hành động khác cấm.
  if (principal === 'AGENT' && action !== 'workspace.view') return false;
  return role !== null && WORKSPACE_MATRIX[action].includes(role);
}

/** Người báo được tự xoá thẻ của mình khi còn quyền sửa; ADMIN xoá được mọi thẻ. Agent: không bao giờ (tự xoá dấu vết). */
export function canDeleteIssue(role: ProjectRole | null, userId: number, reporterId: number | null, principal: Principal = 'HUMAN'): boolean {
  if (principal === 'AGENT') return false;
  if (can(role, 'issue.delete')) return true;
  return reporterId === userId && can(role, 'issue.edit');
}

/** Tác giả sửa/xoá bình luận của mình (khi còn quyền bình luận); ADMIN xoá mọi bình luận. */
export function canModifyComment(role: ProjectRole | null, userId: number, authorId: number | null): boolean {
  if (authorId !== null && authorId === userId && can(role, 'comment.create')) return true;
  return can(role, 'comment.moderate');
}

// ─── Lớp studio: luật theo NGƯỜI (hàm thuần) ─────────────────────

export interface StepLite { id: number; approverId: number; position: number; decision: string }

/**
 * Bước nào đang chờ quyết định NGAY BÂY GIỜ. PARALLEL: mọi bước PENDING.
 * SEQUENTIAL: chỉ bước PENDING có position nhỏ nhất (người sau đợi người trước).
 */
export function actionableSteps(mode: string, steps: StepLite[]): StepLite[] {
  const pending = steps.filter((s) => s.decision === 'PENDING').sort((a, b) => a.position - b.position || a.id - b.id);
  if (mode === 'PARALLEL') return pending;
  return pending.length ? [pending[0]] : [];
}

/**
 * Một người được quyết định một bước khi: vai trò được đứng tên duyệt, bước là
 * của CHÍNH người đó (không ai — kể cả ADMIN — duyệt thay; ADMIN muốn dừng thì
 * huỷ cả yêu cầu), yêu cầu còn PENDING, và tới lượt (tuần tự) hoặc song song.
 */
export function canDecideApprovalStep(
  role: ProjectRole | null,
  userId: number,
  approval: { status: string; mode: string; steps: StepLite[] },
  stepId: number,
  principal: Principal = 'HUMAN',
): boolean {
  // CTW-28: AI agent không bao giờ quyết phê duyệt / cổng / UAT — kể cả khi bước đứng tên nó (dữ liệu cũ của bot fp_*).
  if (!can(role, 'approval.decide', {}, principal) || approval.status !== 'PENDING') return false;
  const step = approval.steps.find((s) => s.id === stepId);
  if (!step || step.approverId !== userId) return false;
  return actionableSteps(approval.mode, approval.steps).some((s) => s.id === stepId);
}

/** Người tạo (còn quyền tạo) hoặc ADMIN dự án huỷ được yêu cầu phê duyệt. */
export function canCancelApproval(role: ProjectRole | null, userId: number, createdById: number | null): boolean {
  if (can(role, 'approval.manage')) return true;
  return createdById !== null && createdById === userId && can(role, 'approval.create');
}

/**
 * Nhận / trả lại một bàn giao: người nhận đích danh, hoặc trưởng bộ phận nhận
 * (khi bàn giao cho cả bộ phận) — miễn là còn quyền sửa thẻ trong dự án; ADMIN
 * dự án làm thay được. Khách/giảng viên/người chỉ xem thì không.
 */
export function canDecideHandoff(
  role: ProjectRole | null,
  userId: number,
  h: { toUserId: number | null; toTeamLeadIds: number[] },
): boolean {
  if (can(role, 'handoff.manage')) return true;
  if (!can(role, 'issue.edit')) return false;
  return h.toUserId === userId || h.toTeamLeadIds.includes(userId);
}

/** Người tạo bàn giao huỷ được khi còn chờ; ADMIN dự án luôn huỷ được. */
export function canCancelHandoff(role: ProjectRole | null, userId: number, createdById: number | null): boolean {
  if (can(role, 'handoff.manage')) return true;
  return createdById !== null && createdById === userId && can(role, 'handoff.create');
}

/**
 * Giao việc trong HÀNG ĐỢI của bộ phận: người sửa được thẻ, hoặc trưởng bộ
 * phận của thẻ đó (kể cả khi chỉ có vai VIEWER trong dự án — đó là việc của
 * trưởng bộ phận). Khách/giảng viên không bao giờ là thành viên bộ phận.
 */
export function canAssignTeamIssue(role: ProjectRole | null, isTeamLead: boolean): boolean {
  if (can(role, 'issue.edit')) return true;
  return isTeamLead && (role === 'VIEWER' || role === 'MEMBER' || role === 'ADMIN');
}

// ─── Tài liệu dự án (đợt S2a): luật theo NGƯỜI + chế độ hiển thị ──

/**
 * Quyền trên tài liệu của một người trong dự án.
 *   - Khách (vai CLIENT) và khách của không gian (GUEST, dù được vai gì trong
 *     dự án — trừ TEACHER) chỉ thấy trang `visibility = CLIENT` và KHÔNG sửa được
 *     gì — cổng khách là đợt S2b; ở S2a backend chặn đúng là đủ.
 *   - VIEWER / TEACHER thấy mọi trang, chỉ xem.
 *   - MEMBER / ADMIN sửa được; xoá/khôi phục/đổi hiển thị trang người khác cần ADMIN.
 */
export function docAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null): { view: 'ALL' | 'CLIENT' | null; edit: boolean; manage: boolean } {
  if (!role) return { view: null, edit: false, manage: false };
  // Giảng viên (TEACHER, thường là GUEST của không gian) đọc MỌI trang — chấm đồ án cần đọc tài liệu nội bộ của nhóm.
  const restricted = role === 'CLIENT' || (workspaceRole === 'GUEST' && role !== 'TEACHER');
  return {
    view: restricted ? 'CLIENT' : 'ALL',
    edit: !restricted && can(role, 'page.edit'),
    manage: !restricted && can(role, 'page.manage'),
  };
}

/** Người này đọc được trang có chế độ hiển thị `visibility` không. */
export function canViewPage(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, visibility: string): boolean {
  const a = docAccess(role, workspaceRole);
  if (a.view === 'ALL') return true;
  return a.view === 'CLIENT' && visibility === 'CLIENT';
}

/**
 * Xoá trang, khôi phục một phiên bản, đổi chế độ hiển thị: người SỞ HỮU trang
 * (khi còn quyền sửa) hoặc ADMIN dự án.
 */
export function canManagePage(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, userId: number, ownerId: number | null): boolean {
  const a = docAccess(role, workspaceRole);
  if (a.manage) return true;
  return a.edit && ownerId !== null && ownerId === userId;
}

// ─── Quản trị dự án (đợt S3b): CR · RAID · họp ────────────────────

/**
 * Quyền trên phần NỘI BỘ của CR / sổ RAID / cuộc họp (hàm thuần — permissions.test.ts):
 *   - Khách (vai CLIENT, dù dự án có bật cổng khách hay không) và khách của không gian
 *     (GUEST, trừ giảng viên TEACHER) KHÔNG thấy gì — rủi ro, chi phí CR, biên bản nội bộ
 *     là chuyện của đội. Khách chỉ thấy cuộc họp CÓ MỜI họ + biên bản đã chia sẻ, qua
 *     /portal/meetings (meetings.service portal*), và CR đã chia sẻ qua phê duyệt của họ.
 *   - VIEWER / TEACHER chỉ xem; MEMBER / ADMIN tạo + sửa.
 *   - Xoá: người tạo (khi còn quyền sửa) hoặc ADMIN — xem `canDeleteGovernance`.
 */
export function governanceAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null): { view: boolean; edit: boolean; manage: boolean } {
  if (!role) return { view: false, edit: false, manage: false };
  const restricted = role === 'CLIENT' || (workspaceRole === 'GUEST' && role !== 'TEACHER');
  if (restricted) return { view: false, edit: false, manage: false };
  return { view: true, edit: can(role, 'issue.edit'), manage: role === 'ADMIN' };
}

/** Xoá CR / dòng RAID / cuộc họp: ADMIN, hoặc người tạo còn quyền sửa. */
export function canDeleteGovernance(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, userId: number, createdById: number | null): boolean {
  const g = governanceAccess(role, workspaceRole);
  if (g.manage) return true;
  return g.edit && createdById !== null && createdById === userId;
}

// ─── Service desk & SLA (đợt S5a, mô-đun serviceDesk) ──────────────

/**
 * Quyền trên phần NỘI BỘ của service desk (hàng đợi, đồng hồ SLA, sự kiện SLA, Problem, báo cáo, cấu hình):
 *   - Khách (vai CLIENT) và GUEST (trừ giảng viên TEACHER) KHÔNG thấy — khách chỉ gửi yêu cầu, xem trạng thái,
 *     "We'll respond within …" và trả lời CSAT qua /portal/desk/** (đã nằm trong danh sách trắng /portal/**).
 *   - VIEWER / TEACHER chỉ xem; MEMBER / ADMIN xử lý (tạo, chờ khách, đổi mức P, Problem, postmortem).
 *   - Cấu hình (loại yêu cầu, ma trận, mục tiêu, lịch làm việc): ADMIN dự án.
 * Cùng luật "người của đội" với governanceAccess — một định nghĩa, không chép lại.
 */
export function deskAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null): { view: boolean; work: boolean; configure: boolean } {
  const g = governanceAccess(role, workspaceRole);
  return { view: g.view, work: g.edit, configure: g.manage };
}

// ─── Resources (06/10/2026, mô-đun resources) ─────────────────────

/**
 * Quyền trên thư viện link của dự án (hàm thuần — permissions.test.ts):
 *   - Khách (vai CLIENT) và khách của không gian (GUEST, trừ giảng viên TEACHER) chỉ thấy link
 *     `visibility = CLIENT`, KHÔNG thấy linkStatus/openCount, không thêm/sửa gì. Khách bị cách ly (cổng
 *     khách bật) đi qua /portal/resources (danh sách trắng `/portal/**`).
 *   - VIEWER / TEACHER thấy mọi link, chỉ đọc.
 *   - MEMBER thêm link + sửa/xoá link CỦA MÌNH; ADMIN sửa tất và quản lý nhóm.
 */
export function resourceAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null): { view: 'ALL' | 'CLIENT' | null; edit: boolean; manage: boolean } {
  if (!role) return { view: null, edit: false, manage: false };
  const restricted = role === 'CLIENT' || (workspaceRole === 'GUEST' && role !== 'TEACHER');
  if (restricted) return { view: 'CLIENT', edit: false, manage: false };
  return { view: 'ALL', edit: role === 'ADMIN' || role === 'MEMBER', manage: role === 'ADMIN' };
}

/** Sửa / xoá / ghim một link: ADMIN dự án, hoặc người tạo còn quyền thêm link. */
export function canModifyResource(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, userId: number, createdById: number | null): boolean {
  const a = resourceAccess(role, workspaceRole);
  if (a.manage) return true;
  return a.edit && createdById !== null && createdById === userId;
}

// ─── Tầng đọc DB ──────────────────────────────────────────────────

export interface ProjectAccess {
  projectId: number;
  workspaceId: number;
  key: string;
  role: ProjectRole;
  workspaceRole: WorkspaceRole;
  /** CTW-28: HUMAN | AGENT — đọc từ users.kind trong CÙNG truy vấn (không tin route truyền vào). */
  principal: Principal;
  /** settings.agents của dự án (mặc định chặt). */
  agentOptions: AgentOptions;
  options: ProjectOptions;
  /** Loại dự án hiệu lực (cột kind, hoặc suy từ mẫu với dự án cũ). */
  kind: ProjectKind;
  /** Mô-đun studio đang bật (settings.modules; dự án cũ ⇒ tắt hết). */
  modules: ModuleMap;
}

/**
 * Tính quyền của `userId` trên dự án. Trả null nếu không vào được — route
 * phải biến null thành 404 (KHÔNG 403): 403 cho người lạ biết dự án tồn tại.
 */
export async function loadProjectAccess(userId: number, projectId: number): Promise<ProjectAccess | null> {
  const project = await prisma.workProject.findFirst({
    where: { id: projectId, deletedAt: null, workspace: { deletedAt: null } },
    select: {
      id: true,
      key: true,
      workspaceId: true,
      visibility: true,
      settings: true,
      kind: true,
      template: true,
      clientRequest: { select: { id: true } },
      workspace: { select: { members: { where: { userId }, select: { role: true, user: { select: { kind: true } } } } } },
      members: { where: { userId }, select: { role: true } },
    },
  });
  if (!project) return null;
  const principal: Principal = project.workspace.members[0]?.user.kind === 'AGENT' ? 'AGENT' : 'HUMAN';
  let workspaceRole = (project.workspace.members[0]?.role ?? null) as WorkspaceRole | null;
  const projectRole = (project.members[0]?.role ?? null) as ProjectRole | null;
  // MEMBER chỉ là khách cổng ⇒ coi như GUEST (loadWorkspaceRole). Chỉ hỏi DB khi kết
  // quả có thể đổi: vào ngầm (không dòng dự án, dự án mở cho không gian) hoặc vai CLIENT.
  if (workspaceRole === 'MEMBER' && ((!projectRole && project.visibility === 'WORKSPACE') || projectRole === 'CLIENT')
    && (await portalOnlyWorkspaceIds(userId, project.workspaceId)).has(project.workspaceId)) {
    workspaceRole = 'GUEST';
  }
  const role = effectiveProjectRole({
    workspaceRole,
    projectRole,
    visibility: project.visibility as ProjectVisibility,
  });
  if (!role || !workspaceRole) return null;
  return {
    projectId: project.id, workspaceId: project.workspaceId, key: project.key, role, workspaceRole,
    principal, agentOptions: agentOptionsOf(project.settings),
    options: projectOptionsOf(project.settings),
    kind: projectKindOf({ kind: project.kind, template: project.template, fromClientRequest: !!project.clientRequest }),
    modules: modulesOf(project.settings),
  };
}

/** Như loadProjectAccess nhưng ném lỗi: 404 khi không thấy, 403 khi thấy mà không được làm. */
export async function requireProject(userId: number, projectId: number, action: ProjectAction): Promise<ProjectAccess> {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (access.principal === 'AGENT' && AGENT_DENIED_ACTIONS.has(action)) throw await agentForbidden(userId, AGENT_ACTION_VERBS[action] ?? 'do this');
  if (!can(access.role, action, access.options, access.principal)) throw new ForbiddenError('You do not have permission to do this in this project');
  return access;
}

/**
 * Vai trò không gian HIỆU LỰC — mọi tuyến cấp không gian hỏi ở đây. Khác vai lưu
 * trong DB ở đúng một chỗ: MEMBER "chỉ là khách cổng" (xem `portalOnlyWorkspaceIds`)
 * bị coi như GUEST — mất quyền ngầm vào dự án mở cho cả không gian, không tạo dự án,
 * không thấy bộ phận / danh sách người / workload của đội.
 */
export async function loadWorkspaceRole(userId: number, workspaceId: number): Promise<WorkspaceRole | null> {
  return (await loadWorkspaceAccess(userId, workspaceId))?.role ?? null;
}

/** Vai không gian hiệu lực + principal (CTW-28). */
export async function loadWorkspaceAccess(userId: number, workspaceId: number): Promise<{ role: WorkspaceRole; principal: Principal } | null> {
  const m = await prisma.workMember.findFirst({
    where: { workspaceId, userId, workspace: { deletedAt: null } },
    select: { role: true, user: { select: { kind: true } } },
  });
  if (!m) return null;
  let role = m.role as WorkspaceRole;
  if (role === 'MEMBER' && (await portalOnlyWorkspaceIds(userId, workspaceId)).has(workspaceId)) role = 'GUEST';
  return { role, principal: m.user.kind === 'AGENT' ? 'AGENT' : 'HUMAN' };
}

export async function requireWorkspace(userId: number, workspaceId: number, action: WorkspaceAction): Promise<WorkspaceRole> {
  const a = await loadWorkspaceAccess(userId, workspaceId);
  if (!a) throw new NotFoundError('Workspace not found');
  if (a.principal === 'AGENT' && action !== 'workspace.view') throw await agentForbidden(userId, WORKSPACE_ACTION_VERBS[action]);
  if (!canWorkspace(a.role, action, a.principal)) throw new ForbiddenError('You do not have permission to do this in this workspace');
  return a.role;
}

// ─── Cổng khách (đợt S2b, mô-đun clientPortal): CÁCH LY khách ─────

/**
 * Khách bị cách ly: vai CLIENT ở dự án BẬT clientPortal. Chỉ người này bị lọc
 * (chỉ thấy thẻ/tệp/bình luận đã chia sẻ). Dự án không bật cổng khách ⇒ vai
 * CLIENT giữ hành vi cũ (thấy mọi thẻ) — "dự án cũ y nguyên".
 */
export function isClientScoped(a: { role: ProjectRole | null; modules?: ModuleMap | null }): boolean {
  return a.role === 'CLIENT' && a.modules?.clientPortal === true;
}

/**
 * DANH SÁCH TRẮNG tuyến /projects/:pid/<sub> mà khách bị cách ly được gọi. Mọi
 * tuyến khác ⇒ 403 CLIENT_PORTAL_ONLY (work.routes.ts — một chốt cho mọi tuyến,
 * kể cả tuyến thêm SAU này: quên khai ở đây = khách bị chặn, không phải bị lộ).
 * Tuyến được mở ở đây vẫn phải tự LỌC trong service (thẻ clientVisible, bình
 * luận PUBLIC, tệp clientVisible…) — xem portal.service.ts / issues.service.ts.
 */
const CLIENT_ROUTES: Array<[method: string, re: RegExp]> = [
  ['GET', /^$/], // cấu hình dự án — đã rút gọn cho khách (projects.service getProjectConfig)
  ['*', /^\/portal(\/.*)?$/],
  ['GET', /^\/issues$/],
  ['GET', /^\/board$/],
  ['GET', /^\/search$/],
  ['GET', /^\/issues\/\d+$/],
  ['GET', /^\/issues\/\d+\/comments$/],
  ['POST', /^\/issues\/\d+\/comments$/],
  ['PATCH', /^\/issues\/\d+\/comments\/\d+$/],
  ['DELETE', /^\/issues\/\d+\/comments\/\d+$/],
  ['PUT', /^\/issues\/\d+\/comments\/\d+\/reactions\/[^/]+$/],
  ['POST', /^\/issues\/\d+\/attachments\/(presign|complete)$/],
  ['GET', /^\/attachments\/\d+\/url$/],
  ['GET', /^\/issues\/\d+\/pages$/],
  ['GET', /^\/approvals$/],
  ['GET', /^\/approvals\/\d+$/],
  ['POST', /^\/approvals\/\d+\/decide$/],
  ['GET', /^\/pages$/],
  ['GET', /^\/pages\/search$/],
  ['GET', /^\/pages\/\d+$/],
  ['GET', /^\/pages\/\d+\/markdown$/],
  // Đợt 6a: ảnh trong tài liệu/mô tả/bình luận — docs3a.readImage chỉ trả ảnh nằm trong nội dung ĐÃ chia sẻ.
  ['GET', /^\/images\/\d+$/],
];

/** `sub` = phần đường dẫn SAU /projects/:pid ('' cho chính dự án). Hàm thuần — test bằng bảng. */
export function clientPortalRouteAllowed(method: string, sub: string): boolean {
  const m = method.toUpperCase();
  const path = sub === '/' ? '' : sub.replace(/\/+$/, '');
  return CLIENT_ROUTES.some(([mm, re]) => (mm === '*' || mm === m || (mm === 'GET' && m === 'HEAD')) && re.test(path));
}

/** Id các dự án mà `userId` là khách bị cách ly (vai CLIENT + clientPortal bật). */
export async function clientScopedProjectIds(userId: number, workspaceId?: number): Promise<Set<number>> {
  const rows = await prisma.workProjectMember.findMany({
    where: { userId, role: 'CLIENT', project: { deletedAt: null, ...(workspaceId ? { workspaceId } : {}), workspace: { deletedAt: null } } },
    select: { projectId: true, project: { select: { settings: true, workspace: { select: { members: { where: { userId }, select: { role: true } } } } } } },
  });
  const out = new Set<number>();
  for (const r of rows) {
    const ws = r.project.workspace.members[0]?.role;
    // OWNER/ADMIN không gian luôn là ADMIN dự án — không bao giờ là khách.
    if (!ws || ws === 'OWNER' || ws === 'ADMIN') continue;
    if (modulesOf(r.project.settings).clientPortal) out.add(r.projectId);
  }
  return out;
}

/**
 * Không gian mà `userId` CHỈ là khách cổng: có ít nhất một dự án mang vai CLIENT ở dự
 * án bật clientPortal, và KHÔNG có dòng dự án tường minh nào mang vai khác
 * (ADMIN/MEMBER/VIEWER/TEACHER). Ở những không gian này, vai MEMBER bị hạ thành GUEST
 * (loadWorkspaceRole / loadProjectAccess / mọi vòng lặp tự tính vai — dùng
 * `effectiveWorkspaceRole`).
 *
 * LUẬT AN TOÀN cho người "vừa khách vừa nhân viên" (CLIENT ở A + vai tường minh khác
 * ở B): KHÔNG hạ — họ là nhân viên của không gian; riêng dự án A vẫn bị loại khỏi
 * mọi đường xuyên dự án (tìm kiếm, My work, portfolio, workload — `clientScopedProjectIds`)
 * và bên trong A họ vẫn bị cách ly như khách. Vai ngầm (MEMBER thấy dự án mở cho
 * không gian) KHÔNG tính là "vai nhân viên" — nếu tính, mọi khách cũ là MEMBER đều
 * thoát cách ly.
 */
export async function portalOnlyWorkspaceIds(userId: number, workspaceId?: number): Promise<Set<number>> {
  const rows = await prisma.workProjectMember.findMany({
    where: { userId, project: { deletedAt: null, ...(workspaceId ? { workspaceId } : {}), workspace: { deletedAt: null } } },
    select: { role: true, project: { select: { workspaceId: true, settings: true } } },
  });
  const scoped = new Set<number>();
  const staff = new Set<number>();
  for (const r of rows) {
    if (r.role === 'CLIENT') {
      if (modulesOf(r.project.settings).clientPortal) scoped.add(r.project.workspaceId);
    } else staff.add(r.project.workspaceId);
  }
  return new Set([...scoped].filter((w) => !staff.has(w)));
}

/** Hạ vai không gian theo luật trên (hàm thuần — vòng lặp đã có sẵn tập `portalOnly`). */
export function effectiveWorkspaceRole(role: WorkspaceRole, portalOnly: boolean): WorkspaceRole {
  return role === 'MEMBER' && portalOnly ? 'GUEST' : role;
}

/** Những người trong không gian bị hạ MEMBER ⇒ GUEST (cho danh sách thành viên dự án, workload). */
export async function portalOnlyUserIds(workspaceId: number): Promise<Set<number>> {
  const clients = await prisma.workProjectMember.findMany({
    where: { role: 'CLIENT', project: { workspaceId, deletedAt: null } },
    select: { userId: true, project: { select: { settings: true } } },
  });
  const cand = [...new Set(clients.filter((c) => modulesOf(c.project.settings).clientPortal).map((c) => c.userId))];
  if (!cand.length) return new Set();
  const staff = await prisma.workProjectMember.findMany({
    where: { userId: { in: cand }, role: { not: 'CLIENT' }, project: { workspaceId, deletedAt: null } },
    select: { userId: true },
  });
  const s = new Set(staff.map((x) => x.userId));
  return new Set(cand.filter((u) => !s.has(u)));
}

/**
 * Người này là "khách của cổng" trong không gian: GUEST của không gian VÀ là
 * khách bị cách ly ở ít nhất một dự án. Dùng cho tuyến cấp không gian (thành
 * viên, ngày nghỉ, đếm số) — khách không được thấy người/dự án ngoài phạm vi.
 */
export async function isPortalClientInWorkspace(userId: number, workspaceId: number): Promise<boolean> {
  const role = await loadWorkspaceRole(userId, workspaceId);
  if (role !== 'GUEST') return false;
  return (await clientScopedProjectIds(userId, workspaceId)).size > 0;
}

/**
 * Chế độ hiển thị thật của một bình luận MỚI (cổng khách S2b):
 *   - khách bị cách ly ⇒ luôn PUBLIC (khách không viết được ghi chú nội bộ);
 *   - dự án bật clientPortal ⇒ theo lựa chọn, mặc định INTERNAL; PUBLIC chỉ khi thẻ đã chia sẻ;
 *   - dự án không bật cổng khách ⇒ INTERNAL (cột không được đọc).
 */
export function commentVisibilityFor(
  access: { role: ProjectRole | null; modules?: ModuleMap | null; principal?: Principal }, issueShared: boolean, wanted: CommentVisibility | undefined,
): CommentVisibility {
  // CTW-28: AI agent không bao giờ nói thẳng với khách — bình luận của nó luôn INTERNAL (bỏ qua lựa chọn, không lỗi).
  if (access.principal === 'AGENT') return 'INTERNAL';
  if (isClientScoped(access)) return 'PUBLIC';
  if (!access.modules?.clientPortal) return 'INTERNAL';
  if (wanted === 'PUBLIC') {
    if (!issueShared) throw new BadRequestError('Share this issue with the client before replying to them', 'WORK_ISSUE_NOT_SHARED');
    return 'PUBLIC';
  }
  return 'INTERNAL';
}


// ─── AI agent thành viên (CTW-28, 06/10/2026 — docs/ct-work-ai-agents-thiet-ke.md §3) ─────────
//
// Rào chắn HAI tầng, cả hai fail-closed:
//   1. Tầng TUYẾN (`agentRouteAllowed` — chốt ở middleware /projects/:pid): danh sách CẤM tuyến đối ngoại.
//   2. Tầng HÀNH ĐỘNG (yêu cầu của trưởng nhóm khi duyệt): `requireProject` tự đọc users.kind và chặn
//      AGENT_DENIED_ACTIONS; hàm service không đi qua `can()` (tài chính, gửi khách, cổng, duyệt…) gọi
//      `assertHumanActor()` ở dòng đầu. Gọi từ tuyến nào (REST, MCP sau này, AI, script) cũng bị như nhau —
//      tuyến MỚI quên khai ở tầng 1 vẫn không mở được hành động bị cấm.

/** Chủ thể gọi: người hay AI agent (users.kind). */
export type Principal = 'HUMAN' | 'AGENT';

/** Hành động agent KHÔNG BAO GIỜ được, kể cả khi vai dự án cho phép. approval.create / handoff.create VẪN được. */
export const AGENT_DENIED_ACTIONS: ReadonlySet<ProjectAction> = new Set<ProjectAction>([
  'project.settings', 'project.members', 'project.delete',
  'issue.delete',                 // agent tự xoá dấu vết: không
  'comment.moderate',
  'sprint.manage',
  'studio.configure', 'stage.manage', 'stage.requestGate',
  'approval.decide', 'approval.manage',
  'handoff.manage',
  'page.manage',
  'ai.use',                       // GĐ1: agent bên ngoài không tiêu lượt trợ lý AI của web
]);

const AGENT_ACTION_VERBS: Partial<Record<ProjectAction, string>> = {
  'project.settings': 'change project settings', 'project.members': 'manage project members', 'project.delete': 'delete projects',
  'issue.delete': 'delete issues', 'comment.moderate': 'moderate comments', 'sprint.manage': 'manage sprints',
  'studio.configure': 'configure the project', 'stage.manage': 'manage stages', 'stage.requestGate': 'request stage gates',
  'approval.decide': 'decide approvals', 'approval.manage': 'manage approvals', 'handoff.manage': 'manage handoffs',
  'page.manage': 'manage pages', 'ai.use': 'use the CT Work AI assistant',
};
const WORKSPACE_ACTION_VERBS: Record<WorkspaceAction, string> = {
  'workspace.view': 'view the workspace', 'workspace.settings': 'change workspace settings', 'workspace.members': 'manage workspace members',
  'workspace.createProject': 'create projects', 'workspace.delete': 'delete or transfer workspaces', 'workspace.teams': 'manage teams',
};

/**
 * Lỗi 403 WORK_AGENT_FORBIDDEN kèm tên người chịu trách nhiệm — agent đọc `owner` để hỏi người thay vì thử lại.
 * Trả lỗi (không ném) để nơi gọi `throw await agentForbidden(...)`.
 */
export async function agentForbidden(agentUserId: number, verb: string): Promise<AppError> {
  const a = await prisma.workAgent.findUnique({ where: { userId: agentUserId }, select: { owner: { select: { username: true, displayName: true, fullName: true } } } }).catch(() => null);
  const ownerName = a?.owner ? (a.owner.displayName || a.owner.fullName || a.owner.username) : null;
  return new AppError(
    `AI agents cannot ${verb} in CT Work. Ask the agent's owner${ownerName ? ` (${ownerName})` : ''} to do this.`,
    403, 'WORK_AGENT_FORBIDDEN', { owner: a?.owner?.username ?? null },
  );
}

/** users.kind của một người (một truy vấn khoá chính). Không có ⇒ HUMAN (người lạ sẽ bị chặn ở tầng quyền khác). */
export async function principalOf(userId: number): Promise<Principal> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
  return u?.kind === 'AGENT' ? 'AGENT' : 'HUMAN';
}

/**
 * Chốt TẦNG HÀNH ĐỘNG: hàm service có tác dụng đối ngoại / quyết định / tiền gọi dòng này ĐẦU TIÊN.
 * Agent ⇒ 403 WORK_AGENT_FORBIDDEN, bất kể gọi từ tuyến nào.
 */
export async function assertHumanActor(userId: number, verb: string): Promise<void> {
  if ((await principalOf(userId)) === 'AGENT') throw await agentForbidden(userId, verb);
}

/** settings.agents của dự án — thiếu/sai kiểu ⇒ mặc định chặt (§2.1). */
export interface AgentOptions {
  /** Agent kéo vào DONE ⇒ server đổi đích thành cột Review. Mặc định BẬT. */
  doneToReview: boolean;
  /** Trạng thái Review chỉ định (phải thuộc workflow của thẻ); null ⇒ tự dò tên review/qa/verify. */
  reviewStatusId: number | null;
  allowCreateIssues: boolean;
  /** Claim thẻ CHƯA giao ai ⇒ tự giao cho agent. Mặc định TẮT. */
  allowSelfAssign: boolean;
  maxOpenLeases: number;
  leaseMinutes: number;
  /** Người duyệt mặc định cho request_review (GĐ1 A10) — rỗng ⇒ owner của agent. */
  reviewerIds: number[];
}

export function agentOptionsOf(settings: unknown): AgentOptions {
  const a = (((settings ?? {}) as Record<string, unknown>).agents ?? {}) as Record<string, unknown>;
  const int = (v: unknown, lo: number, hi: number, d: number) => (typeof v === 'number' && Number.isInteger(v) && v >= lo && v <= hi ? v : d);
  return {
    doneToReview: a.doneToReview !== false,
    reviewStatusId: typeof a.reviewStatusId === 'number' && Number.isInteger(a.reviewStatusId) && a.reviewStatusId > 0 ? a.reviewStatusId : null,
    allowCreateIssues: a.allowCreateIssues !== false,
    allowSelfAssign: a.allowSelfAssign === true,
    maxOpenLeases: int(a.maxOpenLeases, 1, 20, 3),
    leaseMinutes: int(a.leaseMinutes, 5, 240, 30),
    reviewerIds: Array.isArray(a.reviewerIds) ? (a.reviewerIds as unknown[]).filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x > 0).slice(0, 10) : [],
  };
}

/**
 * Tuyến dưới /projects/:pid mà AGENT bị cấm bất kể vai. Khai CẤM (không khai MỞ) vì agent cần hầu hết tuyến
 * đọc/ghi thẻ — vì vậy tầng hành động (requireProject + assertHumanActor) là lưới thứ hai cho tuyến quên khai.
 * Thêm tuyến có tác dụng đối ngoại (khách, tiền, xoá, cấu hình) ⇒ thêm vào đây VÀ vào bảng permissions.test.ts.
 */
const AGENT_DENIED_ROUTES: Array<[method: string, re: RegExp]> = [
  // Tiền & báo cáo/gửi cho khách
  ['*', /^\/finance(\/.*)?$/],
  ['*', /^\/reports\/client-weekly\/(send|polish|schedule)$/],
  // Cổng khách & chia sẻ ra ngoài
  ['*', /^\/portal(\/.*)?$/],
  ['*', /^\/share-links(\/.*)?$/],
  ['PUT', /^\/issues\/\d+\/client-visible$/], ['*', /^\/attachments\/\d+\/client$/],
  ['PUT', /^\/changes\/\d+\/client-visible$/], ['POST', /^\/changes\/\d+\/approval$/],
  ['*', /^\/meetings\/\d+\/(share|invites)$/],
  // Duyệt / quyết định
  ['POST', /^\/approvals\/\d+\/decide$/], ['POST', /^\/stages\/\d+\/(request-gate|activate)$/],
  // Xuất/nhập dữ liệu, tích hợp ra ngoài
  ['*', /^\/exports?(\/.*)?$/], ['POST', /^\/import$/],
  ['*', /^\/chat-hooks(\/.*)?$/], ['*', /^\/webhooks(\/.*)?$/], ['*', /^\/github(\/.*)?$/], ['*', /^\/gitlab(\/.*)?$/],
  ['*', /^\/automation(\/.*)?$/],
  // Cấu hình dự án / quyền / thành viên / xoá
  ['*', /^\/members(\/.*)?$/], ['PATCH', /^$/], ['DELETE', /^$/], ['*', /^\/archive$/],
  ['*', /^\/(labels|components|workflows|statuses|issue-types|issue-templates|custom-fields|board-columns|studio|desk\/settings|spec-settings|agent-settings|avatar|sample-data|onboarding)(\/.*)?$/],
  ['PUT', /^\/capacity\/\d+$/], ['POST', /^\/tests\/enable$/],
  ['POST', /^\/versions\/\d+\/release$/], ['DELETE', /^\/versions\/\d+$/],
  ['DELETE', /^\/issues\/\d+$/], ['POST', /^\/issues\/\d+\/move-project$/], ['POST', /^\/issues\/bulk$/], ['*', /^\/trash(\/.*)?$/],
  ['*', /^\/edit-lock$/],
  // GĐ1: agent bên ngoài không tiêu lượt trợ lý AI của web (GĐ2 mở riêng cho BUILTIN)
  ['*', /^\/ai(\/.*)?$/],
  // Đợt 3C: agent không tự khởi động/dừng agent dựng sẵn (mỗi lượt tiêu tiền LLM của web — chỉ NGƯỜI Pro/admin bấm).
  // Agent BUILTIN chạy lệnh qua registry, không qua tuyến này.
  ['*', /^\/issues\/\d+\/agent-runs(\/.*)?$/], ['*', /^\/agent-runs(\/.*)?$/],
];

/** `sub` = phần SAU /projects/:pid. Hàm thuần — test bằng bảng (permissions.test.ts). */
export function agentRouteAllowed(method: string, sub: string): boolean {
  const m = method.toUpperCase();
  const path = sub === '/' ? '' : sub.replace(/\/+$/, '');
  return !AGENT_DENIED_ROUTES.some(([mm, re]) => (mm === '*' || mm === m || (mm === 'GET' && m === 'HEAD')) && re.test(path));
}

/**
 * Tuyến NGOÀI /projects/:pid mà token agent được gọi — DANH SÁCH TRẮNG (fail-closed, khác tuyến dự án):
 * chỉ ĐỌC không gian/thành viên/dự án/bộ phận (§3.1), việc của tôi, tìm kiếm, tra mã dự án, và /agents/me/**.
 * Mọi tuyến khác (tạo không gian, nhận lời mời, token, lịch, thùng rác, quản trị không gian…) ⇒ 403.
 * `scoped` = token giới hạn dự án ⇒ không cho tìm kiếm xuyên dự án (sẽ lộ dự án ngoài phạm vi token).
 */
export function agentTopRouteAllowed(method: string, path: string, scoped = false): boolean {
  const m = method.toUpperCase();
  const p = path.replace(/\/+$/, '') || '/';
  if (/^\/projects\/\d+(\/.*)?$/.test(p)) return true; // chốt riêng ở middleware /projects/:pid
  if (/^\/agents\/me(\/.*)?$/.test(p)) return true;
  if (m !== 'GET' && m !== 'HEAD') return false;
  if (/^\/workspaces(\/by-slug\/[^/]+|\/\d+(\/(members|projects|teams))?)?$/.test(p)) return true;
  if (/^\/me\/(work|approvals|handoffs|notify-settings)$/.test(p)) return true;
  if (/^\/resolve\/[^/]+\/[^/]+$/.test(p)) return true;
  if (!scoped && /^\/search(\/(docs|facets))?$/.test(p)) return true;
  return false;
}
