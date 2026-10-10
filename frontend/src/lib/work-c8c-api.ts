/**
 * CT Work đợt 8c — họp định kỳ + mẫu chương trình, RSVP cổng khách, ảnh Mermaid vẽ sẵn, phân tích tĩnh (SARIF) + V(G),
 * SWR302 (ước lượng BA, báo cáo trạng thái yêu cầu, gói nộp ZIP, stakeholder AI). Backend: src/routes/work.ctw8c.routes.ts.
 */
import { api } from './api';
import type { WorkUser } from './work-api';
import type { MeetingType, PortalMeeting } from './work-s3b-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

async function file(path: string, fallback: string) {
  const res = await api.get(path, { responseType: 'blob', timeout: 180_000 });
  const cd = String(res.headers['content-disposition'] ?? '');
  const name = /filename="([^"]+)"/.exec(cd)?.[1] ?? fallback;
  return { blob: res.data as Blob, fileName: name };
}

export const c8cKeys = {
  series: (pid: number) => ['work', 'c8c', pid, 'series'] as const,
  seriesOne: (pid: number, sid: number) => ['work', 'c8c', pid, 'series', sid] as const,
  templates: (pid: number) => ['work', 'c8c', pid, 'meeting-templates'] as const,
  staticAnalysis: (pid: number, status: string) => ['work', 'c8c', pid, 'static', status] as const,
  estimation: (pid: number) => ['work', 'c8c', pid, 'estimation'] as const,
  statusReport: (pid: number, days: number) => ['work', 'c8c', pid, 'status-report', days] as const,
};

// ─── Họp định kỳ ─────────────────────────────────────────────────

export type Freq = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export interface Recurrence { freq: Freq; interval: number; byWeekday: number[]; byMonthDay: number | null; hour: number; minute: number; startDate: string; endDate: string | null }
export interface MeetingTemplate { key: string; type: MeetingType; name: string; description: string; durationMin: number; suggest: { freq: Freq; interval: number; byWeekday?: number[] }; agenda: Array<{ title: string; minutes: number }>; totalMinutes: number }
export interface SeriesRow {
  id: number; title: string; type: MeetingType; typeLabel: string; timezone: string; recurrence: Recurrence; rrule: string; summary: string; summaryVi: string;
  durationMin: number; location: string | null; meetingUrl: string | null; provider: string | null; templateKey: string | null;
  attendeeIds: number[]; exdates: string[]; generatedUntil: string | null; endedAt: string | null; organizerId: number | null; createdAt: string;
  upcoming: Array<{ number: number; key: string; startsAt: string; status: string; detached: boolean; occurrenceDate: string | null }>;
}
export interface SeriesDetail extends SeriesRow { organizer: WorkUser | null; canEdit: boolean; canDelete: boolean; removed?: number; kept?: number }
export interface SeriesInput {
  title: string; type?: MeetingType; templateKey?: string | null;
  recurrence: { freq: Freq; interval?: number; byWeekday?: number[]; byMonthDay?: number | null; hour: number; minute?: number; startDate?: string; endDate?: string | null };
  durationMin?: number; timezone?: string; location?: string | null; meetingUrl?: string | null; attendeeIds?: number[]; sendInvites?: boolean;
}
/** Phần series trong MeetingDetail (meetings.service getMeeting). */
export interface MeetingSeriesInfo { id: number; title: string; rrule: string; summary: string; summaryVi: string; ended: boolean; occurrenceDate: string | null; detached: boolean }

