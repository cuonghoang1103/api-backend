/**
 * CT Work — Portfolio + Workload (đợt S3a). Backend: src/services/work/portfolio.service.ts
 * (luật thuần ở portfolioRules.ts). Tách riêng khỏi work-api.ts để không giẫm phiên khác;
 * kiểu ở đây phải khớp service — đổi một bên thì đổi bên kia.
 */
import { api } from './api';
import type { ProjectKind, ProjectRole, ProjectType, StatusCategory, WorkUser } from './work-api';

export type Rag = 'RED' | 'AMBER' | 'GREEN';
export type PaceStatus = 'NO_ESTIMATES' | 'TOO_EARLY' | 'DONE' | 'AT_RISK' | 'ON_TRACK';
export type WorkloadScope = 'ALL' | 'TEAMS' | 'SELF';

export interface RagReason { level: Rag; code: string; text: string }

export interface PortfolioMilestone { id: number; name: string; date: string; daysUntil: number; total: number; done: number }

export interface PortfolioProject {
  id: number;
  key: string;
  name: string;
  type: ProjectType;
  role: ProjectRole;
  archivedAt: string | null;
  kind: ProjectKind;
  lead: WorkUser | null;
  url: string;
  modules: { stages: boolean; approvals: boolean; teams: boolean };
  counts: { open: number; overdue: number; done14: number };
  sprint: null | {
    name: string; status: PaceStatus; summary: string; daysLeft: number; remaining: number; total: number; done: number;
    neededPerDay: number; recentPerDay: number; unit: 'POINTS' | 'HOURS';
  };
  stage: null | { current: { n: number; name: string; slug: string; status: string } | null; done: number; total: number; percent: number };
  approvals: { pending: number; oldestDays: number | null };
  milestones: PortfolioMilestone[];
  nextMilestone: PortfolioMilestone | null;
  dependencies: { blockedBy: number; blocking: number };
  health: { rag: Rag; reasons: RagReason[] };
}

export type DepSide =
  | { hidden: false; projectId: number; key: string; projectKey: string; projectName: string; number: number; title: string; dueDate: string | null }
  | { hidden: true; projectId: null; key: null; projectKey: null; projectName: null; number: null; title: null; dueDate: null };

export interface Portfolio {
  today: string;
  rules: Array<{ level: 'RED' | 'AMBER'; text: string }>;
  projects: PortfolioProject[];
  milestones: Array<PortfolioMilestone & { projectId: number; projectKey: string; projectName: string; url: string }>;
  blockers: Array<{ id: number; since: string; blocker: DepSide; blocked: DepSide }>;
  canSeeWorkload: boolean;
  workloadScope: WorkloadScope;
}

export type LoadLevel = 'none' | 'low' | 'ok' | 'high' | 'over';

export interface WorkloadWeek {
  start: string;
  end: string;
  workingDays?: number;
  capacity: number;
  hours: number;
  pct: number | null;
  overloaded: boolean;
  level: LoadLevel;
  issueIds?: number[];
}

export interface WorkloadIssue {
  id: number;
  key: string;
  number: number;
  title: string;
  priority: number;
  project: { id: number; key: string; name: string };
  teamId: number | null;
  start: string | null;
  due: string | null;
  overdue: boolean;
  hours: number;
  source: 'remaining' | 'original' | 'points' | 'none' | 'children';
  status: { name: string; category: StatusCategory };
  type: { key: string; name: string; color: string };
  url: string;
}

export interface WorkloadPerson {
  user: WorkUser;
  teamIds: number[];
  hoursPerDay: number;
  capacitySource: 'projects' | 'default';
  timeOff: Array<{ start: string; end: string; note: string | null }>;
  weeks: Array<WorkloadWeek & { issueIds: number[] }>;
  totalHours: number;
  totalCapacity: number;
  pct: number | null;
  level: LoadLevel;
  overloaded: boolean;
  overloadedWeeks: string[];
  unscheduled: number;
  unestimated: number;
  issues: WorkloadIssue[];
}

export interface WorkloadTeam {
  id: number; key: string; name: string; color: string; memberIds: number[]; leadIds: number[];
  weeks: WorkloadWeek[]; overloadedPeople: number;
}

export interface Workload {
  from: string;
  to: string;
  today: string;
  weeks: Array<{ start: string; end: string }>;
  scope: WorkloadScope;
  hoursPerPoint: number;
  rules: { defaultHoursPerDay: number; overloadPct: number; highPct: number; conversion: string[] };
  teams: WorkloadTeam[];
  teamOptions: Array<{ id: number; key: string; name: string; color: string }>;
  projectOptions: Array<{ id: number; key: string; name: string }>;
  people: WorkloadPerson[];
  truncated: boolean;
}

export interface WorkloadQuery { from?: string; to?: string; teamId?: number; projectId?: number; hoursPerPoint?: number }

const B = '/work';
const d = <T,>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);
const qs = (q: Record<string, string | number | undefined>) => {
  const s = Object.entries(q).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  return s ? `?${s}` : '';
};

export const workPortfolioApi = {
  portfolio: (wsId: number, includeArchived = false) =>
    d<Portfolio>(api.get(`${B}/workspaces/${wsId}/portfolio${qs({ includeArchived: includeArchived ? 'true' : undefined })}`)),
  workload: (wsId: number, q: WorkloadQuery = {}) =>
    d<Workload>(api.get(`${B}/workspaces/${wsId}/workload${qs({ ...q })}`)),
};

export const portfolioKeys = {
  portfolio: (wsId: number, archived: boolean) => ['work', 'portfolio', wsId, archived] as const,
  workload: (wsId: number, q: WorkloadQuery) => ['work', 'workload', wsId, q] as const,
};
