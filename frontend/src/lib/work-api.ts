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
export interface WorkIssueType { id: number; key: IssueTypeKey | (string & {}); name: string; icon: string; color: string; level: number; workflowId: number | null }
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
  customFields: CustomField[];
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


// ─── Đợt 3: kiểm thử ─────────────────────────────────────────────

export type RunStatus = 'TODO' | 'IN_PROGRESS' | 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIP' | 'RETEST';
export type StepStatus = 'TODO' | 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIP';
export type CycleState = 'PLANNED' | 'IN_PROGRESS' | 'DONE';
export interface TestStep { id?: number; position?: number; action: string; data?: string | null; expected?: string | null }
export interface IssueRef { number: number; title: string; statusId?: number }

export interface TestListItem {
  id: number; number: number; title: string; priority: number; statusId: number; assigneeId: number | null; updatedAt: string;
  labelIds: number[]; kind: 'MANUAL' | 'GHERKIN'; stepCount: number;
  requirements: IssueRef[];
  lastRun: { status: RunStatus; executedAt: string | null; cycleName: string } | null;
}
export interface TestDetail {
  number: number; title: string; testCaseId: number; kind: 'MANUAL' | 'GHERKIN'; preconditions: string | null; gherkin: string | null;
  updatedAt: string; steps: Array<{ id: number; position: number; action: string; data: string | null; expected: string | null }>;
  runs: Array<{ id: number; status: RunStatus; executedAt: string | null; comment: string | null; executedBy: WorkUser | null;
    cycle: { id: number; name: string; environment: string | null }; defects: IssueRef[] }>;
  plans: Array<{ id: number; name: string }>;
}
export interface TestInput {
  title?: string; preconditions?: string | null; kind?: 'MANUAL' | 'GHERKIN'; gherkin?: string | null; steps?: TestStep[];
  requirementKeys?: string[]; priority?: number; labelIds?: number[]; assigneeId?: number | null;
}
export interface TestPlan { id: number; name: string; description: string | null; archivedAt: string | null; createdAt: string; cycleCount: number; testNumbers: number[] }
export interface CycleCounts { counts: Record<RunStatus, number>; total: number; executed: number; passRate: number | null; progress: number }
export interface TestCycleSummary extends CycleCounts {
  id: number; name: string; environment: string | null; build: string | null; state: CycleState;
  startAt: string | null; endAt: string | null; createdAt: string; plan: { id: number; name: string } | null;
}
export interface TestRunRow {
  id: number; status: RunStatus; executedAt: string | null; comment: string | null; assigneeId: number | null; executedBy: WorkUser | null;
  stepCount: number; test: { number: number; title: string; priority: number }; defects: IssueRef[];
}
export interface TestCycleDetail extends TestCycleSummary { runs: TestRunRow[] }
export interface TestRunDetail {
  id: number; status: RunStatus; comment: string | null; gherkin: string | null; executedAt: string | null; assigneeId: number | null;
  executedBy: WorkUser | null;
  cycle: { id: number; name: string; environment: string | null; build: string | null; state: CycleState };
  testCase: { preconditions: string | null; kind: 'MANUAL' | 'GHERKIN'; issue: { number: number; title: string; priority: number } };
  steps: Array<{ id: number; position: number; action: string; data: string | null; expected: string | null; status: StepStatus; actual: string | null }>;
  defects: IssueRef[];
}
export type Coverage = 'NOT_COVERED' | 'NOT_RUN' | 'FAILING' | 'BLOCKED' | 'PASSING';
export interface TraceabilityData {
  rows: Array<{ number: number; title: string; statusId: number; typeId: number; coverage: Coverage;
    tests: Array<{ number: number; title: string; lastStatus: RunStatus | null; openBugs: IssueRef[] }> }>;
  summary: { total: number; covered: number; passing: number; failing: number; coveragePct: number; passingPct: number };
}


// ─── Đợt 4: AI ───────────────────────────────────────────────────

