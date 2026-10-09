/**
 * CT Work — CTW Diagram (10/10/2026): client của Diagram Studio. Backend: src/routes/work.diagrams.routes.ts +
 * src/services/work/diagrams.service.ts. Tách riêng khỏi lib/work-api.ts (tệp nhiều phiên cùng sửa).
 */

import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

export const DIAGRAM_TYPES = [
  'SEQUENCE', 'USE_CASE', 'ERD', 'CLASS', 'ACTIVITY', 'STATE', 'DEPLOYMENT', 'ARCHITECTURE', 'DATA_FLOW', 'SWIMLANE',
  'GANTT', 'JOURNEY', 'TIMELINE', 'MINDMAP', 'SCREEN_FLOW', 'FLOWCHART', 'WHITEBOARD', 'OTHER',
] as const;
export type DiagramType = (typeof DIAGRAM_TYPES)[number];
export type DiagramFormat = 'MERMAID' | 'EXCALIDRAW';
export type DiagramStatus = 'PROPOSED' | 'DRAFT' | 'APPROVED';
export const GENERATABLE = ['SEQUENCE', 'USE_CASE', 'ERD', 'CLASS', 'ACTIVITY', 'STATE', 'SCREEN_FLOW', 'DEPLOYMENT', 'ARCHITECTURE', 'DATA_FLOW'] as const;
export type GeneratableType = (typeof GENERATABLE)[number];

export interface DPerson { id: number; name: string; username: string; isAgent: boolean }
export interface DOrigin {
  generator?: string; model?: string | null; type?: string; sources?: Array<{ kind: string; label: string; ref?: string | null }>;
  assumptions?: string[]; notes?: string[]; checks?: Record<string, unknown>; fidelity?: { kept: number; merged: string[]; dropped: string[]; notes: string[] }; at?: string;
}
export interface DiagramRow {
  id: number; number: number; key: string; format: DiagramFormat; type: DiagramType; typeLabel: string; title: string; description: string | null;
  feature: string | null; status: DiagramStatus; currentVersion: number; approvedVersion: number | null; rev: number; aiModel: string | null;
  createdAt: string; updatedAt: string;
  issue: { number: number; key: string; title: string } | null; useCase: { number: number; key: string; name: string; feature: string | null } | null;
  page: { number: number; title: string } | null;
}
export interface DiagramListItem extends DiagramRow { updatedBy: DPerson | null; openComments: number; pendingProposals: number; assumptions: number }
export interface DiagramDetail extends DiagramRow {
  canEdit: boolean; canApprove: boolean; canComment: boolean; isAgent: boolean;
  createdBy: DPerson | null; updatedBy: DPerson | null; source: string; origin: DOrigin | null; previewImageId: number | null;
  lint: { ok: boolean; kind: string | null; errors: Array<{ line: number; message: string }> } | null;
  versions: Array<{ number: number; note: string | null; state: 'ACCEPTED' | 'PROPOSED' | 'DISCARDED'; author: DPerson | null; aiModel: string | null; createdAt: string; generator: string | null; assumptions: number }>;
  proposals: Array<{ number: number; note: string | null; author: DPerson | null; createdAt: string; source: string; origin: DOrigin | null }>;
  comments: Array<{ id: number; parentId: number | null; versionNumber: number | null; anchor: string | null; body: string; resolved: boolean; createdAt: string; author: DPerson | null; mine: boolean }>;
  proposedVersion?: number | null;
}
export interface GenerateBody {
  type: GeneratableType; useCase?: number | string | null; feature?: string | null; entities?: string[] | null;
  source?: 'auto' | 'repo' | 'dictionary' | 'docs' | 'workflow' | null; instruction?: string | null; title?: string | null; update?: number | null;
}
export interface GenerateResult {
  diagram: DiagramDetail;
  check: { ok: boolean; sources: Array<{ kind: string; label: string }>; assumptions: string[]; notes: string[]; unknown: string[]; usedAi: boolean; repaired: boolean; model: string | null };
}
export interface DiagramPatch {
  title?: string; description?: string | null; feature?: string | null; type?: DiagramType; source?: string; issueNumber?: number | null; useCase?: number | null;
  pageNumber?: number | null; previewImageId?: number | null; note?: string | null; rev?: number;
}

