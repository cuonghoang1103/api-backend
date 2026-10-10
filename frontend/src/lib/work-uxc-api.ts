/**
 * CT Work UX-C (11/10/2026) — client cho Team overview, mốc + baseline Timeline (C5).
 * Backend: src/routes/work.uxc.routes.ts + src/services/work/uxc.service.ts — đổi kiểu bên này thì đổi bên kia.
 * Tách khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa. (Kéo-thả WBS ở components/work/school/schoolApi.ts.)
 */

import { api } from '@/lib/api';
import type { WorkUser } from '@/lib/work-api';
import type { DocState, FptDoc, Health, HealthReason } from '@/components/work/teaching/teachingApi';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `/work/projects/${pid}`;

export interface TeamPerson {
  user: WorkUser; name: string; role: string;
  todo: number; inProgress: number; overdue: number; blocked: number; estimate: number; total: number;
  stuck: number; reviews: number;
  doing: Array<{ number: number; title: string; statusId: number; days: number | null; flagged: boolean }>;
  signals: Array<{ code: string; text: string; level?: string }>;
  contribStatus: string | null;
}
export interface StuckItem {
  issueId: number; number: number; title: string; statusId: number; statusName: string; assigneeId: number | null;
  days: number; threshold: number; reason: 'REVIEW' | 'IN_PROGRESS' | 'BLOCKED';
}
export interface TeamOverview {
  asOf: string;
  unit: 'POINTS' | 'HOURS' | string;
  totals: { members: number; open: number; inProgress: number; overdue: number; stuck: number; reviews: number; unassigned: number };
  stuckRule: { reviewDays: number; inProgressDays: number; p85: number | null; samples: number };
  people: TeamPerson[];
  unassigned: { todo: number; inProgress: number; overdue: number; total: number } | null;
  overdue: Array<{ number: number; title: string; statusId: number; assigneeId: number | null; dueDate: string | null; daysLate: number }>;
  stuck: StuckItem[];
  reviews: Array<{ number: number; title: string; statusId: number; assigneeId: number | null; days: number | null }>;
  meetings: Array<{ number: number; title: string; startsAt: string; endsAt: string; type: string; url: string | null }> | null;
  docs: { subject: string; states: Record<FptDoc, DocState>; expected: number; submitted: number; missing: number } | null;
  contrib: { completed: number; actions: number; attention: number; lastActiveDay: string | null; silentDays: number | null } | null;
  sprint: { name: string; status: string; done: number; total: number; daysLeft: number; atRisk: boolean } | null;
  risks: { open: number; high: number } | null;
  health: { status: Health; reasons: HealthReason[] } | null;
  qna: { open: number; overdue: number; oldestDays: number; items: Array<{ number: number; key: string; question: string; askedTo: string | null; askedOn: string | null; days: number; overdue: boolean }> } | null;
  tookMs: number;
}

export interface TimelineMarkers {
  sprints: Array<{ id: number; name: string; status: string; start: string | null; end: string | null }>;
  versions: Array<{ id: number; name: string; status: string; start: string | null; release: string | null }>;
  stages: Array<{ id: number; n: number; name: string; status: string; start: string | null; end: string | null }>;
}
export interface BaselineMeta { id: number; name: string; note: string | null; itemCount: number; createdAt: string; createdById: number | null; createdBy?: WorkUser | null }
export type BaselineState = 'SLIPPED' | 'AHEAD' | 'ON_PLAN' | 'ADDED' | 'REMOVED' | 'UNSCHEDULED';
export interface BaselineCompare {
  baseline: { id: number; name: string; createdAt: string; itemCount: number };
  items: Array<{ id: number; number: number; start: string | null; due: string | null }>;
  rows: Array<{ id: number; number: number; baseStart: string | null; baseDue: string | null; start: string | null; due: string | null; slipDays: number | null; state: BaselineState }>;
  summary: { slipped: number; ahead: number; onPlan: number; added: number; removed: number; unscheduled: number; maxSlip: number; avgSlip: number | null };
}

export const uxcKeys = {
  team: (pid: number) => ['work', 'uxc', pid, 'team'] as const,
  markers: (pid: number) => ['work', 'uxc', pid, 'markers'] as const,
  baselines: (pid: number) => ['work', 'uxc', pid, 'baselines'] as const,
  compare: (pid: number, id: number) => ['work', 'uxc', pid, 'baseline', id] as const,
};

export const uxcApi = {
  team: (pid: number) => d<TeamOverview>(api.get(`${P(pid)}/team-overview`)),
  markers: (pid: number) => d<TimelineMarkers>(api.get(`${P(pid)}/timeline/markers`)),
  baselines: (pid: number) => d<BaselineMeta[]>(api.get(`${P(pid)}/timeline/baselines`)),
  createBaseline: (pid: number, body: { name: string; note?: string | null }) => d<BaselineMeta>(api.post(`${P(pid)}/timeline/baselines`, body)),
  deleteBaseline: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${P(pid)}/timeline/baselines/${id}`)),
  compare: (pid: number, id: number) => d<BaselineCompare>(api.get(`${P(pid)}/timeline/baselines/${id}/compare`)),
};
