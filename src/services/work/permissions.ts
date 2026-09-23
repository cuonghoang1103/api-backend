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
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';

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
  | 'ai.use';               // gọi trợ lý AI trong dự án (hạn mức kiểm riêng)

export type WorkspaceAction =
  | 'workspace.view'
  | 'workspace.settings'
  | 'workspace.members'
  | 'workspace.createProject'
  | 'workspace.delete';

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
};

const WORKSPACE_MATRIX: Record<WorkspaceAction, readonly WorkspaceRole[]> = {
  'workspace.view': ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'],
  'workspace.settings': ['OWNER', 'ADMIN'],
  'workspace.members': ['OWNER', 'ADMIN'],
  'workspace.createProject': ['OWNER', 'ADMIN', 'MEMBER'],
  'workspace.delete': ['OWNER'],
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

export function can(role: ProjectRole | null, action: ProjectAction, opts: ProjectOptions = {}): boolean {
  if (role === null) return false;
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

export function canWorkspace(role: WorkspaceRole | null, action: WorkspaceAction): boolean {
  return role !== null && WORKSPACE_MATRIX[action].includes(role);
}

/** Người báo được tự xoá thẻ của mình khi còn quyền sửa; ADMIN xoá được mọi thẻ. */
export function canDeleteIssue(role: ProjectRole | null, userId: number, reporterId: number | null): boolean {
  if (can(role, 'issue.delete')) return true;
  return reporterId === userId && can(role, 'issue.edit');
}

/** Tác giả sửa/xoá bình luận của mình (khi còn quyền bình luận); ADMIN xoá mọi bình luận. */
export function canModifyComment(role: ProjectRole | null, userId: number, authorId: number | null): boolean {
  if (authorId !== null && authorId === userId && can(role, 'comment.create')) return true;
  return can(role, 'comment.moderate');
}

// ─── Tầng đọc DB ──────────────────────────────────────────────────

export interface ProjectAccess {
  projectId: number;
  workspaceId: number;
  key: string;
  role: ProjectRole;
  workspaceRole: WorkspaceRole;
  options: ProjectOptions;
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
      workspace: { select: { members: { where: { userId }, select: { role: true } } } },
      members: { where: { userId }, select: { role: true } },
    },
  });
  if (!project) return null;
  const workspaceRole = (project.workspace.members[0]?.role ?? null) as WorkspaceRole | null;
  const role = effectiveProjectRole({
    workspaceRole,
    projectRole: (project.members[0]?.role ?? null) as ProjectRole | null,
    visibility: project.visibility as ProjectVisibility,
  });
  if (!role || !workspaceRole) return null;
  return { projectId: project.id, workspaceId: project.workspaceId, key: project.key, role, workspaceRole, options: projectOptionsOf(project.settings) };
}

/** Như loadProjectAccess nhưng ném lỗi: 404 khi không thấy, 403 khi thấy mà không được làm. */
export async function requireProject(userId: number, projectId: number, action: ProjectAction): Promise<ProjectAccess> {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (!can(access.role, action, access.options)) throw new ForbiddenError('You do not have permission to do this in this project');
  return access;
}

export async function loadWorkspaceRole(userId: number, workspaceId: number): Promise<WorkspaceRole | null> {
  const m = await prisma.workMember.findFirst({
    where: { workspaceId, userId, workspace: { deletedAt: null } },
    select: { role: true },
  });
  return (m?.role ?? null) as WorkspaceRole | null;
}

export async function requireWorkspace(userId: number, workspaceId: number, action: WorkspaceAction): Promise<WorkspaceRole> {
  const role = await loadWorkspaceRole(userId, workspaceId);
  if (!role) throw new NotFoundError('Workspace not found');
  if (!canWorkspace(role, action)) throw new ForbiddenError('You do not have permission to do this in this workspace');
  return role;
}
