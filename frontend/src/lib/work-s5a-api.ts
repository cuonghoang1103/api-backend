/**
 * CT Work — đợt S5a: Service desk & SLA. Backend: src/routes/work.desk.routes.ts +
 * services/work/{serviceDesk.service,slaRules}.ts. Tách khỏi work-api.ts để không giẫm phiên khác;
 * kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { StatusCategory, WorkUser } from './work-api';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const q = (o: Record<string, string | number | undefined | null | boolean>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '' && v !== false) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

// ═══ Kiểu ═══════════════════════════════════════════════════════════

export type DeskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type DeskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RequestTypeKey = 'INCIDENT' | 'SERVICE_REQUEST' | 'QUESTION' | 'CHANGE';
export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'MET';
export type SlaCalendarKind = 'BUSINESS' | 'ALWAYS';
export type QueueView = 'open' | 'unassigned' | 'mine' | 'at_risk' | 'breached' | 'waiting' | 'team' | 'resolved';
export type ProblemStatus = 'OPEN' | 'INVESTIGATING' | 'KNOWN_ERROR' | 'RESOLVED' | 'CLOSED';

export const DESK_PRIORITIES: DeskPriority[] = ['P1', 'P2', 'P3', 'P4'];
export const DESK_LEVELS: DeskLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
export const PROBLEM_STATUSES: ProblemStatus[] = ['OPEN', 'INVESTIGATING', 'KNOWN_ERROR', 'RESOLVED', 'CLOSED'];
export const PROBLEM_STATUS_LABEL: Record<ProblemStatus, string> = { get OPEN() { return wt('desk.psOpen'); }, get INVESTIGATING() { return wt('desk.psInvestigating'); }, get KNOWN_ERROR() { return wt('desk.psKnownError'); }, get RESOLVED() { return wt('common.resolved'); }, get CLOSED() { return wt('desk.psClosed'); } };
export const LEVEL_LABEL: Record<DeskLevel, string> = { get HIGH() { return wt('status.prioHigh'); }, get MEDIUM() { return wt('status.prioMedium'); }, get LOW() { return wt('status.prioLow'); } };

export interface RequestField { key: string; label: string; kind: 'text' | 'textarea' | 'date'; required: boolean }
export interface RequestTypeConfig {
  key: RequestTypeKey; enabled: boolean; name: string; description: string; defaultImpact: DeskLevel; defaultUrgency: DeskLevel;
  askImpact: boolean; fields: RequestField[]; useChangeRequest?: boolean;
}
export interface SlaGoal { firstResponseMin: number; resolutionMin: number; calendar: SlaCalendarKind }
export type Matrix = Record<DeskLevel, Record<DeskLevel, DeskPriority>>;
export type TargetsText = Record<DeskPriority, { respond: string; resolve: string }>;

export interface DeskSettings {
  calendar: { timezone: string; workDays: number[]; startMin: number; endMin: number; holidays: string[] };
  goals: Record<DeskPriority, SlaGoal>;
  matrix: Matrix;
  requestTypes: RequestTypeConfig[];
  pauseStatusIds: number[];
  responseStatusIds: number[];
  atRiskPercent: number;
  saved: boolean;
  canConfigure: boolean;
  statuses: Array<{ id: number; name: string; category: StatusCategory; workflow: string; isDefault: boolean }>;
  targetsText: TargetsText;
  rules: string[];
}

export interface SlaTarget {
  goalMin: number; calendar: SlaCalendarKind; elapsedMin: number; remainingMin: number; status: SlaStatus;
  stopped: boolean; paused: boolean; dueAt: string | null; atRiskAt: string | null; breachedAt: string | null; stoppedAt: string | null; label: string;
}

export interface QueueItem {
  number: number; key: string; title: string; requestType: RequestTypeKey; requestTypeName: string; priority: DeskPriority;
  waiting: boolean; paused: boolean; channel: 'PORTAL' | 'STAFF'; shared: boolean;
  status: { id: number; name: string; category: StatusCategory; color: string };
  team: { id: number; key: string; name: string; color: string } | null;
  assignee: WorkUser | null; requester: WorkUser | null;
  createdAt: string; updatedAt: string; resolvedAt: string | null;
  firstResponse: SlaTarget; resolution: SlaTarget; problemId: number | null; csat: number | null;
}

export interface QueueResult {
  view: QueueView; counts: Record<QueueView, number>; canWork: boolean; now: string;
  teams: Array<{ id: number; key: string; name: string; color: string }>;
  items: QueueItem[]; truncated: boolean;
}

export interface IssueDeskTicket {
  requestType: RequestTypeKey; requestTypeName: string; impact: DeskLevel; urgency: DeskLevel; priority: DeskPriority; channel: 'PORTAL' | 'STAFF';
  requester: WorkUser | null; fields: Array<{ key: string; label: string; value: string }>;
  waiting: boolean; waitingSince: string | null; firstResponseAt: string | null; firstResponseBy: string | null; paused: boolean;
  firstResponse: SlaTarget; resolution: SlaTarget;
  problem: { number: number; title: string; status: ProblemStatus } | null;
  changeRequest: { number: number; title: string; status: string } | null;
  csat: { requestedAt: string | null; rating: number | null; comment: string | null; at: string | null };
  events: Array<{ id: number; kind: string; at: string; value: string | null; note: string | null; actor: string | null }>;
  createdAt: string;
}

export type IssueDesk =
  | { enabled: false; ticket: null }
  | { enabled: true; canWork: boolean; requestTypes: Array<{ key: RequestTypeKey; name: string; enabled: boolean }>; matrix: Matrix; targets: TargetsText; ticket: IssueDeskTicket | null };

export interface ProblemRow {
  id: number; number: number; key: string; title: string; description: string | null; status: ProblemStatus; rootCause: string | null; workaround: string | null;
  ownerId: number | null; owner: WorkUser | null; incidentCount: number; postmortem: { number: number; title: string } | null;
  createdAt: string; updatedAt: string; resolvedAt: string | null;
}
export interface ProblemDetail extends ProblemRow {
  canWork: boolean; docsEnabled: boolean;
  incidents: Array<{
    number: number; key: string; title: string; status: { name: string; category: StatusCategory; color: string }; requestType: RequestTypeKey;
    priority: DeskPriority; createdAt: string; resolvedAt: string | null; firstResponse: SlaTarget; resolution: SlaTarget;
  }>;
}

export interface ReportCell {
  tickets: number; frDone: number; frMet: number; frPercent: number | null; resDone: number; resMet: number; resPercent: number | null;
  breaches: number; mttrMin: number | null; csatCount: number; csatAvg: number | null;
}
export interface DeskReport {
  months: string[]; priorities: DeskPriority[];
  cells: Record<string, Record<'ALL' | DeskPriority, ReportCell>>;
  byPriority: Record<'ALL' | DeskPriority, ReportCell>;
  breaches: Array<{ key: string; number: number; title: string; priority: DeskPriority; target: 'FIRST_RESPONSE' | 'RESOLUTION'; at: string }>;
  feedback: Array<{ key: string; number: number; title: string; rating: number; comment: string | null; at: string | null }>;
  timezone: string; goals: Record<DeskPriority, SlaGoal>; targets: TargetsText;
}

export interface PortalDeskForm {
  enabled: true;
  canSubmit: boolean;
  requestTypes: Array<{ key: RequestTypeKey; name: string; description: string; askImpact: boolean; fields: RequestField[]; defaultImpact: DeskLevel; defaultUrgency: DeskLevel }>;
  impact: Array<{ value: DeskLevel; label: string; hint: string }>;
  urgency: Array<{ value: DeskLevel; label: string; hint: string }>;
  matrix: Matrix;
  targets: TargetsText;
}

export interface PortalDeskTicket {
  requestTypeName: string; respondWithin: string; resolveWithin: string; responded: boolean; resolved: boolean; mine: boolean;
  csat: { canAnswer: boolean; rating: number | null; comment: string | null; at: string | null };
}

// ═══ Khoá cache ════════════════════════════════════════════════════

export const deskKeys = {
  all: (pid: number) => ['work', 'desk', pid] as const,
  settings: (pid: number) => ['work', 'desk', pid, 'settings'] as const,
  queue: (pid: number, view: string, extra: string) => ['work', 'desk', pid, 'queue', view, extra] as const,
  issue: (pid: number, num: number) => ['work', 'desk', pid, 'issue', num] as const,
  problems: (pid: number) => ['work', 'desk', pid, 'problems'] as const,
  problem: (pid: number, num: number) => ['work', 'desk', pid, 'problem', num] as const,
  report: (pid: number, months: number) => ['work', 'desk', pid, 'report', months] as const,
  portalForm: (pid: number, asClient: boolean) => ['work', 'portal', pid, 'desk-form', asClient] as const,
  portalTicket: (pid: number, num: number, asClient: boolean) => ['work', 'portal', pid, 'desk-ticket', num, asClient] as const,
};

// ═══ API ═══════════════════════════════════════════════════════════

export const deskApi = {
  settings: (pid: number) => d<DeskSettings>(api.get(`${B}/projects/${pid}/desk/settings`)),
  saveSettings: (pid: number, body: Partial<{
    timezone: string; workDays: number[]; workStart: number; workEnd: number; holidays: string[]; goals: Partial<Record<DeskPriority, Partial<SlaGoal>>>;
    matrix: Matrix; requestTypes: RequestTypeConfig[]; pauseStatusIds: number[]; responseStatusIds: number[]; atRiskPercent: number;
  }>) => d<DeskSettings>(api.put(`${B}/projects/${pid}/desk/settings`, body)),
  queue: (pid: number, o: { view?: QueueView; teamId?: number | null; requestType?: RequestTypeKey | ''; priority?: DeskPriority | ''; q?: string; sort?: string }) =>
    d<QueueResult>(api.get(`${B}/projects/${pid}/desk/queue${q(o as Record<string, string | number | undefined | null>)}`)),
  createTicket: (pid: number, body: { requestType: RequestTypeKey; impact: DeskLevel; urgency: DeskLevel; priority?: DeskPriority | null; requesterId?: number | null; fields?: Record<string, string>; issueNumber?: number | null; title?: string | null; description?: string | null }) =>
    d<IssueDesk>(api.post(`${B}/projects/${pid}/desk/tickets`, body)),
  issue: (pid: number, num: number) => d<IssueDesk>(api.get(`${B}/projects/${pid}/issues/${num}/desk`)),
  updateTicket: (pid: number, num: number, body: { requestType?: RequestTypeKey; impact?: DeskLevel; urgency?: DeskLevel; priority?: DeskPriority | null }) =>
    d<IssueDesk>(api.patch(`${B}/projects/${pid}/issues/${num}/desk`, body)),
  setWaiting: (pid: number, num: number, waiting: boolean) => d<IssueDesk>(api.post(`${B}/projects/${pid}/issues/${num}/desk/waiting`, { waiting })),
  problems: (pid: number) => d<{ canWork: boolean; items: ProblemRow[] }>(api.get(`${B}/projects/${pid}/desk/problems`)),
  problem: (pid: number, num: number) => d<ProblemDetail>(api.get(`${B}/projects/${pid}/desk/problems/${num}`)),
  createProblem: (pid: number, body: { title: string; description?: string | null; incidentNumbers?: number[] }) => d<ProblemDetail>(api.post(`${B}/projects/${pid}/desk/problems`, body)),
  updateProblem: (pid: number, num: number, body: Partial<{ title: string; description: string | null; status: ProblemStatus; rootCause: string | null; workaround: string | null; ownerId: number | null }>) =>
    d<ProblemDetail>(api.patch(`${B}/projects/${pid}/desk/problems/${num}`, body)),
  linkIncidents: (pid: number, num: number, issueNumbers: number[]) => d<ProblemDetail>(api.post(`${B}/projects/${pid}/desk/problems/${num}/incidents`, { issueNumbers })),
  unlinkIncident: (pid: number, num: number, inum: number) => d<ProblemDetail>(api.delete(`${B}/projects/${pid}/desk/problems/${num}/incidents/${inum}`)),
  postmortem: (pid: number, num: number) => d<{ pageNumber: number; title: string }>(api.post(`${B}/projects/${pid}/desk/problems/${num}/postmortem`)),
  report: (pid: number, months: number) => d<DeskReport>(api.get(`${B}/projects/${pid}/desk/report${q({ months })}`)),
  reportXlsx: async (pid: number, months: number) => {
    const r = await api.get(`${B}/projects/${pid}/desk/report.xlsx${q({ months })}`, { responseType: 'blob' });
    return r.data as Blob;
  },
  portalForm: (pid: number, asClient?: boolean) => d<PortalDeskForm | { enabled: false }>(api.get(`${B}/projects/${pid}/portal/desk${q({ as: asClient ? 'client' : undefined })}`)),
  portalSubmit: (pid: number, body: { requestType: RequestTypeKey; title: string; description?: string | null; impact?: DeskLevel | null; urgency?: DeskLevel | null; fields?: Record<string, string> }) =>
    d<{ number: number; key: string; respondWithin: string; resolveWithin: string; changeRequest: number | null }>(api.post(`${B}/projects/${pid}/portal/desk/requests`, body)),
  portalTicket: (pid: number, num: number, asClient?: boolean) =>
    d<{ enabled: boolean; ticket: PortalDeskTicket | null }>(api.get(`${B}/projects/${pid}/portal/desk/requests/${num}${q({ as: asClient ? 'client' : undefined })}`)),
  submitCsat: (pid: number, num: number, body: { rating: number; comment?: string | null }) =>
    d<{ enabled: boolean; ticket: PortalDeskTicket | null }>(api.post(`${B}/projects/${pid}/portal/desk/requests/${num}/csat`, body)),
};
