/**
 * CT Work — client API cho /api/v1/work (backend: src/routes/work.routes.ts).
 *
 * Mọi hàm TRẢ THẲNG `data` (đã bóc res.data.data) để hook TanStack Query gọn.
 * Kiểu ở đây phải khớp với service backend — đổi một bên thì đổi bên kia.
 */
import { api } from './api';

// ─── Kiểu ────────────────────────────────────────────────────────

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
export type ProjectRole = 'ADMIN' | 'MEMBER' | 'VIEWER' | 'TEACHER' | 'CLIENT';
export type ProjectType = 'SCRUM' | 'KANBAN' | 'TESTING';
export type ProjectTemplate = 'BLANK' | 'SWR302' | 'SWT301' | 'SWP391' | 'FREELANCE' | 'COMPANY';
export type StatusCategory = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type IssueTypeKey = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK' | 'TEST' | 'REQUIREMENT';
export type LinkType = 'BLOCKS' | 'RELATES' | 'DUPLICATES' | 'CLONES' | 'TESTS';

export interface WorkUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export const userName = (u: Pick<WorkUser, 'username' | 'fullName' | 'displayName'> | null | undefined) =>
  u ? u.displayName || u.fullName || u.username : 'Unassigned';

export interface WorkspaceSummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  role: WorkspaceRole;
  projectCount: number;
  memberCount: number;
}

export interface ProjectSummary {
  id: number;
  key: string;
  name: string;
  description: string | null;
  type: ProjectType;
  template: ProjectTemplate;
  visibility: 'WORKSPACE' | 'PRIVATE';
  archivedAt: string | null;
  lead: WorkUser | null;
  role: ProjectRole;
  openIssues: number;
}

export interface WorkspaceDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  ownerId: number;
  role: WorkspaceRole;
  projects: ProjectSummary[];
}

export interface WorkStatus { id: number; name: string; category: StatusCategory; color: string; position: number; wipLimit: number | null }
export interface WorkTransition { id: number; fromStatusId: number | null; toStatusId: number; name: string | null }
export interface WorkWorkflow { id: number; name: string; isDefault: boolean; statuses: WorkStatus[]; transitions: WorkTransition[] }
export interface WorkIssueType { id: number; key: IssueTypeKey; name: string; icon: string; color: string; level: number; workflowId: number | null }
export interface WorkLabel { id: number; name: string; color: string }
export interface WorkComponent { id: number; name: string; description: string | null; leadId: number | null }
export interface WorkSprint { id: number; name: string; goal: string | null; state: 'PLANNED' | 'ACTIVE' | 'CLOSED'; startAt: string | null; endAt: string | null }
export interface BoardColumn { key: string; name: string; category: string; statusIds: number[]; wipLimit: number | null }
export interface ProjectMember extends WorkUser { role: ProjectRole; explicit: boolean }

export interface ProjectPermissions {
  editIssues: boolean;
  createIssues: boolean;
  transition: boolean;
  deleteIssues: boolean;
  comment: boolean;
  attach: boolean;
  manageSprints: boolean;
  settings: boolean;
  manageMembers: boolean;
  useAi: boolean;
}

export interface ProjectConfig {
  id: number;
  key: string;
  name: string;
  description: string | null;
  type: ProjectType;
  template: ProjectTemplate;
  visibility: 'WORKSPACE' | 'PRIVATE';
  settings: Record<string, unknown>;
  archivedAt: string | null;
  createdAt: string;
  leadId: number | null;
  workspace: { id: number; name: string; slug: string };
  workflows: WorkWorkflow[];
  issueTypes: WorkIssueType[];
  labels: WorkLabel[];
  components: WorkComponent[];
  sprints: WorkSprint[];
  role: ProjectRole;
  workspaceRole: WorkspaceRole;
  permissions: ProjectPermissions;
  boardColumns: BoardColumn[];
  members: ProjectMember[];
}

