/**
 * CT Work đợt 3C — agent DỰNG SẴN (runtime BUILTIN): lượt chạy, dừng, trần chi phí. Backend: src/routes/work.ctw3c.routes.ts
 * + src/services/work/builtinAgent.service.ts. Tách file riêng để không giẫm work-api.ts / work-agents-api.ts.
 */
import { api } from './api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type RunStatus = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED' | 'CANCELLED' | 'CAPPED';
export const BUILTIN_TASKS = ['WRITE_TESTS', 'WRITE_SPEC', 'ANALYZE', 'SPLIT_EPIC', 'TRIAGE_DESK', 'CUSTOM', 'DRAW_DIAGRAM'] as const;
export type BuiltinTask = (typeof BUILTIN_TASKS)[number];
export const TASK_LABEL: Record<BuiltinTask, string> = {
  WRITE_TESTS: 'Write test cases', WRITE_SPEC: 'Write the spec', ANALYZE: 'Analyse', SPLIT_EPIC: 'Split into issues', TRIAGE_DESK: 'Triage', CUSTOM: 'Do what the issue says', DRAW_DIAGRAM: 'Draw a diagram',
};

export interface AgentRunStep { at: string; step: number; text: string }
export interface AgentRun {
  id: number; agentId: number; projectId: number; issueId: number; task: string; status: RunStatus; requestedById: number;
  input: { note?: string | null; leaseId?: number } | null; steps: AgentRunStep[]; resultText: string | null; error: string | null;
  costUsd: number; startedAt: string | null; finishedAt: string | null; createdAt: string; canCancel: boolean;
}
export interface IssueRun extends AgentRun {
  requestedBy: { id: number; username: string; name: string } | null;
  agent: { id: number; userId: number; username: string; name: string; model: string } | null;
}
export interface AgentRunsView {
  runtime: 'EXTERNAL' | 'BUILTIN';
  spend: {
    todayUsd: number; weekUsd: number; totalUsd: number; inputTokens: number; outputTokens: number;
    agentDailyCapUsd: number; workspaceTodayUsd: number; workspaceDailyCapUsd: number; runCapUsd: number; source: 'measured';
  };
  runs: Array<AgentRun & { issue: { key: string; title: string; url: string } | null }>;
}
export interface BuiltinBudget {
  dailyCapUsd: number; runCapUsd: number; maxSteps: number; custom: boolean; spentTodayUsd: number; model: string;
  canEdit: boolean; canUse: boolean; builtinAgents: number;
  defaults: { agentDailyUsd: number; workspaceDailyUsd: number; runUsd: number; maxSteps: number; perWorkspace: number };
}

export const builtinApi = {
  budget: (wsId: number) => d<BuiltinBudget>(api.get(`${B}/workspaces/${wsId}/builtin-budget`)),
  updateBudget: (wsId: number, body: Partial<Pick<BuiltinBudget, 'dailyCapUsd' | 'runCapUsd' | 'maxSteps'>>) => d<BuiltinBudget>(api.put(`${B}/workspaces/${wsId}/builtin-budget`, body)),
  agentRuns: (wsId: number, agentId: number) => d<AgentRunsView>(api.get(`${B}/workspaces/${wsId}/agents/${agentId}/runs`)),
  issueRuns: (pid: number, num: number) => d<IssueRun[]>(api.get(`${B}/projects/${pid}/issues/${num}/agent-runs`)),
  start: (pid: number, num: number, body: { agentId?: number; task?: BuiltinTask; note?: string | null }) =>
    d<{ run: AgentRun; existing: boolean }>(api.post(`${B}/projects/${pid}/issues/${num}/agent-runs`, body)),
  cancel: (pid: number, runId: number) => d<AgentRun>(api.post(`${B}/projects/${pid}/agent-runs/${runId}/cancel`, {})),
};

export const builtinKeys = {
  budget: (wsId: number) => ['work', 'builtin-budget', wsId] as const,
  agentRuns: (wsId: number, agentId: number) => ['work', 'agents', wsId, agentId, 'runs'] as const,
  issueRuns: (pid: number, num: number) => ['work', 'issue', pid, num, 'agent-runs'] as const,
};

export const RUN_LABEL: Record<RunStatus, string> = {
  QUEUED: 'Queued', RUNNING: 'Running', DONE: 'Done', FAILED: 'Failed', CANCELLED: 'Stopped', CAPPED: 'Cost cap reached',
};
