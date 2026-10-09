/**
 * CT Work — Đóng góp & hiệu suất thành viên + đánh giá chéo (10/10/2026).
 * Backend: src/routes/work.contrib.routes.ts · src/services/work/contrib*.ts
 */
import { api } from './api';
import type { EstimationUnit, ProjectRole, WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type RangePreset = 'today' | '7d' | '30d' | 'week' | 'sprint' | 'stage' | 'project' | 'custom';
export interface ContribRange { preset: RangePreset; from?: string; to?: string; sprintId?: number; stageId?: number; compare?: boolean }

export interface ContribWindow { preset: RangePreset; label: string; from: string; to: string; fromDay: string; toDay: string; days: number; includesToday: boolean; tz: string }
export interface ContribSignal { code: string; level: 'info' | 'warn'; text: string }
export type ContribUser = WorkUser & { role: ProjectRole; isAgent: boolean };

export interface MemberMetrics {
  assigned: number; completed: number; subtasksDone: number; points: number;
  withDue: number; onTime: number; late: number; onTimeRate: number | null; avgLateDays: number | null; overdueOpen: number;
  cycleDays: number | null; leadDays: number | null; cycleMedianDays: number | null;
  hours: number; hoursByActivity: Record<string, number>; hoursThisWeek: number;
  comments: number; voiceNotes: number; chatMessages: number | null; updates: number;
  mentions: number; mentionsAnswered: number; mentionsUnanswered: number; responseHours: number | null;
  reviewsDone: number; reviewRequests: number;
  commits: number; prs: number; additions: number | null; deletions: number | null;
  docVersions: number; pagesCreated: number; pagesEdited: number;
  testCasesCreated: number; testRuns: number; defectsFound: number; bugsReported: number; utcidCreated: number; utcidExecuted: number; itExecuted: number;
  meetingsInvited: number; meetingsAttended: number;
  actions: number; activeDays: number; currentStreak: number; longestStreak: number; longestSilence: number;
  silentNow: number | null; lastActiveDay: string | null;
}
export type DeltaKey = 'completed' | 'points' | 'onTimeRate' | 'hours' | 'comments' | 'commits' | 'docVersions' | 'testRuns' | 'actions' | 'activeDays' | 'reviewsDone';

export interface MemberRow {
  user: ContribUser;
  metrics: MemberMetrics;
  prev: MemberMetrics | null;
  delta: Partial<Record<DeltaKey, number | null>>;
  spark: number[];
  signals: ContribSignal[];
  status: 'attention' | 'watch' | 'ok' | 'idle';
  mix: { todo: number; inProgress: number; done: number; overdue: number };
}

export interface TeamTotals {
  people: number; assigned: number; completed: number; subtasksDone: number; points: number; withDue: number; onTime: number; onTimeRate: number | null;
  overdueOpen: number; cycleDays: number | null; hours: number; comments: number; voiceNotes: number; chatMessages: number | null; mentions: number;
  mentionsAnswered: number; responseHours: number | null; reviewsDone: number; reviewRequests: number; commits: number; prs: number;
  additions: number | null; deletions: number | null; docVersions: number; pagesEdited: number; testCasesCreated: number; testRuns: number;
  defectsFound: number; bugsReported: number; utcidCreated: number; utcidExecuted: number; itExecuted: number; meetingsInvited: number;
  meetingsAttended: number; actions: number; activeDaysAvg: number;
}

export interface ContribAccess { view: 'ALL' | 'SELF'; manage: boolean; peerAdmin: boolean; peerParticipant: boolean; export: boolean; teamVisible: boolean }
export interface ContribSettings { teamVisible: boolean; timezone: string; silentDays: number }

export interface ContribSummary {
  project: { id: number; key: string; name: string };
  window: ContribWindow;
  previous: { label: string; fromDay: string; toDay: string } | null;
  unit: EstimationUnit;
  access: ContribAccess;
  settings: ContribSettings;
  chatConnected: boolean;
  members: MemberRow[];
  hiddenMembers: number;
  team: {
    humans: number; agents: number; totals: TeamTotals; prevTotals: TeamTotals | null; delta: Record<string, number | null> | null;
    agentTotals: TeamTotals | null;
    medians: { completed: number | null; points: number | null; hours: number | null; actions: number | null; activeDays: number | null };
    attention: number;
  };
  charts: { bucket: 'day' | 'week'; keys: string[]; completed: number[]; hours: number[]; teamActivity: number[]; heatmap: Array<[string, number]> };
  definitions: Record<string, { label: string; how: string }>;
  note: string;
  tookMs: number;
}

export interface TimelineItem { at: string; kind: string; text: string; issue: { number: number; title: string } | null; url?: string | null }
export interface MemberDetail {
  user: ContribUser;
  self: boolean;
  window: ContribWindow;
  previous: { label: string; fromDay: string; toDay: string } | null;
  unit: EstimationUnit;
  metrics: MemberMetrics;
  prev: MemberMetrics | null;
  delta: Partial<Record<DeltaKey, number | null>>;
  chatConnected: boolean;
  signals: ContribSignal[];
  heatmap: Array<[string, number]>;
  trend: { bucket: 'day' | 'week'; keys: string[]; actions: number[] };
  timeline: TimelineItem[];
  timelineTotal: number;
  overdue: Array<{ number: number; title: string; dueDate: string; daysLate: number }>;
  lateDone: Array<{ number: number; title: string; dueDate: string; resolvedDay: string; daysLate: number }>;
  openNow: Array<{ number: number; title: string; dueDate: string | null; category: string }>;
  code: Array<{ kind: string; title: string; url: string | null; at: string; additions: number | null; deletions: number | null; state: string | null; issueNumbers: number[] }>;
  docs: Array<{ number: number; title: string; versions: number }>;
  meetings: Array<{ number: number; title: string; startsAt: string; attended: boolean; status: string }>;
}

export interface TaskContrib {
  issue: {
    number: number; key: string; title: string; status: { name: string; category: string }; type: { key: string; name: string };
    assignee: WorkUser | null; reporter: WorkUser | null; createdAt: string; resolvedAt: string | null; dueDate: string | null;
    storyPoints: number | null; onTime: boolean | null; leadDays: number | null;
  };
  people: Array<{ who: { user: WorkUser | null; label: string }; actions: number; comments: number; minutes: number; hours: number; commits: number; firstAt: string; lastAt: string }>;
  events: Array<{ at: string; kind: string; who: { user: WorkUser | null; label: string }; text: string; url?: string | null }>;
}

export interface GitAuthor { identity: string; login: string | null; name: string | null; email: string | null; count: number; userId: number | null; manual: boolean }

export interface PeerCriterion { key: string; label: string; description: string }
export interface PeerRoundSummary {
  id: number; title: string; scope: 'SPRINT' | 'STAGE' | 'CUSTOM'; sprintId: number | null; stageId: number | null; status: 'OPEN' | 'CLOSED';
  closesAt: string | null; closedAt: string | null; createdAt: string; criteria: number; participants: number; submitted: number; expected: number;
  mine: { done: number; total: number } | null;
}
export interface PeerRound {
  id: number; title: string; scope: string; sprintId: number | null; stageId: number | null; status: 'OPEN' | 'CLOSED'; criteria: PeerCriterion[];
  closesAt: string | null; closedAt: string | null; createdAt: string; canManage: boolean; canParticipate: boolean;
  toReview: WorkUser[];
  mine: Array<{ revieweeId: number; scores: Record<string, number>; comment: string | null; updatedAt: string }>;
  results: Array<{ user: WorkUser; count: number; byCriterion: Record<string, number>; overall: number | null; comments: string[] }> | null;
  resultsHiddenReason: string | null;
  completion: Array<{ user: WorkUser; submitted: number; expected: number }> | null;
  teamAverage: number | null;
  myResult: { count: number; byCriterion: Record<string, number> | null; overall: number | null; hiddenReason?: string } | null;
}

const qs = (r: ContribRange) => {
  const p = new URLSearchParams({ preset: r.preset });
  if (r.preset === 'custom') { if (r.from) p.set('from', r.from); if (r.to) p.set('to', r.to); }
  if (r.preset === 'sprint' && r.sprintId) p.set('sprintId', String(r.sprintId));
  if (r.preset === 'stage' && r.stageId) p.set('stageId', String(r.stageId));
  if (r.compare === false) p.set('compare', '0');
  return p.toString();
};

export const contribKeys = {
  all: (pid: number) => ['work', 'reports', pid, 'contrib'] as const,
  summary: (pid: number, r: ContribRange) => ['work', 'reports', pid, 'contrib', 'summary', qs(r)] as const,
  member: (pid: number, uid: number, r: ContribRange) => ['work', 'reports', pid, 'contrib', 'member', uid, qs(r)] as const,
  task: (pid: number, num: number) => ['work', 'reports', pid, 'contrib', 'task', num] as const,
  peer: (pid: number) => ['work', 'reports', pid, 'contrib', 'peer'] as const,
  round: (pid: number, id: number) => ['work', 'reports', pid, 'contrib', 'peer', id] as const,
  git: (pid: number) => ['work', 'reports', pid, 'contrib', 'git'] as const,
};

async function file(path: string) {
  const res = await api.get(path, { responseType: 'blob', timeout: 120_000 });
  const cd = String(res.headers['content-disposition'] ?? '');
  const m = /filename\*=UTF-8''([^;]+)/.exec(cd);
  const name = m ? decodeURIComponent(m[1]) : /filename="([^"]+)"/.exec(cd)?.[1] ?? 'contributions';
  return { blob: res.data as Blob, fileName: name };
}

