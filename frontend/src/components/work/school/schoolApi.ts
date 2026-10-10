/**
 * CT Work đợt 3B (09/10/2026) — client cho báo cáo nộp trường theo mẫu FPT:
 * WBS + bảng quy đổi (A3), Project Tracking 4 mẫu (A23), Weekly Report (A21), AI Usage Report (A29), thông tin môn học.
 * Backend: src/routes/work.fptReports.routes.ts + src/services/work/fptReports.service.ts — đổi kiểu bên này thì đổi bên kia.
 * Tách riêng khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `/work/projects/${pid}`;
const R = (pid: number) => `${P(pid)}/fpt-reports`;

export const COMPLEXITIES = ['Simple', 'Medium', 'Complex'] as const;
export type Complexity = (typeof COMPLEXITIES)[number];
export const WBS_KINDS = ['Screen', 'Function', 'Non-UI'] as const;
export const SDLC_PHASES = ['Requirement', 'Design', 'Implementation', 'Testing', 'Deployment', 'Maintenance', 'Project Management', 'Documentation'] as const;
export const WEEKLY_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;

export interface Student { code: string; name: string; role: string; aiTools: string }
export interface ReportDoc {
  subjectCode: string | null; subjectName: string | null; classCode: string | null; semester: string | null; lecturer: string | null;
  groupCode: string | null; projectTitle: string | null; week1Start: string | null; students: Student[];
  fallback: { projectTitle: string; groupCode: string };
  members: Array<{ userId: number; name: string; role: string }>;
  canEdit: boolean;
}

export interface EstimationLevel { name: Complexity; maxFields: number | null; maxTransactions: number | null; manDays: number }
export interface EstimationMatrix { levels: EstimationLevel[]; hoursPerDay: number }
export interface WbsRow {
  wbs: string; depth: number; issueId: number; number: number; key: string; title: string; typeKey: string; description: string;
  kind: string; feature: string; subFeature: string; complexity: Complexity | null; complexitySource: 'set' | 'derived' | 'field' | null;
  fields: number | null; transactions: number | null; plannedDays: number | null; plannedSource: 'override' | 'matrix' | 'estimate' | null;
  plannedTotal: number; actualDays: number; actualTotal: number; iteration: string; status: string; statusName: string; assignee: string; note: string; childCount: number;
  /** UX-C: cha trong WBS (null = gốc), tầng loại thẻ (1 epic · 0 · −1 sub-task), ngày bắt đầu/hạn. Máy chủ cũ không có ⇒ undefined. */
  parentNumber?: number | null; level?: number; start?: string | null; due?: string | null;
}
export interface WbsTotals {
  plannedDays: number; actualDays: number; functions: number; unestimated: number;
  byIteration: Array<{ iteration: string; functions: number; plannedDays: number; actualDays: number }>;
  byComplexity: Array<{ complexity: Complexity; count: number; plannedDays: number }>;
}
export interface WbsData { matrix: EstimationMatrix; rows: WbsRow[]; totals: WbsTotals; truncated: boolean; canEdit: boolean; canEditMatrix: boolean }
export type WbsItemInput = Partial<{ kind: string | null; complexity: Complexity | null; fields: number | null; transactions: number | null; feature: string | null; subFeature: string | null; plannedDays: number | null; note: string | null }>;

export interface WeeklyData {
  status: Array<{ task: string; inCharge: string; status: string; notes: string }>;
  issues: Array<{ issue: string; owner: string; status: string; notes: string }>;
  plan: Array<{ task: string; inCharge: string; deadline: string; notes: string }>;
  matters: Array<{ matter: string; raisedBy: string; date: string; notes: string }>;
  grades: Array<{ name: string; grade: number | null }>;
}
export interface WeeklyReport { id: number; weekStart: string; weekNo: number | null; data: WeeklyData; version: number; updatedAt: string; createdAt: string }
export interface WeeklyListItem { id: number; weekStart: string; weekNo: number | null; version: number; updatedAt: string; counts: { status: number; issues: number; plan: number; matters: number } }

export interface AiUsageLog {
  id: number; usedAt: string; phase: string; task: string; tool: string; output: string | null; validation: string | null; evidence: string | null;
  measure: string | null; value: number | null; risks: string | null; source: 'AUTO' | 'MANUAL'; issueId: number | null; userName: string | null; weekNo: number | null;
}
export type AiUsageInput = { usedAt: string; phase: string; task: string; tool: string; output?: string | null; validation?: string | null; evidence?: string | null; measure?: string | null; value?: number | null; risks?: string | null };

export const TRACKING_VARIANTS = [
  { id: 'SEP490', title: 'SEP490 — Report2 Project Tracking', sheets: 'Scope · WBS · Q&A · TimeLogs · Defects · Issues', from: 'stages, issues, WBS estimates, worklogs, bugs and the RAID log (Q&A = RAID items in category "Q&A")' },
  { id: 'SWP391_T1', title: 'SWP391 — Template1 Project Tracking', sheets: 'Project · Iter1 … Iter4', from: 'requirements (label Req or Screen ID), fix versions as iterations, Write SRS / Write SDS sub-tasks' },
  { id: 'ISSUES', title: 'SWP391 — Template4 Issues Report', sheets: 'Issues Report (GitLab style)', from: 'every issue: state, assignee, milestone, labels, parent screen/function' },
  { id: 'SWP391', title: 'SWP391 — Product + Summary', sheets: 'Product · Summary (LOC by PIC)', from: 'requirements with Planned LOC, Quality and Graded LOC fields' },
] as const;
export type TrackingVariant = (typeof TRACKING_VARIANTS)[number]['id'];

