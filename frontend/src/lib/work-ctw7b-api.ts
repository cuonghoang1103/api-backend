/**
 * CT Work — CTW đợt 7b (11/10/2026): client cho Forms, Import, kênh ngoài → đề xuất, Knowledge base. Backend:
 * src/routes/work.ctw7b.routes.ts — kiểu ở đây phải khớp forms/importer/intake/kb.service.ts. Tách khỏi work-api.ts để
 * không giẫm phiên khác.
 */

import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';
const enc = encodeURIComponent;

// ─── Forms ───────────────────────────────────────────────────────

export const FORM_FIELD_KINDS = ['text', 'longtext', 'select', 'multiselect', 'number', 'date', 'file', 'user'] as const;
export type FormFieldKind = (typeof FORM_FIELD_KINDS)[number];
export interface FormField {
  id: string; kind: FormFieldKind; label: string; help: string | null; required: boolean; options: string[];
  min: number | null; max: number | null; showIf: { field: string; equals: string } | null;
}
export interface FormMapping { typeKey: string | null; titleTemplate: string | null; labelIds: number[]; assigneeId: number | null; priority: number | null; customFields: Record<string, string> }
export interface WorkForm {
  id: number; number: number; key: string; title: string; description: string | null; fields: FormField[]; mapping: FormMapping;
  access: 'PUBLIC' | 'INTERNAL'; status: 'DRAFT' | 'OPEN' | 'CLOSED'; confirmMessage: string | null; collectEmail: boolean;
  maxResponses: number | null; closesAt: string | null; link: string | null; closed: 'CLOSED' | 'EXPIRED' | 'FULL' | null; responses: number; rev: number;
  createdAt: string; updatedAt: string;
}
export type FormBody = Partial<Pick<WorkForm, 'title' | 'description' | 'access' | 'confirmMessage' | 'collectEmail' | 'maxResponses' | 'closesAt'>> & {
  fields?: Array<Partial<FormField>>; mapping?: Partial<FormMapping>; rev?: number;
};
export interface FieldSummary {
  id: string; label: string; kind: FormFieldKind; answered: number; counts?: Array<{ option: string; n: number }>;
  average?: number | null; min?: number | null; max?: number | null; earliest?: string | null; latest?: string | null; samples?: string[]; files?: number;
}
export interface FormResponses {
  form: { key: string; title: string; fields: FormField[] }; total: number; summary: FieldSummary[];
  responses: Array<{ id: number; createdAt: string; issue: { number: number; key: string } | null; respondent: string | null; email: string | null; answers: Record<string, unknown> }>;
}
export interface FillForm {
  title: string; description: string | null; project: string; access: 'PUBLIC' | 'INTERNAL'; collectEmail: boolean; fields: FormField[];
  closed: 'CLOSED' | 'EXPIRED' | 'FULL' | null; members: Array<{ id: number; name: string }> | null;
}
export interface SubmitResult { ok: true; issue: { number: number; key: string } | null; message: string | null }
export interface SubmitBody {
  answers: Record<string, unknown>; name?: string; email?: string; files?: Record<string, Array<{ name: string; type: string; data: string }>>;
  website?: string; elapsedMs?: number;
}

export const workFormsApi = {
  list: (pid: number) => d<{ forms: WorkForm[]; canEdit: boolean; canPublish: boolean }>(api.get(`${B}/${pid}/forms`)),
  get: (pid: number, ref: string) => d<WorkForm>(api.get(`${B}/${pid}/forms/${enc(ref)}`)),
  create: (pid: number, body: FormBody & { title: string }) => d<WorkForm>(api.post(`${B}/${pid}/forms`, body)),
  update: (pid: number, ref: string, body: FormBody) => d<WorkForm>(api.patch(`${B}/${pid}/forms/${enc(ref)}`, body)),
  remove: (pid: number, ref: string) => d<{ ok: true }>(api.delete(`${B}/${pid}/forms/${enc(ref)}`)),
  status: (pid: number, ref: string, status: WorkForm['status']) => d<WorkForm>(api.post(`${B}/${pid}/forms/${enc(ref)}/status`, { status })),
  rotate: (pid: number, ref: string) => d<WorkForm>(api.post(`${B}/${pid}/forms/${enc(ref)}/rotate`)),
  responses: (pid: number, ref: string) => d<FormResponses>(api.get(`${B}/${pid}/forms/${enc(ref)}/responses`)),
  exportXlsx: async (pid: number, ref: string) => (await api.get(`${B}/${pid}/forms/${enc(ref)}/responses.xlsx`, { responseType: 'blob' })).data as Blob,
  // Điền form
  publicGet: (token: string) => d<FillForm>(api.get(`/work/public/forms/${enc(token)}`)),
  publicSubmit: (token: string, body: SubmitBody) => d<SubmitResult>(api.post(`/work/public/forms/${enc(token)}/responses`, body)),
  internalGet: (token: string) => d<FillForm>(api.get(`/work/forms/${enc(token)}`)),
  internalSubmit: (token: string, body: SubmitBody) => d<SubmitResult>(api.post(`/work/forms/${enc(token)}/responses`, body)),
};

