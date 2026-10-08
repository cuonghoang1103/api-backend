/**
 * CT Work — client cho tài liệu kiểm thử chuẩn FPT (Report 5.1 Unit + 5.2 Integration), đợt 1b 08/10/2026.
 * Backend: src/routes/work.fpt.routes.ts + src/services/work/fptTests.service.ts — đổi kiểu bên này thì đổi bên kia.
 * Tách riêng khỏi lib/work-api.ts để không giẫm tệp đang có nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = (pid: number) => `/work/projects/${pid}/fpt-tests`;

export type CaseType = 'N' | 'A' | 'B';
export type CaseResult = 'P' | 'F';
export type UnitSection = 'COND' | 'CONFIRM';
export type ItStatus = 'Passed' | 'Failed' | 'Pending' | 'N/A';
export const IT_STATUSES: ItStatus[] = ['Passed', 'Failed', 'Pending', 'N/A'];
export const MAX_ROUNDS = 4;

export interface DocMeta {
  projectName: string; projectCode: string; creator: string | null; reviewer: string | null; version: string;
  unitIssueDate: string | null; intIssueDate: string | null; environment: string | null; tcPerKloc: number;
  unitNotes: string | null; intNotes: string | null;
}
export interface ChangeRecord {
  id: number; report: 'UNIT' | 'INT'; effectiveDate: string; version: string; changeItem: string | null;
  action: 'A' | 'D' | 'M' | string; description: string | null; reference: string | null; position: number;
}
export interface FptDoc { meta: DocMeta; overrides: { projectName: string | null; projectCode: string | null }; changes: ChangeRecord[]; canEdit: boolean }

export interface UnitStats { passed: number; failed: number; untested: number; n: number; a: number; b: number; total: number }
export interface UnitSummary extends UnitStats {
  functions: number; coverage: number; successCoverage: number; normalPct: number; abnormalPct: number; boundaryPct: number;
  totalLoc: number; kloc: number; requiredCases: number; casesWithLoc: number; functionsWithoutLoc: number; belowNorm: number; meetsNorm: boolean | null;
}
export interface UnitFunctionHead {
  id: number; moduleName: string; methodName: string; sheetName: string | null; description: string | null; preCondition: string | null;
  testRequirement: string | null; codeRef: string | null; loc: number | null; createdBy: string | null; executedBy: string | null;
  position: number; updatedAt: string;
}
export interface UnitFunctionListItem extends UnitFunctionHead { rowCount: number; stats: UnitStats; requiredCases: number | null; belowNorm: boolean }
export interface UnitRow { id: number; section: UnitSection; groupName: string; label: string | null; value: string | null }
export interface UnitCase { id: number; type: CaseType; result: CaseResult | null; executedAt: string | null; defectId: string | null; note: string | null; rowIds: number[] }
export interface UnitFunction extends UnitFunctionHead {
  rows: UnitRow[]; cases: UnitCase[]; stats: UnitStats; tcPerKloc: number; requiredCases: number | null; belowNorm: boolean;
}
export type FunctionInput = Partial<Pick<UnitFunctionHead, 'moduleName' | 'methodName' | 'sheetName' | 'description' | 'preCondition' | 'testRequirement' | 'codeRef' | 'loc' | 'createdBy' | 'executedBy' | 'position'>>;
export interface MatrixInput {
  version?: string;
  rows: Array<{ key: string; section: UnitSection; groupName: string; label?: string | null; value?: string | null }>;
  cases: Array<{ key: string; type: CaseType; result?: CaseResult | null; executedAt?: string | null; defectId?: string | null; note?: string | null }>;
  marks: Array<[string, string]>;
}
export interface AiSuggestion {
  conditions: Array<{ group: string; label?: string | null; value: string }>;
  confirmations: Array<{ group: string; label?: string | null; value: string }>;
  cases: Array<{ type: CaseType; title?: string; conditions: number[]; confirmations: number[] }>;
  notes?: string;
}

export interface ItRound { status: ItStatus | null; date: string | null; tester: string | null }
export interface ItCase {
  id?: number; section: string | null; description: string; procedure: string | null; testData: string | null; expected: string | null;
  actual: string | null; preConditions: string | null; evidence: string | null; note: string | null; rounds: ItRound[];
}
export interface ItStats { passed: number; failed: number; pending: number; na: number; total: number; rounds: Array<{ passed: number; failed: number; pending: number; na: number }>; lastRound: number }
export interface ItModuleHead { id: number; name: string; sheetName: string | null; idPrefix: string; description: string | null; preCondition: string | null; testRequirement: string | null; position: number; updatedAt: string }
export interface ItModuleListItem extends ItModuleHead { stats: ItStats }
export interface ItModule extends ItModuleHead { cases: ItCase[]; stats: ItStats }
export type ModuleInput = Partial<Pick<ItModuleHead, 'name' | 'sheetName' | 'idPrefix' | 'description' | 'preCondition' | 'testRequirement' | 'position'>>;

export interface ImportResult {
  report: 'unit' | 'integration'; dryRun: boolean; mode: 'append' | 'replace'; functions?: number; modules?: number; cases: number; changes: number;
  warnings: string[]; preview: Array<{ name: string; module?: string; cases: number; rows?: number }>;
}

export const fptKeys = {
  all: (pid: number) => ['work', 'fpt', pid] as const,
  doc: (pid: number) => ['work', 'fpt', pid, 'doc'] as const,
  unit: (pid: number) => ['work', 'fpt', pid, 'unit'] as const,
  fn: (pid: number, id: number) => ['work', 'fpt', pid, 'unit', id] as const,
  it: (pid: number) => ['work', 'fpt', pid, 'it'] as const,
  mod: (pid: number, id: number) => ['work', 'fpt', pid, 'it', id] as const,
};

export const fptApi = {
  doc: (pid: number) => d<FptDoc>(api.get(`${B(pid)}/doc`)),
  updateDoc: (pid: number, body: Partial<Omit<DocMeta, 'projectName' | 'projectCode'>> & { projectName?: string | null; projectCode?: string | null }) => d<FptDoc>(api.put(`${B(pid)}/doc`, body)),
  addChange: (pid: number, body: Omit<ChangeRecord, 'id' | 'position'>) => d<ChangeRecord>(api.post(`${B(pid)}/changes`, body)),
  updateChange: (pid: number, id: number, body: Partial<Omit<ChangeRecord, 'id' | 'position'>>) => d<ChangeRecord>(api.patch(`${B(pid)}/changes/${id}`, body)),
  deleteChange: (pid: number, id: number) => d(api.delete(`${B(pid)}/changes/${id}`)),

  functions: (pid: number) => d<{ tcPerKloc: number; summary: UnitSummary; functions: UnitFunctionListItem[] }>(api.get(`${B(pid)}/unit`)),
  createFunction: (pid: number, body: FunctionInput & { moduleName: string; methodName: string; starter?: boolean }) => d<UnitFunction>(api.post(`${B(pid)}/unit`, body)),
  fn: (pid: number, id: number) => d<UnitFunction>(api.get(`${B(pid)}/unit/${id}`)),
  updateFunction: (pid: number, id: number, body: FunctionInput) => d<UnitFunction>(api.patch(`${B(pid)}/unit/${id}`, body)),
  deleteFunction: (pid: number, id: number) => d(api.delete(`${B(pid)}/unit/${id}`)),
  saveMatrix: (pid: number, id: number, body: MatrixInput) => d<UnitFunction>(api.put(`${B(pid)}/unit/${id}/matrix`, body)),
  duplicateFunction: (pid: number, id: number) => d<UnitFunction>(api.post(`${B(pid)}/unit/${id}/duplicate`, {})),
  aiSuggest: (pid: number, id: number, body: { signature?: string | null; extra?: string | null }) =>
    d<AiSuggestion>(api.post(`${B(pid)}/unit/${id}/ai-suggest`, body, { timeout: 120_000 })),

  modules: (pid: number) => d<{ modules: ItModuleListItem[]; summary: { passed: number; failed: number; pending: number; na: number; total: number; coverage: number; successCoverage: number } }>(api.get(`${B(pid)}/integration`)),
  createModule: (pid: number, body: ModuleInput & { name: string }) => d<ItModule>(api.post(`${B(pid)}/integration`, body)),
  mod: (pid: number, id: number) => d<ItModule>(api.get(`${B(pid)}/integration/${id}`)),
  updateModule: (pid: number, id: number, body: ModuleInput) => d<ItModule>(api.patch(`${B(pid)}/integration/${id}`, body)),
  deleteModule: (pid: number, id: number) => d(api.delete(`${B(pid)}/integration/${id}`)),
  saveCases: (pid: number, id: number, body: { version?: string; cases: Array<Omit<ItCase, 'id'>> }) => d<ItModule>(api.put(`${B(pid)}/integration/${id}/cases`, body)),

  exportXlsx: async (pid: number, report: 'unit' | 'integration', module?: string) => {
    const q = new URLSearchParams({ report, ...(module ? { module } : {}) });
    const res = await api.get(`${B(pid)}/export?${q}`, { responseType: 'blob', timeout: 120_000 });
    const cd = String(res.headers['content-disposition'] ?? '');
    const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
    const name = star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? `Report_${report}.xlsx`;
    return { blob: res.data as Blob, fileName: name };
  },
  /** Gửi tệp NHỊ PHÂN (ArrayBuffer) — không dùng FormData: instance axios đặt cứng JSON sẽ biến FormData thành `{}`. */
  importXlsx: (pid: number, file: ArrayBuffer, opts: { report: 'auto' | 'unit' | 'integration'; mode: 'append' | 'replace'; dryRun: boolean }) =>
    d<ImportResult>(api.post(`${B(pid)}/import?${new URLSearchParams({ report: opts.report, mode: opts.mode, dryRun: opts.dryRun ? '1' : '0' })}`, file, {
      headers: { 'Content-Type': 'application/octet-stream' }, timeout: 180_000, transformRequest: [(x) => x],
    })),
};

export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export const TYPE_LABEL: Record<CaseType, string> = { N: 'Normal', A: 'Abnormal', B: 'Boundary' };
export const utcId = (i: number) => `UTCID${String(i + 1).padStart(2, '0')}`;
export const pct = (x: number) => `${Number.isInteger(x) ? x : x.toFixed(1)}%`;
