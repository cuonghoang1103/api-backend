/**
 * "Create with CuongMini" (20/10/2026) — kiểu dữ liệu + trần dùng chung cho cả luồng:
 *   đầu vào trình hướng dẫn (SetupInput) ⇒ bản tóm tắt "CuongMini đã hiểu gì" (Understanding)
 *   ⇒ kế hoạch đầy đủ (SetupPlan, sửa được trước khi tạo) ⇒ dự án thật trong CT Work.
 * Mọi thứ ở đây THUẦN (zod + hằng số) — test đọc trực tiếp.
 */

import { z } from 'zod';
import { PROJECT_KINDS, PROJECT_TEMPLATES, PROJECT_TYPES } from '../constants.js';
import { WORK_LIMITS } from '../limits.js';

// ─── Trần ────────────────────────────────────────────────────────

export const CAP = {
  /** Thẻ tối đa trong MỘT dự án do CuongMini tạo. */
  issuesPerProject: 600,
  /** Dự án tối đa trong một lượt dựng không gian. */
  projectsPerRun: 30,
  epicsPerProject: 30,
  storiesPerEpic: 25,
  subtasksPerStory: 8,
  members: 300,
  membersPerProject: 40,
  pages: 24,
  pageChars: 40_000,
  tests: 80,
  risks: 40,
  meetings: 8,
  sprints: 40,
  milestones: 20,
  /** Nguồn (tệp + link) một bản nháp. */
  sources: 40,
  /** Tệp tải lên: như đính kèm thẻ (issues.service MAX_ATTACHMENT_BYTES). */
  fileBytes: WORK_LIMITS.fileBytes,
  /** Chữ rút từ MỘT nguồn / tổng chữ đưa cho model. */
  sourceChars: 60_000,
  contextChars: 160_000,
  textField: 20_000,
} as const;

// ─── Đầu vào trình hướng dẫn ─────────────────────────────────────

const s = (max: number) => z.string().trim().max(max);
const opt = (max: number) => s(max).optional().default('');
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const LEVELS = [1, 2, 3, 4, 5] as const;

/** Một dòng danh sách thành viên (dán từ Excel / CSV / XLSX / gõ tay). */
export const rosterRow = z.object({
  name: s(120).min(1),
  studentId: opt(40),
  email: z.string().trim().max(160).optional().default(''),
  role: opt(60),
  skills: opt(300),
  /** 1 = mới bắt đầu … 5 = rất mạnh. */
  level: z.number().int().min(1).max(5).optional().default(3),
  hoursPerWeek: z.number().min(0).max(80).optional().default(8),
  prefs: opt(200),
  /** Chế độ không gian: tên nhóm (cột "group"). */
  group: opt(80),
});
export type RosterRow = z.infer<typeof rosterRow>;

export const ASSIGN_RULES = ['BY_LEVEL', 'EQUAL_LOAD', 'MODULE_OWNER', 'LEADER_REVIEWS'] as const;
export type AssignRule = (typeof ASSIGN_RULES)[number];
export const DETAIL_LEVELS = ['EPICS', 'STORIES', 'SUBTASKS'] as const;
export const PAGE_KINDS = [
  'CHARTER', 'OVERVIEW', 'RACI', 'MEMBER_BRIEFS', 'TEAM_RULES', 'GIT_GUIDE', 'CODE_REVIEW', 'DOR_DOD', 'COMMUNICATION',
  'KICKOFF', 'REQUIREMENTS', 'GLOSSARY', 'TEST_PLAN', 'QUALITY_PLAN', 'AGENTS', 'RESOURCES_GUIDE',
] as const;
export type PageKind = (typeof PAGE_KINDS)[number];

export const groupInput = z.object({
  name: s(120).min(1),
  key: z.string().trim().toUpperCase().max(10).optional().default(''),
  /** Đề tài / sản phẩm riêng của nhóm — trống ⇒ dùng chung đề bài. */
  topic: opt(4000),
  leader: opt(120),
});
export type GroupInput = z.infer<typeof groupInput>;