export const meetingSeriesApi = {
  templates: (pid: number) => d<MeetingTemplate[]>(api.get(`${P(pid)}/meeting-templates`)),
  list: (pid: number) => d<{ items: SeriesRow[]; canEdit: boolean; templates: MeetingTemplate[] }>(api.get(`${P(pid)}/meeting-series`)),
  get: (pid: number, sid: number) => d<SeriesDetail>(api.get(`${P(pid)}/meeting-series/${sid}`)),
  create: (pid: number, body: SeriesInput) => d<SeriesDetail>(api.post(`${P(pid)}/meeting-series`, body)),
  update: (pid: number, sid: number, body: Partial<SeriesInput> & { scope: 'all' | 'following'; fromMeeting?: number }) => d<SeriesDetail>(api.patch(`${P(pid)}/meeting-series/${sid}`, body)),
  remove: (pid: number, sid: number, scope: 'all' | 'following', from?: number) => d<{ removed: number; kept: number }>(api.delete(`${P(pid)}/meeting-series/${sid}`, { params: { scope, from } })),
  applyTemplate: (pid: number, num: number, key: string, replace = false) => d<unknown>(api.post(`${P(pid)}/meetings/${num}/apply-template`, { key, replace })),
  portalRsvp: (pid: number, num: number, rsvp: 'YES' | 'NO' | 'MAYBE', note?: string | null) => d<PortalMeeting & { me: PortalMe | null }>(api.post(`${P(pid)}/portal/meetings/${num}/rsvp`, { rsvp, note })),
};
export interface PortalMe { rsvp: 'YES' | 'NO' | 'MAYBE' | null; rsvpNote: string | null; rsvpAt: string | null; canRsvp: boolean }

// ─── Ảnh Mermaid vẽ sẵn ──────────────────────────────────────────

export const diagramRenderApi = {
  put: (pid: number, body: { source: string; svg?: string | null; png?: string | null }) => d<{ hash: string; svg: boolean; png: boolean }>(api.post(`${P(pid)}/diagram-renders`, body, { timeout: 60_000 })),
  imageUrl: (pid: number, n: number, fmt: 'svg' | 'png') => `/api/v1${P(pid)}/diagrams/${n}/image.${fmt}`,
};

// ─── Phân tích tĩnh + V(G) ───────────────────────────────────────

export type FindingStatus = 'OPEN' | 'FIXED' | 'IGNORED' | 'ISSUE';
export interface StaticFinding {
  id: number; tool: string; ruleId: string; level: 'error' | 'warning' | 'note'; message: string; file: string | null; line: number | null; helpUri: string | null;
  status: FindingStatus; seenCount: number; firstSeenAt: string; lastSeenAt: string; fixedAt: string | null; issue: { number: number; key: string; open: boolean } | null;
}
export type Risk = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
export interface StaticOverview {
  summary: { open: number; openErrors: number; openWarnings: number; fixed: number; ignored: number; asIssues: number; lastImportAt: string | null; tools: Array<{ tool: string; count: number }> };
  findings: StaticFinding[];
  imports: Array<{ id: number; kind: string; tools: string | null; source: string; build: string | null; branch: string | null; commitSha: string | null; total: number; newCount: number; fixedCount: number; issuesMade: number; units: number; createdAt: string }>;
  complexity: {
    summary: { units: number; average: number | null; max: number | null; over10: number; basisPaths: number; byRisk: Record<Risk, number> };
    units: Array<{ id: number; name: string; file: string | null; line: number | null; vg: number; source: string; risk: Risk; basisPaths: number; updatedAt: string }>;
  };
}
export const staticApi = {
  overview: (pid: number, status = 'OPEN') => d<StaticOverview>(api.get(`${P(pid)}/static-analysis`, { params: { status } })),
  importReport: (pid: number, report: string, kind: 'sarif' | 'jacoco' | 'lizard' | 'auto', createIssues = false) => d<{ findings: number; newFindings: number; fixed: number; issuesCreated: number; complexityUnits: number }>(api.post(`${P(pid)}/tests/automation/static`, { report, kind, createIssues }, { timeout: 120_000 })),
  act: (pid: number, id: number, action: 'ignore' | 'reopen' | 'issue') => d<{ number?: number; key?: string; created?: boolean; status?: string }>(api.post(`${P(pid)}/static-analysis/findings/${id}/${action}`, {})),
  vg: (pid: number, body: { edges?: number; nodes?: number; components?: number; decisions?: number }) => d<{ vg: number; basisPaths: number; risk: Risk }>(api.post(`${P(pid)}/static-analysis/vg`, body)),
};

