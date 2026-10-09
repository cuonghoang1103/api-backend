/**
 * CT Work — CTW đợt 4b (10/10/2026): client cho SWR302 "Hồ sơ Wiegers" + "Dữ liệu & sáu liên kết". Backend:
 * src/routes/work.ctw4b.routes.ts — kiểu ở đây phải khớp swr.service.ts. Tách khỏi work-api.ts để không giẫm phiên khác.
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkPageDetail } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';
const fileOf = (res: { headers: Record<string, unknown>; data: unknown }, fallback: string) => {
  const cd = String(res.headers['content-disposition'] ?? '');
  const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
  return { blob: res.data as Blob, fileName: star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? fallback };
};

export const REQ_TYPES = ['BUSINESS', 'USER', 'FUNCTIONAL', 'QUALITY', 'CONSTRAINT', 'EXTERNAL_INTERFACE', 'DATA'] as const;
export type ReqType = (typeof REQ_TYPES)[number];
export const LIFECYCLE = ['PROPOSED', 'APPROVED', 'IMPLEMENTED', 'VERIFIED', 'DELETED', 'REJECTED'] as const;
export type Lifecycle = (typeof LIFECYCLE)[number];
export type P3 = 'HIGH' | 'MEDIUM' | 'LOW';
export const DOC_KINDS = ['vision-scope', 'use-cases', 'business-rules', 'srs', 'data-dictionary'] as const;
export type DocKind = (typeof DOC_KINDS)[number];
export type CountKey = 'useCases' | 'screens' | 'reports' | 'interfacingSystems';
export const COUNT_KEYS: CountKey[] = ['useCases', 'screens', 'reports', 'interfacingSystems'];
export type SixKey = 'FE_UC' | 'UC_BR' | 'FR_TRACE' | 'NOUN_DD' | 'PRIORITY_REF' | 'COUNTS';
export interface Weights { benefit: number; penalty: number; cost: number; risk: number }

export interface SwrOverview {
  counts: { features: number; requirements: number; glossary: number; dataElements: number; priorityRows: number };
  docs: Array<{ kind: DocKind; templateKey: string; page: { number: number; title: string } | null }>;
  sixLinks: { passed: number; ok: boolean; links: Array<{ n: number; key: SixKey; ok: boolean; gaps: number }> };
  declaredCounts: Partial<Record<CountKey, number | null>> | null; ignoredNouns: string[]; weights: Weights;
  canEdit: boolean; canApprove: boolean; canConfigure: boolean;
}

export interface Feature {
  id: number; number: number; key: string; name: string; description: string | null; scope: 'IN' | 'OUT'; priority: P3 | null;
  versionId: number | null; epicIssueId: number | null; position: number; release: string | null;
  epic: { number: number; key: string; title: string } | null;
  useCases: Array<{ number: number; key: string; name: string; status: string; manual: boolean; linkId: number | null }>;
  issues: Array<{ linkId: number; number: number; key: string; title: string; type: string }>;
  realized: boolean;
}
export interface FeatureList { key: string; canEdit: boolean; releases: Array<{ id: number; name: string; releaseDate: string | null; status: string }>; features: Feature[] }
export interface FeatureInput { name: string; description?: string | null; scope?: 'IN' | 'OUT'; priority?: P3 | null; versionId?: number | null; epic?: number | string | null }

export interface Requirement {
  issueId: number; number: number; key: string; title: string; text: string; parentId: number | null; status: { name: string; category: string };
  classified: boolean; reqType: ReqType | null; subtype: string | null; priority: P3 | null; lifecycle: Lifecycle; source: string | null;
  ownerId: number | null; rationale: string | null; stability: P3 | null; reqVersion: number; updatedAt: string | null; next: Lifecycle[];
}
export interface RequirementList {
  key: string; canEdit: boolean; canApprove: boolean; requirements: Requirement[];
  counts: { total: number; unclassified: number; byType: Record<ReqType, number>; byLifecycle: Record<Lifecycle, number> };
  owners: Array<{ id: number; name: string }>; qualityAttrs: string[]; interfaceKinds: string[]; dataKinds: string[];
}
export interface RequirementInput { reqType?: ReqType; subtype?: string | null; priority?: P3 | null; source?: string | null; ownerId?: number | null; rationale?: string | null; stability?: P3 | null; reqVersion?: number }
export interface HistoryRow { id: number; field: string; from: string | null; to: string | null; at: string; actor: string | null; actorKind: string }

export interface PriorityComputed { id: number; label: string; benefit: number; penalty: number; cost: number; risk: number; totalValue: number; valuePct: number; costPct: number; riskPct: number; priority: number; rank: number }
export interface PriorityRow { id: number; targetKind: 'FE' | 'UC'; targetId: number; benefit: number; penalty: number; cost: number; risk: number; note: string | null; position: number; label: string | null; orphan: boolean; computed: PriorityComputed | null }
export interface PriorityData { weights: Weights; rows: PriorityRow[]; ranked: PriorityComputed[]; candidates: Array<{ kind: 'FE' | 'UC'; ref: string; label: string }>; canEdit: boolean; canConfigure: boolean }

export interface GlossaryTerm { id: number; term: string; definition: string; aliases: string[]; source: string | null }
export interface GlossaryList { terms: GlossaryTerm[]; clashes: Array<{ word: string; terms: string[] }>; canEdit: boolean }
export interface GlossaryInput { term: string; definition: string; aliases?: string[]; source?: string | null }

export interface DataElement {
  id: number; name: string; description: string | null; kind: 'PRIMITIVE' | 'STRUCTURE'; composition: string | null; dataType: string | null;
  length: string | null; values: string | null; isKey: boolean; position: number; usedIn: string[];
}
export interface DictionaryList {
  elements: DataElement[]; undefinedComponents: Array<{ structure: string; component: string }>;
  missingNouns: Array<{ noun: string; useCases: string[] }>; ignoredNouns: string[]; erd: number; canEdit: boolean;
}
export interface DataElementInput { name: string; description?: string | null; kind?: 'PRIMITIVE' | 'STRUCTURE'; composition?: string | null; dataType?: string | null; length?: string | null; values?: string | null; isKey?: boolean }

export interface LinkGap { ref: string; detail: string; severity: 'error' | 'warning'; code?: string; params?: Record<string, string | number> }
export interface LinkResult { n: number; key: SixKey; title: string; checked: number; ok: boolean; gaps: LinkGap[]; note?: string }
export interface SixLinks { links: LinkResult[]; passed: number; ok: boolean; declared: Partial<Record<CountKey, number | null>> | null; actual: Partial<Record<CountKey, number>>; canEdit: boolean; canConfigure: boolean }

export interface SettingsInput { weights?: Partial<Weights>; declaredCounts?: Partial<Record<CountKey, number | null>>; ignoredNouns?: string[]; ignoreNoun?: string }

export const workSwrKeys = {
  all: (pid: number) => ['work', 'swr', pid] as const,
  overview: (pid: number) => ['work', 'swr', pid, 'overview'] as const,
  features: (pid: number) => ['work', 'swr', pid, 'features'] as const,
  requirements: (pid: number) => ['work', 'swr', pid, 'requirements'] as const,
  history: (pid: number, num: number) => ['work', 'swr', pid, 'history', num] as const,
  priority: (pid: number) => ['work', 'swr', pid, 'priority'] as const,
  glossary: (pid: number) => ['work', 'swr', pid, 'glossary'] as const,
  dictionary: (pid: number) => ['work', 'swr', pid, 'dictionary'] as const,
  sixLinks: (pid: number) => ['work', 'swr', pid, 'six-links'] as const,
};

export const workSwrApi = {
  overview: (pid: number) => d<SwrOverview>(api.get(`${B}/${pid}/swr`)),
  features: (pid: number) => d<FeatureList>(api.get(`${B}/${pid}/swr/features`)),
  createFeature: (pid: number, body: FeatureInput) => d<{ key: string }>(api.post(`${B}/${pid}/swr/features`, body)),
  updateFeature: (pid: number, fe: string, body: Partial<FeatureInput>) => d<{ key: string }>(api.patch(`${B}/${pid}/swr/features/${fe}`, body)),
  deleteFeature: (pid: number, fe: string) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/swr/features/${fe}`)),
  linkFeature: (pid: number, fe: string, body: { kind: 'UC' | 'ISSUE'; ref: string | number }) => d<{ id: number }>(api.post(`${B}/${pid}/swr/features/${fe}/links`, body)),
  unlinkFeature: (pid: number, fe: string, linkId: number) => d<{ removed: boolean }>(api.delete(`${B}/${pid}/swr/features/${fe}/links/${linkId}`)),
  requirements: (pid: number) => d<RequirementList>(api.get(`${B}/${pid}/swr/requirements`)),
  setRequirement: (pid: number, num: number, body: RequirementInput) => d<Requirement>(api.put(`${B}/${pid}/swr/requirements/${num}`, body)),
  setLifecycle: (pid: number, num: number, to: Lifecycle, note?: string | null) => d<Requirement>(api.post(`${B}/${pid}/swr/requirements/${num}/lifecycle`, { to, note: note || null })),
  history: (pid: number, num: number) => d<HistoryRow[]>(api.get(`${B}/${pid}/swr/requirements/${num}/history`)),
  priority: (pid: number) => d<PriorityData>(api.get(`${B}/${pid}/swr/priority`)),
  upsertRow: (pid: number, body: { target: { kind: 'FE' | 'UC'; ref: string }; benefit?: number; penalty?: number; cost?: number; risk?: number }) => d<PriorityRow>(api.post(`${B}/${pid}/swr/priority/rows`, body)),
  updateRow: (pid: number, id: number, body: Partial<Pick<PriorityRow, 'benefit' | 'penalty' | 'cost' | 'risk' | 'note'>>) => d<PriorityRow>(api.patch(`${B}/${pid}/swr/priority/rows/${id}`, body)),
  removeRow: (pid: number, id: number) => d<{ removed: boolean }>(api.delete(`${B}/${pid}/swr/priority/rows/${id}`)),
  seedRows: (pid: number, kind: 'FE' | 'UC') => d<{ added: number }>(api.post(`${B}/${pid}/swr/priority/seed`, { kind })),
  glossary: (pid: number) => d<GlossaryList>(api.get(`${B}/${pid}/swr/glossary`)),
  createTerm: (pid: number, body: GlossaryInput) => d<GlossaryTerm>(api.post(`${B}/${pid}/swr/glossary`, body)),
  updateTerm: (pid: number, id: number, body: Partial<GlossaryInput>) => d<GlossaryTerm>(api.patch(`${B}/${pid}/swr/glossary/${id}`, body)),
  deleteTerm: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/swr/glossary/${id}`)),
  dictionary: (pid: number) => d<DictionaryList>(api.get(`${B}/${pid}/swr/dictionary`)),
  createElement: (pid: number, body: DataElementInput) => d<DataElement>(api.post(`${B}/${pid}/swr/dictionary`, body)),
  updateElement: (pid: number, id: number, body: Partial<DataElementInput>) => d<DataElement>(api.patch(`${B}/${pid}/swr/dictionary/${id}`, body)),
  deleteElement: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/swr/dictionary/${id}`)),
  settings: (pid: number, body: SettingsInput) => d<{ weights: Weights; declaredCounts: SwrOverview['declaredCounts']; ignoredNouns: string[] }>(api.put(`${B}/${pid}/swr/settings`, body)),
  sixLinks: (pid: number) => d<SixLinks>(api.get(`${B}/${pid}/swr/six-links`)),
  doc: (pid: number, kind: DocKind) => d<{ doc: TiptapDoc; title: string; filled: string[]; page: { number: number; title: string } | null }>(api.get(`${B}/${pid}/swr/docs/${kind}`)),
  fillDoc: (pid: number, kind: DocKind, body: { create?: boolean } = {}) => d<{ filled: string[]; created: boolean; page: WorkPageDetail }>(api.post(`${B}/${pid}/swr/docs/${kind}/fill`, body)),
  exportDoc: async (pid: number, kind: DocKind, format: 'docx' | 'pdf', diagrams: Array<string | null>) =>
    fileOf(await api.post(`${B}/${pid}/swr/docs/${kind}/export`, { format, diagrams }, { responseType: 'blob', timeout: 180_000 }), `${kind}.${format}`),
  exportXlsx: async (pid: number, what: 'priority' | 'glossary' | 'dictionary' | 'features' | 'six-links') =>
    fileOf(await api.get(`${B}/${pid}/swr/export/${what}.xlsx`, { responseType: 'blob', timeout: 120_000 }), `${what}.xlsx`),
};
