/**
 * CT Work — client API cho /api/v1/work (backend: src/routes/work.routes.ts).
 *
 * Mọi hàm TRẢ THẲNG `data` (đã bóc res.data.data) để hook TanStack Query gọn.
 * Kiểu ở đây phải khớp với service backend — đổi một bên thì đổi bên kia.
 */
import { api } from './api';
import { localizeError } from '@/components/work/i18n/errors';
import { translate, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => translate(currentWorkLocale(), k, v);

// ─── Kiểu ────────────────────────────────────────────────────────

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
export type ProjectRole = 'ADMIN' | 'MEMBER' | 'VIEWER' | 'TEACHER' | 'CLIENT';
export type ProjectType = 'SCRUM' | 'KANBAN' | 'TESTING';
export type ProjectTemplate = 'BLANK' | 'SWR302' | 'SWT301' | 'SWP391' | 'FREELANCE' | 'COMPANY' | 'CAPSTONE';
/** Loại dự án (lớp studio S1). Dự án cũ: suy từ mẫu (kindStored = null). */
export type ProjectKind = 'PERSONAL' | 'SCHOOL' | 'SOFTWARE' | 'CLIENT';
/** Mô-đun bật/tắt theo dự án. Đợt S1 có tính năng thật: teams, stages, approvals, handoffs. */
export type StudioModule = 'teams' | 'stages' | 'approvals' | 'handoffs' | 'docs' | 'clientPortal' | 'changeRequests' | 'raid' | 'meetings' | 'finance' | 'reports' | 'serviceDesk' | 'resources';
export type ModuleMap = Record<StudioModule, boolean>;
export type StatusCategory = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type IssueTypeKey = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK' | 'TEST' | 'REQUIREMENT';
export type LinkType = 'BLOCKS' | 'RELATES' | 'DUPLICATES' | 'CLONES' | 'TESTS';

export interface WorkUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  /** CTW-28: HUMAN (mặc định, dữ liệu cũ thiếu trường) | AGENT — UserAvatar gắn 🤖. */
  kind?: 'HUMAN' | 'AGENT' | string;
}

export const userName = (u: Pick<WorkUser, 'username' | 'fullName' | 'displayName'> | null | undefined) =>
  u ? u.displayName || u.fullName || u.username : wt('common.unassigned');

export interface WorkspaceSummary {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  role: WorkspaceRole;
  projectCount: number;
  memberCount: number;
  /** CTW-23: logo không gian. */
  logoUrl?: string | null;
  /** CTW đợt 7c: không gian ép 2FA mà phiên này chưa đạt (GRACE = còn ân hạn). null = không ảnh hưởng. */
  twoFactor?: { state: 'GRACE' | 'SETUP_REQUIRED' | 'VERIFY_REQUIRED'; graceUntil: string | null } | null;
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
  /** Lớp studio (S1). */
  kind?: ProjectKind;
  modules?: ModuleMap;
  /** CTW-23: nhận diện dự án. */
  avatarUrl?: string | null;
  iconEmoji?: string | null;
  color?: string | null;
  /** UX-D: ảnh bìa ("preset:<id>" | URL) + điểm lấy nét dọc 0–100. */
  coverUrl?: string | null;
  coverPositionY?: number | null;
}

export interface WorkspaceDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  ownerId: number;
  role: WorkspaceRole;
  projects: ProjectSummary[];
  /** CTW-23: logo không gian. */
  logoUrl?: string | null;
}

export interface WorkStatus { id: number; name: string; category: StatusCategory; color: string; position: number; wipLimit: number | null }
/** Luật của luồng chuyển (S1): cần phê duyệt thẻ / chỉ thành viên các bộ phận. `{}` = không luật. */
export interface TransitionRules { requireApproval?: boolean; teamIds?: number[] }
export interface WorkTransition { id: number; fromStatusId: number | null; toStatusId: number; name: string | null; rules?: TransitionRules }
export interface WorkWorkflow { id: number; name: string; isDefault: boolean; statuses: WorkStatus[]; transitions: WorkTransition[] }
/** Bố cục sơ đồ: statusId → toạ độ (lưu trong project.settings.workflowLayout[wfId]). */
export type WorkflowLayout = Record<string, { x: number; y: number }>;
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
  // Lớp studio (S1) — quyền theo VAI; mô-đun tắt thì API vẫn trả 403 MODULE_DISABLED.
  configureStudio?: boolean;
  manageStages?: boolean;
  requestGate?: boolean;
  createApprovals?: boolean;
  /** Được đứng tên người duyệt (vẫn chỉ quyết bước của chính mình). */
  beApprover?: boolean;
  manageApprovals?: boolean;
  createHandoffs?: boolean;
  manageHandoffs?: boolean;
  // Tài liệu (S2a) — khách (CLIENT/GUEST) chỉ đọc trang Client, không sửa. Mô-đun tắt ⇒ API 403.
  viewAllDocs?: boolean;
  editDocs?: boolean;
  manageDocs?: boolean;
  // CR · RAID · họp (S3b) — khách/GUEST (trừ giảng viên) không thấy phần nội bộ.
  viewGovernance?: boolean;
  editGovernance?: boolean;
  // Tài chính · báo cáo · xuất trọn (S4) — quyền theo VAI; mô-đun tắt thì API vẫn 403 MODULE_DISABLED.
  /** Có trang Finance (ADMIN, MEMBER ghi giờ, trưởng bộ phận duyệt giờ). */
  viewFinance?: boolean;
  /** Thấy đơn giá, chi phí, ngân sách, mốc thanh toán (ADMIN dự án). */
  manageFinance?: boolean;
  reviewTimesheets?: boolean;
  viewReports?: boolean;
  sendClientReports?: boolean;
  exportProject?: boolean;
  // Service desk & SLA (S5a) — phần nội bộ (hàng đợi, đồng hồ, Problem, báo cáo) chỉ cho người của đội.
  viewDesk?: boolean;
  workDesk?: boolean;
  configureDesk?: boolean;
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
  workspace: { id: number; name: string; slug: string; logoUrl?: string | null };
  /** CTW-23: nhận diện dự án. */
  avatarUrl?: string | null;
  iconEmoji?: string | null;
  color?: string | null;
  /** UX-D: ảnh bìa ("preset:<id>" | URL) + điểm lấy nét dọc 0–100. */
  coverUrl?: string | null;
  coverPositionY?: number | null;
  /** CTW-5: phiên bản (chưa lưu trữ) — gợi ý JQL `fixVersion`. */
  versions?: Array<{ id: number; name: string; status: string }>;
  workflows: WorkWorkflow[];
  issueTypes: WorkIssueType[];
  labels: WorkLabel[];
  components: WorkComponent[];
  sprints: WorkSprint[];
  role: ProjectRole;
  workspaceRole: WorkspaceRole;
  permissions: ProjectPermissions;
  /** Người xem đang BẬT khoá chỉnh sửa dự án này ⇒ `permissions` đã bị tắt các quyền sửa (chỉ xem). */
  editLocked?: boolean;
  /** Quyền thật của vai trò (trước khi khoá) — để biết mở khoá xong sẽ sửa được gì. */
  rolePermissions?: ProjectPermissions;
  boardColumns: BoardColumn[];
  members: ProjectMember[];
  customFields: CustomField[];
  /** Lớp studio (S1): loại hiệu lực, loại đã lưu (null = dự án cũ), mô-đun đang bật. */
  kind?: ProjectKind;
  kindStored?: ProjectKind | null;
  modules?: ModuleMap;
  /** Cổng khách (S2b): người xem là khách bị cách ly ⇒ chỉ dùng /portal. */
  clientView?: boolean;
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
  fixVersionId: number | null;
  /** Bộ phận phụ trách (S1, mô-đun teams). */
  teamId?: number | null;
  /** Giai đoạn (S1, mô-đun stages). */
  stageId?: number | null;
  /** Cổng khách (S2b): thẻ đã chia sẻ với khách. */
  clientVisible?: boolean;
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
  /** CTW-11: cờ "Bị chặn" + lý do (khách không thấy). */
  flaggedAt?: string | null;
  flagReason?: string | null;
}

export interface IssueBrief { id: number; key: string; number: number; title: string; statusId: number; typeId: number }

export interface IssueAttachment {
  id: number; fileName: string; mime: string; size: number; createdAt: string; uploader: WorkUser | null;
  /** Cổng khách (S2b): tệp chia sẻ với khách / tệp bàn giao. */
  clientVisible?: boolean; deliverable?: boolean;
}

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
  clientSharedAt?: string | null;
}

export interface TiptapDoc { type: 'doc'; content?: unknown[] }

export type CommentReportReason = 'spam' | 'harassment' | 'hate' | 'sexual' | 'violence' | 'other';

/** INTERNAL = ghi chú nội bộ · PUBLIC = trả lời khách (cổng khách S2b). */
export type CommentVisibility = 'INTERNAL' | 'PUBLIC';

export interface WorkComment {
  id: number;
  /** CTW đợt 5b K-1: trả lời theo luồng (id gốc) — đầy đủ ở lib/work-comments-api.ts (ThreadComment). */
  parentId?: number | null;
  bodyJson: TiptapDoc;
  isAi: boolean;
  visibility?: CommentVisibility;
  createdAt: string;
  editedAt: string | null;
  author: WorkUser | null;
  /** Cảm xúc (👍 🎉 …) — thứ tự cố định theo REACTION_EMOJIS. */
  reactions?: CommentReaction[];
}

/** Bộ cảm xúc cho bình luận — server kiểm đúng danh sách này. */
export const REACTION_EMOJIS = ['👍', '👎', '😄', '🎉', '😕', '❤️', '🚀', '👀'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];
export const REACTION_LABELS: Record<ReactionEmoji, string> = {
  get '👍'() { return wt('detail.rxThumbsUp'); }, get '👎'() { return wt('detail.rxThumbsDown'); }, get '😄'() { return wt('detail.rxLaugh'); }, get '🎉'() { return wt('detail.rxHooray'); },
  get '😕'() { return wt('detail.rxConfused'); }, get '❤️'() { return wt('detail.rxHeart'); }, get '🚀'() { return wt('detail.rxRocket'); }, get '👀'() { return wt('detail.rxEyes'); },
};

export interface CommentReaction {
  emoji: ReactionEmoji;
  count: number;
  mine: boolean;
  /** Tối đa 10 người đầu tiên (cho tooltip). */
  users: Array<{ id: number; name: string }>;
}

