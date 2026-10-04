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
export const STUDIO_MODULES = ['teams', 'stages', 'approvals', 'handoffs', 'docs', 'clientPortal', 'changeRequests', 'raid', 'meetings', 'finance', 'reports', 'serviceDesk'] as const;
export type StudioModule = (typeof STUDIO_MODULES)[number];
/** Mô-đun đã có tính năng thật (đợt S1). */
export const STUDIO_MODULES_S1: readonly StudioModule[] = ['teams', 'stages', 'approvals', 'handoffs'];
/** Mô-đun có tính năng thật từ đợt S2a (04/10/2026): tài liệu dự án kiểu Confluence. */
export const STUDIO_MODULES_S2A: readonly StudioModule[] = ['docs'];
/** Mô-đun có tính năng thật từ đợt S2b (04/10/2026): cổng khách (client portal). */
export const STUDIO_MODULES_S2B: readonly StudioModule[] = ['clientPortal'];

export const TEAM_ROLES = ['LEAD', 'MEMBER'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export const STAGE_STATUSES = ['NOT_STARTED', 'ACTIVE', 'GATE_REVIEW', 'DONE'] as const;
export type StageStatus = (typeof STAGE_STATUSES)[number];

/** UAT (đợt S2b): nghiệm thu của khách cho một mốc/version/giai đoạn — chi tiết ở work_uat_requests. */
export const APPROVAL_TARGETS = ['ISSUE', 'STAGE_GATE', 'DOC', 'CR', 'UAT'] as const;
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

// ─── Cổng khách (đợt S2b, 04/10/2026, mô-đun `clientPortal`) ─────

/** INTERNAL: ghi chú nội bộ (mặc định) · PUBLIC: trả lời khách — khách chỉ thấy PUBLIC. */
export const COMMENT_VISIBILITY = ['INTERNAL', 'PUBLIC'] as const;
export type CommentVisibility = (typeof COMMENT_VISIBILITY)[number];

/** Loại yêu cầu khách gửi từ cổng ⇒ loại thẻ + bộ phận nhận (portal.service.ts). */
export const PORTAL_REQUEST_KINDS = ['BUG', 'CHANGE', 'QUESTION', 'FEEDBACK'] as const;
export type PortalRequestKind = (typeof PORTAL_REQUEST_KINDS)[number];

/** Nhãn gắn mọi thẻ khách gửi qua cổng. */
export const FROM_CLIENT_LABEL = 'from-client';

// ─── Quản trị dự án (đợt S3b, 04/10/2026): CR · RAID · họp ───────

/** Mô-đun có tính năng thật từ đợt S3b: yêu cầu thay đổi, sổ RAID, cuộc họp. */
export const STUDIO_MODULES_S3B: readonly StudioModule[] = ['changeRequests', 'raid', 'meetings'];

/**
 * Vòng đời CR (PMBOK 7 change control): Draft → Submitted → Under review → Approved/Rejected → Implemented.
 * UNDER_REVIEW / APPROVED / REJECTED chỉ đặt qua phê duyệt (approvals.service, targetType CR).
 */
export const CR_STATUSES = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED'] as const;
export type CrStatus = (typeof CR_STATUSES)[number];
export const CR_URGENCY = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type CrUrgency = (typeof CR_URGENCY)[number];
/** AFFECTED: thẻ/giai đoạn/version bị ảnh hưởng · IMPLEMENTS: thẻ thực hiện CR. */
export const CR_LINK_ROLES = ['AFFECTED', 'IMPLEMENTS'] as const;
export type CrLinkRole = (typeof CR_LINK_ROLES)[number];

/** Sổ RAID: Risk · Assumption · Issue · Dependency. */
export const RAID_TYPES = ['RISK', 'ASSUMPTION', 'ISSUE', 'DEPENDENCY'] as const;
export type RaidType = (typeof RAID_TYPES)[number];
export const RAID_STATUSES = ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'] as const;
export const ASSUMPTION_STATUSES = ['UNVALIDATED', 'VALIDATED', 'INVALID'] as const;
export type RaidStatus = (typeof RAID_STATUSES)[number] | (typeof ASSUMPTION_STATUSES)[number];
/** Phản ứng với rủi ro (PMBOK / ISO 31000): tránh · giảm · chuyển giao · chấp nhận. */
export const RAID_RESPONSES = ['AVOID', 'MITIGATE', 'TRANSFER', 'ACCEPT'] as const;
export type RaidResponse = (typeof RAID_RESPONSES)[number];

export const MEETING_TYPES = ['KICKOFF', 'DAILY', 'WEEKLY', 'DEMO', 'RETRO', 'STEERING', 'CLIENT', 'OTHER'] as const;
export type MeetingType = (typeof MEETING_TYPES)[number];
export const MEETING_STATUSES = ['SCHEDULED', 'DONE', 'CANCELLED'] as const;
export type MeetingStatus = (typeof MEETING_STATUSES)[number];

// ─── Tài chính · báo cáo · xuất trọn (đợt S4, 04/10/2026) ────────

/**
 * Mô-đun có tính năng thật từ đợt S4: `finance` (đơn giá, timesheet tuần, ngân sách, chi phí,
 * mốc thanh toán) và `reports` (báo cáo tuần cho khách tự động, steering, chế độ thuyết trình).
 * Xuất trọn dự án KHÔNG phải mô-đun — quyền ADMIN dự án (sao lưu là quyền, không phải tính năng bật/tắt).
 */
export const STUDIO_MODULES_S4: readonly StudioModule[] = ['finance', 'reports'];

/** Đơn vị tiền theo dự án. Mặc định VND. */
export const CURRENCIES = ['VND', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];
/** Phạm vi đơn giá — ưu tiên khi định giá: USER → TEAM → ROLE → DEFAULT (financeRules.pickRate). */
export const RATE_SCOPES = ['DEFAULT', 'ROLE', 'TEAM', 'USER'] as const;
export type RateScope = (typeof RATE_SCOPES)[number];
export const TIMESHEET_STATUSES = ['SUBMITTED', 'APPROVED', 'RETURNED', 'REOPENED'] as const;
export type TimesheetStatus = (typeof TIMESHEET_STATUSES)[number];
export const BUDGET_CATEGORIES = ['LABOR', 'EQUIPMENT', 'SERVICES', 'OTHER'] as const;
export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];
export const EXPENSE_CATEGORIES = ['EQUIPMENT', 'SERVICES', 'LICENSE', 'TRAVEL', 'OTHER'] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
/** Mốc thanh toán: PLANNED → DUE (tay, hoặc UAT/cổng giai đoạn được duyệt) → INVOICED (số hoá đơn ghi tay) → PAID. */
export const PAYMENT_STATUSES = ['PLANNED', 'DUE', 'INVOICED', 'PAID'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const PAYMENT_TRIGGERS = ['MANUAL', 'UAT', 'STAGE_GATE'] as const;
export type PaymentTrigger = (typeof PAYMENT_TRIGGERS)[number];
export const REPORT_KINDS = ['CLIENT_WEEKLY', 'STEERING'] as const;
export type ReportKind = (typeof REPORT_KINDS)[number];

// ─── Service desk & SLA (đợt S5a, 04/10/2026) ────────────────────

/**
 * Mô-đun có tính năng thật từ đợt S5a: `serviceDesk` — loại yêu cầu, ưu tiên P1–P4 (Impact × Urgency), SLA
 * theo lịch làm việc, hàng đợi, CSAT, Problem + postmortem. Luật thuần ở slaRules.ts.
 */
export const STUDIO_MODULES_S5A: readonly StudioModule[] = ['serviceDesk'];