export const workDiagramKeys = {
  list: (pid: number) => ['work', 'diagrams', pid] as const,
  one: (pid: number, n: number) => ['work', 'diagrams', pid, n] as const,
};

export const workDiagramsApi = {
  list: (pid: number, q: { type?: string; status?: string; useCase?: number; q?: string } = {}) =>
    d<{ canEdit: boolean; canApprove: boolean; canComment: boolean; items: DiagramListItem[] }>(api.get(`${B}/${pid}/diagrams`, { params: q })),
  get: (pid: number, n: number) => d<DiagramDetail>(api.get(`${B}/${pid}/diagrams/${n}`)),
  version: (pid: number, n: number, v: number) => d<{ number: number; source: string; note: string | null; state: string; origin: DOrigin | null; previewImageId: number | null; format: DiagramFormat }>(api.get(`${B}/${pid}/diagrams/${n}/versions/${v}`)),
  create: (pid: number, body: DiagramPatch & { format?: DiagramFormat; source: string }) => d<DiagramDetail>(api.post(`${B}/${pid}/diagrams`, body)),
  update: (pid: number, n: number, body: DiagramPatch) => d<DiagramDetail>(api.patch(`${B}/${pid}/diagrams/${n}`, body)),
  remove: (pid: number, n: number) => d<{ deleted: string }>(api.delete(`${B}/${pid}/diagrams/${n}`)),
  generate: (pid: number, body: GenerateBody) => d<GenerateResult>(api.post(`${B}/${pid}/diagrams/generate`, body, { timeout: 240_000 })),
  importFile: (pid: number, body: { fileName: string; content: string; base64?: boolean; page?: number; to?: 'mermaid' | 'native'; title?: string | null }) =>
    d<DiagramDetail & { fidelity: NonNullable<DOrigin['fidelity']>; pages: string[] | null }>(api.post(`${B}/${pid}/diagrams/import`, body, { timeout: 120_000 })),
  restore: (pid: number, n: number, v: number) => d<DiagramDetail>(api.post(`${B}/${pid}/diagrams/${n}/versions/${v}/restore`)),
  resolve: (pid: number, n: number, v: number, accept: boolean) => d<DiagramDetail | { discarded: true; key: string }>(api.post(`${B}/${pid}/diagrams/${n}/versions/${v}/${accept ? 'accept' : 'discard'}`)),
  approve: (pid: number, n: number, approve: boolean, parsedOk?: boolean) => d<DiagramDetail>(api.post(`${B}/${pid}/diagrams/${n}/${approve ? 'approve' : 'unapprove'}`, { parsedOk })),
  embed: (pid: number, n: number, body: { page: number; mode?: 'latest' | 'pinned'; heading?: string | null }) =>
    d<{ page: { number: number; title: string; version: number | null }; placed: 'heading' | 'end' }>(api.post(`${B}/${pid}/diagrams/${n}/embed`, body)),
  headings: (pid: number, page: number) => d<{ number: number; title: string; canEdit: boolean; headings: Array<{ level: number; text: string }> }>(api.get(`${B}/${pid}/diagrams/page-headings/${page}`)),
  fillReport: (pid: number, report: 3 | 4) => d<{ filled: string[]; page: { number: number; title: string; version?: number | null }; diagrams: number }>(api.post(`${B}/${pid}/diagrams/fill-report`, { report })),
  comment: (pid: number, n: number, body: { body: string; parentId?: number | null; anchor?: string | null; versionNumber?: number | null }) => d<{ id: number }>(api.post(`${B}/${pid}/diagrams/${n}/comments`, body)),
  updateComment: (pid: number, n: number, cid: number, body: { resolved?: boolean; body?: string }) => d<{ id: number }>(api.patch(`${B}/${pid}/diagrams/${n}/comments/${cid}`, body)),
  deleteComment: (pid: number, n: number, cid: number) => d<{ deleted: number }>(api.delete(`${B}/${pid}/diagrams/${n}/comments/${cid}`)),
};