/** Mẫu mô tả đang hiệu lực của một loại thẻ. */
export interface IssueTemplate {
  typeId: number;
  typeKey: string;
  typeName: string;
  name: string;
  /** null = loại này không có mẫu. */
  doc: TiptapDoc | null;
  /** true = mẫu mặc định của CT Work (dự án chưa tự đặt). */
  isDefault: boolean;
  hasDefault: boolean;
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
  /** Board cắt ở `limit` (2000) thẻ: true ⇒ đang hiện `limit`/`total`, báo người dùng lọc bớt. */
  truncated?: boolean;
  total?: number;
  limit?: number;
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
  fixVersionId?: number | null;
  /** S1 — chỉ ghi được khi mô-đun teams/stages bật (403 MODULE_DISABLED). */
  teamId?: number | null;
  stageId?: number | null;
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
  /** Bộ phận (0 = chưa có bộ phận). */
  team?: number[];
  stage?: number;
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
  | { type: 'project.updated'; projectId: number; actor: { kind: string; userId: number | null } }
  // Lớp studio (S1)
  | { type: 'stage.updated'; projectId: number; stageId: number; status: StageStatus | 'DELETED'; actor: { kind: string; userId: number | null } }
  | { type: 'approval.updated'; projectId: number; approvalId: number; status: ApprovalStatus; targetType: ApprovalTarget; targetIssueId: number | null; stageId: number | null; actor: { kind: string; userId: number | null } }
  | { type: 'handoff.updated'; projectId: number; handoffId: number; issueId: number; status: HandoffStatus; actor: { kind: string; userId: number | null } }
  // Tài liệu dự án (S2a) — chỉ id/số trang, không tiêu đề (phòng dự án có cả khách).
  | { type: 'page.updated'; projectId: number; pageId: number; number: number; action: 'created' | 'updated' | 'status' | 'moved' | 'deleted' | 'restored' | 'comment' | 'links'; actor: { kind: string; userId: number | null } };


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
  /** Backlog cắt ở `limit` (3000) thẻ: true ⇒ đang hiện `limit`/`total`. */
  truncated?: boolean;
  total?: number;
  limit?: number;
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
  /** UX-B: rollingAverage = TB trượt 3 sprint (gồm sprint đó); bản dữ liệu cũ (chia sẻ) có thể thiếu. */
  sprints: Array<{ id: number; name: string; committedPoints: number; completedPoints: number; completedAt: string | null; rollingAverage?: number }>;
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
  /** CTW đợt 8c (T10): phiên bản test case đã chạy / hiện tại; outdated = test đã sửa sau khi run được tạo. */
  testVersion?: number | null; currentVersion?: number; outdated?: boolean;
}
export interface TestCycleDetail extends TestCycleSummary { runs: TestRunRow[] }
export interface TestRunDetail {
  id: number; status: RunStatus; comment: string | null; gherkin: string | null; executedAt: string | null; assigneeId: number | null;
  executedBy: WorkUser | null;
  cycle: { id: number; name: string; environment: string | null; build: string | null; state: CycleState };
  testCase: { preconditions: string | null; kind: 'MANUAL' | 'GHERKIN'; issue: { number: number; title: string; priority: number } };
  steps: Array<{ id: number; position: number; action: string; data: string | null; expected: string | null; status: StepStatus; actual: string | null }>;
  defects: IssueRef[];
  evidence: RunEvidence[];
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
  | { type: 'create_test'; title: string; preconditions?: string | null; steps: Array<{ action: string; data?: string | null; expected?: string | null }>; requirement?: number | null }
  // Đợt S5c — tài liệu (mô-đun docs): Apply ⇒ trang mới / phiên bản mới của trang.
  | { type: 'draft_page'; title: string; markdown: string; parent?: number | null }
  | { type: 'update_page_section'; number: number; heading: string; markdown: string; mode?: 'replace' | 'append' | null }
  // Đợt 3C — lệnh GHI của registry dùng chung (cùng bộ với MCP + agent dựng sẵn): Apply ⇒ chạy bằng quyền người bấm.
  | { type: 'command'; command: string; args: Record<string, unknown>; summary?: string | null };
export interface AiAnswer {
  reply: string; actions: AiAction[]; quota: AiQuota;
  /** Hội thoại đã lưu ở server (trả về từ chat/quick). */
  threadId?: number; question?: AiMessage | null; answer?: AiMessage;
}
export type AiStoredStatus = 'pending' | 'applying' | 'done' | 'error' | 'dismissed';
export interface AiStoredAction { index: number; action: AiAction; status: AiStoredStatus; summary?: string; number?: number; error?: string; byId?: number; byName?: string; at?: string }
export interface AiMessage {
  id: number; threadId: number; role: 'user' | 'assistant'; content: string; title: string | null;
  issueNumber: number | null; error: string | null; createdAt: string; author: WorkUser | null; actions: AiStoredAction[];
}
export type AiThreadVisibility = 'PROJECT' | 'PRIVATE';
export interface AiThreadSummary {
  id: number; title: string; visibility: AiThreadVisibility; mode?: 'CHAT' | 'DEFENSE'; issueNumber: number | null; messageCount: number;
  lastMessageAt: string; createdAt: string; createdById: number | null; createdBy: WorkUser | null; participants: WorkUser[]; mine: boolean;
}
export interface AiThread extends Omit<AiThreadSummary, 'participants' | 'mine'> { canManage: boolean; messages: AiMessage[] }
export type AiQuickTask = 'write_story' | 'split' | 'generate_tests' | 'improve_bug' | 'summarize' | 'review_story' | 'meeting_notes' | 'req_review' | 'team_health' | 'draft_srs' | 'summarize_page';
export interface AiFilterResult {
  filter: { status: number[]; type: number[]; assignee: number[]; label: number[]; sprint?: number | 'backlog'; q?: string; includeDone?: boolean };
  explanation: string | null; quota: AiQuota;
}
export interface InsightIssue { key: string; number: number; title: string; assignee: string | null; status: string; dueDate: string | null }
export interface InsightLoad {
  username: string; points: number; issues: number;
  /** CTW-9 (tuỳ chọn): sức chứa trong phạm vi (null = chưa khai giờ/ngày) + cơ sở kết luận quá tải. */
  capacity?: number | null; overloaded?: boolean; basis?: 'capacity' | 'relative'; unit?: 'points' | 'hours';
}
export interface InsightsData {
  overdue: InsightIssue[]; dueSoon: InsightIssue[]; stale: Array<InsightIssue & { idleDays: number }>; unassignedUrgent: InsightIssue[];
  overloaded: Array<InsightLoad>; loads: Array<InsightLoad>;
  /** CTW-9: phạm vi tính tải (sprint đang chạy, hoặc việc đang làm/có hạn 14 ngày tới) — tuỳ chọn cho backend cũ. */
  loadScope?: { kind: 'sprint' | 'window'; label: string; sprints?: string[]; windowDays?: number; workingDaysLeft: number };
  sprintRisk: null | {
    sprint: string; remaining: number; daysLeft: number; neededPerDay: number; recentPerDay: number; atRisk: boolean;
    // Thêm 23/09 (sprintPace.ts) — tuỳ chọn để tương thích bản backend cũ.
    status?: 'NO_ESTIMATES' | 'TOO_EARLY' | 'DONE' | 'AT_RISK' | 'ON_TRACK'; total?: number; done?: number; committed?: number;
    elapsedDays?: number; estimated?: boolean; summary?: string;
  };
  unit: EstimationUnit;
}
/** GET /projects/:pid/onboarding — mỗi bước đọc từ dữ liệu thật của dự án. */
export interface OnboardingStatus {
  scrum: boolean;
  steps: { createIssues: boolean; inviteTeam: boolean; planSprint: boolean; startSprint: boolean; moveToDone: boolean; shareLink: boolean };
  completed: boolean;
  issueCount: number;
  sampleData: { issues: number; at: string } | null;
  canAddSample: boolean;
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
export interface StatsGroup { key: string; label: string; count: number; points: number; color?: string; /** UX-B: có khi nhóm theo trạng thái. */ category?: StatusCategory }
export interface StatsData { unit: EstimationUnit; total: number; groups: StatsGroup[] }
export interface SavedFilter { id: number; name: string; query: string; shared: boolean; ownerId: number; updatedAt: string; owner: { username: string } }
export type WidgetKind = 'filter' | 'pie' | 'bar' | 'counter' | 'created_resolved' | 'burndown' | 'my_issues' | 'text' | 'health' | 'top_risks'
  // UX-B: biểu đồ dòng chảy + KPI + tải theo người + việc trễ (số liệu ở work-uxb-api.ts).
  | 'kpis' | 'cfd' | 'throughput' | 'cycle_time' | 'aging_wip' | 'velocity' | 'release_burnup' | 'workload' | 'overdue'
  // CTW đợt 7c (C3): số liệu ở work-c7c-api.ts (OKR + đồng hồ đọc API đợt 7a).
  | 'test_pass_rate' | 'defects_by_severity' | 'license_expiring' | 'my_timer' | 'okr';
export interface DashboardWidget {
  id: string; kind: WidgetKind; title: string; query?: string; groupBy?: GroupBy; sprintId?: number | null; versionId?: number | null; days?: number; text?: string; size?: 'half' | 'full';
}
export interface WorkDashboard { id: number; name: string; shared: boolean; ownerId: number; widgets: DashboardWidget[]; updatedAt: string }
export interface SearchResult { total: number; items: IssueCard[]; offset: number; limit: number }

// ─── Kế hoạch dài hạn & tự động hoá (đợt 6) ───────────────────
export type VersionStatus = 'UNRELEASED' | 'RELEASED' | 'ARCHIVED';
export interface WorkVersion {
  id: number; name: string; description: string | null; startDate: string | null; releaseDate: string | null; status: VersionStatus;
  releasedAt: string | null; releaseNotes: string | null; position: number; createdAt: string;
}
export interface VersionSummary extends WorkVersion { total: number; done: number; overdue: boolean }
export interface TimelineItem {
  id: number; number: number; title: string; typeId: number; statusId: number; parentId: number | null; assigneeId: number | null;
  sprintId: number | null; fixVersionId: number | null; level: number; start: string | null; due: string | null; done: boolean; progress: number;
}
export interface TimelineData {
  items: TimelineItem[]; dependencies: Array<{ from: number; to: number }>; criticalPath: number[]; criticalDays: number; conflicts: Array<{ from: number; to: number }>;
}
export interface CapacityRow {
  user: Pick<WorkUser, 'id' | 'username' | 'fullName' | 'displayName' | 'avatarUrl'>;
  hoursPerDay: number | null; workingDays: number; timeOff: Array<{ id: number; start: string; end: string; note: string | null }>;
  capacityHours: number | null; issues: number; loadHours: number; loadPoints: number; utilization: number | null;
}
export interface CapacityData { from: string; to: string; unit: EstimationUnit; sprintId: number | null; members: CapacityRow[] }
export interface TimeOffEntry { id: number; userId: number; startDate: string; endDate: string; note: string | null; user: WorkUser }
export interface Worklog { id: number; minutes: number; startedAt: string; note: string | null; createdAt: string; userId: number; user: WorkUser; /** CTW đợt 4 (A24) */ activity?: string | null; workProduct?: string | null }
export interface TimeReport {
  from: string; to: string; totalMin: number;
  people: Array<{ user: WorkUser; name: string; totalMin: number; byDay: Record<string, number>; issues: Array<{ number: number; title: string; minutes: number }>; userKind?: 'HUMAN' | 'AGENT'; autoMin?: number }>;
  /** CTW-28 A12-1: lọc theo loại + tổng phút theo loại (phút). */
  principal?: 'HUMAN' | 'AGENT' | 'ALL';
  byPrincipal?: { HUMAN: number; AGENT: number };
}
export type RuleTrigger = 'issue.created' | 'issue.transitioned' | 'issue.assigned' | 'field.changed' | 'comment.added' | 'scheduled.daily'
  // CTW đợt 7c (C13)
  | 'issue.due_soon' | 'test.failed' | 'pr.merged' | 'sla.breached' | 'baseline.changed';
export type RuleActionKind = 'transition' | 'assign' | 'set_priority' | 'add_label' | 'comment' | 'move_to_active_sprint' | 'notify' | 'create_subtask'
  // CTW đợt 7c (C13)
  | 'post_chat' | 'webhook' | 'assign_round_robin' | 'create_subtasks';
export interface RuleAction {
  kind: RuleActionKind; statusId?: number; assignee?: number | 'reporter' | null; priority?: number; labelId?: number; text?: string;
  to?: Array<'assignee' | 'reporter' | 'watchers' | number>; title?: string;
  /** CTW đợt 7c: post_chat (kênh, '' = #general) · webhook (url, secret chỉ GỬI lên, server che khi trả về) · vòng · mẫu thẻ con. */
  channel?: string | null; url?: string; secret?: string; secretSet?: boolean; pool?: number[]; titles?: string[]; template?: string;
}
export interface RuleConfig { toStatusIds?: number[]; fromStatusIds?: number[]; fields?: string[]; jql?: string; dueInDays?: number; conditions?: Array<{ jql: string }>; actions: RuleAction[] }
export interface AutomationRule {
  id: number; name: string; enabled: boolean; trigger: RuleTrigger; config: RuleConfig; createdById: number | null; runCount: number;
  lastRunAt: string | null; createdAt: string; updatedAt: string; recentProblems: number;
}
export type RuleLogStatus = 'SUCCESS' | 'NO_MATCH' | 'FAILED' | 'LOOP_BLOCKED' | 'THROTTLED' | 'DRY_RUN';
/** CTW-7: kết quả "Test rule" — mặc định chạy thử (dryRun), `actions` là việc SẼ làm. */
export interface RuleTestResult {
  dryRun: boolean; status: RuleLogStatus; message: string;
  conditions?: Array<{ jql: string; matched: boolean }>;
  actions: Array<{ kind: string; summary: string; willChange: boolean }>;
}
export interface RuleLog {
  id: number; ruleId: number; ruleName: string; issueId: number | null; issue: { number: number; title: string } | null;
  status: RuleLogStatus; message: string; durationMs: number; createdAt: string;
}
export type EmailMode = 'INSTANT' | 'DIGEST' | 'OFF';
// ─── Bù đợt 3–4: bằng chứng test, báo cáo cycle, AI kế hoạch sprint / retro / bản tin ───
export interface RunEvidence { id: number; fileName: string; mime: string; size: number; createdAt: string; uploader: WorkUser | null }
export interface SprintPlan {
  sprint: { id: number; name: string }; unit: EstimationUnit; velocity: number | null;
  history: Array<{ name: string; committedPoints: number | null; completedPoints: number | null }>;
  target: number; alreadyPlanned: number; selected: Array<{ number: number; title: string; points: number }>;
  plannedTotal: number; warnings: string[]; rationale: string | null;
  /** CTW-10: test case (Xray) + ticket service desk không vào backlog lập kế hoạch — chỉ đếm. */
  excluded?: { testCases: number; deskTickets: number };
}
export interface RetroResult { summary: string; actions: AiAction[]; facts: string; quota: AiQuota }
export interface DailyBrief { text: string; at: string; by: number }

export interface NotifySettings { emailMode: EmailMode; quietStart: number | null; quietEnd: number | null }

// ─── Tích hợp, quản trị, chia sẻ (đợt 7) ───────────────────────
export interface GitlabConnection {
  connected: boolean; webhookUrl: string; token?: string | null; repoPath?: string | null;
  config?: { mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }; lastEventAt?: string | null;
}
export type ChatHookKind = 'DISCORD' | 'SLACK' | 'GOOGLE_CHAT';
export type ChatHookEvent = 'issue.created' | 'issue.assigned' | 'issue.done' | 'comment.created';
export interface ChatHook {
  id: number; kind: ChatHookKind; name: string; urlMasked: string; events: ChatHookEvent[]; enabled: boolean;
  lastSentAt: string | null; lastError: string | null; createdAt: string;
}
export interface GithubConnection {
  connected: boolean; webhookUrl: string; secret?: string | null; repoFullName?: string | null;
  config?: { prOpenedStatusId?: number | null; prMergedStatusId?: number | null }; lastEventAt?: string | null;
}
export interface DevItem { id: number; kind: 'COMMIT' | 'BRANCH' | 'PR'; externalId: string; title: string; url: string; state: string | null; author: string | null; repo: string | null; createdAt: string; updatedAt: string }
export interface DevActivity { branches: DevItem[]; commits: DevItem[]; pullRequests: DevItem[] }
export interface ImportPreviewRow { row: number; summary: string; type: string; status: string; parent: string | null; errors: string[]; warnings: string[] }
export type ImportResult =
  | { dryRun: true; total: number; valid: number; rows: ImportPreviewRow[] }
  | { dryRun: false; total: number; created: number; skipped: number; failures: Array<{ row: number; error: string }> };
export interface AuditItem {
  id: number; projectId: number | null; actorId: number | null; actorName: string | null; action: string; targetType: string | null; targetId: number | null;
  summary: string; detail: unknown; createdAt: string; project: { id: number; key: string; name: string } | null;
}
export interface TrashIssue { id: number; number: number; title: string; deletedAt: string; typeId: number; statusId: number; parentId: number | null; reporter: WorkUser | null; deletedBy: WorkUser | null }
export interface TrashProject { id: number; key: string; name: string; deletedAt: string; _count: { issues: number } }
export interface TrashWorkspace { id: number; name: string; slug: string; deletedAt: string; _count: { projects: number } }
export interface ShareOptions { board: boolean; backlog: boolean; reports: boolean; tests: boolean; descriptions: boolean }
export interface ShareLink {
  id: number; token: string; url: string; label: string | null; options: ShareOptions; expiresAt: string | null; expired: boolean;
  viewCount: number; lastViewedAt: string | null; createdAt: string;
}
export type TokenScope = 'read' | 'write' | 'tests:write';
export interface CalendarLinkStatus { active: boolean; createdAt: string | null; lastUsedAt: string | null; prefix: string | null }

export interface ApiToken { id: number; name: string; prefix: string; scopes: TokenScope[]; expiresAt: string | null; lastUsedAt: string | null; lastUsedIp: string | null; createdAt: string }
/** Dữ liệu trang công khai /work/share/[token] — không có email, bình luận, file. */
export interface ShareSummary {
  label: string | null; options: ShareOptions; expiresAt: string | null;
  project: { key: string; name: string; description: string | null; type: ProjectType; archived: boolean; workspace: string };
  workflows: Array<{ id: number; isDefault: boolean; statuses: Array<{ id: number; name: string; category: StatusCategory; color: string; position: number }> }>;
  issueTypes: Array<{ id: number; key: string; name: string; icon: string; color: string; level: number }>;
  sprints: WorkSprint[]; labels: WorkLabel[]; members: Array<{ id: number; name: string; avatarUrl: string | null }>;
}
export interface ShareIssue {
  key: string; number: number; title: string; typeId: number; statusId: number; parentId: number | null; sprintId: number | null; priority: number;
  assigneeId: number | null; storyPoints: number | null; dueDate: string | null; resolvedAt: string | null; rank: string;
}
export interface ShareIssueDetail extends ShareIssue {
  description: string | null; startDate: string | null; createdAt: string; parent: { number: number; title: string } | null;
  /** Đợt 6a: ảnh trong mô tả, qua đường ảnh riêng của link (/api/v1/work/share/:token/images/:id). */
  images?: string[];
  children: Array<{ number: number; title: string; statusId: number }>;
}
export interface ShareReports {
  unit: EstimationUnit; totals: { issues: number; done: number; points: number; donePoints: number };
  burndown: BurndownData | null; velocity: VelocityData | null;
}
export interface ShareTestCycle {
  id: number; name: string; environment: string | null; build: string | null; state: CycleState; createdAt: string;
  total: number; counts: Record<string, number>; executed: number; passRate: number | null;
}

/** Lỗi hết lượt AI miễn phí (402) — giao diện hiện hộp "Upgrade to Pro". */
export function isAiQuotaError(err: unknown): boolean {
  const e = err as { response?: { status?: number; data?: { code?: string } } };
  return e?.response?.status === 402 || e?.response?.data?.code === 'WORK_AI_QUOTA_EXCEEDED';
}

// ─── Gọi API ─────────────────────────────────────────────────────

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

/** Object phẳng ⇒ "?a=1&b=2" (bỏ giá trị undefined). */
function params(q: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
}

function qs(q: IssueQuery): string {
  const p = new URLSearchParams();
  const list = (k: string, v?: number[]) => v?.length && p.set(k, v.join(','));
  list('status', q.status);
  list('type', q.type);
  list('assignee', q.assignee);
  list('team', q.team);
  if (q.stage) p.set('stage', String(q.stage));
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
    d<{ workspace: { name: string; slug: string }; role: WorkspaceRole; invitedBy: string | null; restrictedToEmail: boolean; card?: import('./work-uxd-api').InviteCard }>(api.get(`${B}/invites/${encodeURIComponent(token)}`)),
  acceptInvite: (token: string) => d<{ slug: string; portalPath?: string }>(api.post(`${B}/invites/${encodeURIComponent(token)}/accept`)),

  // Dự án
  createProject: (wsId: number, body: { key: string; name: string; description?: string | null; type: ProjectType; template: ProjectTemplate; visibility?: 'WORKSPACE' | 'PRIVATE'; kind?: ProjectKind; modules?: Partial<ModuleMap> }) =>
    d<{ id: number; key: string; name: string; kind?: ProjectKind; modules?: ModuleMap }>(api.post(`${B}/workspaces/${wsId}/projects`, body)),
  resolve: (slug: string, key: string) => d<{ projectId: number }>(api.get(`${B}/resolve/${encodeURIComponent(slug)}/${encodeURIComponent(key)}`)),
  /**
   * Cấu hình dự án. Khi người xem đang BẬT khoá chỉnh sửa, các quyền SỬA bị tắt ngay
   * tại đây ⇒ mọi màn (board, chi tiết thẻ, trình soạn mô tả, backlog, cài đặt…) tự
   * chuyển sang chỉ xem. Bình luận và AI giữ nguyên. Server vẫn chặn riêng (423).
   */
  project: async (pid: number): Promise<ProjectConfig> => {
    const [cfg, lock] = await Promise.all([
      d<ProjectConfig>(api.get(`${B}/projects/${pid}`)),
      d<{ locked: boolean }>(api.get(`${B}/projects/${pid}/edit-lock`)).catch(() => ({ locked: false })),
    ]);
    if (!lock.locked) return { ...cfg, editLocked: false, rolePermissions: cfg.permissions };
    const off = Object.fromEntries(Object.keys(cfg.permissions).map((k) => [k, k === 'comment' || k === 'useAi' || k === 'viewProject' ? (cfg.permissions as unknown as Record<string, boolean>)[k] : false]));
    return { ...cfg, editLocked: true, rolePermissions: cfg.permissions, permissions: off as unknown as ProjectPermissions };
  },
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
  /** Nhân bản thẻ ("Copy of …" + link CLONES) — trả chi tiết thẻ mới. */
  cloneIssue: (pid: number, num: number) => d<IssueDetail>(api.post(`${B}/projects/${pid}/issues/${num}/clone`)),
  history: (pid: number, num: number) => d<HistoryEntry[]>(api.get(`${B}/projects/${pid}/issues/${num}/history`)),
  addLink: (pid: number, num: number, body: { type: LinkType; targetKey: string }) => d(api.post(`${B}/projects/${pid}/issues/${num}/links`, body)),
  removeLink: (pid: number, num: number, linkId: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}/links/${linkId}`)),
  watch: (pid: number, num: number, on: boolean) => d(on ? api.put(`${B}/projects/${pid}/issues/${num}/watch`) : api.delete(`${B}/projects/${pid}/issues/${num}/watch`)),
  comments: (pid: number, num: number) => d<WorkComment[]>(api.get(`${B}/projects/${pid}/issues/${num}/comments`)),
  addComment: (pid: number, num: number, bodyJson: TiptapDoc, visibility?: CommentVisibility) => d<WorkComment>(api.post(`${B}/projects/${pid}/issues/${num}/comments`, { bodyJson, ...(visibility ? { visibility } : {}) })),
  editComment: (pid: number, num: number, cid: number, bodyJson: TiptapDoc) => d<WorkComment>(api.patch(`${B}/projects/${pid}/issues/${num}/comments/${cid}`, { bodyJson })),
  deleteComment: (pid: number, num: number, cid: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}/comments/${cid}`)),
  reportComment: (pid: number, num: number, cid: number, body: { reason: CommentReportReason; details?: string | null }) =>
    d<{ reported: boolean; duplicate: boolean }>(api.post(`${B}/projects/${pid}/issues/${num}/comments/${cid}/report`, body)),
  /** Bật/tắt cảm xúc; `active` = đặt thẳng trạng thái (idempotent). */
  reactToComment: (pid: number, num: number, cid: number, emoji: ReactionEmoji, active?: boolean) =>
    d<{ commentId: number; emoji: ReactionEmoji; reacted: boolean; reactions: CommentReaction[] }>(
      api.put(`${B}/projects/${pid}/issues/${num}/comments/${cid}/reactions/${encodeURIComponent(emoji)}`, active === undefined ? {} : { active }),
    ),
  issueTemplates: (pid: number) => d<IssueTemplate[]>(api.get(`${B}/projects/${pid}/issue-templates`)),
  /** doc = null ⇒ về mẫu mặc định; tài liệu rỗng ⇒ tắt mẫu cho loại này. */
  setIssueTemplate: (pid: number, typeKey: string, doc: TiptapDoc | null) =>
    d<IssueTemplate | null>(api.put(`${B}/projects/${pid}/issue-templates/${encodeURIComponent(typeKey)}`, { doc })),
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
  /** Như aiChat nhưng huỷ được (nút Cancel trong khung AI). */
  aiChatAbortable: (pid: number, body: { message: string; history?: Array<{ role: 'user' | 'assistant'; content: string }>; issueNumber?: number | null; threadId?: number | null }, signal?: AbortSignal) =>
    d<AiAnswer>(api.post(`${B}/projects/${pid}/ai/chat`, body, { timeout: 120_000, signal })),
  // Hội thoại AI lưu ở server, dùng chung trong dự án
  aiThreads: (pid: number, params: { scope?: 'all' | 'mine'; q?: string }) =>
    d<AiThreadSummary[]>(api.get(`${B}/projects/${pid}/ai/threads`, { params })),
  aiThread: (pid: number, tid: number) => d<AiThread>(api.get(`${B}/projects/${pid}/ai/threads/${tid}`)),
  /** Luyện bảo vệ: AI (hội đồng) mở buổi và hỏi câu đầu. focus = C1…C5 | 'me' | 'all'. */
  aiStartDefense: (pid: number, body: { focus: string; visibility?: AiThreadVisibility }) =>
    d<AiThread>(api.post(`${B}/projects/${pid}/ai/defense`, body, { timeout: 120_000 })),
  aiCreateThread: (pid: number, body: { title: string; issueNumber?: number | null; visibility?: AiThreadVisibility }) =>
    d<AiThread>(api.post(`${B}/projects/${pid}/ai/threads`, body)),
  aiUpdateThread: (pid: number, tid: number, body: { title?: string; visibility?: AiThreadVisibility }) =>
    d<AiThread>(api.patch(`${B}/projects/${pid}/ai/threads/${tid}`, body)),
  aiDeleteThread: (pid: number, tid: number) => d<{ ok: true }>(api.delete(`${B}/projects/${pid}/ai/threads/${tid}`)),
  aiRetry: (pid: number, mid: number) => d<AiAnswer>(api.post(`${B}/projects/${pid}/ai/messages/${mid}/retry`, {}, { timeout: 120_000 })),
  aiApplyStored: (pid: number, mid: number, idx: number, action?: AiAction) =>
    d<AiStoredAction>(api.post(`${B}/projects/${pid}/ai/messages/${mid}/actions/${idx}/apply`, action ? { action } : {})),
  aiSetStoredStatus: (pid: number, mid: number, idx: number, status: 'dismissed' | 'pending') =>
    d<AiStoredAction>(api.patch(`${B}/projects/${pid}/ai/messages/${mid}/actions/${idx}`, { status })),
  // Lần chạy đầu: dữ liệu mẫu + danh sách Getting started
  onboarding: (pid: number) => d<OnboardingStatus>(api.get(`${B}/projects/${pid}/onboarding`)),
  addSampleData: (pid: number) => d<{ issues: number; labels: number; sprintId: number | null; plans: number }>(api.post(`${B}/projects/${pid}/sample-data`, {}, { timeout: 120_000 })),
  removeSampleData: (pid: number) => d<{ issues: number; labels: number; sprintRemoved: boolean }>(api.delete(`${B}/projects/${pid}/sample-data`, { timeout: 60_000 })),
  aiQuick: (pid: number, body: { task: AiQuickTask; issueNumber?: number | null; pageNumber?: number | null; text?: string | null; threadId?: number | null; label?: string | null }) =>
    d<AiAnswer>(api.post(`${B}/projects/${pid}/ai/quick`, body, { timeout: 180_000 })),
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
  setTransitions: (pid: number, wfId: number, body: { mode: 'free' | 'restricted'; transitions?: Array<{ from: number | null; to: number; rules?: TransitionRules | null }> }) =>
    d(api.put(`${B}/projects/${pid}/workflows/${wfId}/transitions`, body)),
  /** Toạ độ nút sơ đồ quy trình (settings.workflowLayout[wfId]); null = về tự sắp xếp. */
  setWorkflowLayout: (pid: number, wfId: number, positions: WorkflowLayout | null) =>
    d<{ workflowId: number; positions: WorkflowLayout | null }>(api.put(`${B}/projects/${pid}/workflows/${wfId}/layout`, { positions })),
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

