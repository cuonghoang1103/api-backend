/**
 * CTW đợt 5 (10/10/2026) — client cho hub giảng viên, lớp học, rubric + điểm, tuần 1, việc định kỳ.
 * Backend: src/routes/work.ctw5.routes.ts (+ teaching / classroom / recurring.service.ts) — đổi kiểu bên này thì đổi bên kia.
 * Tách khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import type { WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export const CLASS_SUBJECTS = ['SWP391', 'SWT301', 'SWR302', 'SEP490', 'ISP490', 'OTHER'] as const;
export type ClassSubject = (typeof CLASS_SUBJECTS)[number];
export const FPT_DOCS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'T51', 'T52', 'T53', 'WEEKLY', 'AI'] as const;
export type FptDoc = (typeof FPT_DOCS)[number];
export type DocState = 'SUBMITTED' | 'DRAFT' | 'MISSING' | 'NA';
export type Health = 'red' | 'amber' | 'green';

export interface HealthReason { code: string; level: 'red' | 'amber'; n: number }
export interface GroupRow {
  projectId: number; key: string; name: string; href: string; workspace: string; archived: boolean;
  subject: string; classCode: string | null; term: string | null; groupCode: string | null; classId: number | null; className: string | null;
  members: Array<{ id: number; name: string; username: string; role: string; status: string | null; signals: string[] }>;
  issues: { open: number; overdue: number; done14: number };
  sprint: { name: string; status: string; done: number; total: number; daysLeft: number; atRisk: boolean } | null;
  stage: { n: number; name: string; total: number; completed: number } | null;
  contrib: { completed: number; actions: number; attention: number; lastActiveDay: string | null; silentDays: number | null } | null;
  docs: Record<FptDoc, DocState>;
  docsExpected: number; docsSubmitted: number; docsMissing: number;
  qna: { open: number; oldestDays: number };
  risks: { open: number; high: number };
  grades: { total: number; published: number; latestMilestone: string | null };
  health: { status: Health; reasons: HealthReason[] };
}
export interface OverviewFilter { subject?: string; classCode?: string; term?: string; q?: string }
export interface Overview {
  generatedAt: string; filter: OverviewFilter;
  facets: { subjects: string[]; classes: string[]; terms: string[] };
  totals: { groups: number; red: number; amber: number; green: number; students: number; overdue: number; qnaOpen: number; docsMissing: number };
  groups: GroupRow[]; tookMs: number;
}

export interface RubricLevel { score: number; label: string; description: string }
export interface RubricCriterion { key: string; name: string; weight: number; description: string; levels: RubricLevel[] }
export interface Rubric {
  id: number; name: string; subject: string | null; description: string | null; criteria: RubricCriterion[]; scaleMax: number;
  templateKey: string | null; archivedAt: string | null; createdAt: string; updatedAt: string; ownerId: number; gradeCount?: number;
}
export interface RubricTemplate { key: string; name: string; subject: string; description: string; milestones: string[]; criteria: RubricCriterion[]; scaleMax: number }
export interface RubricInput { templateKey?: string; name?: string; subject?: string | null; description?: string | null; criteria?: Array<Partial<RubricCriterion> & { name: string; weight: number }>; scaleMax?: number }

export interface Grade {
  id: number; projectId: number; rubricId: number; milestone: string; stageId: number | null; subjectKey: string; subjectUserId: number | null;
  scores: Record<string, number>; notes: Record<string, string>; comment: string | null; total: number | null; graderId: number;
  publishedAt: string | null; version: number; createdAt: string; updatedAt: string;
  rubric: Rubric; grader: WorkUser | null;
}
export interface GradesView {
  mode: 'teacher' | 'student';
  grades: Grade[]; hiddenDrafts: number;
  team: Array<{ id: number; name: string; username: string; avatarUrl: string | null }>;
  stages: Array<{ id: number; n: number; name: string }>;
  rubrics: Rubric[];
  milestoneHints: string[];
}
export interface GradeInput { rubricId: number; milestone: string; stageId?: number | null; subjectUserId?: number | null; scores: Record<string, number | null>; notes?: Record<string, string>; comment?: string | null; publish?: boolean }
export interface GradeHistoryRow { id: number; action: string; scores: Record<string, number>; total: number | null; comment: string | null; publishedAt: string | null; createdAt: string; actor: WorkUser | null }

export type ClassRole = 'OWNER' | 'TEACHER' | 'STUDENT';
export interface ClassGroup { id: number; number: number; name: string; leaderId: number | null; members: number; project: { id: number; key: string; name: string; href: string } | null }
export interface ClassStudent {
  id: number; email: string | null; studentCode: string | null; fullName: string | null; groupId: number | null; source: string;
  invitedAt: string | null; inviteCount: number; joinedAt: string | null; user: WorkUser | null;
}
export interface ClassDetail {
  id: number; name: string; subject: ClassSubject; classCode: string; term: string; role: ClassRole;
  owner: WorkUser; teacher: WorkUser | null; maxGroupSize: number; week1Start: string | null; timezone: string; archivedAt: string | null;
  joinState: 'OK' | 'CLOSED' | 'EXPIRED' | 'ARCHIVED'; groups: ClassGroup[]; me: { id: number; groupId: number | null; studentCode: string | null } | null;
  manage: boolean;
  joinCode?: string; joinCodeDisplay?: string; joinExpiresAt?: string | null; joinOpen?: boolean; joinUrl?: string; teacherEmail?: string | null;
  students?: ClassStudent[];
  inviteLimits?: { perBatch: number; perClassPerDay: number; resendAfterHours: number; maxPerStudent: number };
}
export interface ClassListItem { id: number; name: string; subject: string; classCode: string; term: string; role: ClassRole; archivedAt: string | null; groups?: number; students?: number; group?: { id: number; name: string; href: string | null } | null }
export interface ClassInput { name?: string | null; subject: ClassSubject; classCode: string; term: string; iAmTeacher?: boolean; teacherEmail?: string | null; maxGroupSize?: number; joinExpiresInDays?: number | null; week1Start?: string | null; timezone?: string | null }
export interface JoinPreview {
  class: { id: number; name: string; subject: ClassSubject; classCode: string; term: string; maxGroupSize: number; owner: WorkUser; teacher: WorkUser | null };
  groups: Array<{ id: number; number: number; name: string; members: number; full: boolean }>;
  me: { joined: boolean; groupId: number | null };
  onRoster: { studentCode: string | null; fullName: string | null } | null;
  isTeacher: boolean; canTeach: boolean; template: string;
}
export interface JoinInput { action: 'JOIN' | 'JOIN_GROUP' | 'CREATE_GROUP' | 'TEACH'; groupId?: number; groupName?: string; projectKey?: string; studentCode?: string }
export type RosterError = 'MISSING_EMAIL' | 'BAD_EMAIL' | 'BAD_CODE' | 'DUP_EMAIL_IN_FILE' | 'DUP_CODE_IN_FILE' | 'ALREADY_IN_CLASS' | 'CODE_IN_CLASS';
export interface RosterRow { line: number; studentCode: string | null; fullName: string | null; email: string | null; errors: RosterError[] }
export interface RosterPreview { rows: RosterRow[]; total: number; valid: number; invalid: number; imported?: number; skipped?: number }
export interface RosterSource { csv?: string; xlsxBase64?: string }
export interface InvitePlan { willSend: number; sent: number; confirmed: boolean; sentLast24h: number; skipped: { joined: number; tooSoon: number; max: number; overLimit: number }; limits: { perBatch: number; perClassPerDay: number; resendAfterHours: number; maxPerStudent: number } }

export type Week1Id = 'course' | 'team' | 'roles' | 'charter' | 'backlog' | 'sprint' | 'github' | 'chat' | 'recurring' | 'mentorMeeting' | 'qna' | 'subject';
export interface Week1 { subject: string | null; class: { subject: string; classCode: string; term: string } | null; items: Array<{ id: Week1Id; done: boolean; href: string; variant?: 'tests' | 'requirements' }>; done: number; total: number; canEdit: boolean }

export interface Recurrence { freq: 'DAILY' | 'WEEKLY' | 'MONTHLY'; interval: number; byWeekday: number[]; byMonthDay: number | null; hour: number; minute: number; startDate: string; endDate: string | null }
export interface RecurringIssue { title: string; typeId: number; description?: string | null; assigneeId?: number | null; priority?: number | null; labelIds?: number[]; dueInDays?: number | null; addToActiveSprint?: boolean }
export interface RecurringRule {
  id: number; name: string; enabled: boolean; recurrence: Recurrence; issue: RecurringIssue; rrule: string; next: string[]; timezone: string;
  runCount: number; lastRunAt: string | null; createdAt: string; recent: Array<{ occurrence: string; issueNumber: number | null; at: string }>;
}
export interface RecurringList { timezone: string; today: string; canEdit: boolean; rules: RecurringRule[] }

const qs = (f: OverviewFilter) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const teachingKeys = {
  access: ['work', 'teaching', 'access'] as const,
  overview: (f: OverviewFilter) => ['work', 'teaching', 'overview', f] as const,
  rubrics: ['work', 'teaching', 'rubrics'] as const,
  classes: ['work', 'classes'] as const,
  cls: (id: number) => ['work', 'classes', id] as const,
  join: (code: string) => ['work', 'classes', 'join', code] as const,
  grades: (pid: number) => ['work', 'project', pid, 'grades'] as const,
  week1: (pid: number) => ['work', 'project', pid, 'week1'] as const,
  recurring: (pid: number) => ['work', 'project', pid, 'recurring'] as const,
};

export const teachingApi = {
  access: () => d<{ teaching: boolean; projects: number; classes: number }>(api.get('/work/teaching/access')),
  overview: (f: OverviewFilter) => d<Overview>(api.get(`/work/teaching/overview${qs(f)}`)),
  exportUrl: (kind: 'xlsx' | 'pdf', f: OverviewFilter) => `/work/teaching/overview.${kind}${qs(f)}`,
  download: async (kind: 'xlsx' | 'pdf', f: OverviewFilter) => {
    const r = await api.get(`/work/teaching/overview.${kind}${qs(f)}`, { responseType: 'blob' });
    return r.data as Blob;
  },
  aiSummary: (f: OverviewFilter & { language?: 'en' | 'vi' }) => d<{ summary: string; facts: string; groups: number }>(api.post('/work/teaching/ai-summary', f)),
  rubrics: () => d<{ rubrics: Rubric[]; templates: RubricTemplate[] }>(api.get('/work/teaching/rubrics')),
  createRubric: (b: RubricInput) => d<Rubric>(api.post('/work/teaching/rubrics', b)),
  updateRubric: (id: number, b: RubricInput) => d<Rubric>(api.patch(`/work/teaching/rubrics/${id}`, b)),
  archiveRubric: (id: number) => d<{ archived: boolean }>(api.delete(`/work/teaching/rubrics/${id}`)),

  classes: () => d<{ teaching: ClassListItem[]; enrolled: ClassListItem[] }>(api.get('/work/classes')),
  createClass: (b: ClassInput) => d<ClassDetail>(api.post('/work/classes', b)),
  getClass: (id: number) => d<ClassDetail>(api.get(`/work/classes/${id}`)),
  updateClass: (id: number, b: Partial<{ name: string; maxGroupSize: number; joinOpen: boolean; teacherEmail: string | null; week1Start: string | null; archived: boolean; timezone: string }>) => d<ClassDetail>(api.patch(`/work/classes/${id}`, b)),
  newJoinCode: (id: number, expiresInDays: number | null) => d<ClassDetail>(api.post(`/work/classes/${id}/join-code`, { expiresInDays })),
  previewJoin: (code: string) => d<JoinPreview>(api.get(`/work/classes/join/${encodeURIComponent(code)}`)),
  join: (code: string, b: JoinInput) => d<{ classId: number; role: ClassRole; project: { id: number; key: string; href: string } | null }>(api.post(`/work/classes/join/${encodeURIComponent(code)}`, b)),
  previewRoster: (id: number, src: RosterSource) => d<RosterPreview>(api.post(`/work/classes/${id}/roster/preview`, src)),
  importRoster: (id: number, src: RosterSource) => d<RosterPreview>(api.post(`/work/classes/${id}/roster/import`, { ...src, confirm: true })),
  invite: (id: number, b: { studentIds?: number[]; confirm?: boolean }) => d<InvitePlan>(api.post(`/work/classes/${id}/roster/invite`, b)),
  removeStudent: (id: number, sid: number) => d<{ removed: boolean }>(api.delete(`/work/classes/${id}/roster/${sid}`)),

  week1: (pid: number) => d<Week1>(api.get(`/work/projects/${pid}/week1`)),
  grades: (pid: number) => d<GradesView>(api.get(`/work/projects/${pid}/grades`)),
  saveGrade: (pid: number, b: GradeInput) => d<Grade>(api.put(`/work/projects/${pid}/grades`, b)),
  publish: (pid: number, ids: number[], published: boolean) => d<{ changed: number }>(api.post(`/work/projects/${pid}/grades/publish`, { ids, published })),
  history: (pid: number, gid: number) => d<GradeHistoryRow[]>(api.get(`/work/projects/${pid}/grades/${gid}/history`)),
  deleteGrade: (pid: number, gid: number) => d<{ deleted: boolean }>(api.delete(`/work/projects/${pid}/grades/${gid}`)),

  recurring: (pid: number) => d<RecurringList>(api.get(`/work/projects/${pid}/automation/recurring`)),
  previewRecurring: (pid: number, recurrence: Recurrence, title?: string) => d<{ rrule: string; timezone: string; next: Array<{ day: string; title: string | null }> }>(api.post(`/work/projects/${pid}/automation/recurring/preview`, { recurrence, ...(title ? { title } : {}) })),
  createRecurring: (pid: number, b: { name: string; enabled?: boolean; recurrence: Recurrence; issue: RecurringIssue }) => d<{ id: number }>(api.post(`/work/projects/${pid}/automation/recurring`, b)),
  updateRecurring: (pid: number, id: number, b: { name: string; enabled?: boolean; recurrence: Recurrence; issue: RecurringIssue }) => d<{ id: number }>(api.patch(`/work/projects/${pid}/automation/recurring/${id}`, b)),
  deleteRecurring: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`/work/projects/${pid}/automation/recurring/${id}`)),
  setTimezone: (pid: number, timezone: string) => d<{ timezone: string }>(api.put(`/work/projects/${pid}/automation/recurring/timezone`, { timezone })),
};

/** Lưu Blob thành tệp (xuất xlsx/PDF). */
export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