// ─── Import ──────────────────────────────────────────────────────

export const IMPORT_SOURCES = ['TRELLO', 'ASANA', 'JIRA', 'CSV'] as const;
export type ImportSource = (typeof IMPORT_SOURCES)[number];
export const MAP_FIELDS = ['title', 'description', 'type', 'status', 'priority', 'assignee', 'assigneeEmail', 'reporter', 'labels', 'due', 'start', 'created', 'storyPoints', 'externalId', 'parent', 'comment'] as const;
export type MapField = (typeof MAP_FIELDS)[number];
export interface ImportBody {
  source: ImportSource; fileName?: string; content: string; encoding?: 'text' | 'base64'; mapping?: Partial<Record<MapField, number | null>>;
  people?: Record<string, number | null>; statuses?: Record<string, number>; dryRun: boolean;
}
export interface ImportPerson { key: string; name: string | null; email: string | null; userId: number | null; matchedBy: 'email' | 'name' | 'manual' | null; uses: number }
export interface ImportRow {
  row: number; externalId: string; title: string; type: string; status: string; assignee: string | null; assigneeSource: string | null;
  labels: string[]; due: string | null; comments: number; checklist: number; duplicate: { issueNumber: number | null } | null; errors: string[]; warnings: string[];
}
export interface ImportPreview {
  dryRun: true; source: ImportSource; notes: string[]; columns: string[] | null; mapping: Partial<Record<MapField, number | null>> | null;
  summary: { total: number; valid: number; invalid: number; duplicates: number; toCreate: number; comments: number; checklistItems: number };
  people: ImportPerson[]; statuses: Array<{ name: string; statusId: number | null; statusName: string | null }>;
  members: Array<{ id: number; name: string; email: string | null }>; projectStatuses: Array<{ id: number; name: string; category: string }>;
  hasSubtaskType: boolean; rows: ImportRow[];
}
export interface ImportReport {
  dryRun: false; runId: number; source: ImportSource; created: number; duplicates: number; failed: number; subtasks: number; comments: number; labels: number;
  invalid: number; unmatchedPeople: string[]; warnings: string[]; failures: Array<{ row: number; error: string }>; invalidRows: Array<{ row: number; errors: string[] }>; notes: string[];
}
export interface ImportRun { id: number; source: ImportSource; fileName: string | null; createdAt: string; by: string | null; created: number; duplicates: number; failed: number; report: Partial<ImportReport> }

export const workImportApi = {
  preview: (pid: number, body: Omit<ImportBody, 'dryRun'>) => d<ImportPreview>(api.post(`${B}/${pid}/imports`, { ...body, dryRun: true })),
  run: (pid: number, body: Omit<ImportBody, 'dryRun'>) => d<ImportReport>(api.post(`${B}/${pid}/imports`, { ...body, dryRun: false })),
  runs: (pid: number) => d<ImportRun[]>(api.get(`${B}/${pid}/imports`)),
};

// ─── Kênh ngoài → đề xuất ────────────────────────────────────────

export type IntakeKind = 'EMAIL' | 'DISCORD' | 'ZALO';
export interface IntakeChannel {
  id: number; kind: IntakeKind; name: string; enabled: boolean; pending: number;
  // chỉ ADMIN mới có các trường dưới
  webhookUrl?: string; address?: string | null; publicKey?: string | null; applicationId?: string | null; appId?: string | null; oaId?: string | null;
  prefix?: string | null; secretSet?: boolean; secretMasked?: string | null; ready?: boolean; lastEventAt?: string | null; lastError?: string | null;
}
export interface ChannelBody { kind?: IntakeKind; name?: string; enabled?: boolean; address?: string; publicKey?: string; applicationId?: string; appId?: string; oaId?: string; prefix?: string; secret?: string }
export interface Proposal {
  // CTW đợt 8b: + SLACK (lệnh /ctwork new — không có kênh intake riêng, channelId null).
  id: number; source: IntakeKind | 'SLACK'; channelId: number | null; title: string; body: string | null; senderName: string | null; senderHandle: string | null; sender: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'; simulated: boolean; createdAt: string; issue: { number: number; key: string } | null;
  decidedBy: string | null; decidedAt: string | null; decisionNote: string | null; meta: Record<string, unknown> | null;
}