  // Kế hoạch dài hạn & tự động hoá
  versions: (pid: number) => d<VersionSummary[]>(api.get(`${B}/projects/${pid}/versions`)),
  version: (pid: number, versionId: number) => d<{ version: WorkVersion; issues: IssueCard[] }>(api.get(`${B}/projects/${pid}/versions/${versionId}`)),
  createVersion: (pid: number, body: { name: string; description?: string | null; startDate?: string | null; releaseDate?: string | null }) =>
    d<WorkVersion>(api.post(`${B}/projects/${pid}/versions`, body)),
  updateVersion: (pid: number, versionId: number, body: { name?: string; description?: string | null; startDate?: string | null; releaseDate?: string | null; status?: 'UNRELEASED' | 'ARCHIVED'; releaseNotes?: string | null }) =>
    d<WorkVersion>(api.patch(`${B}/projects/${pid}/versions/${versionId}`, body)),
  releaseVersion: (pid: number, versionId: number, body: { moveUnresolvedTo: number | null; releaseDate?: string | null }) =>
    d<{ version: WorkVersion; moved: number }>(api.post(`${B}/projects/${pid}/versions/${versionId}/release`, body)),
  deleteVersion: (pid: number, versionId: number) => d(api.delete(`${B}/projects/${pid}/versions/${versionId}`)),
  aiReleaseNotes: (pid: number, versionId: number, body: { audience: 'users' | 'team'; language?: 'en' | 'vi' }) =>
    d<{ notes: string; quota: AiQuota }>(api.post(`${B}/projects/${pid}/versions/${versionId}/ai-notes`, body, { timeout: 120_000 })),
  timeline: (pid: number) => d<TimelineData>(api.get(`${B}/projects/${pid}/timeline`)),
  scheduleIssue: (pid: number, num: number, body: { startDate: string | null; dueDate: string | null; version?: number }) =>
    d<{ number: number; version: number }>(api.put(`${B}/projects/${pid}/issues/${num}/schedule`, body)),
  capacity: (pid: number, q: { sprintId?: number; from?: string; to?: string } = {}) =>
    d<CapacityData>(api.get(`${B}/projects/${pid}/capacity${params(q)}`)),
  setCapacity: (pid: number, userId: number, hoursPerDay: number | null) => d(api.put(`${B}/projects/${pid}/capacity/${userId}`, { hoursPerDay })),
  timeOff: (wsId: number) => d<TimeOffEntry[]>(api.get(`${B}/workspaces/${wsId}/time-off`)),
  addTimeOff: (wsId: number, body: { userId?: number; startDate: string; endDate: string; note?: string | null }) => d(api.post(`${B}/workspaces/${wsId}/time-off`, body)),
  deleteTimeOff: (wsId: number, id: number) => d(api.delete(`${B}/workspaces/${wsId}/time-off/${id}`)),
  worklogs: (pid: number, num: number) => d<Worklog[]>(api.get(`${B}/projects/${pid}/issues/${num}/worklogs`)),
  addWorklog: (pid: number, num: number, body: { minutes: number; startedAt?: string; note?: string | null; remaining?: 'auto' | 'keep' | number; activity?: string | null; workProduct?: string | null }) =>
    d<Worklog>(api.post(`${B}/projects/${pid}/issues/${num}/worklogs`, body)),
  deleteWorklog: (pid: number, num: number, logId: number) => d(api.delete(`${B}/projects/${pid}/issues/${num}/worklogs/${logId}`)),
  timeReport: (pid: number, q: { from: string; to: string; userId?: number; principal?: 'HUMAN' | 'AGENT' | 'ALL' }) => d<TimeReport>(api.get(`${B}/projects/${pid}/reports/time${params(q)}`)),
  automationRules: (pid: number) => d<AutomationRule[]>(api.get(`${B}/projects/${pid}/automation`)),
  saveAutomationRule: (pid: number, body: { id?: number; name: string; enabled?: boolean; trigger: RuleTrigger; config: RuleConfig }) =>
    d<AutomationRule>(api.post(`${B}/projects/${pid}/automation`, body)),
  setAutomationEnabled: (pid: number, ruleId: number, enabled: boolean) => d(api.patch(`${B}/projects/${pid}/automation/${ruleId}`, { enabled })),
  deleteAutomationRule: (pid: number, ruleId: number) => d(api.delete(`${B}/projects/${pid}/automation/${ruleId}`)),
  automationLogs: (pid: number, ruleId?: number) => d<RuleLog[]>(api.get(`${B}/projects/${pid}/automation-logs${ruleId ? `?ruleId=${ruleId}` : ''}`)),
  testAutomationRule: (pid: number, ruleId: number, number: number, execute = false) =>
    d<RuleTestResult>(api.post(`${B}/projects/${pid}/automation/${ruleId}/test`, { number, ...(execute ? { execute: true } : {}) })),
  notifySettings: () => d<NotifySettings>(api.get(`${B}/me/notify-settings`)),
  setNotifySettings: (body: Partial<NotifySettings>) => d<NotifySettings>(api.put(`${B}/me/notify-settings`, body)),

