/**
 * CT Work — dm5 G4 (27/11/2026): client API của gói "Code, phát hành, báo cáo theo vai, CR/RAID & thư viện mẫu".
 * Backend: src/routes/work.dm5g4.routes.ts, work.routes.ts (version, project create), work.governance.routes.ts (CR/RAID),
 * work.code.routes.ts (health — xem code/codeApi.ts). Tách khỏi work-api.ts (G1 sở hữu) để không đụng nhau.
 */
import { api } from './api';
import type { ModuleMap, ProjectKind, ProjectTemplate, ProjectType, WorkVersion } from './work-api';

const B = '/work';
type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

// ─── D14: version ───────────────────────────────────────────────

export type FreezeLevel = 'NONE' | 'FEATURE' | 'CODE' | 'HARD';
export const FREEZE_LEVELS: FreezeLevel[] = ['NONE', 'FEATURE', 'CODE', 'HARD'];
export interface VersionG4 { freezeLevel?: FreezeLevel; gitTag?: string | null; commitSha?: string | null; releaseCi?: string | null }
export const versionG4 = (v: WorkVersion | null | undefined): VersionG4 => (v ?? {}) as VersionG4;

// ─── A25: thư viện mẫu ──────────────────────────────────────────

export type BlueprintKey = 'SWP391_TEAM5' | 'SWP391_SOLO5' | 'SEP490' | 'OJT' | 'SCRUM';
export type BlueprintGroup = 'workflow' | 'types' | 'fields' | 'labels' | 'gates' | 'cadence' | 'stages' | 'docs' | 'checklists' | 'modules';
export interface BlueprintPreview {
  key: BlueprintKey; name: string; nameVi: string; description: string; descriptionVi: string;
  base: { template: ProjectTemplate; type: ProjectType; kind: ProjectKind };
  groups: Array<{ key: BlueprintGroup; label: string; labelVi: string; enabled: boolean; items: string[] }>;
}
export interface ProjectCopyPreview {
  kind: 'project';
  source: { id: number; key: string; name: string; type: string; template: string; kind: string };
  copies: { workflows: Array<{ name: string; statuses: string[]; transitions: number }>; issueTypes: string[]; labels: number; components: number; fields: string[]; stages: number; docPages: number; settings: string[] };
  notCopied: { issues: number; note: string };
}
export interface SetupSummary { applied: Record<string, number | string>; skipped: Array<{ group: string; reason: string }> }
export interface CreateProjectG4Body {
  key: string; name: string; description?: string | null; type: ProjectType; template: ProjectTemplate; visibility?: 'WORKSPACE' | 'PRIVATE';
  kind?: ProjectKind; modules?: Partial<ModuleMap>;
  blueprint?: BlueprintKey | null; groups?: Partial<Record<BlueprintGroup, boolean>> | null; fromProjectId?: number | null; configOnly?: boolean; copyDocBodies?: boolean;
}

// ─── C5: giờ theo vai ───────────────────────────────────────────

export type Hat = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
export const HATS: Hat[] = ['C1', 'C2', 'C3', 'C4', 'C5'];
export interface RoleWeek { weekStart: string; totalHours: number; hours: Record<Hat, number>; pct: Record<Hat, number>; alerts: Array<{ code: 'QA_LOW' | 'OVER_HOURS'; message: string }> }
export interface HoursByRole {
  hats: Array<{ hat: Hat; label: string }>; weeks: RoleWeek[];
  totals: { totalHours: number; hours: Record<Hat, number>; pct: Record<Hat, number> };
  thresholds: { qaMinPct: number; maxWeekHours: number }; guessedHours: number;
}

// ─── C8 / C10 ───────────────────────────────────────────────────