/** Một thẻ trên board / danh sách. */
export interface IssueCard {
  id: number;
  number: number;
  title: string;
  typeId: number;
  statusId: number;
  parentId: number | null;
  /** Số của thẻ cha (để hiện mã cha mà không cần tải thẻ cha). */
  parentNumber: number | null;
  sprintId: number | null;
  priority: number;
  assigneeId: number | null;
  reporterId: number | null;
  storyPoints: number | null;
  dueDate: string | null;
  rank: string;
  version: number;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  labelIds: number[];
  subtaskCount: number;
  commentCount: number;
  attachmentCount: number;
}

export interface IssueBrief { id: number; key: string; number: number; title: string; statusId: number; typeId: number }

export interface IssueAttachment { id: number; fileName: string; mime: string; size: number; createdAt: string; uploader: WorkUser | null }

export interface IssueDetail extends IssueCard {
  descriptionJson: TiptapDoc | null;
  originalEstimateMin: number | null;
  remainingEstimateMin: number | null;
  timeSpentMin: number;
  startDate: string | null;
  resolution: string | null;
  assignee: WorkUser | null;
  reporter: WorkUser | null;
  parent: { id: number; number: number; title: string; typeId: number; statusId: number } | null;
  children: Array<{ id: number; number: number; title: string; typeId: number; statusId: number; assigneeId: number | null; priority: number }>;
  componentIds: number[];
  links: Array<{ id: number; type: LinkType; direction: 'outward' | 'inward'; issue: IssueBrief }>;
  attachments: IssueAttachment[];
  watcherCount: number;
  isWatching: boolean;
  canDelete: boolean;
}

export interface TiptapDoc { type: 'doc'; content?: unknown[] }

export interface WorkComment {
  id: number;
  bodyJson: TiptapDoc;
  isAi: boolean;
  createdAt: string;
  editedAt: string | null;
  author: WorkUser | null;
}

export interface HistoryEntry {
  id: number;
  field: string;
  fromValue: string | null;
  toValue: string | null;
  actorKind: 'USER' | 'AI' | 'AUTOMATION' | 'SYSTEM';
  createdAt: string;
  actor: WorkUser | null;
}

export interface BoardData {
  mode: ProjectType;
  sprint: WorkSprint | null;
  /** Scrum chưa có sprint chạy ⇒ board đang hiện mọi thẻ mở. */
  fallback: boolean;
  issues: IssueCard[];
}

export interface IssuePatch {
  title?: string;
  descriptionJson?: TiptapDoc | null;
  priority?: number;
  assigneeId?: number | null;
  storyPoints?: number | null;
  originalEstimateMin?: number | null;
  remainingEstimateMin?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  parentId?: number | null;
  sprintId?: number | null;
  statusId?: number;
  labelIds?: number[];
  componentIds?: number[];
  version?: number;
}

export interface IssueQuery {
  status?: number[];
  type?: number[];
  assignee?: number[];
  label?: number[];
  sprint?: number | 'backlog' | 'open';
  parent?: number;
  q?: string;
  includeDone?: boolean;
  excludeEpics?: boolean;
  limit?: number;
  cursor?: string;
}

export interface WorkInvite {
  id: number;
  email: string | null;
  role: WorkspaceRole;
  projectId: number | null;
  projectRole: ProjectRole | null;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  createdAt: string;
  invitedBy: WorkUser;
}

export interface WorkspaceMember extends WorkUser { role: WorkspaceRole; joinedAt: string }

/** Sự kiện thời gian thực (backend: services/work/events.ts). */
export type WorkEvent =
  | { type: 'issue.created' | 'issue.deleted'; projectId: number; issueId: number; actor: { kind: string; userId: number | null } }
  | { type: 'issue.updated'; projectId: number; issueId: number; actor: { kind: string; userId: number | null }; changes: Array<{ field: string; from: string | null; to: string | null }> }
  | { type: 'comment.created'; projectId: number; issueId: number; commentId: number; actor: { kind: string; userId: number | null } }
  | { type: 'sprint.updated'; projectId: number; sprintId: number; actor: { kind: string; userId: number | null } }
  | { type: 'project.updated'; projectId: number; actor: { kind: string; userId: number | null } };


