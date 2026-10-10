/**
 * CT Work — CTW đợt 6b (11/10/2026): client cho SRS chuyên sâu (SWR-3) + elicitation & stakeholder (SWR-4). Backend:
 * src/routes/work.ctw6b.routes.ts — kiểu ở đây phải khớp swrElic.service.ts + srsDeep.service.ts. Tách khỏi work-api.ts để
 * không giẫm phiên khác.
 */

import { api } from '@/lib/api';
import type { Lifecycle, ReqType } from '@/lib/work-swr-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';
const fileOf = (res: { headers: Record<string, unknown>; data: unknown }, fallback: string) => {
  const cd = String(res.headers['content-disposition'] ?? '');
  const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
  return { blob: res.data as Blob, fileName: star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? fallback };
};

// ─── Stakeholder + RACI ──────────────────────────────────────────

export const ATTITUDES = ['CHAMPION', 'SUPPORTER', 'NEUTRAL', 'CRITIC', 'BLOCKER'] as const;
export type Attitude = (typeof ATTITUDES)[number];
export const STAKEHOLDER_KINDS = ['PERSON', 'GROUP', 'ORG'] as const;
export type Quadrant = 'MANAGE_CLOSELY' | 'KEEP_SATISFIED' | 'KEEP_INFORMED' | 'MONITOR';
export const QUADRANTS: Quadrant[] = ['KEEP_SATISFIED', 'MANAGE_CLOSELY', 'MONITOR', 'KEEP_INFORMED'];

export interface Stakeholder {
  id: number; number: number; key: string; name: string; role: string | null; organization: string | null; kind: string; userClass: string | null;
  influence: number; interest: number; attitude: Attitude | null; isChampion: boolean; decisionRights: string | null; majorValue: string | null;
  interests: string | null; constraints: string | null; contact: string | null; notes: string | null; actorId: number | null; userId: number | null;
  position: number; rev: number; quadrant: Quadrant; sessions: string[]; requirements: number;
}
export interface StakeholderList {
  stakeholders: Stakeholder[]; grid: Record<Quadrant, string[]>; warnings: Array<{ code: string; params?: Record<string, string | number> }>;
  actors: Array<{ id: number; name: string; kind: string }>; members: Array<{ id: number; name: string }>; canEdit: boolean; canConfigure: boolean;
}
export type StakeholderBody = Partial<Pick<Stakeholder, 'name' | 'role' | 'organization' | 'kind' | 'userClass' | 'influence' | 'interest' | 'attitude' | 'isChampion' | 'decisionRights' | 'majorValue' | 'interests' | 'constraints' | 'contact' | 'notes' | 'actorId' | 'userId'>> & { rev?: number };
export type RaciRole = 'R' | 'A' | 'C' | 'I';
export interface Raci {
  activities: Array<{ id: number; name: string; position: number }>; stakeholders: Array<{ id: number; key: string; name: string; role: string | null }>;
  cells: Array<{ activityId: number; stakeholderId: number; role: RaciRole }>; problems: Array<{ activity: string; code: 'NO_A' | 'MANY_A' | 'NO_R'; count: number }>;
  defaults: string[]; canEdit: boolean;
}

// ─── Phiên elicitation ───────────────────────────────────────────