export const setupInput = z.object({
  overview: z.object({
    name: opt(120),
    key: z.string().trim().toUpperCase().max(10).optional().default(''),
    template: z.enum(PROJECT_TEMPLATES).optional().default('SWP391'),
    type: z.enum(PROJECT_TYPES).optional().default('SCRUM'),
    kind: z.enum(PROJECT_KINDS).optional().default('SCHOOL'),
    courseCode: opt(40),
    className: opt(60),
    semester: opt(40),
    stakeholders: opt(1000),
    language: z.enum(['vi', 'en', 'both']).optional().default('vi'),
    goal: opt(4000),
  }).default({}),
  brief: z.object({
    text: opt(CAP.textField),
    functional: opt(CAP.textField),
    nonFunctional: opt(8000),
    rubric: opt(8000),
    deliverables: z.array(s(120)).max(30).optional().default([]),
  }).default({}),
  team: z.object({
    members: z.array(rosterRow).max(CAP.members).optional().default([]),
    rules: z.array(z.enum(ASSIGN_RULES)).max(4).optional().default(['BY_LEVEL', 'LEADER_REVIEWS']),
    rulesText: opt(4000),
    sendInvites: z.boolean().optional().default(false),
  }).default({}),
  timeline: z.object({
    startDate: day.optional().or(z.literal('')).default(''),
    endDate: day.optional().or(z.literal('')).default(''),
    milestones: z.array(z.object({ name: s(120).min(1), date: day })).max(CAP.milestones).optional().default([]),
    sprintWeeks: z.number().int().min(1).max(4).optional().default(2),
    /** 0 = CN … 6 = T7. */
    workingDays: z.array(z.number().int().min(0).max(6)).max(7).optional().default([1, 2, 3, 4, 5]),
    avoid: z.array(z.object({ name: s(120).min(1), from: day, to: day })).max(20).optional().default([]),
    meeting: z.object({
      weekday: z.number().int().min(0).max(6),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      durationMin: z.number().int().min(10).max(240).optional().default(45),
    }).nullable().optional().default(null),
  }).default({}),
  code: z.object({
    repoUrl: opt(500),
    branch: opt(120),
    stack: opt(500),
    conventions: opt(4000),
  }).default({}),
  split: z.object({
    prompt: opt(CAP.textField),
    detail: z.enum(DETAIL_LEVELS).optional().default('SUBTASKS'),
    criteria: z.boolean().optional().default(true),
    points: z.boolean().optional().default(true),
    tests: z.boolean().optional().default(true),
    risks: z.boolean().optional().default(true),
    meetings: z.boolean().optional().default(true),
    pages: z.boolean().optional().default(true),
    assign: z.boolean().optional().default(true),
    onboarding: z.boolean().optional().default(true),
  }).default({}),
  groups: z.array(groupInput).max(CAP.projectsPerRun).optional().default([]),
  /** Mặc định TẮT: tạo ngay sau khi lập kế hoạch rồi mới cho xem kết quả. Bật ⇒ dừng ở bản nháp sửa được. */
  reviewFirst: z.boolean().optional().default(false),
});
export type SetupInput = z.infer<typeof setupInput>;

// ─── Bước 1: "CuongMini đã hiểu gì" ──────────────────────────────

const lines = (n: number, max = 400) => z.array(z.string().trim().max(max)).max(n).default([]);

export const understanding = z.object({
  goal: z.string().trim().max(3000).default(''),
  scopeIn: lines(30),
  scopeOut: lines(20),
  deliverables: z.array(z.object({ name: z.string().trim().max(160), due: z.string().trim().max(40).default(''), criteria: z.string().trim().max(600).default('') })).max(30).default([]),
  grading: lines(20),
  tech: z.object({
    stack: lines(20, 120),
    repoFindings: lines(20),
  }).default({ stack: [], repoFindings: [] }),
  team: z.array(z.object({
    name: z.string().trim().max(120),
    studentId: z.string().trim().max(40).default(''),
    group: z.string().trim().max(80).default(''),
    proposedRole: z.string().trim().max(60).default(''),
    why: z.string().trim().max(400).default(''),
  })).max(CAP.members).default([]),
  timeline: lines(30),
  strategy: lines(20, 600),
  assumptions: lines(20),
  risks: lines(20),
  questions: z.array(z.object({ q: z.string().trim().max(400), answer: z.string().trim().max(2000).default('') })).max(20).default([]),
  /** Ghi chú người dùng sửa tay thêm (đưa lại cho bước lập kế hoạch). */
  notes: z.string().trim().max(8000).default(''),
});
export type Understanding = z.infer<typeof understanding>;