// ─── Đợt 2: sprint, backlog, báo cáo ─────────────────────────────

export type EstimationUnit = 'POINTS' | 'HOURS';

export interface SprintFull extends WorkSprint {
  completedAt: string | null;
  committedPoints: number | null;
  completedPoints: number | null;
  position: number;
}

export interface BacklogIssue extends IssueCard {
  originalEstimateMin: number | null;
  /** Điểm hoặc giờ tuỳ settings.estimation của dự án. */
  estimate: number;
}

export interface BacklogEpic {
  id: number; number: number; title: string; statusId: number; done: boolean;
  total: number; completed: number; points: number; pointsDone: number;
}

export interface BacklogData {
  unit: EstimationUnit;
  sprints: SprintFull[];
  issues: BacklogIssue[];
  epics: BacklogEpic[];
}

export interface BulkPatch {
  sprintId?: number | null;
  assigneeId?: number | null;
  priority?: number;
  statusId?: number;
  parentId?: number | null;
  addLabelIds?: number[];
  delete?: true;
}

export interface SprintReportItem { id: number; number: number; title: string; points: number }
export interface SprintReport {
  completed: SprintReportItem[];
  incomplete: SprintReportItem[];
  added: number[];
  removed: number[];
  committedPoints: number;
  completedPoints: number;
  unit: EstimationUnit;
}

export interface BurndownPoint { day: string; remaining: number | null; total: number | null; done: number | null; ideal: number }
export interface BurndownData { sprint: SprintFull & { goal: string | null }; unit: EstimationUnit; points: BurndownPoint[] }
export interface VelocityData {
  unit: EstimationUnit;
  sprints: Array<{ id: number; name: string; committedPoints: number; completedPoints: number; completedAt: string | null }>;
  /** Trung bình điểm hoàn thành của 3 sprint gần nhất (null nếu chưa có sprint nào đóng). */
  average: number | null;
}
export interface EpicProgress {
  id: number; number: number; title: string; statusId: number; dueDate: string | null; resolved: boolean;
  total: number; completed: number; points: number; pointsDone: number; percent: number;
}
export interface ContributionRow {
  user: WorkUser;
  /** Thẻ tầng 0 đã xong mà người này đang được giao. */
  resolved: number;
  points: number;
  subtasks: number;
  created: number;
  comments: number;
  /** Số lần sửa thẻ (không tính của AI/tự động). */
  updates: number;
  open: number;
  /** % điểm hoàn thành trên tổng của cả nhóm. */
  share: number;
}
export interface ContributionData { unit: EstimationUnit; from: string | null; to: string | null; members: ContributionRow[] }

// ─── Gọi API ─────────────────────────────────────────────────────

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

