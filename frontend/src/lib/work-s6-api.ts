/**
 * CT Work — đợt S6: Spec Fidelity (chấm đặc tả 4 chiều) + nguồn gốc AI. Backend: src/routes/work.s6.routes.ts +
 * services/work/{specReview.service,specFidelity,provenance}.ts. Tách khỏi work-api.ts để không giẫm phiên khác;
 * kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { WorkApproval, WorkStage } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type SpecDimension = 'completeness' | 'consistency' | 'unambiguity' | 'verifiability';
export const SPEC_DIMENSIONS: SpecDimension[] = ['completeness', 'consistency', 'unambiguity', 'verifiability'];
export type SpecSeverity = 'high' | 'medium' | 'low';

export interface SpecTarget { kind: 'PAGE' | 'ISSUE'; pageNumber?: number; blockIndex?: number; issueNumber?: number }
export interface SpecPerson { id: number; username: string; name: string }

export interface SpecFinding {
  id: string;
  dimension: SpecDimension;
  severity: SpecSeverity;
  rule: string;
  ref: string;
  excerpt: string;
  why: string;
  suggestion: string;
  rewrite: string | null;
  target: SpecTarget | null;
  source: 'rule' | 'ai';
  status: 'open' | 'applied' | 'dismissed';
  appliedAt?: string;
  appliedBy?: SpecPerson | null;
}

export interface SpecUntraced { ref: string; title: string; hasAcceptanceCriteria: boolean; target: SpecTarget | null }

export interface SpecScores { overall: number; completeness: number; consistency: number; unambiguity: number; verifiability: number }

export interface SpecReviewSummary extends SpecScores {
  id: number;
  scope: 'PAGE' | 'ISSUES';
  pageId: number | null;
  pageVersion: number | null;
  stageId: number | null;
  epicNumber: number | null;
  scopeLabel: string;
  itemCount: number;
  semantic: 'OK' | 'UNAVAILABLE' | 'SKIPPED';
  model: string | null;
  createdAt: string;
  createdBy: SpecPerson | null;
  page: { number: number; title: string } | null;
}

export interface SpecReview extends SpecReviewSummary {
  findings: SpecFinding[];
  untraced: SpecUntraced[];
  stats: {
    items: number; withAcceptanceCriteria: number; withTests: number; measurable: number; acPct: number; testPct: number;
    verifiabilityRules: number; testingEnabled: boolean; semanticReason?: string;
  };
  currentPageVersion: number | null;
  stale: boolean;
}

export interface SpecGateConfig { enabled: boolean; stageIds: number[]; minOverall: number; minDimension: number }
export interface SpecSettings {
  specGate: SpecGateConfig;
  aiReview: { requireIndependentReviewer: boolean };
  stagesOn: boolean;
  approvalsOn: boolean;
  stages: Array<{ id: number; n: number; slug: string; name: string }>;
  defaultStageSlug: string;
  canConfigure: boolean;
}

export interface SpecGateStatus {
  applies: boolean;
  config: SpecGateConfig;
  review: { id: number; scope: string; scopeLabel: string; createdAt: string; scores: SpecScores; stale: boolean } | null;
  pass: boolean;
  reasons: string[];
}

/** Trường nguồn gốc AI mà server trả thêm trên thẻ/trang (work-api.ts chưa khai — đọc qua kiểu này). */
export interface AiProvenance { aiAssisted?: boolean; aiModel?: string | null; aiAssistedAt?: string | null; aiAppliedById?: number | null }

export const workS6Keys = {
  reviews: (pid: number, q: Record<string, unknown> = {}) => ['work', 'spec-reviews', pid, q] as const,
  allReviews: (pid: number) => ['work', 'spec-reviews', pid] as const,
  review: (pid: number, id: number) => ['work', 'spec-review', pid, id] as const,
  settings: (pid: number) => ['work', 'spec-settings', pid] as const,
  gate: (pid: number, sid: number) => ['work', 'spec-gate', pid, sid] as const,
};