  // Tích hợp, quản trị, chia sẻ
  github: (pid: number) => d<GithubConnection>(api.get(`${B}/projects/${pid}/github`)),
  connectGithub: (pid: number, rotate = false) => d<GithubConnection>(api.post(`${B}/projects/${pid}/github`, { rotate })),
  updateGithub: (pid: number, body: { repoFullName?: string | null; prOpenedStatusId?: number | null; prMergedStatusId?: number | null }) =>
    d<GithubConnection>(api.patch(`${B}/projects/${pid}/github`, body)),
  disconnectGithub: (pid: number) => d(api.delete(`${B}/projects/${pid}/github`)),
  /** Khoá chỉnh sửa CÁ NHÂN của dự án (lướt xem không sợ lỡ tay sửa). */
  editLock: (pid: number) => d<{ locked: boolean; since: string | null }>(api.get(`${B}/projects/${pid}/edit-lock`)),
  setEditLock: (pid: number, locked: boolean) => d<{ locked: boolean; since: string | null }>(api.put(`${B}/projects/${pid}/edit-lock`, { locked })),
  gitlab: (pid: number) => d<GitlabConnection>(api.get(`${B}/projects/${pid}/gitlab`)),
  connectGitlab: (pid: number, rotate = false) => d<GitlabConnection>(api.post(`${B}/projects/${pid}/gitlab`, { rotate })),
  updateGitlab: (pid: number, body: { repoPath?: string | null; mrOpenedStatusId?: number | null; mrMergedStatusId?: number | null }) =>
    d<GitlabConnection>(api.patch(`${B}/projects/${pid}/gitlab`, body)),
  disconnectGitlab: (pid: number) => d(api.delete(`${B}/projects/${pid}/gitlab`)),
  chatHooks: (pid: number) => d<ChatHook[]>(api.get(`${B}/projects/${pid}/chat-hooks`)),
  createChatHook: (pid: number, body: { kind: ChatHookKind; name?: string; url: string; events?: ChatHookEvent[] }) =>
    d<ChatHook>(api.post(`${B}/projects/${pid}/chat-hooks`, body)),
  updateChatHook: (pid: number, hid: number, body: { name?: string; url?: string; events?: ChatHookEvent[]; enabled?: boolean }) =>
    d<ChatHook>(api.patch(`${B}/projects/${pid}/chat-hooks/${hid}`, body)),
  deleteChatHook: (pid: number, hid: number) => d(api.delete(`${B}/projects/${pid}/chat-hooks/${hid}`)),
  testChatHook: (pid: number, hid: number) => d<{ ok: true }>(api.post(`${B}/projects/${pid}/chat-hooks/${hid}/test`, {}, { timeout: 20_000 })),
  /** Project Tracking theo mẫu SWP391 (Product + Summary theo PIC). */
  exportProjectTracking: async (pid: number) => {
    const res = await api.get(`${B}/projects/${pid}/export/project-tracking`, { responseType: 'blob', timeout: 120_000 });
    const cd = String(res.headers['content-disposition'] ?? '');
    const name = /filename="([^"]+)"/.exec(cd)?.[1] ?? 'ProjectTracking.xlsx';
    return { blob: res.data as Blob, fileName: name };
  },
  devActivity: (pid: number, num: number) => d<DevActivity>(api.get(`${B}/projects/${pid}/issues/${num}/dev`)),
  /** Tải file xuất (CSV/Excel/PDF) — trả Blob để trình duyệt lưu. */
  exportIssues: async (pid: number, format: 'csv' | 'xlsx' | 'pdf', jql = '') => {
    const res = await api.get(`${B}/projects/${pid}/export${params({ format, jql })}`, { responseType: 'blob', timeout: 120_000 });
    const cd = String(res.headers['content-disposition'] ?? '');
    const name = /filename="([^"]+)"/.exec(cd)?.[1] ?? `issues.${format}`;
    return { blob: res.data as Blob, fileName: name };
  },
  importIssues: (pid: number, body: { csv: string; dryRun: boolean }) => d<ImportResult>(api.post(`${B}/projects/${pid}/import`, body, { timeout: 300_000 })),
  audit: (wsId: number, q: { projectId?: number; action?: string; before?: number; limit?: number } = {}) =>
    d<{ items: AuditItem[]; nextBefore: number | null }>(api.get(`${B}/workspaces/${wsId}/audit${params(q)}`)),
  trash: (pid: number) => d<TrashIssue[]>(api.get(`${B}/projects/${pid}/trash`)),
  restoreIssue: (pid: number, num: number) => d(api.post(`${B}/projects/${pid}/trash/${num}/restore`)),
  purgeIssue: (pid: number, num: number) => d(api.delete(`${B}/projects/${pid}/trash/${num}`)),
  projectTrash: (wsId: number) => d<TrashProject[]>(api.get(`${B}/workspaces/${wsId}/trash`)),
  restoreProject: (wsId: number, pid: number) => d(api.post(`${B}/workspaces/${wsId}/trash/projects/${pid}/restore`)),
  workspaceTrash: () => d<TrashWorkspace[]>(api.get(`${B}/me/trash/workspaces`)),
  restoreWorkspace: (wsId: number) => d(api.post(`${B}/me/trash/workspaces/${wsId}/restore`)),
  shareLinks: (pid: number) => d<ShareLink[]>(api.get(`${B}/projects/${pid}/share-links`)),
  createShareLink: (pid: number, body: { label?: string | null; options?: Partial<ShareOptions>; expiresInDays?: number | null }) =>
    d<ShareLink>(api.post(`${B}/projects/${pid}/share-links`, body)),
  revokeShareLink: (pid: number, linkId: number) => d(api.delete(`${B}/projects/${pid}/share-links/${linkId}`)),
  apiTokens: () => d<ApiToken[]>(api.get(`${B}/me/api-tokens`)),
  createApiToken: (body: { name: string; scopes: TokenScope[]; expiresInDays?: number | null }) => d<ApiToken & { token: string }>(api.post(`${B}/me/api-tokens`, body)),
  revokeApiToken: (id: number) => d(api.delete(`${B}/me/api-tokens/${id}`)),
  calendarLink: () => d<CalendarLinkStatus>(api.get(`${B}/me/calendar-link`)),
  createCalendarLink: () => d<{ token: string; path: string }>(api.post(`${B}/me/calendar-link`)),
  revokeCalendarLink: () => d(api.delete(`${B}/me/calendar-link`)),
  // Trang công khai (không cần đăng nhập)
  share: (token: string) => d<ShareSummary>(api.get(`${B}/share/${encodeURIComponent(token)}`)),
  shareIssues: (token: string, section: 'board' | 'backlog') => d<ShareIssue[]>(api.get(`${B}/share/${encodeURIComponent(token)}/issues?section=${section}`)),
  shareIssue: (token: string, num: number) => d<ShareIssueDetail>(api.get(`${B}/share/${encodeURIComponent(token)}/issues/${num}`)),
  shareReports: (token: string) => d<ShareReports>(api.get(`${B}/share/${encodeURIComponent(token)}/reports`)),
  shareTests: (token: string) => d<ShareTestCycle[]>(api.get(`${B}/share/${encodeURIComponent(token)}/tests`)),

  // Bù đợt 3–4
  exportTestCycle: async (pid: number, cycleId: number, format: 'xlsx' | 'pdf' | 'csv') => {
    const res = await api.get(`${B}/projects/${pid}/test-cycles/${cycleId}/export?format=${format}`, { responseType: 'blob', timeout: 120_000 });
    const name = /filename="([^"]+)"/.exec(String(res.headers['content-disposition'] ?? ''))?.[1] ?? `test-cycle.${format}`;
    return { blob: res.data as Blob, fileName: name };
  },
  /** Tải ảnh/tệp bằng chứng cho một lần chạy test (file thuộc thẻ test case). */
  async uploadRunEvidence(pid: number, testNumber: number, runId: number, file: File, onProgress?: (pct: number) => void): Promise<IssueAttachment> {
    const pre = await d<{ uploadUrl: string; key: string; headers: Record<string, string> }>(
      api.post(`${B}/projects/${pid}/issues/${testNumber}/attachments/presign`, { fileName: file.name, contentType: file.type || 'application/octet-stream', size: file.size }),
    );
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', pre.uploadUrl);
      Object.entries(pre.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(wt('detail.uploadFailedN', { n: xhr.status }))));
      xhr.onerror = () => reject(new Error(wt('detail.uploadFailedConn')));
      xhr.send(file);
    });
    return d<IssueAttachment>(api.post(`${B}/projects/${pid}/issues/${testNumber}/attachments/complete`, { key: pre.key, fileName: file.name, runId }));
  },
  aiPlanSprint: (pid: number, body: { sprintId: number; explain?: boolean; language?: 'en' | 'vi' }) =>
    d<SprintPlan>(api.post(`${B}/projects/${pid}/ai/plan-sprint`, body, { timeout: 120_000 })),
  aiRetro: (pid: number, body: { sprintId: number; notes?: string | null; language?: 'en' | 'vi' }) =>
    d<RetroResult>(api.post(`${B}/projects/${pid}/ai/retro`, body, { timeout: 120_000 })),
  aiDailyBrief: (pid: number, body: { language?: 'en' | 'vi' } = {}) =>
    d<DailyBrief & { facts: string; quota: AiQuota }>(api.post(`${B}/projects/${pid}/ai/daily-brief`, body, { timeout: 120_000 })),

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
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(wt('detail.uploadFailedN', { n: xhr.status }))));
      xhr.onerror = () => reject(new Error(wt('detail.uploadFailedConn')));
      xhr.send(file);
    });
    return d<IssueAttachment>(api.post(`${B}/projects/${pid}/issues/${num}/attachments/complete`, { key: pre.key, fileName: file.name }));
  },
};