export type ImpactDim = 'scope' | 'schedule' | 'cost' | 'quality' | 'risk' | 'docs';
export type ImpactLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
export const IMPACT_DIMS: ImpactDim[] = ['scope', 'schedule', 'cost', 'quality', 'risk', 'docs'];
export const IMPACT_LEVELS: ImpactLevel[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];
export type ImpactMatrix = Record<ImpactDim, { level: ImpactLevel; note: string | null }>;
export interface CrOption { key?: 'A' | 'B' | 'C'; title: string; effortDays: number | null; pros: string | null; cons: string | null; chosen: boolean }
export type SyncKey = 'srsRoc' | 'trackingQna' | 'trackingIssues' | 'trackingWbs' | 'rtm';
export interface CrG4 {
  parentNumber?: number | null; splitKey?: string | null; impactLevel?: ImpactLevel; impactMatrix?: ImpactMatrix | null; options?: CrOption[];
  children?: Array<{ number: number; key: string; splitKey: string; title: string; status: string }>;
  syncItems?: Array<{ key: SyncKey; label: string; done: boolean }>; syncDone?: number; syncTotal?: number; syncOpen?: boolean;
}

export type AiDecision = 'ACCEPTED' | 'REJECTED' | 'PARTIAL';

export const g4Api = {
  updateVersion: (pid: number, versionId: number, body: VersionG4) => d<WorkVersion>(api.patch(`${P(pid)}/versions/${versionId}`, body)),
  createVersion: (pid: number, body: { name: string; description?: string | null; startDate?: string | null; releaseDate?: string | null } & VersionG4) =>
    d<WorkVersion>(api.post(`${P(pid)}/versions`, body)),
  releaseVersion: (pid: number, versionId: number, body: { moveUnresolvedTo: number | null; releaseDate?: string | null; gitTag?: string | null; commitSha?: string | null }) =>
    d<{ version: WorkVersion; moved: number; ci: { sha: string; state: string; pr: number | null; url: string | null } | null }>(api.post(`${P(pid)}/versions/${versionId}/release`, body)),

  blueprints: () => d<BlueprintPreview[]>(api.get(`${B}/project-blueprints`)),
  preview: (wsId: number, body: { blueprint?: BlueprintKey; groups?: Partial<Record<BlueprintGroup, boolean>> | null; fromProjectId?: number }) =>
    d<({ kind: 'blueprint' } & BlueprintPreview) | ProjectCopyPreview>(api.post(`${B}/workspaces/${wsId}/projects/preview`, body)),
  createProject: (wsId: number, body: CreateProjectG4Body) =>
    d<{ id: number; key: string; name: string; kind: ProjectKind; modules: ModuleMap; setup?: SetupSummary }>(api.post(`${B}/workspaces/${wsId}/projects`, body, { timeout: 120_000 })),

  hoursByRole: (pid: number, q: { from?: string; to?: string; userId?: number } = {}) => d<HoursByRole>(api.get(`${P(pid)}/reports/hours-by-role`, { params: q })),

  updateCr: (pid: number, num: number, body: { impactMatrix?: Partial<ImpactMatrix> | null; options?: CrOption[] | null }) => d<CrG4>(api.patch(`${P(pid)}/changes/${num}`, body)),
  splitCr: (pid: number, num: number, parts: Array<{ title: string; impactScope?: string | null; scheduleDays?: number | null }>) =>
    d<{ created: Array<{ number: number; key: string; splitKey: string }> }>(api.post(`${P(pid)}/changes/${num}/split`, { parts })),
  syncCr: (pid: number, num: number, body: Partial<Record<SyncKey, boolean>> & { note?: string | null }) => d<CrG4>(api.put(`${P(pid)}/changes/${num}/sync`, body)),
  raidToIssue: (pid: number, num: number, body: { use?: 'mitigation' | 'contingency'; title?: string | null } = {}) =>
    d<{ issue: { number: number; key: string; title: string } }>(api.post(`${P(pid)}/raid/${num}/to-issue`, body)),

  setWorklogHat: (pid: number, num: number, logId: number, hat: Hat | null) => d<{ id: number; hat: Hat | null }>(api.patch(`${P(pid)}/issues/${num}/worklogs/${logId}`, { hat })),
  aiUsageDecision: (pid: number, id: number, decision: AiDecision | null) => d<{ id: number; decision: AiDecision | null }>(api.patch(`${P(pid)}/fpt-reports/ai-usage/${id}`, { decision })),
};

export const g4Keys = {
  blueprints: ['work', 'g4', 'blueprints'] as const,
  preview: (wsId: number, k: string) => ['work', 'g4', 'preview', wsId, k] as const,
  hoursByRole: (pid: number, from: string, to: string, userId: number | null) => ['work', 'project', pid, 'g4', 'roles', from, to, userId] as const,
};
