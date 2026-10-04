/**
 * CT Work — các giá trị hợp lệ.
 *
 * Schema lưu vai trò/trạng thái/loại thẻ dưới dạng CHUỖI (thêm giá trị mới
 * không cần migration), nên đây là nơi duy nhất nói chuỗi nào là hợp lệ.
 * Route kiểm đầu vào bằng các mảng này qua zod — đừng chép lại danh sách ở
 * chỗ khác (bài học enum chép tay trôi dạt trong seed.ts, 08/08/2026).
 */

export const WORKSPACE_ROLES = ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const PROJECT_ROLES = ['ADMIN', 'MEMBER', 'VIEWER', 'TEACHER', 'CLIENT'] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];

export const PROJECT_TYPES = ['SCRUM', 'KANBAN', 'TESTING'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_VISIBILITY = ['WORKSPACE', 'PRIVATE'] as const;
export type ProjectVisibility = (typeof PROJECT_VISIBILITY)[number];

export const PROJECT_TEMPLATES = ['BLANK', 'SWR302', 'SWT301', 'SWP391', 'FREELANCE', 'COMPANY'] as const;
export type ProjectTemplate = (typeof PROJECT_TEMPLATES)[number];

export const STATUS_CATEGORIES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export type StatusCategory = (typeof STATUS_CATEGORIES)[number];

export const ISSUE_TYPE_KEYS = ['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK', 'TEST', 'REQUIREMENT'] as const;
export type IssueTypeKey = (typeof ISSUE_TYPE_KEYS)[number];

export const LINK_TYPES = ['BLOCKS', 'RELATES', 'DUPLICATES', 'CLONES', 'TESTS'] as const;
export type LinkType = (typeof LINK_TYPES)[number];

export const SPRINT_STATES = ['PLANNED', 'ACTIVE', 'CLOSED'] as const;
export type SprintState = (typeof SPRINT_STATES)[number];

export const ACTOR_KINDS = ['USER', 'AI', 'AUTOMATION', 'SYSTEM'] as const;
export type ActorKind = (typeof ACTOR_KINDS)[number];

/** 1 = Cao nhất … 5 = Thấp nhất — cùng thứ tự với Jira. */
export const PRIORITY_MIN = 1;
export const PRIORITY_MAX = 5;
export const PRIORITY_DEFAULT = 3;

/** Mã dự án: 2–10 ký tự, bắt đầu bằng chữ, chỉ chữ in hoa và số (SWP, SWT301). */
export const PROJECT_KEY_RE = /^[A-Z][A-Z0-9]{1,9}$/;

// ─── Lớp studio (đợt S1, 04/10/2026) ─────────────────────────────

/** Loại dự án — chọn lúc tạo; quyết định mô-đun mặc định (studio.ts). */
export const PROJECT_KINDS = ['PERSONAL', 'SCHOOL', 'SOFTWARE', 'CLIENT'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

/**
 * Mô-đun bật/tắt theo dự án. Đợt S1 dùng thật 4 mô-đun đầu; các khoá sau CHỪA
 * CHỖ cho đợt 2–4 (lưu được, chưa có route nào đọc).
 */
export const STUDIO_MODULES = ['teams', 'stages', 'approvals', 'handoffs', 'docs', 'clientPortal', 'changeRequests', 'raid', 'meetings', 'finance'] as const;
export type StudioModule = (typeof STUDIO_MODULES)[number];
/** Mô-đun đã có tính năng thật (đợt S1). */
export const STUDIO_MODULES_S1: readonly StudioModule[] = ['teams', 'stages', 'approvals', 'handoffs'];
/** Mô-đun có tính năng thật từ đợt S2a (04/10/2026): tài liệu dự án kiểu Confluence. */
export const STUDIO_MODULES_S2A: readonly StudioModule[] = ['docs'];

export const TEAM_ROLES = ['LEAD', 'MEMBER'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export const STAGE_STATUSES = ['NOT_STARTED', 'ACTIVE', 'GATE_REVIEW', 'DONE'] as const;
export type StageStatus = (typeof STAGE_STATUSES)[number];

export const APPROVAL_TARGETS = ['ISSUE', 'STAGE_GATE', 'DOC', 'CR'] as const;
export type ApprovalTarget = (typeof APPROVAL_TARGETS)[number];
export const APPROVAL_MODES = ['SEQUENTIAL', 'PARALLEL'] as const;
export type ApprovalMode = (typeof APPROVAL_MODES)[number];
export const APPROVAL_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
export const STEP_DECISIONS = ['PENDING', 'APPROVED', 'REJECTED', 'SKIPPED'] as const;
export type StepDecision = (typeof STEP_DECISIONS)[number];

export const HANDOFF_STATUSES = ['PENDING', 'ACCEPTED', 'RETURNED', 'CANCELLED'] as const;
export type HandoffStatus = (typeof HANDOFF_STATUSES)[number];

/** Mã bộ phận: 2–16 ký tự, bắt đầu bằng chữ, chữ in hoa/số/gạch dưới (BA, DEV, QA_AUTO). */
export const TEAM_KEY_RE = /^[A-Z][A-Z0-9_]{1,15}$/;

// ─── Tài liệu dự án (đợt S2a, 04/10/2026, mô-đun `docs`) ─────────

export const PAGE_STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED'] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];
/** INTERNAL: chỉ đội làm. CLIENT: khách (vai CLIENT / khách GUEST) đọc được — cổng khách đợt S2b. */
export const PAGE_VISIBILITY = ['INTERNAL', 'CLIENT'] as const;
export type PageVisibility = (typeof PAGE_VISIBILITY)[number];
