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
