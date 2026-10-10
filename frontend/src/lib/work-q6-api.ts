/**
 * CT Work đợt 6 — chất lượng: review/inspection + baseline + CR ↔ yêu cầu (RV), quản lý test chuyên sâu (TST-1).
 * Backend: src/routes/work.ctw6.routes.ts (+ quality.service.ts, testMgmt.service.ts). Kiểu khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

async function download(url: string, params: Record<string, unknown>, fallback: string) {
  const r = await api.get(url, { params, responseType: 'blob' });
  const cd = String(r.headers['content-disposition'] ?? '');
  const name = decodeURIComponent(/filename\*=UTF-8''([^;]+)/.exec(cd)?.[1] ?? fallback);
  const href = URL.createObjectURL(r.data as Blob);
  const a = document.createElement('a');
  a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}

export const q6Keys = {
  base: (pid: number) => ['work', 'q6', pid] as const,
  reviews: (pid: number) => ['work', 'q6', pid, 'reviews'] as const,
  review: (pid: number, n: number) => ['work', 'q6', pid, 'review', n] as const,
  baselines: (pid: number) => ['work', 'q6', pid, 'baselines'] as const,
  tests: (pid: number) => ['work', 'q6', pid, 'tests'] as const,
};

// ─── Review / inspection ─────────────────────────────────────────

export type ReviewKind = 'DOC' | 'CODE';
export type ReviewMethod = 'INFORMAL' | 'WALKTHROUGH' | 'TECHNICAL' | 'INSPECTION';
export type ReviewRole = 'MODERATOR' | 'AUTHOR' | 'REVIEWER' | 'SCRIBE' | 'READER';
export type ReviewStatus = 'PLANNING' | 'PREPARATION' | 'MEETING' | 'REWORK' | 'FOLLOW_UP' | 'CLOSED';
export type ReviewDecision = 'ACCEPT' | 'ACCEPT_WITH_CHANGES' | 'REINSPECT';
export type ItemResult = 'OK' | 'NG' | 'NA';
export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL';
export const REVIEW_METHODS: ReviewMethod[] = ['INFORMAL', 'WALKTHROUGH', 'TECHNICAL', 'INSPECTION'];
export const REVIEW_ROLES: ReviewRole[] = ['MODERATOR', 'AUTHOR', 'REVIEWER', 'SCRIBE', 'READER'];
export const REVIEW_STATUSES: ReviewStatus[] = ['PLANNING', 'PREPARATION', 'MEETING', 'REWORK', 'FOLLOW_UP', 'CLOSED'];
export const SEVERITIES: Severity[] = ['CRITICAL', 'MAJOR', 'MINOR', 'TRIVIAL'];

export interface Checklist { key: string; kind: ReviewKind; name: string; source: string; sizeUnit: 'PAGE' | 'LOC'; sections: Array<{ name: string; items: number }>; items: number }
export interface ReviewMetrics {
  size: number | null; sizeUnit: 'PAGE' | 'LOC'; participants: number; prepHours: number; meetingHours: number; effortHours: number; reworkHours: number;
  defects: number; majorDefects: number; checklistProgress: number; rate: number | null; rateTooFast: boolean; density: number | null; efficiency: number | null;
}
export interface ReviewRow {
  number: number; key: string; title: string; kind: ReviewKind; method: ReviewMethod; checklistKey: string; status: ReviewStatus; decision: ReviewDecision | null;
  workProduct: string | null; meetingAt: string | null; createdAt: string; closedAt: string | null; participants: number; defects: number; progress: number;
  rate: number | null; density: number | null; efficiency: number | null;
}
export interface ReviewItem { id: number; position: number; section: string; question: string; result: ItemResult | null; line: string | null; note: string | null; severity: Severity | null; defect: { number: number; key: string; title: string; done: boolean } | null }
export interface Review {
  number: number; key: string; projectKey: string; title: string; kind: ReviewKind; method: ReviewMethod; checklistKey: string; checklistName: string; checklistSource: string | null;
  page: { number: number; title: string } | null; workProduct: string | null; prUrl: string | null; size: number | null; sizeUnit: 'PAGE' | 'LOC';
  status: ReviewStatus; decision: ReviewDecision | null; meetingAt: string | null; meetingMinutes: number | null; reworkMinutes: number | null;
  entryCriteria: string | null; exitCriteria: string | null; notes: string | null; createdAt: string; updatedAt: string; closedAt: string | null;
  participants: Array<{ id: number; userId: number; role: ReviewRole; prepMinutes: number | null; user: WorkUser | null }>;
  items: ReviewItem[]; metrics: ReviewMetrics; next: ReviewStatus[]; closeBlockers: string[]; canEdit: boolean;
}
export interface ReviewCreate {
  title: string; kind: ReviewKind; method: ReviewMethod; checklistKey: string; pageNumber?: number | null; workProduct?: string | null; prUrl?: string | null;
  size?: number | null; meetingAt?: string | null; entryCriteria?: string | null; exitCriteria?: string | null; participants?: Array<{ userId: number; role: ReviewRole }>; language?: 'vi' | 'en';
}

// ─── Baseline ────────────────────────────────────────────────────

export type BaselineKind = 'REQ' | 'UC' | 'BR' | 'DOC';
export interface BaselineItem { kind: BaselineKind; refId: number; ref: string; title: string; version: string | null; hash: string }
export interface Baseline {
  number: number; key: string; name: string; description: string | null; status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED'; locked: boolean;
  hash: string; itemCount: number; counts: Record<BaselineKind, number>; createdAt: string; approvedAt: string | null; createdBy: WorkUser | null;
  scope: { requirements?: boolean; useCases?: boolean; businessRules?: boolean; pageNumbers?: number[] };
  signoffs: Array<{ userId: number; user: WorkUser | null; decision: 'PENDING' | 'APPROVED' | 'REJECTED'; comment: string | null; decidedAt: string | null; contentHash: string | null; hashMatches: boolean | null }>;
  items?: BaselineItem[];
}
export interface BaselineDiff {
  from: { number: number; key: string; name: string }; to: { current: true } | { number: number; key: string };
  rows: Array<{ kind: BaselineKind; refId: number; ref: string; title: string; change: 'ADDED' | 'REMOVED' | 'CHANGED'; fromVersion: string | null; toVersion: string | null; fromTitle?: string; changeRequests: Array<{ number: number; key: string; status: string }>; authorized: boolean }>;
  unchanged: number; counts: { added: number; removed: number; changed: number }; volatility: number | null;
}
export interface CrImpact {
  changeRequest: { number: number; key: string; title: string; status: string; unlocksEditing: boolean };
  items: Array<{ kind: BaselineKind; refId: number; ref: string; title: string; tests: string[]; baselines: string[] }>;
  testsToRerun: string[];
}

// ─── Test ────────────────────────────────────────────────────────

export type Technique = 'EP_BVA' | 'DECISION_TABLE' | 'STATE_TRANSITION' | 'PAIRWISE';
export const TECHNIQUES: Technique[] = ['EP_BVA', 'DECISION_TABLE', 'STATE_TRANSITION', 'PAIRWISE'];
export const TEST_LEVELS = ['COMPONENT', 'INTEGRATION', 'SYSTEM', 'ACCEPTANCE'] as const;
export const TEST_TYPES = ['FUNCTIONAL', 'NON_FUNCTIONAL', 'STRUCTURAL', 'CONFIRMATION', 'REGRESSION', 'SMOKE'] as const;
export const ROOT_CAUSES = ['REQUIREMENT', 'DESIGN', 'CODING', 'ENVIRONMENT', 'DATA', 'TEST', 'THIRD_PARTY', 'OTHER'] as const;
export const PHASES = ['REQUIREMENT', 'DESIGN', 'CODING', 'UNIT_TEST', 'INTEGRATION', 'SYSTEM_TEST', 'ACCEPTANCE', 'PRODUCTION'] as const;
export interface DesignCase { id: string; title: string; inputs: Record<string, string>; expected: string; type: 'N' | 'A' | 'B'; steps?: Array<{ action: string; expected: string }>; tags: string[] }
export interface DesignResult { cases: DesignCase[]; table: any; warnings: string[]; coverage: { label: string; covered: number; total: number } } // eslint-disable-line @typescript-eslint/no-explicit-any
export interface TestDesign { number: number; key: string; name: string; technique: Technique; requirementKey: string | null; input: unknown; cases: DesignCase[]; exported: Array<Record<string, unknown>>; createdAt: string; updatedAt: string; result?: DesignResult; caseCount?: number }
export interface CycleStat { cycleId: number; round: number; name: string; state: string; total: number; executed: number; pass: number; fail: number; blocked: number; retest: number; todo: number; skip: number; passRate: number | null; progress: number | null }
export interface Count { key: string; total: number; open: number }
export interface QualityDashboard {
  projectKey: string; plan: { id: number; name: string } | null; cycles: CycleStat[];
  retest: { failedCases: number; retested: number; fixedOnRetest: number; retestRate: number | null; fixRate: number | null };
  sCurve: { cycle: { id: number; name: string }; points: Array<{ day: string; planned: number; actual: number | null }> } | null;
  defects: { total: number; open: number; bySeverity: Count[]; byModule: Count[]; byActivity: Count[]; byRootCause: Count[]; byInjectedPhase: Count[]; leakage: number | null; dre: number | null; reopenRate: number | null; avgAgeDays: number | null };
  defectTrend: Array<{ day: string; opened: number; closed: number; openTotal: number }>;
  coverage: { requirements: number; covered: number; verified: number; pct: number | null; verifiedPct: number | null };
  exit: { met: boolean; rows: Array<{ key: string; target: string; actual: string; met: boolean }> };
  estimation: {
    params: Estimation; testCases: number; executions: number; durationDays: number; formula: string; recordedMinutes: number; casesWithEstimate: number;
    effort: { designDays: number; executeDays: number; overheadDays: number; totalDays: number; totalHours: number };
  };
  levels: Array<{ level: string; cases: number }>;
}
export interface Estimation { method: 'TEST_CASES' | 'FUNCTION_POINTS'; size: number; designPerDay: number; executePerDay: number; cycles: number; retestPct: number; overheadPct: number; testers: number; hoursPerDay: number }
export interface Criteria { passRate: number; maxOpenCritical: number; maxOpenMajor: number; reqCoverage: number; minExecuted: number }
export interface PlanSettings {
  scopeIn?: string; scopeOut?: string; approach?: string; environment?: string; suspension?: string; resumption?: string;
  deliverables?: string; schedule?: string; risks?: string; variances?: string; criteria: Criteria; estimation: Estimation;
}
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface RiskRow {
  number: number; key: string; title: string; category: string | null; likelihood: number | null; impact: number | null; score: number | null; level: RiskLevel | null;
  riskKind: 'PRODUCT' | 'PROJECT' | null; status: string; mitigation: string | null; policy: { priority: string; depth: string; techniques: string[]; order: number } | null;
  requirements: Array<{ number: number; key: string; title: string }>; tests: Array<{ number: number; key: string; title: string; lastStatus: string | null }>; covered: boolean; passing: boolean;
}
export interface RiskMatrix { rows: RiskRow[]; grid: string[][][]; summary: { total: number; product: number; highUncovered: number; highCoveragePct: number | null } }
export interface DefectRowQ {
  number: number; key: string; title: string; open: boolean; createdAt: string; severity: Severity | null; activity: string | null; rootCause: string | null; injectedPhase: string | null;
  detectedByTool: string | null; testLevel: string | null; fixNote: string | null; reporter: string | null; reporterId: number | null; assignee: string | null;
}
export interface ExploreNote { id: string; at: string; offsetMin: number | null; kind: 'NOTE' | 'BUG' | 'QUESTION' | 'IDEA' | 'RISK'; text: string; bugNumber?: number; bugKey: string | null; authorId: number }
export interface Exploratory {
  number: number; key: string; charter: string; area: string | null; timeboxMin: number; tester: WorkUser | null; testerId: number | null; cycleId: number | null;
  status: 'PLANNED' | 'RUNNING' | 'DONE'; startedAt: string | null; endedAt: string | null; summary: string | null; elapsedMin: number; overTime: boolean;
  notes: ExploreNote[]; counts: Record<string, number>; bugs: number; createdAt: string;
}

export const q6Api = {
  // Review
  checklists: (pid: number, lang: 'vi' | 'en') => d<Checklist[]>(api.get(`${P(pid)}/review-checklists`, { params: { lang } })),
  reviews: (pid: number) => d<ReviewRow[]>(api.get(`${P(pid)}/reviews`)),
  review: (pid: number, n: number) => d<Review>(api.get(`${P(pid)}/reviews/${n}`)),
  createReview: (pid: number, body: ReviewCreate) => d<Review>(api.post(`${P(pid)}/reviews`, body)),
  updateReview: (pid: number, n: number, body: Partial<Pick<Review, 'title' | 'method' | 'workProduct' | 'prUrl' | 'size' | 'meetingAt' | 'meetingMinutes' | 'reworkMinutes' | 'entryCriteria' | 'exitCriteria' | 'notes' | 'decision'>>) =>
    d<Review>(api.patch(`${P(pid)}/reviews/${n}`, body)),
  deleteReview: (pid: number, n: number) => d<{ ok: true }>(api.delete(`${P(pid)}/reviews/${n}`)),
  participants: (pid: number, n: number, items: Array<{ userId: number; role: ReviewRole; prepMinutes?: number | null }>) => d<Review>(api.put(`${P(pid)}/reviews/${n}/participants`, { items })),
  saveItems: (pid: number, n: number, body: { items?: Array<{ id: number; result?: ItemResult | null; line?: string | null; note?: string | null; severity?: Severity | null }>; add?: Array<{ section: string; question: string }> }) =>
    d<Review>(api.put(`${P(pid)}/reviews/${n}/items`, body)),
  transition: (pid: number, n: number, to: ReviewStatus) => d<Review>(api.post(`${P(pid)}/reviews/${n}/transition`, { to })),
  logDefect: (pid: number, n: number, itemId: number, body: { severity?: Severity | null } = {}) =>
    d<{ created: boolean; number: number; key: string; title: string }>(api.post(`${P(pid)}/reviews/${n}/items/${itemId}/defect`, body)),
  exportReview: (pid: number, n: number, format: 'docx' | 'pdf', lang: 'vi' | 'en') => download(`${P(pid)}/reviews/${n}/export`, { format, lang }, `REV-${n}.${format}`),
  // Baseline
  baselines: (pid: number) => d<Baseline[]>(api.get(`${P(pid)}/baselines`)),
  baseline: (pid: number, n: number) => d<Baseline>(api.get(`${P(pid)}/baselines/${n}`)),
  createBaseline: (pid: number, body: { name: string; description?: string | null; scope: Baseline['scope']; approverIds?: number[] }) => d<Baseline>(api.post(`${P(pid)}/baselines`, body)),
  requestSignoff: (pid: number, n: number, approverIds: number[]) => d<Baseline>(api.post(`${P(pid)}/baselines/${n}/request-signoff`, { approverIds })),
  sign: (pid: number, n: number, decision: 'APPROVE' | 'REJECT', comment?: string) => d<Baseline>(api.post(`${P(pid)}/baselines/${n}/sign`, { decision, comment })),
  compare: (pid: number, n: number, against: 'current' | number) => d<BaselineDiff>(api.get(`${P(pid)}/baselines/${n}/compare`, { params: { against } })),
  locked: (pid: number) => d<{ baseline: { number: number; key: string; name: string } | null; refs: string[] }>(api.get(`${P(pid)}/baselines-locked`)),
  volatility: (pid: number) => d<Array<{ key: string; name: string; approvedAt: string | null; items: number; added: number | null; removed: number | null; changed: number | null; volatility: number | null }>>(api.get(`${P(pid)}/requirements-volatility`)),
  crImpact: (pid: number, cr: number) => d<CrImpact>(api.get(`${P(pid)}/changes/${cr}/impact`)),
  setCrAffected: (pid: number, cr: number, items: Array<{ kind: BaselineKind; ref: string }>) => d<CrImpact>(api.put(`${P(pid)}/changes/${cr}/affected`, { items })),
  // Test design
  preview: (pid: number, technique: Technique, input: unknown) => d<DesignResult>(api.post(`${P(pid)}/test-designs/preview`, { technique, input })),
  designs: (pid: number) => d<TestDesign[]>(api.get(`${P(pid)}/test-designs`)),
  design: (pid: number, n: number) => d<TestDesign>(api.get(`${P(pid)}/test-designs/${n}`)),
  saveDesign: (pid: number, body: { number?: number | null; name: string; technique: Technique; requirementKey?: string | null; input: unknown }) => d<TestDesign>(api.post(`${P(pid)}/test-designs`, body)),
  deleteDesign: (pid: number, n: number) => d<{ ok: true }>(api.delete(`${P(pid)}/test-designs/${n}`)),
  exportDesign: (pid: number, n: number, body: { target: 'XRAY' | 'UNIT'; caseIds?: string[]; level?: string | null; testType?: string | null; moduleName?: string | null; methodName?: string | null }) =>
    d<{ target: string; numbers?: number[]; keys?: string[]; failed?: Array<{ id: string; error: string }>; functionId?: number; cases?: number }>(api.post(`${P(pid)}/test-designs/${n}/export`, body)),
  // Monitoring
  attributes: (pid: number) => d<Array<{ number: number; title: string; level: string | null; testType: string | null; technique: string | null; estimateMin: number | null }>>(api.get(`${P(pid)}/tests-attributes`)),
  setAttributes: (pid: number, body: { numbers: number[]; level?: string | null; testType?: string | null; technique?: string | null; estimateMin?: number | null }) => d<{ updated: number }>(api.patch(`${P(pid)}/tests-attributes`, body)),
  planSettings: (pid: number, planId: number) => d<{ id: number; name: string; settings: PlanSettings }>(api.get(`${P(pid)}/test-plans/${planId}/settings`)),
  savePlanSettings: (pid: number, planId: number, body: Partial<Omit<PlanSettings, 'criteria' | 'estimation'>> & { criteria?: Partial<Criteria>; estimation?: Partial<Estimation> }) =>
    d<{ id: number; name: string; settings: PlanSettings }>(api.put(`${P(pid)}/test-plans/${planId}/settings`, body)),
  quality: (pid: number, planId?: number | null) => d<QualityDashboard>(api.get(`${P(pid)}/test-quality`, { params: planId ? { planId } : {} })),
  risks: (pid: number) => d<RiskMatrix>(api.get(`${P(pid)}/test-risks`)),
  saveRisk: (pid: number, body: { number?: number | null; title?: string; likelihood?: number | null; impact?: number | null; riskKind?: 'PRODUCT' | 'PROJECT' | null; mitigation?: string | null; issueNumbers?: number[] }) =>
    d<RiskMatrix>(api.post(`${P(pid)}/test-risks`, body)),
  defects: (pid: number) => d<DefectRowQ[]>(api.get(`${P(pid)}/test-defects`)),
  setDefect: (pid: number, num: number, body: Partial<Pick<DefectRowQ, 'rootCause' | 'injectedPhase' | 'detectedByTool' | 'testLevel' | 'fixNote'>>) => d<DefectRowQ[]>(api.put(`${P(pid)}/test-defects/${num}`, body)),
  exportDefects: (pid: number, format: 'docx' | 'pdf', lang: 'vi' | 'en') => download(`${P(pid)}/test-defects-report`, { format, lang }, `defects.${format}`),
  tsr: (pid: number, planId: number | null, lang: 'vi' | 'en') => d<{ markdown: string; exitMet: boolean }>(api.get(`${P(pid)}/test-summary-report`, { params: { ...(planId ? { planId } : {}), lang, format: 'md' } })),
  exportTsr: (pid: number, planId: number | null, format: 'docx' | 'pdf', lang: 'vi' | 'en') => download(`${P(pid)}/test-summary-report`, { ...(planId ? { planId } : {}), format, lang }, `TSR.${format}`),
  // Exploratory
  exploratory: (pid: number) => d<Exploratory[]>(api.get(`${P(pid)}/exploratory`)),
  saveExploratory: (pid: number, body: { number?: number; charter?: string; area?: string | null; timeboxMin?: number; testerId?: number | null; cycleId?: number | null; summary?: string | null }) =>
    body.number ? d<Exploratory>(api.patch(`${P(pid)}/exploratory/${body.number}`, { ...body, number: undefined })) : d<Exploratory>(api.post(`${P(pid)}/exploratory`, body)),
  exploreAction: (pid: number, n: number, action: 'start' | 'stop') => d<Exploratory>(api.post(`${P(pid)}/exploratory/${n}/${action}`, {})),
  exploreNote: (pid: number, n: number, body: { kind: ExploreNote['kind']; text: string; logBug?: boolean; severity?: Severity | null }) => d<Exploratory>(api.post(`${P(pid)}/exploratory/${n}/notes`, body)),
  deleteExploratory: (pid: number, n: number) => d<{ ok: true }>(api.delete(`${P(pid)}/exploratory/${n}`)),
};