/** Thông điệp lỗi đọc được từ lỗi axios. */
export function workError(err: unknown, fallback?: string): string {
  const e = err as { response?: { status?: number; data?: { error?: string; message?: string; code?: string; data?: { en?: unknown; vi?: unknown } } }; request?: unknown; code?: string; message?: string };
  // Máy chủ gửi sẵn câu song ngữ (vd 422 WORK_DIAGRAM_NO_SOURCE: message = "EN / VI", data.en + data.vi) ⇒ lấy đúng một vế.
  const both = e?.response?.data?.data;
  if (both && typeof both.en === 'string' && typeof both.vi === 'string') return currentWorkLocale() === 'vi' ? both.vi : both.en;
  const server = e?.response?.data?.error || e?.response?.data?.message;
  // i18n 10/10: câu theo ngôn ngữ CT Work cho các mã/câu hay gặp (components/work/i18n/errors.ts). Máy chủ không đổi.
  const network = !e?.response && (e?.code === 'ERR_NETWORK' || !!e?.request);
  const local = localizeError(currentWorkLocale(), { status: e?.response?.status, code: e?.response?.data?.code, message: server, network });
  return local || server || fallback || e?.message || translate(currentWorkLocale(), 'common.somethingWrong');
}

/** Server từ chối vì người dùng đang BẬT khoá chỉnh sửa dự án (xem components/work/editLock.tsx). */
export const EDIT_LOCKED_CODE = 'WORK_EDIT_LOCKED';
export function isEditLockedError(err: unknown): boolean {
  return (err as { response?: { data?: { code?: string } } })?.response?.data?.code === EDIT_LOCKED_CODE;
}
/** Dự án của request bị từ chối vì khoá (đọc từ URL của request). */
export function editLockedPid(err: unknown): number | null {
  if (!isEditLockedError(err)) return null;
  const url = String((err as { config?: { url?: string } })?.config?.url ?? '');
  const m = /\/projects\/(\d+)(\/|$)/.exec(url);
  return m ? Number(m[1]) : null;
}

/** Mã lỗi backend (vd 'CONFLICT' khi version lệch). */
export function workErrorStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

// ─── Tìm thẻ mọi dự án (/work/search + ⌘K) — backend: services/work/globalSearch.service.ts ───

export interface GlobalIssueHit {
  id: number;
  /** "SHOP-12" */
  key: string;
  number: number;
  title: string;
  priority: number;
  storyPoints: number | null;
  dueDate: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: { id: number; name: string; category: StatusCategory; color: string };
  type: { id: number; key: string; name: string; icon: string; color: string };
  assignee: WorkUser | null;
  project: { id: number; key: string; name: string; archived: boolean };
  workspace: { slug: string; name: string };
  /** /work/<slug>/<KEY>/issue/<n> */
  url: string;
  /** Chỉ có khi tìm bằng q: khớp ở đâu. */
  match?: 'key' | 'title' | 'description' | 'comment'; // 'comment' — K-1 (đợt 5b)
}