export const schoolKeys = {
  doc: (pid: number) => ['work', 'school', pid, 'doc'] as const,
  wbs: (pid: number) => ['work', 'school', pid, 'wbs'] as const,
  weekly: (pid: number) => ['work', 'school', pid, 'weekly'] as const,
  week: (pid: number, id: number) => ['work', 'school', pid, 'weekly', id] as const,
  ai: (pid: number) => ['work', 'school', pid, 'ai'] as const,
};

async function download(url: string, fallback: string) {
  const res = await api.get(url, { responseType: 'blob', timeout: 120_000 });
  const cd = String(res.headers['content-disposition'] ?? '');
  const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
  const name = star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? fallback;
  const blob = res.data as Blob;
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
  return name;
}

export const schoolApi = {
  doc: (pid: number) => d<ReportDoc>(api.get(`${R(pid)}/doc`)),
  updateDoc: (pid: number, body: Partial<Omit<ReportDoc, 'fallback' | 'members' | 'canEdit'>>) => d<ReportDoc>(api.put(`${R(pid)}/doc`, body)),

  wbs: (pid: number) => d<WbsData>(api.get(`${P(pid)}/wbs`)),
  setMatrix: (pid: number, body: EstimationMatrix) => d<WbsData>(api.put(`${P(pid)}/wbs/matrix`, body)),
  setItem: (pid: number, num: number, body: WbsItemInput) => d<{ row: WbsRow | null; totals: WbsTotals }>(api.put(`${P(pid)}/wbs/items/${num}`, body)),
  exportWbs: (pid: number) => download(`${P(pid)}/wbs/export`, 'WBS.xlsx'),
  /** UX-C: kéo-thả trong WBS — đổi cha và/hoặc thứ tự (rank). */
  moveItem: (pid: number, num: number, body: { parentNumber: number | null; beforeNumber?: number | null; afterNumber?: number | null }) =>
    d<{ number: number; rank: string; version: number }>(api.put(`${P(pid)}/wbs/items/${num}/move`, body)),
  exportTracking: (pid: number, variant: TrackingVariant) => download(`${P(pid)}/export/project-tracking?variant=${variant}`, 'ProjectTracking.xlsx'),

  weeklyList: (pid: number) => d<{ reports: WeeklyListItem[]; week1Start: string | null; group: string; canEdit: boolean }>(api.get(`${R(pid)}/weekly`)),
  weeklyPreview: (pid: number, week: string) => d<{ weekStart: string; weekNo: number | null; data: WeeklyData }>(api.get(`${R(pid)}/weekly/preview?week=${week}`)),
  weekly: (pid: number, id: number) => d<WeeklyReport>(api.get(`${R(pid)}/weekly/${id}`)),
  createWeekly: (pid: number, weekStart: string) => d<WeeklyReport>(api.post(`${R(pid)}/weekly`, { weekStart })),
  saveWeekly: (pid: number, id: number, body: { version: number; weekNo?: number | null; data: WeeklyData }) => d<WeeklyReport>(api.put(`${R(pid)}/weekly/${id}`, body)),
  refreshWeekly: (pid: number, id: number) => d<WeeklyReport>(api.post(`${R(pid)}/weekly/${id}/refresh`, {})),
  deleteWeekly: (pid: number, id: number) => d(api.delete(`${R(pid)}/weekly/${id}`)),
  exportWeekly: (pid: number, ids?: number[]) => download(`${R(pid)}/weekly/export${ids?.length ? `?ids=${ids.join(',')}` : ''}`, 'Weekly_Report.xlsx'),

  ai: (pid: number) => d<{ logs: AiUsageLog[]; week1Start: string | null; canEdit: boolean }>(api.get(`${R(pid)}/ai-usage`)),
  syncAi: (pid: number) => d<{ added: number; scanned: number }>(api.post(`${R(pid)}/ai-usage/sync`, {})),
  addAi: (pid: number, body: AiUsageInput) => d<AiUsageLog>(api.post(`${R(pid)}/ai-usage`, body)),
  updateAi: (pid: number, id: number, body: Partial<AiUsageInput>) => d<AiUsageLog>(api.patch(`${R(pid)}/ai-usage/${id}`, body)),
  deleteAi: (pid: number, id: number) => d(api.delete(`${R(pid)}/ai-usage/${id}`)),
  exportAi: (pid: number) => download(`${R(pid)}/ai-usage/export`, 'AI_Usage_Report.xlsx'),
};

export const ddmm = (iso: string | null | undefined) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');
/** Thứ Hai (YYYY-MM-DD) của tuần chứa ngày `iso` (giờ máy). */
export function mondayOf(iso: string): string {
  const d0 = new Date(`${iso}T00:00:00Z`);
  return new Date(d0.getTime() - ((d0.getUTCDay() + 6) % 7) * 86_400_000).toISOString().slice(0, 10);
}
export const todayLocal = () => {
  const d0 = new Date();
  return `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, '0')}-${String(d0.getDate()).padStart(2, '0')}`;
};
export const addDaysIso = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
export const days = (n: number | null | undefined) => (n === null || n === undefined ? '' : Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''));
