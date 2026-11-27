/**
 * CT Work — dm5 G1 (27/11/2026): cổng quy trình & nhịp vận hành — các tuyến đọc của work.dm5a.routes.ts.
 * Kiểu khớp src/services/work/dm5a.service.ts. Khoá settings của gói (readyRequirements, wipGuards, capacity, ragRules,
 * moscowCapPct, stageGateBlocksWork, retroActionCap, doneRequirements.requireCiGreen/requirePr) ghi qua workApi.updateProject.
 */
import { api } from './api';
import type { CapacityVerdict } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

export type RagLevel = 'GREEN' | 'AMBER' | 'RED';

export const dm5Keys = {
  guards: (pid: number, sid: number) => ['work', 'dm5a', 'guards', pid, sid] as const,
  warnings: (pid: number) => ['work', 'reports', pid, 'dm5a', 'warnings'] as const,
  rag: (pid: number) => ['work', 'reports', pid, 'dm5a', 'rag'] as const,
  moscow: (pid: number, q: string) => ['work', 'dm5a', 'moscow', pid, q] as const,
  ages: (pid: number) => ['work', 'dm5a', 'ages', pid] as const,
};

export interface MoscowCheck {
  enabled: boolean; reason?: 'NO_FIELD'; cap: number | null; unit?: 'POINTS' | 'HOURS'; scope?: 'sprint' | 'version' | 'open';
  must?: number; should?: number; could?: number; wont?: number; unclassified?: number; mustPct?: number | null; over?: boolean;
}

export interface SprintGuards {
  sprint: { id: number; name: string; state: string; from: string; to: string };
  readyRule: boolean;
  notReady: Array<{ number: number; key: string; title: string; missing: string[] }>;
  capacity: CapacityVerdict & { unestimated: number; members: number };
  moscow: MoscowCheck;
}

export interface EarlyWarning {
  code: 'BLOCKED_24H' | 'HIGH_IDLE_48H' | 'BURNDOWN_FLAT' | 'SCOPE_ADDED';
  level: RagLevel; count: number; days?: number; points?: number; jql?: string;
  items?: Array<{ key: string; number: number; title: string; days: number }>;
}
export interface EarlyWarnings {
  warnings: EarlyWarning[];
  sprint: { name: string; flatDays: number; flatSource: string; addedPoints: number; addedIssues: number[]; committed: number; unit: string } | null;
  at: string;
}

export interface ProjectRag {
  overall: RagLevel;
  dimensions: Array<{ key: 'schedule' | 'scope' | 'quality' | 'effort'; value: number | null; level: RagLevel; detail: Record<string, unknown> | null }>;
  rules: Record<'schedule' | 'scope' | 'quality' | 'effort', { amber: number; red: number }>;
  completionPct: number | null;
  issues: number;
}

export const dm5Api = {
  sprintGuards: (pid: number, sid: number) => d<SprintGuards>(api.get(`${P(pid)}/sprints/${sid}/guards`)),
  earlyWarnings: (pid: number) => d<EarlyWarnings>(api.get(`${P(pid)}/early-warnings`)),
  rag: (pid: number) => d<ProjectRag>(api.get(`${P(pid)}/rag`)),
  moscow: (pid: number, q: { sprintId?: number; versionId?: number } = {}) => {
    const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v).map(([k, v]) => [k, String(v)])).toString();
    return d<MoscowCheck>(api.get(`${P(pid)}/moscow${qs ? `?${qs}` : ''}`));
  },
  boardAges: (pid: number) => d<Record<number, number>>(api.get(`${P(pid)}/board/ages`)),
};

/** Màu chữ/nền theo mức RAG (biến theme của CT Work). */
export const ragColor = (l: RagLevel | null | undefined) =>
  l === 'RED' ? 'var(--w-red)' : l === 'AMBER' ? 'var(--w-orange)' : l === 'GREEN' ? 'var(--w-green)' : 'var(--w-text-3)';