export interface GlobalSearchResult {
  items: GlobalIssueHit[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  projectsSearched: number;
  /** Quá 200 dự án ⇒ chỉ quét 200 dự án cập nhật gần nhất. */
  truncated: boolean;
  /** true = xếp theo độ khớp của q (không có ORDER BY). */
  ranked: boolean;
}

export interface GlobalSearchFacets {
  projects: Array<{ id: number; key: string; name: string; archived: boolean; workspace: { slug: string; name: string } }>;
  statuses: Array<{ name: string; category: StatusCategory; color: string; projectCount: number }>;
  types: Array<{ key: string; name: string; icon: string; color: string; projectCount: number }>;
  assignees: WorkUser[];
}

export const workSearchKeys = {
  all: ['work', 'global-search'] as const,
  results: (jql: string, q: string) => ['work', 'global-search', 'results', jql, q] as const,
  facets: ['work', 'global-search', 'facets'] as const,
};

export const workSearchApi = {
  search: (opts: { jql?: string; q?: string; limit?: number; offset?: number }) =>
    d<GlobalSearchResult>(api.get(`${B}/search${params({ jql: opts.jql || undefined, q: opts.q || undefined, limit: opts.limit, offset: opts.offset || undefined })}`)),
  facets: () => d<GlobalSearchFacets>(api.get(`${B}/search/facets`)),
};

// ═══ LỚP STUDIO đợt S1 (04/10/2026) — backend: services/work/{studio,teams,stages,approvals,handoffs,issueMove}.ts ═══
// Mọi route của mô-đun đang TẮT trả 403 `code: 'MODULE_DISABLED'` (data.module = tên mô-đun) —
// dùng `moduleDisabled(err)` để hiện "Turn on in Project settings → Modules" thay vì lỗi đỏ.

export type TeamRole = 'LEAD' | 'MEMBER';
export type StageStatus = 'NOT_STARTED' | 'ACTIVE' | 'GATE_REVIEW' | 'DONE';
export type ApprovalTarget = 'ISSUE' | 'STAGE_GATE' | 'DOC' | 'CR';
export type ApprovalMode = 'SEQUENTIAL' | 'PARALLEL';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type StepDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
export type HandoffStatus = 'PENDING' | 'ACCEPTED' | 'RETURNED' | 'CANCELLED';

export interface StageGateConfig { approverIds: number[]; mode: ApprovalMode }
export interface StudioConfig { kind: ProjectKind; kindStored: ProjectKind | null; modules: ModuleMap; stageGate: StageGateConfig }

export interface WorkTeam {
  id: number;
  workspaceId: number;
  key: string;
  name: string;
  color: string;
  description: string | null;
  archivedAt: string | null;
  createdAt: string;
  members: Array<WorkUser & { teamRole: TeamRole }>;
  leadIds: number[];
  /** Thẻ chưa xong của bộ phận (mọi dự án). */
  openIssues: number;
}

export interface TeamQueueItem extends IssueCard {
  projectId: number;
  projectKey: string;
  projectName: string;
  /** "CL-12" */
  key: string;
  assignee: WorkUser | null;
}
export interface TeamQueue { team: WorkTeam; isLead: boolean; total: number; limit: number; offset: number; items: TeamQueueItem[] }

export interface WorkStage {
  id: number;
  n: number;
  /** Với dự án khách: khớp /about/quy-trinh/<slug>. */
  slug: string;
  name: string;
  status: StageStatus;
  gateIssueId: number | null;
  gateIssue: { id: number; number: number; title: string; resolvedAt: string | null } | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}
export interface StageSummary extends WorkStage {
  gateIssueKey: string | null;
  issueCount: number;
  doneCount: number;
  /** Yêu cầu duyệt cổng đang chờ (nếu có). */
  pendingApprovalId: number | null;
}

export interface ApprovalStep {
  id: number;
  approverId: number;
  position: number;
  decision: StepDecision;
  comment: string | null;
  decidedAt: string | null;
  /** SHA-256 nội dung lúc người này quyết ("chữ ký"). IP không bao giờ trả ra. */
  contentHash: string | null;
  approver: WorkUser;
}
export interface WorkApproval {
  id: number;
  projectId: number;
  targetType: ApprovalTarget;
  issueId: number | null;
  stageId: number | null;
  title: string;
  description: string | null;
  mode: ApprovalMode;
  status: ApprovalStatus;
  dueAt: string | null;
  /** Hash nội dung lúc gửi duyệt. */
  contentHash: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: WorkUser | null;
  issue: { id: number; number: number; title: string } | null;
  stage: { id: number; n: number; slug: string; name: string; status: StageStatus } | null;
  /** Trang tài liệu (targetType DOC, S2a). */
  pageId?: number | null;
  page?: { id: number; number: number; title: string; status: PageStatus; visibility: PageVisibility } | null;
  /** Yêu cầu thay đổi (targetType CR, đợt S3b). */
  changeRequestId?: number | null;
  changeRequest?: { id: number; number: number; title: string; status: string; clientVisible: boolean } | null;
  steps: ApprovalStep[];
  /** CTW-1: lời nhắn cho khách + bằng chứng (chỉ ở GET một phê duyệt). */
  clientNote?: string | null;
  evidence?: import('./work-ctw-api').GateEvidence | null;
  issueKey: string | null;
  currentHash: string | null;
  signedHash: string | null;
  /** ⚠ Đã có người ký mà nội dung bây giờ khác lúc ký — cảnh báo, phê duyệt KHÔNG tự huỷ. */
  contentChanged: boolean;
  /** Còn chờ mà nội dung đã khác lúc gửi duyệt. */
  changedSinceRequest: boolean;
  myStepId: number | null;
  canDecide: boolean;
  canCancel: boolean;
  /** Người đang tới lượt (tuần tự: 1 người; song song: mọi người còn chờ). */
  waitingOn: number[];
}
export interface MyApproval extends WorkApproval { project: { id: number; key: string; name: string; workspaceSlug: string } }

export interface HandoffChecklistItem { text: string; done: boolean }
export interface TeamBrief { id: number; key: string; name: string; color: string }
export interface WorkHandoff {
  id: number;
  projectId: number;
  issueId: number;
  issueKey: string;
  issue: { number: number; title: string };
  fromTeamId: number | null;
  fromUserId: number | null;
  toTeamId: number | null;
  toUserId: number | null;
  fromTeam: TeamBrief | null;
  toTeam: TeamBrief | null;
  fromUser: WorkUser | null;
  toUser: WorkUser | null;
  createdBy: WorkUser | null;
  checklist: HandoffChecklistItem[];
  note: string | null;
  status: HandoffStatus;
  returnReason: string | null;
  createdById: number | null;
  decidedById: number | null;
  createdAt: string;
  decidedAt: string | null;
  canDecide: boolean;
  canCancel: boolean;
}
export interface MyHandoff extends WorkHandoff { project: { id: number; key: string; name: string; workspaceSlug: string } }

export interface MoveIssueResult {
  issueId: number;
  projectId: number;
  /** Mã mới, vd "OT-7". Mã cũ trả 404 code WORK_ISSUE_MOVED kèm data { projectId, key, number }. */
  key: string;
  number: number;
  subtasks: Array<{ from: string; to: string }>;
  /** Nhãn/component/trường không có ở dự án đích nên bị bỏ. */
  dropped: string[];
  canEditTarget: boolean;
}

/** Lỗi do mô-đun đang tắt ⇒ tên mô-đun; không phải ⇒ null. */
export function moduleDisabled(err: unknown): StudioModule | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; data?: { module?: StudioModule } } } })?.response;
  return r?.status === 403 && r.data?.code === 'MODULE_DISABLED' ? (r.data.data?.module ?? null) : null;
}

/** 404 vì thẻ đã chuyển sang dự án khác ⇒ mã mới để chuyển hướng; không phải ⇒ null. */
export function issueMovedTo(err: unknown): { projectId: number; key: string; number: number } | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; data?: { projectId: number; key: string; number: number } } } })?.response;
  return r?.status === 404 && r.data?.code === 'WORK_ISSUE_MOVED' && r.data.data ? r.data.data : null;
}

export const workStudioApi = {
  // Loại dự án + mô-đun + người duyệt cổng (ADMIN dự án)
  studio: (pid: number) => d<StudioConfig>(api.get(`${B}/projects/${pid}/studio`)),
  updateStudio: (pid: number, body: { kind?: ProjectKind; applyKindDefaults?: boolean; modules?: Partial<ModuleMap>; stageGate?: { approverIds?: number[]; mode?: ApprovalMode } | null }) =>
    d<StudioConfig>(api.put(`${B}/projects/${pid}/studio`, body)),

  // Bộ phận (cấp không gian; tạo/sửa = OWNER/ADMIN không gian; khách không xem được)
  teams: (wsId: number, includeArchived = false) => d<WorkTeam[]>(api.get(`${B}/workspaces/${wsId}/teams${includeArchived ? '?includeArchived=true' : ''}`)),
  team: (wsId: number, teamId: number) => d<WorkTeam>(api.get(`${B}/workspaces/${wsId}/teams/${teamId}`)),
  createTeam: (wsId: number, body: { key: string; name: string; color?: string; description?: string | null; leadIds?: number[]; memberIds?: number[] }) =>
    d<WorkTeam>(api.post(`${B}/workspaces/${wsId}/teams`, body)),
  updateTeam: (wsId: number, teamId: number, body: { name?: string; color?: string; description?: string | null; archived?: boolean }) =>
    d<WorkTeam>(api.patch(`${B}/workspaces/${wsId}/teams/${teamId}`, body)),
  deleteTeam: (wsId: number, teamId: number) => d(api.delete(`${B}/workspaces/${wsId}/teams/${teamId}`)),
  setTeamMember: (wsId: number, teamId: number, userId: number, role: TeamRole = 'MEMBER') =>
    d<WorkTeam>(api.put(`${B}/workspaces/${wsId}/teams/${teamId}/members/${userId}`, { role })),
  removeTeamMember: (wsId: number, teamId: number, userId: number) => d<WorkTeam>(api.delete(`${B}/workspaces/${wsId}/teams/${teamId}/members/${userId}`)),
  teamQueue: (wsId: number, teamId: number, q: { projectId?: number; status?: 'open' | 'done' | 'all'; unassigned?: boolean; limit?: number; offset?: number } = {}) =>
    d<TeamQueue>(api.get(`${B}/workspaces/${wsId}/teams/${teamId}/queue${params({ projectId: q.projectId, status: q.status, unassigned: q.unassigned ? 'true' : undefined, limit: q.limit, offset: q.offset })}`)),
  /** Trưởng bộ phận (hoặc người sửa được thẻ) giao/bỏ giao việc từ hàng đợi. */
  assignFromQueue: (wsId: number, teamId: number, issueId: number, assigneeId: number | null) =>
    d<IssueCard>(api.put(`${B}/workspaces/${wsId}/teams/${teamId}/queue/${issueId}/assignee`, { assigneeId })),

  // Giai đoạn + cổng
  stages: (pid: number) => d<StageSummary[]>(api.get(`${B}/projects/${pid}/stages`)),
  createStage: (pid: number, body: { n?: number; slug: string; name: string; gateIssueNumber?: number | null }) => d<WorkStage>(api.post(`${B}/projects/${pid}/stages`, body)),
  updateStage: (pid: number, sid: number, body: { n?: number; slug?: string; name?: string; gateIssueNumber?: number | null }) => d<WorkStage>(api.patch(`${B}/projects/${pid}/stages/${sid}`, body)),
  deleteStage: (pid: number, sid: number) => d(api.delete(`${B}/projects/${pid}/stages/${sid}`)),
  /** 409 WORK_STAGE_BLOCKED (data.blockingStage) khi giai đoạn trước chưa DONE; ADMIN gửi override.reason để vượt (ghi audit). */
  activateStage: (pid: number, sid: number, override?: { reason: string }) => d<WorkStage>(api.post(`${B}/projects/${pid}/stages/${sid}/activate`, override ? { override } : {})),
  requestGate: (pid: number, sid: number, body: { description?: string | null; dueAt?: string | null } = {}) =>
    d<{ stage: WorkStage; approval: WorkApproval }>(api.post(`${B}/projects/${pid}/stages/${sid}/request-gate`, body)),

  // Phê duyệt
  myApprovals: () => d<MyApproval[]>(api.get(`${B}/me/approvals`)),
  approvals: (pid: number, q: { status?: ApprovalStatus; targetType?: ApprovalTarget; issue?: number; stage?: number; page?: number; limit?: number } = {}) =>
    d<WorkApproval[]>(api.get(`${B}/projects/${pid}/approvals${params(q)}`)),
  approval: (pid: number, aid: number) => d<WorkApproval>(api.get(`${B}/projects/${pid}/approvals/${aid}`)),
  createApproval: (pid: number, body: { issueNumber: number; approverIds: number[]; mode?: ApprovalMode; title?: string; description?: string | null; dueAt?: string | null }) =>
    d<WorkApproval>(api.post(`${B}/projects/${pid}/approvals`, { targetType: 'ISSUE', ...body })),
  /** Duyệt một trang tài liệu (S2a): trang ⇒ IN_REVIEW; duyệt xong ⇒ APPROVED. Người duyệt phải đọc được trang. */
  createDocApproval: (pid: number, body: { pageNumber: number; approverIds: number[]; mode?: ApprovalMode; title?: string; description?: string | null; dueAt?: string | null }) =>
    d<WorkApproval>(api.post(`${B}/projects/${pid}/approvals`, { targetType: 'DOC', ...body })),
  /** REJECT bắt buộc comment. 409 WORK_APPROVAL_NOT_YOUR_TURN khi tuần tự chưa tới lượt. */
  decideApproval: (pid: number, aid: number, body: { decision: 'APPROVE' | 'REJECT'; comment?: string | null }) =>
    d<WorkApproval>(api.post(`${B}/projects/${pid}/approvals/${aid}/decide`, body)),
  cancelApproval: (pid: number, aid: number, reason?: string) => d<WorkApproval>(api.post(`${B}/projects/${pid}/approvals/${aid}/cancel`, { reason })),

  // Bàn giao
  myHandoffs: () => d<MyHandoff[]>(api.get(`${B}/me/handoffs`)),
  projectHandoffs: (pid: number, q: { status?: HandoffStatus; limit?: number } = {}) => d<WorkHandoff[]>(api.get(`${B}/projects/${pid}/handoffs${params(q)}`)),
  issueHandoffs: (pid: number, num: number) => d<WorkHandoff[]>(api.get(`${B}/projects/${pid}/issues/${num}/handoffs`)),
  createHandoff: (pid: number, num: number, body: { toTeamId?: number | null; toUserId?: number | null; checklist?: Array<{ text: string; done?: boolean }>; note?: string | null }) =>
    d<WorkHandoff>(api.post(`${B}/projects/${pid}/issues/${num}/handoffs`, body)),
  /** `checklist` = trạng thái tick theo đúng thứ tự mục; thiếu mục chưa tick ⇒ 400 WORK_HANDOFF_CHECKLIST. */
  acceptHandoff: (pid: number, hid: number, checklist?: boolean[]) => d<WorkHandoff>(api.post(`${B}/projects/${pid}/handoffs/${hid}/accept`, { checklist })),
  returnHandoff: (pid: number, hid: number, reason: string) => d<WorkHandoff>(api.post(`${B}/projects/${pid}/handoffs/${hid}/return`, { reason })),
  cancelHandoff: (pid: number, hid: number) => d<WorkHandoff>(api.post(`${B}/projects/${pid}/handoffs/${hid}/cancel`)),

  // Chuyển thẻ sang dự án khác (cùng không gian; ADMIN hoặc người báo)
  moveToProject: (pid: number, num: number, targetProjectId: number, version?: number) =>
    d<MoveIssueResult>(api.post(`${B}/projects/${pid}/issues/${num}/move-project`, { targetProjectId, version })),
};