export const workS6Api = {
  reviewPage: (pid: number, num: number, body: { semantic?: boolean } = {}) =>
    d<SpecReview>(api.post(`${B}/projects/${pid}/spec-reviews/page/${num}`, body, { timeout: 120_000 })),
  reviewIssues: (pid: number, body: { epicNumber?: number | null; stageId?: number | null; semantic?: boolean } = {}) =>
    d<SpecReview>(api.post(`${B}/projects/${pid}/spec-reviews/issues`, body, { timeout: 120_000 })),
  reviews: (pid: number, q: { page?: number; scope?: 'PAGE' | 'ISSUES'; stage?: number; epic?: number; limit?: number } = {}) =>
    d<{ items: SpecReviewSummary[] }>(api.get(`${B}/projects/${pid}/spec-reviews`, { params: q })),
  review: (pid: number, id: number) => d<SpecReview>(api.get(`${B}/projects/${pid}/spec-reviews/${id}`)),
  apply: (pid: number, id: number, fid: string, rewrite?: string | null) =>
    d<SpecReview>(api.post(`${B}/projects/${pid}/spec-reviews/${id}/findings/${fid}/apply`, rewrite ? { rewrite } : {})),
  dismiss: (pid: number, id: number, fid: string, dismissed: boolean) =>
    d<SpecReview>(api.post(`${B}/projects/${pid}/spec-reviews/${id}/findings/${fid}/dismiss`, { dismissed })),
  settings: (pid: number) => d<SpecSettings>(api.get(`${B}/projects/${pid}/spec-settings`)),
  updateSettings: (pid: number, body: { specGate?: Partial<SpecGateConfig>; aiReview?: { requireIndependentReviewer: boolean } }) =>
    d<SpecSettings>(api.put(`${B}/projects/${pid}/spec-settings`, body)),
  gate: (pid: number, sid: number) => d<SpecGateStatus>(api.get(`${B}/projects/${pid}/stages/${sid}/spec-gate`)),
  /** Như workStudioApi.requestGate + `override` (ADMIN vượt cổng Spec Fidelity, bắt buộc lý do). */
  requestGate: (pid: number, sid: number, body: { description?: string | null; dueAt?: string | null; override?: { reason: string } | null }) =>
    d<{ stage: WorkStage; approval: WorkApproval & { specReview?: (SpecScores & { id: number; scopeLabel: string }) | null } }>(api.post(`${B}/projects/${pid}/stages/${sid}/request-gate`, body)),
  /** Gắn / gỡ nhãn AI-assisted bằng tay. */
  markIssue: (pid: number, num: number, aiAssisted: boolean, version?: number) =>
    d<unknown>(api.patch(`${B}/projects/${pid}/issues/${num}`, { aiAssisted, ...(version !== undefined ? { version } : {}) })),
  markPage: (pid: number, num: number, aiAssisted: boolean) => d<unknown>(api.patch(`${B}/projects/${pid}/pages/${num}`, { aiAssisted })),
};

/** Lỗi 409 WORK_SPEC_GATE ⇒ trạng thái cổng kèm theo. */
export function specGateError(err: unknown): SpecGateStatus | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; data?: { specGate?: SpecGateStatus } } } })?.response;
  return r?.status === 409 && r.data?.code === 'WORK_SPEC_GATE' ? (r.data.data?.specGate ?? null) : null;
}

export const DIMENSION_INFO: Record<SpecDimension, { label: string; short: string; body: string }> = {
  completeness: { label: 'Completeness', short: 'Complete', body: 'Everything needed is there: sections, edge cases, failure modes, no TBD.' },
  consistency: { label: 'Consistency', short: 'Consistent', body: 'No duplicates, no contradictions, every ID defined once.' },
  unambiguity: { label: 'Unambiguity', short: 'Unambiguous', body: 'Each requirement has one reading — no "fast", "user-friendly", "etc".' },
  verifiability: { label: 'Verifiability', short: 'Verifiable', body: 'Each requirement has a pass/fail criterion and a linked test.' },
};