function qs(q: IssueQuery): string {
  const p = new URLSearchParams();
  const list = (k: string, v?: number[]) => v?.length && p.set(k, v.join(','));
  list('status', q.status);
  list('type', q.type);
  list('assignee', q.assignee);
  list('label', q.label);
  if (q.sprint !== undefined) p.set('sprint', String(q.sprint));
  if (q.parent) p.set('parent', String(q.parent));
  if (q.q) p.set('q', q.q);
  if (q.includeDone !== undefined) p.set('includeDone', String(q.includeDone));
  if (q.excludeEpics) p.set('excludeEpics', 'true');
  if (q.limit) p.set('limit', String(q.limit));
  if (q.cursor) p.set('cursor', q.cursor);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const workApi = {
  // Không gian
  workspaces: () => d<WorkspaceSummary[]>(api.get(`${B}/workspaces`)),
  createWorkspace: (body: { name: string; description?: string | null }) =>
    d<{ id: number; name: string; slug: string }>(api.post(`${B}/workspaces`, body)),
  workspaceBySlug: (slug: string) => d<WorkspaceDetail>(api.get(`${B}/workspaces/by-slug/${encodeURIComponent(slug)}`)),
  updateWorkspace: (id: number, body: { name?: string; description?: string | null }) => d(api.patch(`${B}/workspaces/${id}`, body)),
  deleteWorkspace: (id: number, confirmName: string) => d(api.delete(`${B}/workspaces/${id}`, { data: { confirmName } })),
  members: (wsId: number, q?: string) =>
    d<WorkspaceMember[]>(api.get(`${B}/workspaces/${wsId}/members${q ? `?q=${encodeURIComponent(q)}` : ''}`)),
  setMemberRole: (wsId: number, userId: number, role: WorkspaceRole) => d(api.patch(`${B}/workspaces/${wsId}/members/${userId}`, { role })),
  removeMember: (wsId: number, userId: number) => d(api.delete(`${B}/workspaces/${wsId}/members/${userId}`)),
  transferOwnership: (wsId: number, userId: number) => d(api.post(`${B}/workspaces/${wsId}/transfer`, { userId })),
  invites: (wsId: number) => d<WorkInvite[]>(api.get(`${B}/workspaces/${wsId}/invites`)),
  inviteEmails: (wsId: number, body: { emails: string[]; role: WorkspaceRole; projectId?: number | null; projectRole?: ProjectRole | null }) =>
    d<Array<{ email: string; status: 'ADDED' | 'ALREADY_MEMBER' | 'INVITED' }>>(api.post(`${B}/workspaces/${wsId}/invites`, body)),
  createInviteLink: (wsId: number, body: { role: WorkspaceRole; projectId?: number | null; projectRole?: ProjectRole | null; maxUses?: number; expiresInDays?: number }) =>
    d<{ id: number; url: string; expiresAt: string; maxUses: number }>(api.post(`${B}/workspaces/${wsId}/invite-links`, body)),
  revokeInvite: (wsId: number, inviteId: number) => d(api.delete(`${B}/workspaces/${wsId}/invites/${inviteId}`)),
  previewInvite: (token: string) =>
    d<{ workspace: { name: string; slug: string }; role: WorkspaceRole; invitedBy: string | null; restrictedToEmail: boolean }>(api.get(`${B}/invites/${encodeURIComponent(token)}`)),
  acceptInvite: (token: string) => d<{ slug: string }>(api.post(`${B}/invites/${encodeURIComponent(token)}/accept`)),

  // Dự án
  createProject: (wsId: number, body: { key: string; name: string; description?: string | null; type: ProjectType; template: ProjectTemplate; visibility?: 'WORKSPACE' | 'PRIVATE' }) =>
    d<{ id: number; key: string; name: string }>(api.post(`${B}/workspaces/${wsId}/projects`, body)),
  resolve: (slug: string, key: string) => d<{ projectId: number }>(api.get(`${B}/resolve/${encodeURIComponent(slug)}/${encodeURIComponent(key)}`)),
  project: (pid: number) => d<ProjectConfig>(api.get(`${B}/projects/${pid}`)),
  updateProject: (pid: number, body: { name?: string; description?: string | null; visibility?: 'WORKSPACE' | 'PRIVATE'; leadId?: number | null; settings?: Record<string, unknown> }) =>
    d(api.patch(`${B}/projects/${pid}`, body)),
  archiveProject: (pid: number, archived: boolean) => d(api.post(`${B}/projects/${pid}/archive`, { archived })),
  deleteProject: (pid: number, confirmKey: string) => d(api.delete(`${B}/projects/${pid}`, { data: { confirmKey } })),
  setProjectMember: (pid: number, userId: number, role: ProjectRole) => d(api.put(`${B}/projects/${pid}/members/${userId}`, { role })),
  removeProjectMember: (pid: number, userId: number) => d(api.delete(`${B}/projects/${pid}/members/${userId}`)),
  createLabel: (pid: number, body: { name: string; color?: string }) => d<WorkLabel>(api.post(`${B}/projects/${pid}/labels`, body)),
  updateLabel: (pid: number, id: number, body: { name: string; color?: string }) => d<WorkLabel>(api.patch(`${B}/projects/${pid}/labels/${id}`, body)),
  deleteLabel: (pid: number, id: number) => d(api.delete(`${B}/projects/${pid}/labels/${id}`)),
  createComponent: (pid: number, body: { name: string; description?: string | null; leadId?: number | null }) =>
    d<WorkComponent>(api.post(`${B}/projects/${pid}/components`, body)),
  updateComponent: (pid: number, id: number, body: { name: string; description?: string | null; leadId?: number | null }) =>
    d<WorkComponent>(api.patch(`${B}/projects/${pid}/components/${id}`, body)),
  deleteComponent: (pid: number, id: number) => d(api.delete(`${B}/projects/${pid}/components/${id}`)),

  // Thẻ
  board: (pid: number, sprintId?: number) => d<BoardData>(api.get(`${B}/projects/${pid}/board${sprintId ? `?sprintId=${sprintId}` : ''}`)),
  issues: (pid: number, q: IssueQuery = {}) => d<{ items: IssueCard[]; total: number; nextCursor: string | null }>(api.get(`${B}/projects/${pid}/issues${qs(q)}`)),
  createIssue: (pid: number, body: IssuePatch & { typeId: number; title: string }) => d<IssueDetail>(api.post(`${B}/projects/${pid}/issues`, body)),
  issue: (pid: number, num: number) => d<IssueDetail>(api.get(`${B}/projects/${pid}/issues/${num}`)),
  updateIssue: (pid: number, num: number, body: IssuePatch) => d<IssueDetail>(api.patch(`${B}/projects/${pid}/issues/${num}`, body)),
  moveIssue: (pid: number, num: number, body: { statusId?: number; sprintId?: number | null; beforeIssueId?: number | null; afterIssueId?: number | null; version?: number }) =>
    d<IssueCard>(api.post(`${B}/projects/${pid}/issues/${num}/move`, body)),
  deleteIssue: (pid: number, num: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}`)),
  history: (pid: number, num: number) => d<HistoryEntry[]>(api.get(`${B}/projects/${pid}/issues/${num}/history`)),
  addLink: (pid: number, num: number, body: { type: LinkType; targetKey: string }) => d(api.post(`${B}/projects/${pid}/issues/${num}/links`, body)),
  removeLink: (pid: number, num: number, linkId: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}/links/${linkId}`)),
  watch: (pid: number, num: number, on: boolean) => d(on ? api.put(`${B}/projects/${pid}/issues/${num}/watch`) : api.delete(`${B}/projects/${pid}/issues/${num}/watch`)),
  comments: (pid: number, num: number) => d<WorkComment[]>(api.get(`${B}/projects/${pid}/issues/${num}/comments`)),
  addComment: (pid: number, num: number, bodyJson: TiptapDoc) => d<WorkComment>(api.post(`${B}/projects/${pid}/issues/${num}/comments`, { bodyJson })),
  editComment: (pid: number, num: number, cid: number, bodyJson: TiptapDoc) => d<WorkComment>(api.patch(`${B}/projects/${pid}/issues/${num}/comments/${cid}`, { bodyJson })),
  deleteComment: (pid: number, num: number, cid: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}/comments/${cid}`)),
  attachmentUrl: (pid: number, aid: number, inline = false) =>
    d<{ url: string }>(api.get(`${B}/projects/${pid}/attachments/${aid}/url${inline ? '?inline=1' : ''}`)).then((r) => r.url),
  deleteAttachment: (pid: number, aid: number) => d(api.delete(`${B}/projects/${pid}/attachments/${aid}`)),

  // Sprint & backlog
  sprints: (pid: number, includeClosed = false) => d<SprintFull[]>(api.get(`${B}/projects/${pid}/sprints${includeClosed ? '?includeClosed=true' : ''}`)),
  createSprint: (pid: number, body: { name?: string; goal?: string | null } = {}) => d<SprintFull>(api.post(`${B}/projects/${pid}/sprints`, body)),
  updateSprint: (pid: number, sid: number, body: { name?: string; goal?: string | null; startAt?: string | null; endAt?: string | null }) =>
    d<SprintFull>(api.patch(`${B}/projects/${pid}/sprints/${sid}`, body)),
  deleteSprint: (pid: number, sid: number) => d(api.delete(`${B}/projects/${pid}/sprints/${sid}`)),
  startSprint: (pid: number, sid: number, body: { name?: string; goal?: string | null; startAt: string; endAt: string }) =>
    d<SprintFull>(api.post(`${B}/projects/${pid}/sprints/${sid}/start`, body)),
  completeSprint: (pid: number, sid: number, moveTo: 'backlog' | 'new' | number) =>
    d<{ report: SprintReport; movedTo: number | null }>(api.post(`${B}/projects/${pid}/sprints/${sid}/complete`, { moveTo })),
  backlog: (pid: number) => d<BacklogData>(api.get(`${B}/projects/${pid}/backlog`)),
  bulkUpdate: (pid: number, numbers: number[], patch: BulkPatch) =>
    d<{ updated: number[]; failed: Array<{ number: number; error: string }> }>(api.post(`${B}/projects/${pid}/issues/bulk`, { numbers, patch })),

  // Báo cáo
  burndown: (pid: number, sprintId: number) => d<BurndownData>(api.get(`${B}/projects/${pid}/reports/burndown?sprintId=${sprintId}`)),
  velocity: (pid: number) => d<VelocityData>(api.get(`${B}/projects/${pid}/reports/velocity`)),
  sprintReport: (pid: number, sprintId: number) => d<{ sprint: SprintFull; report: SprintReport }>(api.get(`${B}/projects/${pid}/reports/sprint?sprintId=${sprintId}`)),
  epicReport: (pid: number) => d<{ unit: EstimationUnit; epics: EpicProgress[] }>(api.get(`${B}/projects/${pid}/reports/epics`)),
  contributions: (pid: number, range: { from?: string; to?: string; sprintId?: number } = {}) => {
    const p = new URLSearchParams();
    if (range.from) p.set('from', range.from);
    if (range.to) p.set('to', range.to);
    if (range.sprintId) p.set('sprintId', String(range.sprintId));
    const q = p.toString();
    return d<ContributionData>(api.get(`${B}/projects/${pid}/reports/contributions${q ? `?${q}` : ''}`));
  },

  /** Tải file thẳng lên R2: xin URL ký sẵn → PUT → báo hoàn tất. */
  async uploadAttachment(pid: number, num: number, file: File, onProgress?: (pct: number) => void): Promise<IssueAttachment> {
    const pre = await d<{ uploadUrl: string; key: string; headers: Record<string, string> }>(
      api.post(`${B}/projects/${pid}/issues/${num}/attachments/presign`, { fileName: file.name, contentType: file.type || 'application/octet-stream', size: file.size }),
    );
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', pre.uploadUrl);
      Object.entries(pre.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      xhr.send(file);
    });
    return d<IssueAttachment>(api.post(`${B}/projects/${pid}/issues/${num}/attachments/complete`, { key: pre.key, fileName: file.name }));
  },
};

/** Thông điệp lỗi đọc được từ lỗi axios. */
export function workError(err: unknown, fallback = 'Something went wrong'): string {
  const e = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
  return e?.response?.data?.error || e?.response?.data?.message || e?.message || fallback;
}

/** Mã lỗi backend (vd 'CONFLICT' khi version lệch). */
export function workErrorStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}