export const TECHNIQUES = ['INTERVIEW', 'WORKSHOP', 'SURVEY', 'OBSERVATION', 'DOCUMENT_ANALYSIS', 'PROTOTYPE'] as const;
export type Technique = (typeof TECHNIQUES)[number];
export type SessionStatus = 'PLANNED' | 'DONE' | 'CANCELLED';
export interface SessionQuestion { id: string; text: string; answer: string | null }
export interface SessionRow {
  number: number; key: string; title: string; technique: Technique; status: SessionStatus; scheduledAt: string | null; durationMin: number | null; aiSimulated: boolean;
  meetingId: number | null; surveyId: number | null; participants: Array<{ key: string; name: string; role: string | null; rolePlayed: string | null }>;
  questions: number; answered: number; requirements: number; pending: number;
}
export interface Proposal {
  id: number; title: string; text: string | null; reqType: ReqType; priority: string | null; status: 'PENDING' | 'ACCEPTED' | 'DISMISSED'; model: string | null;
  stakeholder: { key: string; name: string } | null; evidence: Array<{ line: number; quote: string; text?: string }>; issue: string | null;
}
export interface SessionDetail {
  number: number; key: string; title: string; technique: Technique; status: SessionStatus; scheduledAt: string | null; durationMin: number | null; location: string | null;
  objective: string | null; plan: string | null; questions: SessionQuestion[]; notes: string | null; outcome: string | null; aiSimulated: boolean; rev: number;
  meeting: { number: number; title: string; status: string; startsAt: string; recordings: number } | null;
  survey: { number: number; key: string; title: string; status: string; responses: number } | null; sourceText: string;
  participants: Array<{ stakeholderId: number; key: string; name: string; role: string | null; rolePlayed: string | null; userId: number | null }>;
  proposals: Proposal[];
  requirements: Array<{ originId: number; key: string; number: number; title: string; lifecycle: Lifecycle; stakeholder: { key: string; name: string } | null; note: string | null }>;
  questionBank: string[]; canEdit: boolean; canApprove: boolean;
}
export interface SessionBody {
  title?: string; technique?: Technique; status?: SessionStatus; scheduledAt?: string | null; durationMin?: number | null; location?: string | null; objective?: string | null;
  plan?: string | null; questions?: Array<{ id?: string; text: string; answer?: string | null }>; notes?: string | null; outcome?: string | null; aiSimulated?: boolean;
  participants?: Array<{ stakeholder: string | number; rolePlayed?: string | null }>; suggestQuestions?: boolean; rev?: number;
}
export interface TraceRow {
  issueNumber: number; key: string; title: string; lifecycle: Lifecycle; reqType: string | null; source: string | null;
  origins: Array<{ id: number; session: { key: string; title: string; technique: string } | null; stakeholder: { key: string; name: string; role: string | null } | null; note: string | null }>;
}

// ─── Khảo sát ────────────────────────────────────────────────────

export const QUESTION_KINDS = ['TEXT', 'LONG_TEXT', 'SINGLE', 'MULTI', 'SCALE', 'YES_NO'] as const;
export type QuestionKind = (typeof QUESTION_KINDS)[number];
export interface SurveyQuestion { id: string; kind: QuestionKind; text: string; help: string | null; required: boolean; options: string[]; scaleMax: number }
export interface QuestionSummary {
  id: string; kind: QuestionKind; text: string; answered: number; counts?: Array<{ option: string; n: number; pct: number }>;
  average?: number | null; distribution?: number[]; yes?: number; no?: number; texts?: string[];
}
export interface SurveyRow {
  number: number; key: string; title: string; description: string | null; status: 'DRAFT' | 'OPEN' | 'CLOSED'; questions: SurveyQuestion[]; collectName: boolean;
  closesAt: string | null; maxResponses: number | null; responses: number; publicPath: string | null; session: string | null; rev: number; createdAt: string; updatedAt: string;
}
export interface SurveyDetail extends SurveyRow { summary: QuestionSummary[]; recent: Array<{ id: number; at: string; name: string | null; answers: Record<string, unknown> }>; canEdit: boolean; canPublish: boolean }
export interface SurveyBody {
  title?: string; description?: string | null; questions?: Array<Partial<SurveyQuestion> & { kind: QuestionKind; text: string }>; collectName?: boolean;
  closesAt?: string | null; maxResponses?: number | null; session?: string | null; rev?: number;
}
export interface PublicSurvey { title: string; description: string | null; project: string; collectName: boolean; questions: SurveyQuestion[]; closed: string | null }

// ─── Mô hình, prototype, chất lượng, NFR ─────────────────────────