export interface AiQuota { pro: boolean; used: number; limit: number | null; remaining: number | null; available: boolean }
export type AiAction =
  | { type: 'create_issue'; issueType: string; title: string; description?: string | null; acceptanceCriteria?: string[] | null; priority?: number | null; assignee?: string | null; storyPoints?: number | null; parent?: number | null; sprint?: string | null }
  | { type: 'update_issue'; number: number; title?: string | null; description?: string | null; priority?: number | null; assignee?: string | null; storyPoints?: number | null; status?: string | null; sprint?: string | null; dueDate?: string | null }
  | { type: 'add_comment'; number: number; text: string }
  | { type: 'move_to_sprint'; numbers: number[]; sprint: string }
  | { type: 'create_test'; title: string; preconditions?: string | null; steps: Array<{ action: string; data?: string | null; expected?: string | null }>; requirement?: number | null };
export interface AiAnswer { reply: string; actions: AiAction[]; quota: AiQuota }
export type AiQuickTask = 'write_story' | 'split' | 'generate_tests' | 'improve_bug' | 'summarize' | 'review_story' | 'meeting_notes';
export interface AiFilterResult {
  filter: { status: number[]; type: number[]; assignee: number[]; label: number[]; sprint?: number | 'backlog'; q?: string; includeDone?: boolean };
  explanation: string | null; quota: AiQuota;
}
export interface InsightIssue { key: string; number: number; title: string; assignee: string | null; status: string; dueDate: string | null }
export interface InsightsData {
  overdue: InsightIssue[]; dueSoon: InsightIssue[]; stale: Array<InsightIssue & { idleDays: number }>; unassignedUrgent: InsightIssue[];
  overloaded: Array<{ username: string; points: number; issues: number }>; loads: Array<{ username: string; points: number; issues: number }>;
  sprintRisk: null | { sprint: string; remaining: number; daysLeft: number; neededPerDay: number; recentPerDay: number; atRisk: boolean };
  unit: EstimationUnit;
}
export interface MyWorkItem {
  key: string; number: number; title: string; priority: number; dueDate: string | null; bucket: 'overdue' | 'today' | 'soon' | 'later' | 'none';
  type: { key: string; name: string; color: string }; status: { name: string; category: StatusCategory }; updatedAt: string;
  project: { key: string; name: string }; workspace: { slug: string; name: string }; url: string;
}
export interface MyWorkData { items: MyWorkItem[]; counts: { overdue: number; dueToday: number; dueSoon: number; inProgress: number; total: number } }

// ─── Tuỳ biến & tìm kiếm (đợt 5) ───────────────────────────────
export type CustomKind = 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'MULTISELECT' | 'USER' | 'URL' | 'CHECKBOX';
export interface CustomOption { id: string; label: string; color: string }
export interface CustomField { id: number; name: string; kind: CustomKind; options: CustomOption[]; typeKeys: string[] | null; required: boolean; position: number }
/** Giá trị theo kiểu: TEXT/URL/DATE(YYYY-MM-DD)/SELECT(option id) = string, NUMBER/USER = number, CHECKBOX = boolean, MULTISELECT = string[]. */
export type CustomValue = string | number | boolean | string[] | null;
export type CustomValues = Record<string, CustomValue>;
export type GroupBy = 'status' | 'statusCategory' | 'assignee' | 'type' | 'priority' | 'label' | 'sprint' | 'component';
export interface StatsGroup { key: string; label: string; count: number; points: number; color?: string }
export interface StatsData { unit: EstimationUnit; total: number; groups: StatsGroup[] }
export interface SavedFilter { id: number; name: string; query: string; shared: boolean; ownerId: number; updatedAt: string; owner: { username: string } }
export type WidgetKind = 'filter' | 'pie' | 'bar' | 'counter' | 'created_resolved' | 'burndown' | 'my_issues' | 'text' | 'health';
export interface DashboardWidget {
  id: string; kind: WidgetKind; title: string; query?: string; groupBy?: GroupBy; sprintId?: number | null; days?: number; text?: string; size?: 'half' | 'full';
}
export interface WorkDashboard { id: number; name: string; shared: boolean; ownerId: number; widgets: DashboardWidget[]; updatedAt: string }
export interface SearchResult { total: number; items: IssueCard[]; offset: number; limit: number }