export const workStudioKeys = {
  studio: (pid: number) => ['work', 'studio', pid] as const,
  teams: (wsId: number) => ['work', 'teams', wsId] as const,
  teamQueue: (wsId: number, teamId: number) => ['work', 'team-queue', wsId, teamId] as const,
  stages: (pid: number) => ['work', 'stages', pid] as const,
  approvals: (pid: number) => ['work', 'approvals', pid] as const,
  myApprovals: ['work', 'my-approvals'] as const,
  handoffs: (pid: number) => ['work', 'handoffs', pid] as const,
  issueHandoffs: (pid: number, num: number) => ['work', 'handoffs', pid, num] as const,
  myHandoffs: ['work', 'my-handoffs'] as const,
};

// ─── Tài liệu dự án (đợt S2a, mô-đun docs) ───────────────────────

export type PageStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'ARCHIVED';
export type PageVisibility = 'INTERNAL' | 'CLIENT';

export interface WorkPageItem {
  id: number;
  number: number;
  /** Khách thấy trang Client dưới trang nội bộ ⇒ server trả parentId của tổ tiên thấy được (hoặc null). */
  parentId: number | null;
  title: string;
  status: PageStatus;
  visibility: PageVisibility;
  stageId: number | null;
  position: number;
  ownerId: number | null;
  templateKey: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: WorkUser | null;
}
export interface WorkPageList { pages: WorkPageItem[]; canEdit: boolean; canManage: boolean; approvalsOn: boolean; stagesOn: boolean }

export interface PageIssueLink {
  linkId: number;
  linkedAt: string;
  id: number;
  number: number;
  key: string;
  title: string;
  resolvedAt: string | null;
  status: { name: string; category: StatusCategory };
  type: { key: string; name: string; icon: string; color: string };
}

export interface WorkPageDetail extends WorkPageItem {
  contentJson: TiptapDoc | null;
  contentText: string | null;
  /** Số lần lưu — gửi lại khi PATCH; lệch ⇒ 409 WORK_PAGE_CONFLICT. */
  version: number;
  lastEditedById: number | null;
  owner: WorkUser | null;
  lastEditedBy: WorkUser | null;
  stage: { id: number; n: number; slug: string; name: string; status: StageStatus } | null;
  projectKey: string;
  currentVersion: number;
  versionCount: number;
  issues: PageIssueLink[];
  ancestors: Array<{ id: number; number: number; title: string }>;
  children: Array<{ id: number; number: number; title: string; status: PageStatus; visibility: PageVisibility }>;
  approval: { id: number; status: ApprovalStatus; decidedAt: string | null; createdAt: string; contentChanged: boolean; changedSinceRequest: boolean } | null;
  approvalsOn: boolean;
  canEdit: boolean;
  canManage: boolean;
  canComment: boolean;
  canRequestApproval: boolean;
}

export interface PageVersion {
  id: number;
  n: number;
  kind: 'CREATE' | 'EDIT' | 'RESTORE' | 'MANUAL';
  title: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  author: WorkUser | null;
  chars: number;
}
export interface PageVersionFull extends Omit<PageVersion, 'chars'> { contentJson: TiptapDoc | null; contentText: string | null }
export interface PageDiff {
  from: { n: number; title: string; createdAt: string };
  to: { n: number | null; title: string; createdAt: string | null; current: boolean };
  lines: Array<{ op: 'eq' | 'add' | 'del'; text: string }>;
  added: number;
  removed: number;
}
export interface PageComment {
  id: number;
  bodyJson: TiptapDoc;
  bodyText: string;
  createdAt: string;
  editedAt: string | null;
  authorId: number | null;
  author: WorkUser | null;
  canDelete: boolean;
  /** CTW đợt 5b K-1: trả lời theo luồng (id gốc). */
  parentId?: number | null;
}
export interface DocTemplateInfo {
  key: string;
  title: string;
  titleVi: string;
  stages: Array<{ n: number; slug: string; title: string; titleEn: string }>;
  sections: number;
  summary: string;
}
export interface DocSearchHit { id: number; number: number; title: string; status: PageStatus; updatedAt: string; snippet: string; project?: { id: number; key: string; name: string; workspaceSlug: string } }

export const workDocsKeys = {
  all: (pid: number) => ['work', 'pages', pid] as const,
  list: (pid: number) => ['work', 'pages', pid, 'list'] as const,
  page: (pid: number, num: number) => ['work', 'pages', pid, 'page', num] as const,
  versions: (pid: number, num: number) => ['work', 'pages', pid, 'versions', num] as const,
  comments: (pid: number, num: number) => ['work', 'pages', pid, 'comments', num] as const,
  issuePages: (pid: number, issueNum: number) => ['work', 'pages', pid, 'issue', issueNum] as const,
  templates: (pid: number) => ['work', 'doc-templates', pid] as const,
};

export const workDocsApi = {
  list: (pid: number, stage?: number) => d<WorkPageList>(api.get(`${B}/projects/${pid}/pages${params({ stage })}`)),
  get: (pid: number, num: number) => d<WorkPageDetail>(api.get(`${B}/projects/${pid}/pages/${num}`)),
  create: (pid: number, body: { title?: string; parentNumber?: number | null; templateKey?: string | null; stageId?: number | null; contentJson?: TiptapDoc; visibility?: PageVisibility }) =>
    d<WorkPageDetail>(api.post(`${B}/projects/${pid}/pages`, body)),
  /** 409 WORK_PAGE_CONFLICT khi `version` lệch (người khác vừa lưu). */
  update: (pid: number, num: number, body: { title?: string; contentJson?: TiptapDoc; status?: PageStatus; visibility?: PageVisibility; ownerId?: number; stageId?: number | null; version?: number; versionNote?: string | null }) =>
    d<WorkPageDetail>(api.patch(`${B}/projects/${pid}/pages/${num}`, body)),
  move: (pid: number, num: number, parentNumber: number | null, index: number) => d<WorkPageList>(api.post(`${B}/projects/${pid}/pages/${num}/move`, { parentNumber, index })),
  remove: (pid: number, num: number) => d<{ deleted: number }>(api.delete(`${B}/projects/${pid}/pages/${num}`)),
  markdown: (pid: number, num: number) => d<{ filename: string; markdown: string }>(api.get(`${B}/projects/${pid}/pages/${num}/markdown`)),
  versions: (pid: number, num: number) => d<PageVersion[]>(api.get(`${B}/projects/${pid}/pages/${num}/versions`)),
  version: (pid: number, num: number, n: number) => d<PageVersionFull>(api.get(`${B}/projects/${pid}/pages/${num}/versions/${n}`)),
  compare: (pid: number, num: number, from: number, to: number | 'current' = 'current') => d<PageDiff>(api.get(`${B}/projects/${pid}/pages/${num}/versions/compare${params({ from, to })}`)),
  restore: (pid: number, num: number, n: number) => d<WorkPageDetail>(api.post(`${B}/projects/${pid}/pages/${num}/versions/${n}/restore`)),
  linkIssue: (pid: number, num: number, issueNumber: number) => d<PageIssueLink[]>(api.post(`${B}/projects/${pid}/pages/${num}/issues`, { issueNumber })),
  unlinkIssue: (pid: number, num: number, issueNumber: number) => d<PageIssueLink[]>(api.delete(`${B}/projects/${pid}/pages/${num}/issues/${issueNumber}`)),
  issuePages: (pid: number, issueNum: number) => d<{ pages: Array<{ linkId: number; id: number; number: number; title: string; status: PageStatus; visibility: PageVisibility; updatedAt: string }>; canEdit: boolean }>(api.get(`${B}/projects/${pid}/issues/${issueNum}/pages`)),
  comments: (pid: number, num: number) => d<PageComment[]>(api.get(`${B}/projects/${pid}/pages/${num}/comments`)),
  addComment: (pid: number, num: number, bodyJson: TiptapDoc) => d<PageComment>(api.post(`${B}/projects/${pid}/pages/${num}/comments`, { bodyJson })),
  deleteComment: (pid: number, num: number, cid: number) => d(api.delete(`${B}/projects/${pid}/pages/${num}/comments/${cid}`)),
  search: (pid: number, q: string) => d<DocSearchHit[]>(api.get(`${B}/projects/${pid}/pages/search${params({ q })}`)),
  searchAll: (q: string) => d<DocSearchHit[]>(api.get(`${B}/search/docs${params({ q })}`)),
  templates: (pid: number) => d<DocTemplateInfo[]>(api.get(`${B}/projects/${pid}/doc-templates`)),
  template: (pid: number, key: string) => d<DocTemplateInfo & { contentJson: TiptapDoc }>(api.get(`${B}/projects/${pid}/doc-templates/${key}`)),
};

// ─── Ghi chú liên kết (mô-đun Notes ↔ thẻ) — chiều B trên chi tiết thẻ ──
// Ghi chú là RIÊNG TƯ: backend chỉ trả ghi chú CỦA NGƯỜI GỌI liên kết với thẻ này.
export interface IssueLinkedNote {
  linkId: number;
  id: number;
  title: string;
  subject: { id: number; name: string; color: string | null } | null;
  updatedAt: string;
  url: string;
}

export const workIssueNotesKeys = {
  list: (pid: number, issueNum: number) => ['work', 'issue-notes', pid, issueNum] as const,
};

export const workIssueNotesApi = {
  list: (pid: number, issueNum: number) => d<{ notes: IssueLinkedNote[] }>(api.get(`${B}/projects/${pid}/issues/${issueNum}/notes`)),
  link: (pid: number, issueNum: number, noteId: number) => d<{ notes: IssueLinkedNote[] }>(api.post(`${B}/projects/${pid}/issues/${issueNum}/notes`, { noteId })),
  unlink: (pid: number, issueNum: number, noteId: number) => d<{ notes: IssueLinkedNote[] }>(api.delete(`${B}/projects/${pid}/issues/${issueNum}/notes/${noteId}`)),
};

// ─── Cổng khách (đợt S2b, mô-đun clientPortal) ───────────────────
// Backend: src/services/work/portal.service.ts. `asClient` = "Preview as client"
// (nhân viên xem đúng như khách, chỉ đọc).