export type ModelKind = 'CONTEXT' | 'DFD1' | 'STATE' | 'ACTIVITY' | 'FEATURE_TREE';
export interface ModelsData {
  kinds: Array<{ kind: ModelKind; label: string; diagramType: string }>;
  models: Array<{ kind: ModelKind; subject: string; diagram: { number: number; key: string; title: string; status: string; currentVersion: number; approvedVersion: number | null; updatedAt: string } }>;
  readiness: Record<'CONTEXT' | 'DFD1' | 'FEATURE_TREE', { ready: boolean; en?: string; vi?: string; fix?: string }>;
  stateCandidates: Array<{ name: string; values: string[] }>; useCases: Array<{ number: number; key: string; name: string }>;
  events: Array<{ ref: string; event: string; type: 'BUSINESS' | 'SIGNAL' | 'TEMPORAL'; state: string; response: string; actor: string | null; typeLabel: string }>;
  canEdit: boolean;
}
export interface Mockup {
  id: number; screenId: number; screen: string; kind: 'IMAGE' | 'LINK'; url: string | null; provider: string | null; title: string | null; image: string | null;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'CHANGES'; reviewerName: string | null; reviewerRole: string | null; reviewNote: string | null; reviewedAt: string | null;
  shared: boolean; reviewPath: string | null; createdAt: string; updatedAt: string;
}
export interface MockupList {
  screens: Array<{ id: number; name: string; feature: string | null; mockups: Mockup[]; approved: boolean }>;
  counts: { screens: number; withPrototype: number; approved: number }; canEdit: boolean; canReview: boolean; canShare: boolean;
}
export interface PublicMockup {
  project: string; screen: string; description: string | null; title: string | null; kind: 'IMAGE' | 'LINK'; url: string | null; provider: string | null;
  image: string | null; status: Mockup['status']; reviewerName: string | null; reviewNote: string | null; reviewedAt: string | null;
}
export const QUALITY_CRITERIA = ['unambiguous', 'complete', 'consistent', 'verifiable', 'feasible', 'necessary', 'prioritized', 'traceable'] as const;
export type QualityCriterion = (typeof QUALITY_CRITERIA)[number];
export interface CriterionResult { key: QualityCriterion; status: 'pass' | 'fail' | 'unchecked'; auto: boolean; reasons: Array<{ code: string; params?: Record<string, string | number> }> }
export interface QualityRow {
  issueId: number; number: number; key: string; title: string; reqType: ReqType | null; lifecycle: Lifecycle; manual: Partial<Record<QualityCriterion, boolean | null>>;
  ai: { rewrite: string; acceptanceCriteria?: string[] | null; metric?: { scale: string; meter: string; unit?: string | null; comparator?: string | null; must?: number | null; plan?: number | null } | null; notes?: string[] | null; at: string } | null;
  aiModel: string | null; criteria: CriterionResult[]; passed: number; total: number; score: number; vague: Array<{ match: string; hint: string; replace: string | null }>;
}
export interface QualityData {
  requirements: QualityRow[]; criteria: QualityCriterion[]; manualCriteria: QualityCriterion[]; byCriterion: Record<QualityCriterion, { pass: number; fail: number; unchecked: number }>;
  average: number | null; canEdit: boolean; canUseAi: boolean;
}
export const ISO_CHARACTERISTICS = ['FUNCTIONAL_SUITABILITY', 'PERFORMANCE_EFFICIENCY', 'COMPATIBILITY', 'INTERACTION_CAPABILITY', 'RELIABILITY', 'SECURITY', 'MAINTAINABILITY', 'FLEXIBILITY', 'SAFETY'] as const;
export type IsoCharacteristic = (typeof ISO_CHARACTERISTICS)[number];
export type Comparator = '<=' | '>=' | '=';
export type Verification = 'TEST' | 'ANALYSIS' | 'INSPECTION' | 'DEMONSTRATION';
export interface NfrSpec {
  characteristic: IsoCharacteristic; subCharacteristic: string | null; scale: string; meter: string; unit: string | null; comparator: Comparator;
  mustValue: number | null; planValue: number | null; wishValue: number | null; conditions: string | null; verification: Verification;
}
export interface NfrTemplate { id: string; characteristic: IsoCharacteristic; sub: string; title: string; scale: string; meter: string; unit: string; comparator: Comparator; must: number; plan: number; conditions: string; verification: Verification }
export interface NfrData {
  requirements: Array<{ number: number; key: string; title: string; text: string; subtype: string | null; priority: string | null; lifecycle: Lifecycle; spec: NfrSpec | null; statement: string | null; suggestedCharacteristic: IsoCharacteristic | null }>;
  characteristics: Array<{ key: IsoCharacteristic; label: string; subs: string[] }>; templates: NfrTemplate[]; comparators: Comparator[]; verifications: Verification[];
  measured: number; canEdit: boolean;
}

export const workSwr6bKeys = {
  all: (pid: number) => ['work', pid, 'swr6b'] as const,
  stakeholders: (pid: number) => ['work', pid, 'swr6b', 'stakeholders'] as const,
  raci: (pid: number) => ['work', pid, 'swr6b', 'raci'] as const,
  sessions: (pid: number) => ['work', pid, 'swr6b', 'sessions'] as const,
  session: (pid: number, n: number) => ['work', pid, 'swr6b', 'session', n] as const,
  trace: (pid: number) => ['work', pid, 'swr6b', 'trace'] as const,
  surveys: (pid: number) => ['work', pid, 'swr6b', 'surveys'] as const,
  survey: (pid: number, n: number) => ['work', pid, 'swr6b', 'survey', n] as const,
  models: (pid: number) => ['work', pid, 'swr6b', 'models'] as const,
  mockups: (pid: number) => ['work', pid, 'swr6b', 'mockups'] as const,
  quality: (pid: number) => ['work', pid, 'swr6b', 'quality'] as const,
  nfr: (pid: number) => ['work', pid, 'swr6b', 'nfr'] as const,
};