// ─── Bước 2: kế hoạch (bản nháp sửa được) ────────────────────────

export const ITEM_KINDS = ['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK'] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

const ref = z.string().trim().min(1).max(40);
const nref = ref.nullable().default(null);

export const planMember = z.object({
  ref,
  name: z.string().trim().max(120),
  studentId: z.string().trim().max(40).default(''),
  email: z.string().trim().max(160).default(''),
  role: z.string().trim().max(60).default(''),
  skills: z.string().trim().max(300).default(''),
  level: z.number().int().min(1).max(5).default(3),
  hoursPerWeek: z.number().min(0).max(80).default(8),
  prefs: z.string().trim().max(200).default(''),
  /** Dự án (ref) người này thuộc về. */
  projectRef: ref,
  leader: z.boolean().default(false),
  /** USER = tài khoản trong không gian · INVITE = gửi lời mời (có email) · PLACEHOLDER = chỉ ghi "Planned owner". */
  mapping: z.enum(['USER', 'INVITE', 'PLACEHOLDER']).default('PLACEHOLDER'),
  userId: z.number().int().positive().nullable().default(null),
  why: z.string().trim().max(400).default(''),
});
export type PlanMember = z.infer<typeof planMember>;

export const planItem = z.object({
  ref,
  kind: z.enum(ITEM_KINDS),
  parentRef: nref,
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(8000).default(''),
  criteria: z.array(z.string().trim().max(400)).max(15).default([]),
  points: z.number().min(0).max(100).nullable().default(null),
  /** 1 = cao nhất … 5 = thấp nhất (như Jira). */
  priority: z.number().int().min(1).max(5).default(3),
  /** 1 dễ · 2 vừa · 3 khó — luật "người mới không ôm việc khó một mình". */
  difficulty: z.number().int().min(1).max(3).default(2),
  labels: z.array(z.string().trim().max(50)).max(8).default([]),
  component: z.string().trim().max(60).default(''),
  /** Mảng kỹ năng (fe/be/db/test/doc/design/devops/pm) — để giao theo sở thích. */
  area: z.string().trim().max(30).default(''),
  assigneeRef: nref,
  pairRef: nref,
  sprintRef: nref,
  milestoneRef: nref,
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  blockedBy: z.array(ref).max(10).default([]),
  /** Người dùng đã sửa tay ⇒ "nhờ CuongMini sửa" và xếp lịch lại không đè. */
  locked: z.boolean().default(false),
});
export type PlanItem = z.infer<typeof planItem>;

export const planPage = z.object({
  ref,
  kind: z.enum(PAGE_KINDS).nullable().default(null),
  title: z.string().trim().min(1).max(255),
  markdown: z.string().max(CAP.pageChars).default(''),
});
export type PlanPage = z.infer<typeof planPage>;