export const workIntakeApi = {
  channels: (pid: number) => d<{ canConfigure: boolean; channels: IntakeChannel[] }>(api.get(`${B}/${pid}/intake/channels`)),
  create: (pid: number, body: ChannelBody & { kind: IntakeKind }) => d<IntakeChannel>(api.post(`${B}/${pid}/intake/channels`, body)),
  update: (pid: number, id: number, body: ChannelBody) => d<IntakeChannel>(api.patch(`${B}/${pid}/intake/channels/${id}`, body)),
  remove: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/intake/channels/${id}`)),
  rotate: (pid: number, id: number) => d<IntakeChannel>(api.post(`${B}/${pid}/intake/channels/${id}/rotate`)),
  simulate: (pid: number, id: number, body: { title: string; body?: string | null; senderName?: string | null }) => d<Proposal>(api.post(`${B}/${pid}/intake/channels/${id}/simulate`, body)),
  proposals: (pid: number, status?: Proposal['status']) => d<{ proposals: Proposal[]; counts: Partial<Record<Proposal['status'], number>>; canDecide: boolean }>(api.get(`${B}/${pid}/intake/proposals`, { params: status ? { status } : {} })),
  decide: (pid: number, id: number, body: { decision: 'ACCEPT' | 'REJECT'; title?: string; typeKey?: string; assigneeId?: number | null; note?: string | null }) =>
    d<Proposal>(api.post(`${B}/${pid}/intake/proposals/${id}/decide`, body)),
};

// ─── Knowledge base ──────────────────────────────────────────────

export interface KbArticle {
  id: number; title: string; pageNumber: number; category: { id: number; name: string } | null; excerpt: string; updatedAt: string;
  audience?: 'CLIENT' | 'INTERNAL'; published?: boolean; keywords?: string | null; pageVisibility?: string; pageStatus?: string;
  views?: number; helpful?: number; notHelpful?: number; deflected?: number; helpfulPercent?: number | null; hiddenFromClients?: boolean;
}
export interface KbOverview {
  canEdit: boolean; categories: Array<{ id: number; name: string; description: string | null; position: number; articles: number }>;
  articles: KbArticle[]; pages: Array<{ number: number; title: string; visibility: string }>;
  totals: { articles: number; forClients: number; views: number; deflected: number; helpful: number; notHelpful: number };
}
export interface KbBrowse { query: string; categories: Array<{ id: number; name: string; description: string | null; count: number }>; articles: KbArticle[]; total: number }
export interface KbRead extends KbArticle { contentJson: unknown; myVote: 'HELPFUL' | 'NOT_HELPFUL' | null; canVote: boolean; related: Array<{ id: number; title: string }> }

const as = (asClient?: boolean) => (asClient ? { as: 'client' } : {});
export const workKbApi = {
  overview: (pid: number) => d<KbOverview>(api.get(`${B}/${pid}/kb`)),
  addCategory: (pid: number, body: { name: string; description?: string | null }) => d<{ id: number }>(api.post(`${B}/${pid}/kb/categories`, body)),
  updateCategory: (pid: number, id: number, body: { name?: string; description?: string | null }) => d<{ ok: true }>(api.patch(`${B}/${pid}/kb/categories/${id}`, body)),
  removeCategory: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/kb/categories/${id}`)),
  addArticle: (pid: number, body: { pageNumber: number; categoryId?: number | null; audience?: 'CLIENT' | 'INTERNAL'; keywords?: string | null; published?: boolean }) => d<{ id: number }>(api.post(`${B}/${pid}/kb/articles`, body)),
  updateArticle: (pid: number, id: number, body: { categoryId?: number | null; audience?: 'CLIENT' | 'INTERNAL'; keywords?: string | null; published?: boolean }) => d<{ ok: true }>(api.patch(`${B}/${pid}/kb/articles/${id}`, body)),
  removeArticle: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/kb/articles/${id}`)),
  // Cổng khách
  browse: (pid: number, q: { q?: string; category?: number }, asClient?: boolean) => d<KbBrowse>(api.get(`${B}/${pid}/portal/kb`, { params: { ...q, ...as(asClient) } })),
  read: (pid: number, id: number, asClient?: boolean) => d<KbRead>(api.get(`${B}/${pid}/portal/kb/${id}`, { params: as(asClient) })),
  vote: (pid: number, id: number, helpful: boolean) => d<{ ok: true; myVote: string }>(api.post(`${B}/${pid}/portal/kb/${id}/vote`, { helpful })),
  suggest: (pid: number, q: string, asClient?: boolean) => d<{ articles: Array<{ id: number; title: string; excerpt: string }> }>(api.get(`${B}/${pid}/portal/kb/suggest`, { params: { q, ...as(asClient) } })),
  deflected: (pid: number, id: number) => d<{ ok: true }>(api.post(`${B}/${pid}/portal/kb/${id}/deflected`)),
};

/** Tệp ⇒ base64 (không tiền tố data:). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ''));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