const S = (pid: number) => `${B}/${pid}/swr`;

export const workSwr6bApi = {
  stakeholders: (pid: number) => d<StakeholderList>(api.get(`${S(pid)}/stakeholders`)),
  createStakeholder: (pid: number, body: StakeholderBody) => d<Stakeholder>(api.post(`${S(pid)}/stakeholders`, body)),
  updateStakeholder: (pid: number, n: number, body: StakeholderBody) => d<Stakeholder>(api.patch(`${S(pid)}/stakeholders/${n}`, body)),
  deleteStakeholder: (pid: number, n: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/stakeholders/${n}`)),
  seedStakeholders: (pid: number) => d<{ added: number }>(api.post(`${S(pid)}/stakeholders/seed-actors`)),
  raci: (pid: number) => d<Raci>(api.get(`${S(pid)}/raci`)),
  addRaciActivity: (pid: number, body: { name?: string; defaults?: boolean }) => d<{ added: number }>(api.post(`${S(pid)}/raci/activities`, body)),
  deleteRaciActivity: (pid: number, id: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/raci/activities/${id}`)),
  setRaci: (pid: number, body: { activityId: number; stakeholder: number; role: RaciRole | null }) => d<Raci>(api.put(`${S(pid)}/raci/cells`, body)),

  sessions: (pid: number) => d<{ sessions: SessionRow[]; techniques: Technique[]; questionBank: Record<Technique, string[]>; canEdit: boolean; canApprove: boolean }>(api.get(`${S(pid)}/elicitation`)),
  session: (pid: number, n: number) => d<SessionDetail>(api.get(`${S(pid)}/elicitation/${n}`)),
  createSession: (pid: number, body: SessionBody) => d<SessionDetail>(api.post(`${S(pid)}/elicitation`, body)),
  updateSession: (pid: number, n: number, body: SessionBody) => d<SessionDetail>(api.patch(`${S(pid)}/elicitation/${n}`, body)),
  deleteSession: (pid: number, n: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/elicitation/${n}`)),
  linkMeeting: (pid: number, n: number, body: { create?: boolean; meeting?: number | null }) => d<{ meeting: SessionDetail['meeting'] }>(api.post(`${S(pid)}/elicitation/${n}/meeting`, body)),
  propose: (pid: number, n: number, language: 'vi' | 'en') => d<{ added: number; dropped: number; notes: string[]; model: string | null; session: SessionDetail }>(api.post(`${S(pid)}/elicitation/${n}/propose`, { language }, { timeout: 180_000 })),
  addProposal: (pid: number, n: number, body: { title: string; text?: string | null; reqType?: ReqType; priority?: string | null; stakeholder?: number | null }) => d<{ id: number }>(api.post(`${S(pid)}/elicitation/${n}/proposals`, body)),
  decide: (pid: number, n: number, id: number, body: { accept: boolean; title?: string; reqType?: ReqType; priority?: 'HIGH' | 'MEDIUM' | 'LOW' | null; approve?: boolean }) =>
    d<{ status: 'ACCEPTED' | 'DISMISSED'; issue: { number: number; key: string } | null }>(api.post(`${S(pid)}/elicitation/${n}/proposals/${id}/decide`, body)),
  trace: (pid: number) => d<{ rows: TraceRow[]; counts: { requirements: number; traced: number; withSourceText: number }; canEdit: boolean }>(api.get(`${S(pid)}/trace`)),
  addOrigin: (pid: number, body: { issue: number | string; session?: number | string | null; stakeholder?: number | string | null; note?: string | null }) => d<{ id: number }>(api.post(`${S(pid)}/origins`, body)),
  removeOrigin: (pid: number, id: number) => d<{ removed: true }>(api.delete(`${S(pid)}/origins/${id}`)),
  exportReport: async (pid: number, format: 'docx' | 'pdf') => fileOf(await api.get(`${S(pid)}/elicitation-report.${format}`, { responseType: 'blob', timeout: 180_000 }), `elicitation.${format}`),

  surveys: (pid: number) => d<{ surveys: SurveyRow[]; canEdit: boolean; canPublish: boolean }>(api.get(`${S(pid)}/surveys`)),
  survey: (pid: number, n: number) => d<SurveyDetail>(api.get(`${S(pid)}/surveys/${n}`)),
  createSurvey: (pid: number, body: SurveyBody) => d<SurveyRow>(api.post(`${S(pid)}/surveys`, body)),
  updateSurvey: (pid: number, n: number, body: SurveyBody) => d<SurveyDetail>(api.patch(`${S(pid)}/surveys/${n}`, body)),
  deleteSurvey: (pid: number, n: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/surveys/${n}`)),
  surveyStatus: (pid: number, n: number, status: 'DRAFT' | 'OPEN' | 'CLOSED') => d<SurveyDetail>(api.post(`${S(pid)}/surveys/${n}/status`, { status })),
  rotateSurvey: (pid: number, n: number) => d<SurveyDetail>(api.post(`${S(pid)}/surveys/${n}/rotate`)),
  exportSurvey: async (pid: number, n: number) => fileOf(await api.get(`${S(pid)}/surveys/${n}/export.xlsx`, { responseType: 'blob', timeout: 120_000 }), `survey-${n}.xlsx`),

  models: (pid: number) => d<ModelsData>(api.get(`${S(pid)}/models`)),
  generateModel: (pid: number, kind: ModelKind, body: { subject?: string | null; useCase?: string | null } = {}) =>
    d<{ kind: ModelKind; subject: string; diagram: { number: number; key: string }; created: boolean; proposedVersion?: number | null; check: { assumptions: string[]; notes: string[] } }>(api.post(`${S(pid)}/models/${kind.toLowerCase()}/generate`, body, { timeout: 120_000 })),
  exportEvents: async (pid: number) => fileOf(await api.get(`${S(pid)}/export/event-response.xlsx`, { responseType: 'blob', timeout: 120_000 }), 'event-response.xlsx'),

  mockups: (pid: number) => d<MockupList>(api.get(`${S(pid)}/mockups`)),
  addMockup: (pid: number, body: { screenId: number; kind: 'IMAGE' | 'LINK'; imageId?: number | null; url?: string | null; title?: string | null }) => d<Mockup>(api.post(`${S(pid)}/mockups`, body)),
  updateMockup: (pid: number, id: number, body: { title?: string | null; url?: string | null; imageId?: number | null }) => d<Mockup>(api.patch(`${S(pid)}/mockups/${id}`, body)),
  deleteMockup: (pid: number, id: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/mockups/${id}`)),
  submitMockup: (pid: number, id: number, share = false) => d<Mockup>(api.post(`${S(pid)}/mockups/${id}/submit`, { share })),
  reviewMockup: (pid: number, id: number, body: { decision: 'APPROVED' | 'CHANGES'; note?: string | null }) => d<Mockup>(api.post(`${S(pid)}/mockups/${id}/review`, body)),

  quality: (pid: number) => d<QualityData>(api.get(`${S(pid)}/quality`)),
  setQuality: (pid: number, num: number, body: Partial<Record<'feasible' | 'consistent' | 'necessary', boolean | null>>) => d<QualityRow>(api.put(`${S(pid)}/quality/${num}`, body)),
  aiFix: (pid: number, num: number, language: 'vi' | 'en') => d<{ suggestion: NonNullable<QualityRow['ai']>; model: string | null }>(api.post(`${S(pid)}/quality/${num}/ai-fix`, { language }, { timeout: 180_000 })),
  exportQuality: async (pid: number) => fileOf(await api.get(`${S(pid)}/export/quality.xlsx`, { responseType: 'blob', timeout: 120_000 }), 'quality.xlsx'),

  nfr: (pid: number) => d<NfrData>(api.get(`${S(pid)}/nfr`)),
  setNfr: (pid: number, num: number, body: Partial<NfrSpec> & { characteristic: IsoCharacteristic; scale: string; meter: string }) => d<{ spec: NfrSpec; statement: string }>(api.put(`${S(pid)}/nfr/${num}`, body)),
  deleteNfr: (pid: number, num: number) => d<{ deleted: true }>(api.delete(`${S(pid)}/nfr/${num}`)),
  nfrFromTemplate: (pid: number, template: string, title?: string | null) => d<{ number: number; key: string }>(api.post(`${S(pid)}/nfr/from-template`, { template, title })),
};

/** Công khai (không đăng nhập): khảo sát + link khách xác nhận prototype. */
export const workPublic6bApi = {
  survey: (token: string) => d<PublicSurvey>(api.get(`/work/public/surveys/${encodeURIComponent(token)}`)),
  submit: (token: string, body: { answers: Record<string, unknown>; name?: string }) => d<{ ok: true }>(api.post(`/work/public/surveys/${encodeURIComponent(token)}/responses`, body)),
  mockup: (token: string) => d<PublicMockup>(api.get(`/work/public/mockup-review/${encodeURIComponent(token)}`)),
  decide: (token: string, body: { decision: 'APPROVED' | 'CHANGES'; name: string; note?: string | null }) => d<PublicMockup>(api.post(`/work/public/mockup-review/${encodeURIComponent(token)}/decision`, body)),
};