// ─── SWR302 ──────────────────────────────────────────────────────

export const EST_COUNT_KEYS = ['existingDocPages', 'existingSystems', 'stakeholders', 'interfacesSmall', 'interfacesMedium', 'interfacesLarge', 'useCases', 'businessDataDiagrams', 'screens', 'reports'] as const;
export type EstCountKey = (typeof EST_COUNT_KEYS)[number];
export interface EstProject { totalBudget: number; baHourlyCost: number; projectType: 'STANDARD' | 'COTS'; developers: number; remote: boolean; projectWeeks: number; requirementsWeeks: number; budgetPercent: number }
export interface EstMethod { bas: number | null; requirementsCost: number; projectCost: number | null; ratio?: number }
export interface Estimation {
  auto: Record<EstCountKey, number>;
  config: { counts?: Partial<Record<EstCountKey, number>>; project?: Partial<EstProject>; factors?: Record<string, number>; minutes?: Record<string, number> };
  result: {
    counts: Record<EstCountKey, number>; project: EstProject; factors: Record<string, number>; derived: Record<string, number>;
    rows: Array<{ key: string; category: string; label: string; minutesPerUnit: number; units: number | null; minutes: number; hours: number; note: string | null; edited: boolean }>;
    categories: Array<{ category: string; hours: number }>;
    totals: { workHours: number; remoteBuffer: number; hours: number };
    methods: { budgetPercent: EstMethod; devRatio: EstMethod; activity: EstMethod };
  };
  mismatches: Array<{ key: EstCountKey; label: string; entered: number; actual: number }>;
  labels: Record<EstCountKey, string>;
  canEdit: boolean;
}
export interface StatusReport {
  total: number; byLifecycle: Record<string, number>; byType: Record<string, number>;
  window: { days: number; from: string; added: number; modified: number; deleted: number; volatility: number };
  effort: { hours: number; byPerson: Array<{ who: string; hours: number }> };
  trend: Array<{ week: string; added: number; changed: number; deleted: number; effortHours: number }>;
  versionedMoreThanOnce: number;
}
export interface AiTurn { role: 'analyst' | 'stakeholder'; text: string; at: string }

export const swrPackApi = {
  estimation: (pid: number) => d<Estimation>(api.get(`${P(pid)}/swr/estimation`)),
  saveEstimation: (pid: number, body: { counts?: Record<string, number | null>; project?: Record<string, unknown>; factors?: Record<string, number | null>; minutes?: Record<string, number | null> }) => d<Estimation>(api.put(`${P(pid)}/swr/estimation`, body)),
  estimationXlsx: (pid: number) => file(`${P(pid)}/swr/export/estimation.xlsx`, 'Requirements_Estimation.xlsx'),
  statusReport: (pid: number, days: number) => d<StatusReport>(api.get(`${P(pid)}/swr/status-report`, { params: { days } })),
  statusXlsx: (pid: number, days: number) => file(`${P(pid)}/swr/export/status-report.xlsx?days=${days}`, 'Requirements_Status.xlsx'),
  packageZip: (pid: number) => file(`${P(pid)}/swr/package.zip`, 'SWR302_Assignment.zip'),
  askStakeholder: (pid: number, elc: string, body: { stakeholder?: string | null; question: string; language?: 'vi' | 'en' }) => d<{ turns: AiTurn[]; persona: { key: string; name: string; role: string | null } | null; answer: string }>(api.post(`${P(pid)}/swr/elicitation/${elc}/ai-stakeholder`, body, { timeout: 90_000 })),
  clearStakeholder: (pid: number, elc: string) => d<{ cleared: true }>(api.delete(`${P(pid)}/swr/elicitation/${elc}/ai-stakeholder`)),
};
