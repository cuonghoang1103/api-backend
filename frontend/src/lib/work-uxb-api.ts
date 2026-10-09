/**
 * CT Work UX-B (10/10/2026) — báo cáo dòng chảy + KPI + dashboard "Project overview".
 * Backend: src/routes/work.uxb.routes.ts + services/work/flowReports.service.ts (phép tính ở flowMetrics.ts).
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { EstimationUnit, WorkDashboard, WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type FlowCategory = 'TODO' | 'IN_PROGRESS' | 'DONE';
export interface FlowBand { key: string; name: string; category: FlowCategory; color: string | null }
export interface Percentiles { n: number; p50: number | null; p85: number | null; p95: number | null; mean: number | null }

export interface CfdData { scope: string; days: number; from: string; to: string; bands: FlowBand[]; points: Array<{ day: string } & Record<string, number | string>> }
export interface CycleItem { issueId: number; number: number; title?: string; resolvedAt: string; day: string; cycleDays: number | null; leadDays: number }
export interface CycleData { scope: string; days: number; from: string; to: string; items: CycleItem[]; cycle: Percentiles; lead: Percentiles }
export interface ThroughputData { scope: string; unit: EstimationUnit; weeks: Array<{ week: string; end: string; count: number; points: number }>; average: number | null; averagePoints: number | null }
export interface AgingItem { issueId: number; number: number; title?: string; statusId: number; band: string; ageDays: number; assigneeId: number | null }
export interface AgingData { scope: string; bands: FlowBand[]; items: AgingItem[]; reference: Percentiles }
export interface ReleasePoint { day: string; scope: number; done: number; remaining: number; ideal: number | null }
export interface ReleaseBurnupData {
  version: { id: number; name: string; status: string; startDate: string | null; releaseDate: string | null; releasedAt: string | null };
  unit: EstimationUnit; byCount: boolean; points: ReleasePoint[]; scope: string; forecast: string | null;
}
export interface LoadByPersonData {
  unit: EstimationUnit;
  people: Array<{ user: Pick<WorkUser, 'id' | 'username' | 'fullName' | 'displayName' | 'avatarUrl'> | null; todo: number; inProgress: number; overdue: number; blocked: number; estimate: number; total: number }>;
}
export interface KpiTrend { value: number; previous: number | null }
export interface ProjectKpis {
  asOf: string;
  open: KpiTrend; overdue: KpiTrend; blocked: KpiTrend;
  sprint: { name: string; status: 'NO_ESTIMATES' | 'TOO_EARLY' | 'DONE' | 'AT_RISK' | 'ON_TRACK'; daysLeft: number; total: number; done: number; pctDone: number | null } | null;
  highRisks: number | null;
}

export const uxbKeys = {
  /** Dưới ['work','reports',pid] ⇒ sự kiện thời gian thực của dự án làm tươi luôn. */
  base: (pid: number) => ['work', 'reports', pid, 'uxb'] as const,
};

const qs = (o: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const uxbApi = {
  cfd: (pid: number, days?: number) => d<CfdData>(api.get(`${B}/projects/${pid}/reports/cfd${qs({ days })}`)),
  cycleTime: (pid: number, days?: number) => d<CycleData>(api.get(`${B}/projects/${pid}/reports/cycle-time${qs({ days })}`)),
  throughput: (pid: number, weeks?: number) => d<ThroughputData>(api.get(`${B}/projects/${pid}/reports/throughput${qs({ weeks })}`)),
  agingWip: (pid: number) => d<AgingData>(api.get(`${B}/projects/${pid}/reports/aging-wip`)),
  releaseBurnup: (pid: number, versionId: number, by?: 'count' | 'estimate') => d<ReleaseBurnupData>(api.get(`${B}/projects/${pid}/reports/release-burnup${qs({ versionId, by })}`)),
  loadByPerson: (pid: number) => d<LoadByPersonData>(api.get(`${B}/projects/${pid}/reports/load-by-person`)),
  kpis: (pid: number) => d<ProjectKpis>(api.get(`${B}/projects/${pid}/reports/kpis`)),
  createOverview: (pid: number) => d<WorkDashboard>(api.post(`${B}/projects/${pid}/dashboards/overview`)),
};