/** Lỗi hết lượt AI miễn phí (402) — giao diện hiện hộp "Upgrade to Pro". */
export function isAiQuotaError(err: unknown): boolean {
  const e = err as { response?: { status?: number; data?: { code?: string } } };
  return e?.response?.status === 402 || e?.response?.data?.code === 'WORK_AI_QUOTA_EXCEEDED';
}

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

  // Kiểm thử
  enableTesting: (pid: number) => d(api.post(`${B}/projects/${pid}/tests/enable`)),
  tests: (pid: number, q?: string) => d<TestListItem[]>(api.get(`${B}/projects/${pid}/tests${q ? `?q=${encodeURIComponent(q)}` : ''}`)),
  test: (pid: number, num: number) => d<TestDetail>(api.get(`${B}/projects/${pid}/tests/${num}`)),
  createTest: (pid: number, body: TestInput & { title: string }) => d<{ number: number; failedLinks: string[] }>(api.post(`${B}/projects/${pid}/tests`, body)),
  updateTest: (pid: number, num: number, body: TestInput) => d<TestDetail>(api.put(`${B}/projects/${pid}/tests/${num}`, body)),
  importTests: (pid: number, rows: Array<TestInput & { title: string }>) =>
    d<{ created: number[]; failed: Array<{ row: number; title: string; error: string }> }>(api.post(`${B}/projects/${pid}/tests/import`, { rows })),
  testPlans: (pid: number) => d<TestPlan[]>(api.get(`${B}/projects/${pid}/test-plans`)),
  createTestPlan: (pid: number, body: { name: string; description?: string | null; numbers?: number[] }) => d<{ id: number }>(api.post(`${B}/projects/${pid}/test-plans`, body)),
  updateTestPlan: (pid: number, planId: number, body: { name?: string; description?: string | null; archived?: boolean; addNumbers?: number[]; removeNumbers?: number[] }) =>
    d(api.patch(`${B}/projects/${pid}/test-plans/${planId}`, body)),
  deleteTestPlan: (pid: number, planId: number) => d(api.delete(`${B}/projects/${pid}/test-plans/${planId}`)),
  testCycles: (pid: number) => d<TestCycleSummary[]>(api.get(`${B}/projects/${pid}/test-cycles`)),
  createTestCycle: (pid: number, body: { name: string; environment?: string | null; build?: string | null; planId?: number | null; numbers?: number[] }) =>
    d<{ id: number }>(api.post(`${B}/projects/${pid}/test-cycles`, body)),
  testCycle: (pid: number, cycleId: number) => d<TestCycleDetail>(api.get(`${B}/projects/${pid}/test-cycles/${cycleId}`)),
  updateTestCycle: (pid: number, cycleId: number, body: { name?: string; environment?: string | null; build?: string | null; state?: CycleState; addNumbers?: number[]; removeRunIds?: number[] }) =>
    d(api.patch(`${B}/projects/${pid}/test-cycles/${cycleId}`, body)),
  deleteTestCycle: (pid: number, cycleId: number) => d(api.delete(`${B}/projects/${pid}/test-cycles/${cycleId}`)),
  testRun: (pid: number, runId: number) => d<TestRunDetail>(api.get(`${B}/projects/${pid}/test-runs/${runId}`)),
  updateTestRun: (pid: number, runId: number, body: { status?: RunStatus; comment?: string | null; assigneeId?: number | null; reset?: boolean }) =>
    d<TestRunDetail>(api.patch(`${B}/projects/${pid}/test-runs/${runId}`, body)),
  updateStepResult: (pid: number, runId: number, stepId: number, body: { status?: StepStatus; actual?: string | null }) =>
    d<TestRunDetail>(api.patch(`${B}/projects/${pid}/test-runs/${runId}/steps/${stepId}`, body)),
  createDefect: (pid: number, runId: number, body: { title?: string; stepResultId?: number | null; priority?: number; assigneeId?: number | null } = {}) =>
    d<{ number: number }>(api.post(`${B}/projects/${pid}/test-runs/${runId}/defects`, body)),
  linkDefect: (pid: number, runId: number, num: number) => d(api.put(`${B}/projects/${pid}/test-runs/${runId}/defects/${num}`)),
  unlinkDefect: (pid: number, runId: number, num: number) => d(api.delete(`${B}/projects/${pid}/test-runs/${runId}/defects/${num}`)),
  traceability: (pid: number) => d<TraceabilityData>(api.get(`${B}/projects/${pid}/reports/traceability`)),

  // AI
  aiQuota: () => d<AiQuota>(api.get(`${B}/ai/quota`)),
  aiChat: (pid: number, body: { message: string; history?: Array<{ role: 'user' | 'assistant'; content: string }>; issueNumber?: number | null }) =>
    d<AiAnswer>(api.post(`${B}/projects/${pid}/ai/chat`, body, { timeout: 120_000 })),
  aiQuick: (pid: number, body: { task: AiQuickTask; issueNumber?: number | null; text?: string | null }) =>
    d<AiAnswer>(api.post(`${B}/projects/${pid}/ai/quick`, body, { timeout: 120_000 })),
  aiFilter: (pid: number, question: string) => d<AiFilterResult>(api.post(`${B}/projects/${pid}/ai/filter`, { question }, { timeout: 60_000 })),
  aiApply: (pid: number, action: AiAction) => d<{ summary: string; number?: number }>(api.post(`${B}/projects/${pid}/ai/apply`, { action })),
  aiWeeklyReport: (pid: number, body: { audience: 'teacher' | 'client' | 'team'; language?: 'en' | 'vi' }) =>
    d<{ report: string; facts: string; quota: AiQuota }>(api.post(`${B}/projects/${pid}/ai/weekly-report`, body, { timeout: 120_000 })),
  insights: (pid: number) => d<InsightsData>(api.get(`${B}/projects/${pid}/insights`)),
  similar: (pid: number, title: string) =>
    d<Array<{ number: number; title: string; score: number; resolved: boolean }>>(api.get(`${B}/projects/${pid}/similar?title=${encodeURIComponent(title)}`)),
  suggestAssignee: (pid: number, q: { parentId?: number; labelIds?: number[] } = {}) =>
    d<Array<{ userId: number; username: string; name: string; openIssues: number; load: number; familiarity: number }>>(
      api.get(`${B}/projects/${pid}/suggest-assignee${q.parentId || q.labelIds?.length ? `?${new URLSearchParams({ ...(q.parentId ? { parentId: String(q.parentId) } : {}), ...(q.labelIds?.length ? { labels: q.labelIds.join(',') } : {}) })}` : ''}`)),
  myWork: () => d<MyWorkData>(api.get(`${B}/me/work`)),

  // Tuỳ biến & tìm kiếm
  createWorkflow: (pid: number, body: { name: string; copyFrom?: number | null }) => d<{ id: number }>(api.post(`${B}/projects/${pid}/workflows`, body)),
  addStatus: (pid: number, wfId: number, body: { name: string; category: StatusCategory; color?: string }) => d<WorkStatus>(api.post(`${B}/projects/${pid}/workflows/${wfId}/statuses`, body)),
  reorderStatuses: (pid: number, wfId: number, statusIds: number[]) => d(api.put(`${B}/projects/${pid}/workflows/${wfId}/order`, { statusIds })),
  setTransitions: (pid: number, wfId: number, body: { mode: 'free' | 'restricted'; transitions?: Array<{ from: number | null; to: number }> }) =>
    d(api.put(`${B}/projects/${pid}/workflows/${wfId}/transitions`, body)),
  updateStatus: (pid: number, statusId: number, body: { name?: string; category?: StatusCategory; color?: string; wipLimit?: number | null }) =>
    d(api.patch(`${B}/projects/${pid}/statuses/${statusId}`, body)),
  deleteStatus: (pid: number, statusId: number, moveTo?: number) => d(api.delete(`${B}/projects/${pid}/statuses/${statusId}${moveTo ? `?moveTo=${moveTo}` : ''}`)),
  setBoardColumns: (pid: number, columns: Array<{ name: string; statusIds: number[]; wipLimit?: number | null }> | null) =>
    d(api.put(`${B}/projects/${pid}/board-columns`, { columns })),
  addIssueType: (pid: number, body: { name: string; level: 0 | -1 | 1; color?: string; icon?: string; workflowId?: number | null }) =>
    d<WorkIssueType>(api.post(`${B}/projects/${pid}/issue-types`, body)),
  updateIssueType: (pid: number, typeId: number, body: { name?: string; color?: string; icon?: string; archived?: boolean; workflowId?: number | null }) =>
    d(api.patch(`${B}/projects/${pid}/issue-types/${typeId}`, body)),
  customFields: (pid: number) => d<CustomField[]>(api.get(`${B}/projects/${pid}/custom-fields`)),
  createCustomField: (pid: number, body: { name: string; kind: CustomKind; options?: Array<{ label: string; color?: string }>; typeKeys?: string[] | null; required?: boolean }) =>
    d<CustomField>(api.post(`${B}/projects/${pid}/custom-fields`, body)),
  updateCustomField: (pid: number, fieldId: number, body: { name?: string; options?: Array<{ id?: string; label: string; color?: string }>; typeKeys?: string[] | null; required?: boolean; position?: number }) =>
    d(api.patch(`${B}/projects/${pid}/custom-fields/${fieldId}`, body)),
  deleteCustomField: (pid: number, fieldId: number) => d(api.delete(`${B}/projects/${pid}/custom-fields/${fieldId}`)),
  customValues: (pid: number, num: number) => d<CustomValues>(api.get(`${B}/projects/${pid}/issues/${num}/custom-values`)),
  setCustomValues: (pid: number, num: number, values: CustomValues) => d<CustomValues>(api.put(`${B}/projects/${pid}/issues/${num}/custom-values`, { values })),
  search: (pid: number, jql: string, opts: { limit?: number; offset?: number } = {}) =>
    d<SearchResult>(api.get(`${B}/projects/${pid}/search?${new URLSearchParams({ jql, ...(opts.limit ? { limit: String(opts.limit) } : {}), ...(opts.offset ? { offset: String(opts.offset) } : {}) })}`)),
  stats: (pid: number, groupBy: GroupBy, jql = '') => d<StatsData>(api.get(`${B}/projects/${pid}/stats?${new URLSearchParams({ groupBy, jql })}`)),
  createdResolved: (pid: number, days = 30, jql = '') =>
    d<Array<{ day: string; created: number; resolved: number }>>(api.get(`${B}/projects/${pid}/stats/created-resolved?${new URLSearchParams({ days: String(days), jql })}`)),
  savedFilters: (pid: number) => d<SavedFilter[]>(api.get(`${B}/projects/${pid}/filters`)),
  saveFilter: (pid: number, body: { id?: number; name: string; query: string; shared?: boolean }) => d<SavedFilter>(api.post(`${B}/projects/${pid}/filters`, body)),
  deleteFilter: (pid: number, filterId: number) => d(api.delete(`${B}/projects/${pid}/filters/${filterId}`)),
  dashboards: (pid: number) => d<WorkDashboard[]>(api.get(`${B}/projects/${pid}/dashboards`)),
  saveDashboard: (pid: number, body: { id?: number; name: string; shared?: boolean; widgets: DashboardWidget[] }) => d<WorkDashboard>(api.post(`${B}/projects/${pid}/dashboards`, body)),
  deleteDashboard: (pid: number, dashId: number) => d(api.delete(`${B}/projects/${pid}/dashboards/${dashId}`)),

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