export type PortalTab = 'overview' | 'requests' | 'approvals' | 'documents' | 'deliverables' | 'activity' | 'meetings' | 'payments' | 'reports' | 'resources' | 'help'; // 'help' = CTW đợt 7b: knowledge base
export type PortalRequestKind = 'BUG' | 'CHANGE' | 'QUESTION' | 'FEEDBACK';

export interface PortalViewer {
  clientView: boolean; preview: boolean; isClient: boolean;
  canManage: boolean; canInvite: boolean; canRequestUat: boolean; canSubmitRequest: boolean;
}
export interface PortalOverview {
  project: {
    key: string; name: string; description: string | null; workspaceName: string; organization: string | null;
    /** CTW-23: nhận diện dự án + logo studio. */
    avatarUrl?: string | null; iconEmoji?: string | null; color?: string | null; workspaceLogoUrl?: string | null;
    coverUrl?: string | null; coverPositionY?: number | null; // UX-D
  };
  viewer: PortalViewer;
  stages: Array<{ id: number; n: number; name: string; status: 'NOT_STARTED' | 'ACTIVE' | 'GATE_REVIEW' | 'DONE'; percent: number; startedAt: string | null; completedAt: string | null }>;
  currentStage: PortalOverview['stages'][number] | null;
  overallPercent: number | null;
  milestones: Array<{ id: number; name: string; status: string; releaseDate: string | null; releasedAt: string | null; items: number; done: number }>;
  waitingOnClient: Array<{ id: number; title: string; kind: 'UAT' | 'APPROVAL'; dueAt: string | null; createdAt: string }>;
  counts: { sharedOpen: number; sharedDone: number; requestsOpen: number };
}
export interface PortalTypeRef { key: string; name: string; icon: string; color: string }
export interface PortalStatusRef { name: string; category: StatusCategory; color: string }
export interface PortalRequestRow {
  number: number; key: string; title: string; priority: number; type: PortalTypeRef; status: PortalStatusRef; stage: string | null;
  fromClient: boolean; mine: boolean; replies: number; files: number; createdAt: string; updatedAt: string; resolvedAt: string | null; sharedAt: string | null;
}
export interface PortalRequestDetail {
  id: number; number: number; key: string; title: string; descriptionJson: TiptapDoc | null; priority: number;
  createdAt: string; updatedAt: string; resolvedAt: string | null; clientSharedAt: string | null; dueDate: string | null;
  type: PortalTypeRef; status: PortalStatusRef; stage: { n: number; name: string; status: string } | null;
  parent: { title: string; number: number | null } | null;
  fixVersion: { name: string; releaseDate: string | null; status: string } | null;
  reporter: WorkUser | null; fromClient: boolean;
  attachments: Array<{ id: number; fileName: string; mime: string; size: number; createdAt: string; deliverable: boolean; uploader: WorkUser | null }>;
  comments: Array<{ id: number; bodyJson: TiptapDoc; createdAt: string; editedAt: string | null; isAi: boolean; author: WorkUser | null; parentId?: number | null; attachments?: import('./work-comments-api').CommentFile[] }>; // K-1: luồng + tệp/voice
  viewer: PortalViewer; clientIds: number[];
}
export interface PortalUat {
  round: number; environment: string | null; build: string | null; conditions: string | null;
  version: { id: number; name: string; releaseDate: string | null } | null; stage: { id: number; n: number; name: string } | null;
  items: Array<{ number: number; key: string; title: string; done: boolean; status: { name: string; category: StatusCategory }; type: { key: string; name: string } }>;
  itemCount: number;
  pages: Array<{ number: number; title: string; status: string }>;
  files: Array<{ id: number; fileName: string; size: number }>;
  createdIssues: Array<{ number: number; key: string; title: string; type: { key: string; name: string }; status: { name: string; category: StatusCategory } }>;
}
export interface PortalApproval {
  id: number; targetType: 'ISSUE' | 'STAGE_GATE' | 'DOC' | 'UAT' | 'CR'; title: string; description: string | null; mode: string;
  status: ApprovalStatus; dueAt: string | null; decidedAt: string | null; createdAt: string; createdBy: WorkUser | null;
  issue: { number: number; title: string; key: string; shared: boolean } | null;
  stage: { n: number; name: string; status: string } | null;
  page: { number: number; title: string } | null;
  steps: Array<{ id: number; position: number; decision: string; decidedAt: string | null; approver: WorkUser; isClient: boolean; comment: string | null; signature: string | null }>;
  waitingOnClient: boolean; canDecide: boolean; contentChanged: boolean; signedHash: string | null;
  uat: PortalUat | null;
  /** CTW-1: lời nhắn cho khách (nhân viên xem; khách đọc qua `description`) + bằng chứng cổng giai đoạn. */
  clientNote?: string | null;
  evidence?: import('./work-ctw-api').GateEvidence | null;
  /** Phân tích ảnh hưởng của CR đã chia sẻ (targetType CR, đợt S3b). */
  changeRequest?: import('./work-s3b-api').CrForClient | null;
}
export interface PortalDocuments {
  viewer: PortalViewer;
  pages: Array<{ number: number; title: string; status: PageStatus; updatedAt: string; stage: string | null }>;
  files: Array<{ id: number; fileName: string; mime: string; size: number; createdAt: string; uploader: WorkUser | null; issue: { number: number; title: string; key: string } }>;
}
export interface PortalDeliverables {
  viewer: PortalViewer;
  files: Array<{ id: number; fileName: string; mime: string; size: number; deliveredAt: string | null; createdAt: string; issue: { number: number; title: string; key: string; version: string | null } }>;
  releases: Array<{ id: number; name: string; releasedAt: string | null; items: Array<{ number: number; title: string; key: string }> }>;
}
export interface PortalActivityItem { id: string; at: string; kind: string; text: string; actor: string | null; issueNumber?: number | null; pageNumber?: number | null; approvalId?: number | null }
export interface PortalCertificate {
  project: { name: string; key: string }; vendor: string; client: string | null; requestCode: string | null;
  title: string; status: ApprovalStatus; round: number; milestone: string | null; environment: string | null; build: string | null;
  requestedAt: string; decidedAt: string | null;
  items: PortalUat['items']; results: { total: number; passed: number; failed: number };
  documents: PortalUat['pages']; files: PortalUat['files']; conditions: string | null; findings: PortalUat['createdIssues'];
  conclusion: 'ACCEPTED' | 'ACCEPTED_WITH_CONDITIONS' | 'NOT_ACCEPTED' | 'PENDING';
  signatures: Array<{ name: string; side: 'CLIENT' | 'VENDOR'; decision: string; at: string; signature: string | null; comment: string | null }>;
  contentHash: string | null; contentChanged: boolean; viewer: PortalViewer; generatedAt: string;
}

const asQ = (asClient?: boolean, extra: Record<string, string | number | undefined> = {}) => params({ ...extra, ...(asClient ? { as: 'client' } : {}) });

export const workPortalKeys = {
  all: (pid: number) => ['work', 'portal', pid] as const,
  tab: (pid: number, tab: string, asClient: boolean) => ['work', 'portal', pid, tab, asClient] as const,
  request: (pid: number, num: number, asClient: boolean) => ['work', 'portal', pid, 'request', num, asClient] as const,
  approval: (pid: number, id: number, asClient: boolean) => ['work', 'portal', pid, 'approval', id, asClient] as const,
  doc: (pid: number, num: number, asClient: boolean) => ['work', 'portal', pid, 'doc', num, asClient] as const,
};

export const workPortalApi = {
  overview: (pid: number, asClient?: boolean) => d<PortalOverview>(api.get(`${B}/projects/${pid}/portal/overview${asQ(asClient)}`)),
  requests: (pid: number, asClient?: boolean, filter?: 'all' | 'open' | 'done' | 'mine') => d<{ viewer: PortalViewer; items: PortalRequestRow[] }>(api.get(`${B}/projects/${pid}/portal/requests${asQ(asClient, { filter })}`)),
  request: (pid: number, num: number, asClient?: boolean) => d<PortalRequestDetail>(api.get(`${B}/projects/${pid}/portal/requests/${num}${asQ(asClient)}`)),
  submitRequest: (pid: number, body: { kind: PortalRequestKind; title: string; description?: string | null; priority?: number }) =>
    d<{ number: number; key: string }>(api.post(`${B}/projects/${pid}/portal/requests`, body)),
  approvals: (pid: number, asClient?: boolean) => d<{ viewer: PortalViewer; items: PortalApproval[] }>(api.get(`${B}/projects/${pid}/portal/approvals${asQ(asClient)}`)),
  approval: (pid: number, id: number, asClient?: boolean) => d<PortalApproval>(api.get(`${B}/projects/${pid}/portal/approvals/${id}${asQ(asClient)}`)),
  documents: (pid: number, asClient?: boolean) => d<PortalDocuments>(api.get(`${B}/projects/${pid}/portal/documents${asQ(asClient)}`)),
  document: (pid: number, num: number, asClient?: boolean) =>
    d<{ number: number; title: string; status: PageStatus; visibility: PageVisibility; contentJson: TiptapDoc | null; updatedAt: string; stage: string | null; owner: WorkUser | null }>(api.get(`${B}/projects/${pid}/portal/documents/${num}${asQ(asClient)}`)),
  deliverables: (pid: number, asClient?: boolean) => d<PortalDeliverables>(api.get(`${B}/projects/${pid}/portal/deliverables${asQ(asClient)}`)),
  activity: (pid: number, asClient?: boolean) => d<{ viewer: PortalViewer; items: PortalActivityItem[] }>(api.get(`${B}/projects/${pid}/portal/activity${asQ(asClient)}`)),
  clients: (pid: number) => d<{ clients: Array<WorkUser & { email?: string }>; pendingInvites: Array<{ id: number; email: string; expiresAt: string }> }>(api.get(`${B}/projects/${pid}/portal/clients`)),
  invite: (pid: number, emails: string[]) => d<Array<{ email: string; status: 'ADDED' | 'ALREADY_MEMBER' | 'INVITED' }>>(api.post(`${B}/projects/${pid}/portal/invite`, { emails })),
  createUat: (pid: number, body: { title?: string; description?: string | null; versionId?: number | null; stageId?: number | null; issueNumbers: number[]; pageNumbers?: number[]; attachmentIds?: number[]; approverIds: number[]; environment?: string | null; build?: string | null; dueAt?: string | null }) =>
    d<PortalApproval>(api.post(`${B}/projects/${pid}/portal/uat`, body)),
  decideUat: (pid: number, id: number, body: { decision: 'APPROVE' | 'REJECT'; comment?: string | null; conditions?: string | null; points?: Array<{ title: string; kind: 'BUG' | 'CHANGE'; detail?: string | null }> }) =>
    d<PortalApproval>(api.post(`${B}/projects/${pid}/portal/uat/${id}/decide`, body)),
  certificate: (pid: number, id: number, asClient?: boolean) => d<PortalCertificate>(api.get(`${B}/projects/${pid}/portal/uat/${id}/certificate${asQ(asClient)}`)),
  // Nhân viên: chia sẻ thẻ / tệp
  setIssueShared: (pid: number, num: number, visible: boolean) => d<{ number: number; clientVisible: boolean }>(api.put(`${B}/projects/${pid}/issues/${num}/client-visible`, { visible })),
  setAttachmentClient: (pid: number, aid: number, body: { clientVisible?: boolean; deliverable?: boolean }) => d(api.patch(`${B}/projects/${pid}/attachments/${aid}/client`, body)),
};

// ─── "Ask AI how to use" — trợ lý hướng dẫn trong ứng dụng (POST /work/help/ask) ───
export interface HelpAskLink { scope: string; path: string; label: { en: string; vi: string } }
export interface HelpAskResult { answer: string; links: HelpAskLink[] }
export const workHelpApi = {
  ask: (body: { q: string; lang: 'en' | 'vi'; page?: string }) =>
    d<HelpAskResult>(api.post(`${B}/help/ask`, body)),
};