export const planProject = z.object({
  ref,
  name: z.string().trim().min(1).max(120),
  key: z.string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9]{1,9}$/, 'Key must be 2–10 letters/digits'),
  template: z.enum(PROJECT_TEMPLATES).default('BLANK'),
  type: z.enum(PROJECT_TYPES).default('SCRUM'),
  kind: z.enum(PROJECT_KINDS).default('SCHOOL'),
  description: z.string().trim().max(5000).default(''),
  sprints: z.array(z.object({ ref, name: z.string().trim().max(100), goal: z.string().trim().max(500).default(''), start: z.string(), end: z.string() })).max(CAP.sprints).default([]),
  milestones: z.array(z.object({ ref, name: z.string().trim().max(120), date: z.string(), description: z.string().trim().max(500).default('') })).max(CAP.milestones).default([]),
  labels: z.array(z.object({ name: z.string().trim().max(50), color: z.string().max(16).default('#64748b') })).max(30).default([]),
  components: z.array(z.object({ name: z.string().trim().max(60), description: z.string().trim().max(300).default(''), ownerRef: nref })).max(20).default([]),
  items: z.array(planItem).max(CAP.issuesPerProject).default([]),
  pages: z.array(planPage).max(CAP.pages).default([]),
  tests: z.array(z.object({
    ref, title: z.string().trim().max(255), preconditions: z.string().trim().max(1000).default(''),
    steps: z.array(z.object({ action: z.string().trim().max(500), expected: z.string().trim().max(500).default('') })).max(15).default([]),
    storyRef: nref,
  })).max(CAP.tests).default([]),
  risks: z.array(z.object({
    ref, title: z.string().trim().max(255), description: z.string().trim().max(2000).default(''), category: z.string().trim().max(60).default(''),
    probability: z.number().int().min(1).max(5).default(3), impact: z.number().int().min(1).max(5).default(3),
    mitigation: z.string().trim().max(2000).default(''), ownerRef: nref,
  })).max(CAP.risks).default([]),
  meetings: z.array(z.object({
    ref, title: z.string().trim().max(255),
    type: z.enum(['KICKOFF', 'DAILY', 'WEEKLY', 'DEMO', 'RETRO', 'PLANNING', 'MENTOR', 'OTHER']).default('WEEKLY'),
    weekday: z.number().int().min(0).max(6), hour: z.number().int().min(0).max(23), minute: z.number().int().min(0).max(59).default(0),
    durationMin: z.number().int().min(10).max(480).default(45), intervalWeeks: z.number().int().min(1).max(8).default(1),
    startDate: z.string(), endDate: z.string().nullable().default(null),
    agenda: z.array(z.string().trim().max(300)).max(20).default([]),
  })).max(CAP.meetings).default([]),
  resources: z.array(z.object({ title: z.string().trim().max(200), url: z.string().trim().max(2000), group: z.string().trim().max(80).default(''), note: z.string().trim().max(1000).default('') })).max(60).default([]),
  dod: z.array(z.string().trim().max(200)).max(20).default([]),
});
export type PlanProject = z.infer<typeof planProject>;

export const WARNING_KINDS = ['MISSING_INFO', 'OVERLOAD', 'DEADLINE', 'UNASSIGNED', 'BEGINNER_HARD', 'CAP', 'NO_EMAIL', 'SOURCE'] as const;
export const planWarning = z.object({
  kind: z.enum(WARNING_KINDS),
  projectRef: z.string().max(40).nullable().default(null),
  ref: z.string().max(40).nullable().default(null),
  message: z.string().max(500),
});
export type PlanWarning = z.infer<typeof planWarning>;

export const setupPlan = z.object({
  projects: z.array(planProject).min(1).max(CAP.projectsPerRun),
  members: z.array(planMember).max(CAP.members).default([]),
  /** Chế độ không gian: trang tổng quan danh mục (đặt trong dự án đầu tiên + mọi dự án). */
  portfolio: planPage.nullable().default(null),
  warnings: z.array(planWarning).max(400).default([]),
});
export type SetupPlan = z.infer<typeof setupPlan>;

// ─── Bản nháp + nguồn ────────────────────────────────────────────

export const DRAFT_STATUSES = ['DRAFT', 'READING', 'UNDERSTOOD', 'PLANNING', 'READY', 'APPLYING', 'APPLIED', 'FAILED', 'CANCELLED'] as const;
export type DraftStatus = (typeof DRAFT_STATUSES)[number];
/** Trạng thái đang có job chạy (không sửa được, không chạy job khác). */
export const BUSY: readonly DraftStatus[] = ['READING', 'PLANNING', 'APPLYING'];

export const SOURCE_CATEGORIES = ['BRIEF', 'TEMPLATE', 'CODE', 'SAMPLE', 'ROSTER', 'OTHER'] as const;
export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];

export interface SetupSource {
  id: string;
  kind: 'FILE' | 'LINK' | 'REPO';
  category: SourceCategory;
  name: string;
  note: string;
  mime?: string;
  size?: number;
  r2Key?: string;
  url?: string;
  /** OK | EMPTY (đọc được nhưng không có chữ — ảnh/scan) | ERROR | PRIVATE (link chưa chia sẻ công khai) */
  status: 'OK' | 'EMPTY' | 'ERROR' | 'PRIVATE';
  error?: string;
  chars: number;
  /** Chữ đã rút (KHÔNG bao giờ gửi về client — xem stripSources). */
  text?: string;
  addedAt: string;
}

export interface ProgressStep { key: string; status: 'pending' | 'running' | 'done' | 'skipped' | 'error'; detail?: string; at?: string }

export interface UsageCall { step: string; path: 'chinh_hang' | 'modelapi'; model: string; inputTokens: number; outputTokens: number; usd: number; ms: number; ok: boolean }
