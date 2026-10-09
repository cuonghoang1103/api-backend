/**
 * CT Work — CTW đợt 4 (09/10/2026): client cho SRS có cấu trúc (actor/UC/BR/màn/phân quyền/Non-UI), RTM, defect log,
 * Q&A log, Report 3/Report 7 và giờ theo Activity. Backend: src/routes/work.ctw4.routes.ts. Tách khỏi work-api.ts để
 * không giẫm phiên khác; kiểu ở đây phải khớp service (srs.service / rtm.service / defects / qna / finalReport / timeActivity).
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkPageDetail } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

// ─── SRS ─────────────────────────────────────────────────────────

export type UcStatus = 'PROPOSED' | 'DRAFT' | 'APPROVED';
export type UcPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export interface SrsActor { id: number; name: string; description: string | null; kind: 'PERSON' | 'SYSTEM' | string; position: number }
export interface SrsUseCase {
  id: number; number: number; key: string; name: string; feature: string | null; description: string | null; trigger: string | null;
  preconditions: string | null; postconditions: string | null; normalFlow: string | null; alternativeFlows: string | null; exceptionFlows: string | null;
  priority: UcPriority; status: UcStatus; primaryActorId: number | null; secondaryActorIds: number[]; ruleNumbers: number[];
  section: string | null; missing: string[]; version: number; aiModel: string | null; updatedAt: string | null;
  issue: { number: number; key: string; title: string; type: { key: string }; status: { name: string; category: string } } | null;
}
export interface SrsRule { id: number; number: number; key: string; name: string; definition: string | null; category: string | null; status: UcStatus; usedIn: string[] }
export interface SrsScreen { id: number; name: string; feature: string | null; description: string | null; position: number }
export interface SrsLink { fromId: number; toId: number; label: string | null }
export interface SrsFunction { id: number; feature: string | null; name: string; description: string | null; position: number }
export interface SrsData {
  key: string; actors: SrsActor[]; useCases: SrsUseCase[]; rules: SrsRule[]; screens: SrsScreen[]; links: SrsLink[];
  auth: Array<[number, number]>; functions: SrsFunction[]; report3Page: { number: number; title: string } | null;
  canEdit: boolean; canApprove: boolean;
  counts: { useCases: number; proposed: number; approved: number; rules: number; screens: number };
}
export interface UseCaseInput {
  name: string; feature?: string | null; primaryActorId?: number | null; secondaryActorIds?: number[]; trigger?: string | null;
  description?: string | null; preconditions?: string | null; postconditions?: string | null; normalFlow?: string | null;
  alternativeFlows?: string | null; exceptionFlows?: string | null; priority?: UcPriority; issueNumber?: number | null; ruleNumbers?: number[];
}
export type SrsFillSection = 'actors' | 'useCases' | 'screensFlow' | 'screenAuthorization' | 'nonUi' | 'ucSpecs' | 'businessRules';
export const SRS_SECTION_LABEL: Record<SrsFillSection, string> = {
  actors: 'Actors', useCases: 'Use Cases (UC)', screensFlow: 'Screens Flow', screenAuthorization: 'Screen Authorization',
  nonUi: 'Non-UI Functions', ucSpecs: 'Use Case Specifications', businessRules: 'Business Rules',
};

// ─── RTM ─────────────────────────────────────────────────────────

export type GapCode = 'UC_INCOMPLETE' | 'NO_ISSUE' | 'NO_SRS' | 'NO_SDS' | 'NO_CODE' | 'NO_TEST' | 'NOT_RUN' | 'FAILING' | 'OPEN_BUGS' | 'NO_SEQUENCE';
export const GAP_CODES: GapCode[] = ['UC_INCOMPLETE', 'NO_ISSUE', 'NO_SRS', 'NO_SDS', 'NO_CODE', 'NO_TEST', 'NOT_RUN', 'FAILING', 'OPEN_BUGS', 'NO_SEQUENCE'];
export const RTM_STATUSES = ['Planned', 'Analyzed', 'Designed', 'Coded', 'Tested'] as const;
export interface TestSet { name: string; ref?: string; cases: number; passed: number; failed: number; notRun: number }
export interface RtmRow {
  reqId: string; kind: 'UC' | 'REQ'; ucNumber: number | null; issueNumber: number | null; issueKey: string | null;
  requirement: string; feature: string; rules: string[]; srs: string[]; screens: string[]; sds: string[];
  code: { commits: number; prs: number; branches: number; latest: { title: string; url: string } | null };
  classMethod: string[]; unit: TestSet[]; integration: TestSet[]; system: TestSet[];
  xray: Array<{ key: string; title: string; last: string | null }>;
  bugs: Array<{ key: string; title: string; open: boolean; severity: string | null }>;
  iteration: string; issueDone: boolean; ucMissing: string[]; status: (typeof RTM_STATUSES)[number]; gaps: GapCode[];
}
export interface RtmData {
  rows: RtmRow[];
  summary: { rows: number; useCases: number; requirements: number; withTests: number; testedPct: number; passing: number; withGaps: number; gaps: Record<GapCode, number> };
  rules: Array<{ key: string; name: string; usedIn: string[]; unit: string[]; integration: string[]; system: string[]; covered: boolean }>;
  orphans: Array<{ kind: 'XRAY' | 'UNIT' | 'IT' | 'ST'; ref: string; name: string }>;
  gapLabels: Record<GapCode, string>;
}
export type TraceTargetKind = 'SRS' | 'SDS' | 'UNIT' | 'IT' | 'ST' | 'CODE';
export interface TraceLinkInput {
  source: { kind: 'UC' | 'ISSUE' | 'BR'; ref: number | string };
  target: { kind: TraceTargetKind; pageNumber?: number; heading?: string; targetId?: number; ref?: string };
}
export interface TraceLink { id: number; sourceKind: string; sourceId: number; targetKind: TraceTargetKind; targetId: number | null; pageNumber: number | null; heading: string | null; ref: string | null }

// ─── Defect · Q&A · giờ · Report 7 ───────────────────────────────

export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL';
export const SEVERITY_LABEL: Record<Severity, string> = { CRITICAL: 'Critical', MAJOR: 'Major', MINOR: 'Minor', TRIVIAL: 'Trivial' };
export interface DefectInfo {
  isBug: boolean; severity: Severity | null; activity: string | null; product: string | null; productDetails: string | null;
  source: { reviewId: number; findingId: string } | null;
  options: { severities: Severity[]; activities: string[]; products: string[] };
}
export interface QuestionView {
  number: number; key: string; legacy: boolean; question: string; details: string | null; askedOn: string; askedBy: string | null; askedTo: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; priorityText: string; due: string | null; status: string; statusText: 'Open' | 'Closed' | 'Cancelled';
  answer: string | null; answeredAt: string | null; version: number; overdue: boolean;
}
export interface QuestionInput {
  question?: string; details?: string | null; askedOn?: string; askedBy?: string | null; askedTo?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'; due?: string | null; status?: 'OPEN' | 'ANSWERED' | 'CANCELLED'; answer?: string | null; version?: number;
}
export const TL_ACTIVITIES = ['Training', 'Analyzing', 'Designing', 'Coding', 'Testing', 'Deploying'] as const;
export const WORK_PRODUCTS = ['Software Package', 'Report1 (Intro)', 'Report2 (Plan)', 'Report3 (SRS)', 'Report4 (SDS)', 'Report5 (Test)', 'Report6 (Guides)', 'Report7 (Final)'] as const;

const fileOf = (res: { headers: Record<string, unknown>; data: unknown }, fallback: string) => {
  const cd = String(res.headers['content-disposition'] ?? '');
  const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
  return { blob: res.data as Blob, fileName: star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? fallback };
};

export const workCtw4Keys = {
  srs: (pid: number) => ['work', 'ctw4', pid, 'srs'] as const,
  rtm: (pid: number) => ['work', 'ctw4', pid, 'rtm'] as const,
  defect: (pid: number, num: number) => ['work', 'ctw4', pid, 'defect', num] as const,
  qna: (pid: number) => ['work', 'ctw4', pid, 'qna'] as const,
  timeByActivity: (pid: number) => ['work', 'ctw4', pid, 'time-by-activity'] as const,
  worklogDefaults: (pid: number, num: number) => ['work', 'ctw4', pid, 'worklog-defaults', num] as const,
};

export const workCtw4Api = {
  // SRS
  srs: (pid: number) => d<SrsData>(api.get(`${B}/${pid}/srs`)),
  createActor: (pid: number, body: { name: string; description?: string | null; kind?: 'PERSON' | 'SYSTEM' }) => d<SrsActor>(api.post(`${B}/${pid}/srs/actors`, body)),
  updateActor: (pid: number, id: number, body: Partial<{ name: string; description: string | null; kind: 'PERSON' | 'SYSTEM'; position: number }>) => d<SrsActor>(api.patch(`${B}/${pid}/srs/actors/${id}`, body)),
  deleteActor: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/actors/${id}`)),
  createUseCase: (pid: number, body: UseCaseInput) => d<SrsUseCase>(api.post(`${B}/${pid}/srs/use-cases`, body)),
  updateUseCase: (pid: number, n: number, body: Partial<UseCaseInput> & { version?: number }) => d<SrsUseCase>(api.patch(`${B}/${pid}/srs/use-cases/${n}`, body)),
  deleteUseCase: (pid: number, n: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/use-cases/${n}`)),
  setUseCaseStatus: (pid: number, n: number, status: 'DRAFT' | 'APPROVED') => d<SrsUseCase>(api.post(`${B}/${pid}/srs/use-cases/${n}/status`, { status })),
  createRule: (pid: number, body: { name: string; definition?: string | null; category?: string | null }) => d<SrsRule>(api.post(`${B}/${pid}/srs/rules`, body)),
  updateRule: (pid: number, n: number, body: Partial<{ name: string; definition: string | null; category: string | null; status: UcStatus }>) => d<SrsRule>(api.patch(`${B}/${pid}/srs/rules/${n}`, body)),
  deleteRule: (pid: number, n: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/rules/${n}`)),
  createScreen: (pid: number, body: { name: string; feature?: string | null; description?: string | null; issueNumber?: number | null; linksTo?: Array<{ screenId: number; label?: string | null }>; actorIds?: number[] }) => d<SrsScreen>(api.post(`${B}/${pid}/srs/screens`, body)),
  updateScreen: (pid: number, id: number, body: Partial<{ name: string; feature: string | null; description: string | null; position: number; issueNumber: number | null; linksTo: Array<{ screenId: number; label?: string | null }>; actorIds: number[] }>) => d<SrsScreen>(api.patch(`${B}/${pid}/srs/screens/${id}`, body)),
  deleteScreen: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/screens/${id}`)),
  setScreenAuth: (pid: number, body: { screenId: number; actorId: number; allowed: boolean }) => d<{ screenId: number; actorId: number; allowed: boolean }>(api.put(`${B}/${pid}/srs/screen-auth`, body)),
  createFunction: (pid: number, body: { feature?: string | null; name: string; description?: string | null; issueNumber?: number | null }) => d<SrsFunction>(api.post(`${B}/${pid}/srs/functions`, body)),
  updateFunction: (pid: number, id: number, body: Partial<{ feature: string | null; name: string; description: string | null; issueNumber: number | null }>) => d<SrsFunction>(api.patch(`${B}/${pid}/srs/functions/${id}`, body)),
  deleteFunction: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/functions/${id}`)),
  suggest: (pid: number, issueNumber: number) => d<{ created: Array<{ key: string; name: string }>; actorsAdded: string[]; rulesAdded: string[] }>(api.post(`${B}/${pid}/srs/suggest`, { issueNumber }, { timeout: 180_000 })),
  discardProposals: (pid: number) => d<{ useCases: number; rules: number }>(api.post(`${B}/${pid}/srs/proposals/discard`)),
  fillReport3: (pid: number, num: number, body: { version?: number; sections?: SrsFillSection[] } = {}) => d<{ filled: SrsFillSection[]; page: WorkPageDetail }>(api.post(`${B}/${pid}/pages/${num}/fill-srs`, body)),
  report3Doc: (pid: number) => d<{ doc: TiptapDoc; title: string; filled: SrsFillSection[]; page: { number: number; title: string } | null }>(api.get(`${B}/${pid}/srs/report3`)),
  exportReport3: async (pid: number, format: 'docx' | 'pdf', diagrams: Array<string | null>) =>
    fileOf(await api.post(`${B}/${pid}/srs/report3/export`, { format, diagrams }, { responseType: 'blob', timeout: 180_000 }), `Report3.${format}`),
  // RTM
  rtm: (pid: number) => d<RtmData>(api.get(`${B}/${pid}/rtm`)),
  exportRtm: async (pid: number) => fileOf(await api.get(`${B}/${pid}/rtm/export.xlsx`, { responseType: 'blob', timeout: 120_000 }), 'RTM.xlsx'),
  traceLinks: (pid: number, source?: { kind: 'UC' | 'ISSUE' | 'BR'; ref: string }) => d<TraceLink[]>(api.get(`${B}/${pid}/trace-links`, { params: source ? { kind: source.kind, ref: source.ref } : {} })),
  addTraceLink: (pid: number, body: TraceLinkInput) => d<TraceLink>(api.post(`${B}/${pid}/trace-links`, body)),
  removeTraceLink: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/trace-links/${id}`)),
  // Defect log
  defect: (pid: number, num: number) => d<DefectInfo>(api.get(`${B}/${pid}/issues/${num}/defect`)),
  setDefect: (pid: number, num: number, body: Partial<{ severity: Severity | null; activity: string | null; product: string | null; productDetails: string | null }>) => d<DefectInfo>(api.put(`${B}/${pid}/issues/${num}/defect`, body)),
  bugFromFinding: (pid: number, reviewId: number, findingId: string) => d<{ created: boolean; number: number; key: string; title: string }>(api.post(`${B}/${pid}/spec-reviews/${reviewId}/findings/${findingId}/bug`)),
  // Q&A
  qna: (pid: number, status: 'open' | 'closed' | 'all' = 'all') => d<{ items: QuestionView[]; counts: { total: number; open: number; overdue: number; legacy: number }; canEdit: boolean; canAnswer: boolean }>(api.get(`${B}/${pid}/qna`, { params: { status } })),
  createQuestion: (pid: number, body: QuestionInput & { question: string }) => d<QuestionView>(api.post(`${B}/${pid}/qna`, body)),
  updateQuestion: (pid: number, n: number, body: QuestionInput) => d<QuestionView>(api.patch(`${B}/${pid}/qna/${n}`, body)),
  deleteQuestion: (pid: number, n: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/qna/${n}`)),
  convertQuestion: (pid: number, n: number) => d<QuestionView>(api.post(`${B}/${pid}/qna/${n}/convert`)),
  // Report 7
  finalDoc: (pid: number) => d<{ doc: TiptapDoc; merged: number[]; missing: number[]; title: string }>(api.get(`${B}/${pid}/final-report`)),
  assembleFinal: (pid: number, version?: number) => d<{ merged: number[]; missing: number[]; changed: boolean; page: WorkPageDetail }>(api.post(`${B}/${pid}/final-report/assemble`, version !== undefined ? { version } : {})),
  exportFinal: async (pid: number, format: 'docx' | 'pdf', diagrams: Array<string | null>) =>
    fileOf(await api.post(`${B}/${pid}/final-report/export`, { format, diagrams }, { responseType: 'blob', timeout: 180_000 }), `Report7.${format}`),
  // Giờ theo activity
  worklogDefaults: (pid: number, num: number) => d<{ activity: string; workProduct: string; activities: string[]; products: string[] }>(api.get(`${B}/${pid}/issues/${num}/worklog-defaults`)),
  setWorklogMeta: (pid: number, num: number, logId: number, body: { activity?: string | null; workProduct?: string | null }) => d<{ id: number; activity: string | null; workProduct: string | null }>(api.patch(`${B}/${pid}/issues/${num}/worklogs/${logId}`, body)),
  timeByActivity: (pid: number, q: { from?: string; to?: string } = {}) => d<{ activities: string[]; total: number; guessedHours: number; byActivity: Array<{ activity: string; hours: number }>; byPerson: Array<{ person: string; hours: Record<string, number> }> }>(api.get(`${B}/${pid}/reports/time-by-activity`, { params: q })),
};
