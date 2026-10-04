/**
 * CRM nhẹ của studio (CT Work đợt S5b) — /admin/crm + trang khách /proposal/[token].
 * Backend: src/routes/crm.routes.ts + src/services/crm/{crm.service,rules}.ts.
 * Tách khỏi lib/api.ts (tệp dùng chung nhiều phiên). Kiểu ở đây phải khớp service.
 * Đi qua `api` (axios) chung ⇒ 403 MFA_REQUIRED được interceptor mở hộp step-up.
 */
import { api } from './api';

type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export const DEAL_STAGES = ['LEAD', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'] as const;
export type DealStage = (typeof DEAL_STAGES)[number];
export type Decision = 'GO' | 'GO_CONDITIONAL' | 'NO_GO';
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK';
export type Money = Record<string, number>;

export interface CrmMeta {
  stages: DealStage[];
  createStages: DealStage[];
  probability: Record<DealStage, number>;
  staleDays: number;
  packages: string[];
  activityTypes: ActivityType[];
  channels: string[];
  criteria: Array<{ n: number; vi: string; en: string; q: string; qEn: string; hard?: boolean }>;
  proposalTtl: { default: number; max: number };
  owners: Array<{ id: number; name: string }>;
}

export interface DealListItem {
  id: number;
  title: string;
  stage: DealStage;
  packageId: string | null;
  value: number | null;
  currency: string;
  probability: number | null;
  effectiveProbability: number;
  weighted: number;
  expectedCloseAt: string | null;
  source: string | null;
  isRoleplay: boolean;
  lostReason: string | null;
  stageChangedAt: string;
  lastActivityAt: string;
  stale: boolean;
  createdAt: string;
  wonAt: string | null;
  lostAt: string | null;
  ndaSigned: boolean;
  decision: Decision | null;
  org: { id: number; name: string } | null;
  contact: { id: number; name: string; email: string | null; anonymizedAt: string | null } | null;
  owner: { id: number; name: string } | null;
  request: { id: number; code: string; status: string; workProjectId: number | null } | null;
}

export interface CrmActivity {
  id: number;
  dealId: number | null;
  contactId: number | null;
  type: ActivityType;
  subject: string;
  body: string | null;
  dueAt: string | null;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
}

export interface CrmProposal {
  id: number;
  dealId: number;
  version: number;
  title: string;
  content: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  linkState: 'OK' | 'EXPIRED' | 'REVOKED' | 'NOT_SENT';
  url: string | null;
  tokenExpiresAt: string | null;
  tokenRevokedAt: string | null;
  contentHash: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  respondedAt: string | null;
  responseName: string | null;
  responseNote: string | null;
  responseIp: string | null;
  responseUserAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Qualification {
  scores?: Record<string, number>;
  notes?: Record<string, string>;
  risks?: string | null;
  decision?: Decision | null;
  conditions?: string | null;
  reason?: string | null;
  total?: number;
  decidedAt?: string | null;
}

export interface DealDetail extends Omit<DealListItem, 'contact'> {
  contact: {
    id: number; name: string; email: string | null; phone: string | null; title: string | null;
    preferredChannel: string | null; consent: boolean; consentAt: string | null; anonymizedAt: string | null;
  } | null;
  qualification: Qualification;
  qualificationScore: { total: number; max: number; answered: number; hardFail: boolean; suggestion: Decision | null };
  ndaSignedAt: string | null;
  ndaFileName: string | null;
  hasNdaFile: boolean;
  activities: CrmActivity[];
  dueTasks: CrmActivity[];
  proposals: CrmProposal[];
  stageChanges: Array<{ id: number; fromStage: string | null; toStage: string; at: string }>;
  workProject: { projectId: number; deleted: boolean; url: string | null; key: string | null; shareUrl: string | null } | null;
}

export interface Pipeline {
  stages: DealStage[];
  deals: DealListItem[];
  totals: Record<string, { count: number; total: Money; weighted: Money }>;
}

export interface CrmOrg {
  id: number; name: string; industry: string | null; size: string | null; website: string | null; taxCode: string | null; note: string | null;
  createdAt: string; _count?: { contacts: number; deals: number };
}

export interface CrmContact {
  id: number; orgId: number | null; name: string; title: string | null; email: string | null; phone: string | null;
  preferredChannel: string | null; consent: boolean; consentAt: string | null; consentSource: string | null; note: string | null;
  anonymizedAt: string | null; createdAt: string; updatedAt: string;
  org?: { id: number; name: string } | null; _count?: { deals: number };
}

export interface CrmReport {
  funnel: Array<{ stage: DealStage; reached: number; conversionToNext: number | null }>;
  won: number; lost: number; open: number;
  winRate: number | null;
  avgCycleDays: number | null;
  sources: Array<{ source: string; deals: number; won: number; lost: number; winRate: number | null; wonValue: Money }>;
  packages: Array<{ packageId: string; deals: number; won: number }>;
  forecast: Array<{ month: string; deals: number; total: Money; weighted: Money }>;
  unscheduled: { deals: number; weighted: Money };
}

export interface DueTask extends CrmActivity {
  deal: { id: number; title: string; stage: DealStage } | null;
  contact: { id: number; name: string } | null;
}

export interface DealFilters {
  q?: string; stage?: DealStage; owner?: number; source?: string; package?: string; stale?: '1'; roleplay?: 'only' | 'exclude';
  org?: number; contact?: number; page?: number; limit?: number;
}

export interface DealInput {
  title?: string; orgId?: number | null; contactId?: number | null; packageId?: string | null; valueAmount?: number | null;
  currency?: string; probability?: number | null; expectedCloseAt?: string | null; ownerId?: number | null; source?: string | null;
  ndaSigned?: boolean; ndaSignedAt?: string | null; stage?: DealStage;
}

const B = '/admin/crm';

export const crmApi = {
  meta: () => d<CrmMeta>(api.get(`${B}/meta`)),
  pipeline: (f: DealFilters = {}) => d<Pipeline>(api.get(`${B}/pipeline`, { params: f })),
  deals: (f: DealFilters = {}) => d<{ items: DealListItem[]; total: number; page: number; limit: number }>(api.get(`${B}/deals`, { params: f })),
  deal: (id: number) => d<DealDetail>(api.get(`${B}/deals/${id}`)),
  createDeal: (body: DealInput & { title: string }) => d<DealDetail>(api.post(`${B}/deals`, body)),
  updateDeal: (id: number, body: DealInput) => d<DealDetail>(api.patch(`${B}/deals/${id}`, body)),
  deleteDeal: (id: number) => d<{ deleted: true }>(api.delete(`${B}/deals/${id}`)),
  stage: (id: number, stage: DealStage, lostReason?: string) => d<DealDetail>(api.post(`${B}/deals/${id}/stage`, { stage, lostReason })),
  qualification: (id: number, body: { scores: Record<string, number | null>; notes?: Record<string, string>; risks?: string | null; decision?: Decision | null; conditions?: string | null; reason?: string | null }) =>
    d<DealDetail>(api.put(`${B}/deals/${id}/qualification`, body)),
  uploadNda: (id: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return d<DealDetail>(api.post(`${B}/deals/${id}/nda`, fd));
  },
  ndaUrl: (id: number) => d<{ url: string }>(api.get(`${B}/deals/${id}/nda/url`)),
  deleteNda: (id: number) => d<DealDetail>(api.delete(`${B}/deals/${id}/nda`)),
  createWorkProject: (id: number) =>
    d<{ alreadyExisted: boolean; projectId: number; key: string; url: string; shareUrl: string | null; requestId: number }>(api.post(`${B}/deals/${id}/create-work-project`)),
  backfill: () => d<{ created: number }>(api.post(`${B}/backfill`)),

  createProposal: (dealId: number, fromVersion?: number) => d<CrmProposal>(api.post(`${B}/deals/${dealId}/proposals`, { fromVersion })),
  updateProposal: (id: number, body: { title?: string; content?: string }) => d<CrmProposal>(api.patch(`${B}/proposals/${id}`, body)),
  deleteProposal: (id: number) => d<{ deleted: true }>(api.delete(`${B}/proposals/${id}`)),
  sendProposal: (id: number, expiresInDays?: number) => d<CrmProposal>(api.post(`${B}/proposals/${id}/send`, { expiresInDays })),
  revokeProposal: (id: number) => d<CrmProposal>(api.post(`${B}/proposals/${id}/revoke`)),

  dueTasks: (days = 7) => d<DueTask[]>(api.get(`${B}/activities/due`, { params: { days } })),
  createActivity: (body: { dealId?: number | null; contactId?: number | null; type: ActivityType; subject: string; body?: string | null; dueAt?: string | null; done?: boolean }) =>
    d<CrmActivity>(api.post(`${B}/activities`, body)),
  updateActivity: (id: number, body: { subject?: string; body?: string | null; dueAt?: string | null; done?: boolean }) => d<CrmActivity>(api.patch(`${B}/activities/${id}`, body)),
  deleteActivity: (id: number) => d<{ deleted: true }>(api.delete(`${B}/activities/${id}`)),

  orgs: (q?: string) => d<{ items: CrmOrg[]; total: number }>(api.get(`${B}/orgs`, { params: { q, limit: 200 } })),
  createOrg: (body: Partial<CrmOrg> & { name: string }) => d<CrmOrg>(api.post(`${B}/orgs`, body)),
  updateOrg: (id: number, body: Partial<CrmOrg>) => d<CrmOrg>(api.patch(`${B}/orgs/${id}`, body)),
  deleteOrg: (id: number) => d<{ deleted: true }>(api.delete(`${B}/orgs/${id}`)),

  contacts: (q?: string, opts: { org?: number; anonymized?: '1' } = {}) => d<{ items: CrmContact[]; total: number }>(api.get(`${B}/contacts`, { params: { q, limit: 200, ...opts } })),
  contact: (id: number) => d<CrmContact & { deals: DealListItem[]; activities: CrmActivity[] }>(api.get(`${B}/contacts/${id}`)),
  createContact: (body: Partial<CrmContact> & { name: string }) => d<CrmContact>(api.post(`${B}/contacts`, body)),
  updateContact: (id: number, body: Partial<CrmContact>) => d<CrmContact>(api.patch(`${B}/contacts/${id}`, body)),
  /** Tải JSON về máy (Blob) — quyền truy cập dữ liệu của chủ thể. */
  exportContact: (id: number) => api.get(`${B}/contacts/${id}/export`, { responseType: 'blob' }).then((r) => r.data as Blob),
  eraseContact: (id: number, mode: 'anonymize' | 'delete') =>
    d<{ mode: string; deals: number; deletedRequests: number; keptRequests: string[]; keptAcceptedProposals: number }>(api.post(`${B}/contacts/${id}/erase`, { mode, confirm: true })),

  reports: (p: { from?: string; to?: string; roleplay?: '1' } = {}) => d<CrmReport>(api.get(`${B}/reports`, { params: p })),
};

// ─── Trang khách (công khai) ────────────────────────────────────

export interface PublicProposal {
  title: string;
  version: number;
  content: string;
  status: 'SENT' | 'ACCEPTED' | 'REJECTED';
  sentAt: string | null;
  expiresAt: string | null;
  contentHash: string | null;
  integrity: boolean;
  orgName: string | null;
  respondedAt: string | null;
  responseName: string | null;
}

export const publicProposalApi = {
  get: (token: string) => d<PublicProposal>(api.get(`/proposals/${encodeURIComponent(token)}`)),
  respond: (token: string, body: { decision: 'ACCEPT' | 'DECLINE'; name: string; note?: string; contentHash: string }) =>
    d<{ status: string; respondedAt: string; contentHash: string }>(api.post(`/proposals/${encodeURIComponent(token)}/respond`, body)),
};
