/**
 * dm5 G3 (27/11/2026) — "Kiểm thử, review & UAT": API phía web. Backend: work.ctw6.routes.ts (test-groups),
 * work.fpt.routes.ts (unit/automation-import, unit/lint), work.routes.ts (portal/uat, defect), work.ctw5.routes.ts (grades/self),
 * PATCH /projects/:pid (settings.reviewChecklists · reviewCoolOffHours · testGate · uatRevokeOnClose).
 */
import { api } from './api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

export interface ProjectChecklist { key?: string; name: string; kind: 'DOC' | 'CODE'; sections: Array<{ name: string; items: string[] }> }
export interface QualitySettings { reviewChecklists: ProjectChecklist[]; reviewCoolOffHours: number | null; testGate: 'block' | 'warn' | null; uatRevokeOnClose: boolean }

export function qualitySettingsOf(settings: Record<string, unknown> | null | undefined): QualitySettings {
  const s = (settings ?? {}) as Record<string, unknown>;
  return {
    reviewChecklists: Array.isArray(s.reviewChecklists) ? (s.reviewChecklists as ProjectChecklist[]) : [],
    reviewCoolOffHours: typeof s.reviewCoolOffHours === 'number' ? s.reviewCoolOffHours : null,
    testGate: s.testGate === 'block' || s.testGate === 'warn' ? s.testGate : null,
    uatRevokeOnClose: s.uatRevokeOnClose === true,
  };
}

export type UnitLintCode = 'NO_ABNORMAL' | 'NO_BOUNDARY' | 'ABNORMAL_LT_NORMAL' | 'CASE_NO_CONDITION' | 'CASE_NO_CONFIRM' | 'DUPLICATE_CASE' | 'PRECONDITION_IN_CONDITIONS' | 'NO_PRECONDITION_FIELD';
export interface UnitLint { functions: number; issues: Array<{ functionId: number; function: string; code: UnitLintCode; utcids?: string[]; detail?: string }> }
export interface AutomationImport {
  format: string; tests: number; skipped: number; matched: number; passed: number; failed: number;
  unmatched: Array<{ test: string; reason: 'NO_FUNCTION' | 'NO_UTCID' | 'UTCID_NOT_FOUND' }>;
  missing: Array<{ functionId: number; function: string; utcid: string }>;
  coverage: { format: string; linePct: number | null; branchPct: number | null } | null;
  commitSha: string | null; executedAt: string; note: string; dryRun: boolean;
  updates: Array<{ function: string; utcid: string; result: 'P' | 'F'; test: string }>;
}
export const TEST_GROUPS = ['Happy', 'Empty', 'Boundary', 'Conflict', 'Security', 'Adjacent'] as const;
export interface ReqTestGroups {
  requirement: string; isRequirement: boolean;
  tests: Array<{ key: string; number: number; title: string; labels: string[]; testType: string | null; lastStatus: string | null; lint: Array<{ code: 'PRECONDITION_IN_STEPS' | 'STEP_NO_EXPECTED' | 'NO_STEPS'; steps?: number[] }> }>;
  groups: Array<{ group: (typeof TEST_GROUPS)[number]; count: number; tests: string[] }>;
  missing: string[]; ungrouped: string[];
}
export interface UatRow {
  approvalId: number; title: string; status: string; round: number; milestone: string | null; environment: string | null; build: string | null;
  testerCode: string | null; rating: number | null; conditions: string | null; createdAt: string; decidedAt: string | null; items: number; createdIssues: number;
  decisions: Array<{ side: 'CLIENT' | 'VENDOR'; decision: string; comment: string | null; at: string }>;
}
export interface SelfGradeInput { rubricId?: number | null; templateKey?: string | null; milestone: string; subjectUserId?: number | null; scores: Record<string, number | null>; notes?: Record<string, string>; comment?: string | null }

export const g3Api = {
  saveQualitySettings: (pid: number, settings: Partial<QualitySettings>) => d<unknown>(api.patch(P(pid), { settings })),
  unitLint: (pid: number) => d<UnitLint>(api.get(`${P(pid)}/fpt-tests/unit/lint`)),
  automationImport: (pid: number, body: { report: string; coverage?: string | null; commitSha?: string | null; executedAt?: string | null; dryRun?: boolean }) =>
    d<AutomationImport>(api.post(`${P(pid)}/fpt-tests/unit/automation-import`, body)),
  testGroups: (pid: number, num: number) => d<ReqTestGroups>(api.get(`${P(pid)}/test-groups/${num}`)),
  setLeakage: (pid: number, num: number, leakage: boolean | null) => d<{ leakage: boolean; leakageFlag: boolean | null }>(api.put(`${P(pid)}/issues/${num}/defect`, { leakage })),
  uats: (pid: number) => d<UatRow[]>(api.get(`${P(pid)}/portal/uat`)),
  setTesterCode: (pid: number, aid: number, testerCode: string | null) => d<unknown>(api.patch(`${P(pid)}/portal/uat/${aid}`, { testerCode })),
  restoreClient: (pid: number, uid: number) => d<{ restored: true }>(api.post(`${P(pid)}/portal/clients/${uid}/restore`, {})),
  saveSelfGrade: (pid: number, body: SelfGradeInput) => d<{ id: number; total: number | null }>(api.put(`${P(pid)}/grades/self`, body)),
  deleteSelfGrade: (pid: number, gid: number) => d<{ deleted: true }>(api.delete(`${P(pid)}/grades/self/${gid}`)),
};