export const workContribApi = {
  summary: (pid: number, r: ContribRange) => d<ContribSummary>(api.get(`${B}/projects/${pid}/contrib/summary?${qs(r)}`)),
  member: (pid: number, uid: number, r: ContribRange) => d<MemberDetail>(api.get(`${B}/projects/${pid}/contrib/members/${uid}?${qs(r)}`)),
  task: (pid: number, num: number) => d<TaskContrib>(api.get(`${B}/projects/${pid}/contrib/issues/${num}`)),
  exportXlsx: (pid: number, r: ContribRange) => file(`${B}/projects/${pid}/contrib/export.xlsx?${qs(r)}`),
  exportPdf: (pid: number, r: ContribRange) => file(`${B}/projects/${pid}/contrib/export.pdf?${qs(r)}`),
  saveSettings: (pid: number, body: Partial<ContribSettings>) => d<ContribSettings>(api.put(`${B}/projects/${pid}/contrib/settings`, body)),
  gitAuthors: (pid: number) => d<{ authors: GitAuthor[]; people: WorkUser[] }>(api.get(`${B}/projects/${pid}/contrib/git-authors`)),
  setGitAuthor: (pid: number, identity: string, userId: number | null) => d(api.put(`${B}/projects/${pid}/contrib/git-authors`, { identity, userId })),
  rounds: (pid: number) => d<{ rounds: PeerRoundSummary[]; canManage: boolean; canParticipate: boolean; defaultCriteria: PeerCriterion[] }>(api.get(`${B}/projects/${pid}/contrib/peer/rounds`)),
  round: (pid: number, id: number) => d<PeerRound>(api.get(`${B}/projects/${pid}/contrib/peer/rounds/${id}`)),
  createRound: (pid: number, body: { title: string; sprintId?: number | null; stageId?: number | null; criteria?: Array<{ label: string; description?: string }>; closesAt?: string | null }) =>
    d<PeerRound>(api.post(`${B}/projects/${pid}/contrib/peer/rounds`, body)),
  updateRound: (pid: number, id: number, body: { title?: string; status?: 'OPEN' | 'CLOSED'; closesAt?: string | null }) => d<PeerRound>(api.patch(`${B}/projects/${pid}/contrib/peer/rounds/${id}`, body)),
  deleteRound: (pid: number, id: number) => d(api.delete(`${B}/projects/${pid}/contrib/peer/rounds/${id}`)),
  review: (pid: number, id: number, uid: number, body: { scores: Record<string, number>; comment?: string | null }) =>
    d(api.put(`${B}/projects/${pid}/contrib/peer/rounds/${id}/reviews/${uid}`, body)),
};
