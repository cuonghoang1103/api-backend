/**
 * CT Work — AI agent thành viên (CTW-28 GĐ1, A13–A15). Backend: src/routes/work.agents.routes.ts (quản lý/token/webhook/
 * inbox/agent-settings), src/routes/work.agentsUi.routes.ts (chip lease, khối Agent activity, My agents need you) và
 * — phần A12 do phiên BE làm — báo cáo People vs Agents (xem docs/ctw-dot-2-hop-dong-api.md).
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const qs = (q: Record<string, string | number | undefined | null>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

// ─── Kiểu ────────────────────────────────────────────────────────

export type AgentStatus = 'ACTIVE' | 'PAUSED' | 'RETIRED';
export type AgentRuntime = 'EXTERNAL' | 'BUILTIN';

export interface AgentLeaseBrief {
  id: number; issueId: number; projectId: number; expiresAt: string; progressPct: number | null;
  claimedAt?: string; progress?: string | null;
}

export interface WorkAgent {
  id: number;
  userId: number;
  workspaceId: number;
  ownerId: number;
  model: string;
  roleText: string | null;
  capabilities: Record<string, boolean>;
  runtime: AgentRuntime;
  status: AgentStatus;
  parallelSlots: number;
  dailyCostCapUsd: number | null;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
  retiredAt: string | null;
  user: WorkUser;
  owner: WorkUser;
  activeLeases?: AgentLeaseBrief[];
  /** Chỉ có ở GET chi tiết. */
  canManage?: boolean;
  projects?: Array<{ id: number; key: string; name: string; role: string }>;
}

export interface AgentTokenRow {
  id: number; name: string; prefix: string; scopes: string[]; projectIds: number[];
  expiresAt: string | null; lastUsedAt: string | null; lastUsedIp: string | null; createdAt: string;
}
/** Token vừa cấp — `token` chỉ có MỘT lần (không lưu ở đâu khác). */
export interface IssuedAgentToken {
  id: number; name: string; prefix: string; scopes: string[]; projectIds: unknown; expiresAt: string | null; createdAt: string;
  token: string;
}

export interface TokenInput { name?: string; scopes?: Array<'read' | 'write'>; projectIds?: number[]; expiresInDays?: number | null }

export interface CreateAgentBody {
  name: string; model: string; ownerId?: number; roleText?: string | null; capabilities?: Record<string, boolean>;
  parallelSlots?: number; projectIds?: number[]; projectRole?: 'MEMBER' | 'VIEWER'; token?: TokenInput | null;
  /** Đợt 3C: BUILTIN = CT Work chạy hộ (Pro/admin, không token). */
  runtime?: AgentRuntime;
}

export interface AgentWebhook {
  id: number; url: string; secret: string; events: string[]; enabled: boolean;
  lastSentAt: string | null; lastError: string | null; failCount: number; createdAt: string;
}

export interface AgentInboxRow {
  id: number; agentId: number; projectId: number; issueId: number | null; type: string;
  payload: { summary?: string; issue?: { key: string; title: string; url: string } | null; actor?: { username: string | null; kind: string } | null; [k: string]: unknown };
  createdAt: string; ackedAt: string | null; delivery: 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED'; attempts: number;
}

export interface AgentLeaseRow {
  id: number; status: 'ACTIVE' | 'RELEASED' | 'EXPIRED'; claimedAt: string; heartbeatAt: string; expiresAt: string; releasedAt: string | null;
  progress: string | null; progressPct: number | null; issueId: number;
  issue: { key: string; title: string; url: string } | null;
}

export interface AgentSettings {
  doneToReview: boolean;
  reviewStatusId: number | null;
  allowCreateIssues: boolean;
  allowSelfAssign: boolean;
  maxOpenLeases: number;
  leaseMinutes: number;
  reviewerIds: number[];
}
export interface AgentSettingsView extends AgentSettings {
  reviewStatusCandidates: Array<{ id: number; name: string; category: string; workflowId: number }>;
}

export interface LeaseChip {
  issueId: number; leaseId: number; status: 'ACTIVE' | 'EXPIRED'; progress: string | null; progressPct: number | null;
  heartbeatAt: string; expiresAt: string; agentUserId: number;
}

/** A12-4 (phiên BE, docs/ctw-dot-2-hop-dong-api.md): GET /projects/:pid/issues/:num/agent-activity. */
export interface AgentBrief { id: number; userId: number; username: string; displayName: string | null; model: string; status?: AgentStatus; owner?: WorkUser; lastSeenAt?: string | null }
export interface IssueAgentActivity {
  leases: Array<{
    id: number; status: 'ACTIVE' | 'RELEASED' | 'EXPIRED'; claimedAt: string; heartbeatAt: string; expiresAt: string; releasedAt: string | null;
    progress: string | null; progressPct: number | null; agent: AgentBrief;
  }>;
  usage: null | {
    totals: { inputTokens: number; outputTokens: number; cacheReadTokens: number; costUsd: number; reported: number; gateway: number; rows: number };
    byAgent: Array<{ agentId: number; username: string; displayName: string | null; inputTokens: number; outputTokens: number; costUsd: number }>;
    recent: Array<{ id: number; agentId: number; model: string; inputTokens: number; outputTokens: number; cacheReadTokens: number; costUsd: number; source: 'REPORTED' | 'GATEWAY'; note: string | null; createdAt: string }>;
  };
}

export interface AgentsNeedMe {
  agents: Array<{ id: number; userId: number; status: AgentStatus; model: string; workspaceSlug: string; user: WorkUser }>;
  review: Array<{ key: string; title: string; url: string; status: { name: string; category: string; color: string }; agentUserId: number | null; project: { key: string; name: string }; updatedAt: string }>;
  expired: Array<{ key: string; title: string; url: string; agentUserId: number; expiredAt: string | null; flagReason: string | null }>;
  approvals: Array<{ id: number; title: string; createdAt: string; agentUserId: number | null; targetType: string; project: { key: string; name: string }; url: string }>;
}

// ─── Báo cáo (A12 — docs/ctw-dot-2-hop-dong-api.md; tiền agent là USD ƯỚC LƯỢNG, phần lớn agent tự khai) ──

export interface CostSource { reported: number; gateway: number }
export interface TokenTotals { in: number; out: number; cacheRead: number }
export interface AgentReportRow {
  agent: AgentBrief;
  issuesTouched: number; issuesResolved: number; pointsResolved: number; returnedCount: number; returnRate: number;
  leaseMinutes: number; worklogMinutes: number; autoWorklogMinutes: number;
  tokens: TokenTotals; costUsd: number; costSource: CostSource;
  costPerPoint: number | null; costPerResolved: number | null;
}
export interface HumanReportRow { user: WorkUser; worklogMinutes: number; hours: number; cost: number | null; issuesResolved: number }
export interface AgentsReport {
  from: string; to: string; sprintId: number | null;
  agents: AgentReportRow[];
  humans: HumanReportRow[];
  totals: {
    agents: { issuesResolved: number; returnedCount: number; returnRate: number; pointsResolved: number; costUsd: number; costSource: CostSource; tokens: TokenTotals; leaseMinutes: number; worklogMinutes: number; costPerPoint: number | null; costPerResolved: number | null };
    humans: { hours: number; worklogMinutes: number; cost: number | null; issuesResolved: number };
  };
  currency: string | null;
}
export interface AgentsDashboardWeek {
  weekStart: string;
  humanResolved: number | null; agentResolved: number; agentReturned: number;
  agentCostUsd: number; humanHours: number | null;
}
export interface AgentsDashboard {
  days: number; from: string; to: string; scope: 'ALL' | 'OWN';
  weeks: AgentsDashboardWeek[];
  agents: Array<{
    agent: AgentBrief; issuesResolved: number; pointsResolved: number; returnedCount: number; returnRate: number;
    costUsd: number; costSource: CostSource; costPerPoint: number | null; tokens: TokenTotals; leaseMinutes: number; activeLeases: number;
  }>;
  totals: { humanResolved: number | null; agentResolved: number; agentReturned: number; agentReturnRate: number; agentCostUsd: number; humanHours: number | null; costSource: CostSource };
}

// ─── Gọi API ─────────────────────────────────────────────────────

const ws = (wsId: number) => `${B}/workspaces/${wsId}/agents`;

export const agentsApi = {
  list: (wsId: number, includeRetired = false) => d<WorkAgent[]>(api.get(`${ws(wsId)}${includeRetired ? '?includeRetired=1' : ''}`)),
  get: (wsId: number, id: number) => d<WorkAgent>(api.get(`${ws(wsId)}/${id}`)),
  create: (wsId: number, body: CreateAgentBody) => d<{ agent: WorkAgent; token: IssuedAgentToken | null }>(api.post(ws(wsId), body)),
  convert: (wsId: number, body: { userId: number; ownerId: number; model: string; roleText?: string | null; token?: TokenInput | null }) =>
    d<{ agent: WorkAgent; token: IssuedAgentToken | null; demotedProjectRoles: number; revokedTokens: number; pendingApprovalSteps: number }>(api.post(`${ws(wsId)}/convert`, body)),
  update: (wsId: number, id: number, body: Partial<{ name: string; model: string; roleText: string | null; capabilities: Record<string, boolean>; ownerId: number; parallelSlots: number; dailyCostCapUsd: number | null }>) =>
    d<WorkAgent>(api.patch(`${ws(wsId)}/${id}`, body)),
  setStatus: (wsId: number, id: number, action: 'pause' | 'resume' | 'retire') => d<WorkAgent>(api.post(`${ws(wsId)}/${id}/${action}`)),
  tokens: (wsId: number, id: number) => d<AgentTokenRow[]>(api.get(`${ws(wsId)}/${id}/tokens`)),
  createToken: (wsId: number, id: number, body: TokenInput & { name: string }) => d<IssuedAgentToken>(api.post(`${ws(wsId)}/${id}/tokens`, body)),
  revokeToken: (wsId: number, id: number, tokenId: number) => d(api.delete(`${ws(wsId)}/${id}/tokens/${tokenId}`)),
  inbox: (wsId: number, id: number) => d<AgentInboxRow[]>(api.get(`${ws(wsId)}/${id}/inbox`)),
  leaseHistory: (wsId: number, id: number) => d<AgentLeaseRow[]>(api.get(`${ws(wsId)}/${id}/leases`)),
  webhooks: (wsId: number, id: number) => d<AgentWebhook[]>(api.get(`${ws(wsId)}/${id}/webhooks`)),
  createWebhook: (wsId: number, id: number, body: { url: string; events?: string[] }) => d<AgentWebhook>(api.post(`${ws(wsId)}/${id}/webhooks`, body)),
  updateWebhook: (wsId: number, id: number, hid: number, body: { url?: string; events?: string[]; enabled?: boolean }) =>
    d<AgentWebhook>(api.patch(`${ws(wsId)}/${id}/webhooks/${hid}`, body)),
  deleteWebhook: (wsId: number, id: number, hid: number) => d(api.delete(`${ws(wsId)}/${id}/webhooks/${hid}`)),
  testWebhook: (wsId: number, id: number, hid: number) => d<{ ok: boolean; status?: number; error?: string }>(api.post(`${ws(wsId)}/${id}/webhooks/${hid}/test`)),

  settings: (pid: number) => d<AgentSettingsView>(api.get(`${B}/projects/${pid}/agent-settings`)),
  updateSettings: (pid: number, body: Partial<AgentSettings>) => d<AgentSettings>(api.put(`${B}/projects/${pid}/agent-settings`, body)),

  leases: (pid: number) => d<LeaseChip[]>(api.get(`${B}/projects/${pid}/agent-leases`)),
  issueActivity: (pid: number, num: number) => d<IssueAgentActivity>(api.get(`${B}/projects/${pid}/issues/${num}/agent-activity`)),
  needMe: () => d<AgentsNeedMe>(api.get(`${B}/me/agents-need-you`)),

  // A12 (phiên BE): báo cáo
  projectReport: (pid: number, q: { from?: string; to?: string; sprintId?: number | null } = {}) =>
    d<AgentsReport>(api.get(`${B}/projects/${pid}/reports/agents${qs(q)}`)),
  dashboard: (wsId: number, days = 30) => d<AgentsDashboard>(api.get(`${ws(wsId)}/dashboard${qs({ days })}`)),
};

export const agentKeys = {
  list: (wsId: number) => ['work', 'agents', wsId] as const,
  detail: (wsId: number, id: number) => ['work', 'agents', wsId, id] as const,
  tokens: (wsId: number, id: number) => ['work', 'agents', wsId, id, 'tokens'] as const,
  webhooks: (wsId: number, id: number) => ['work', 'agents', wsId, id, 'webhooks'] as const,
  inbox: (wsId: number, id: number) => ['work', 'agents', wsId, id, 'inbox'] as const,
  leaseHistory: (wsId: number, id: number) => ['work', 'agents', wsId, id, 'leases'] as const,
  dashboard: (wsId: number, days: number) => ['work', 'agents', wsId, 'dashboard', days] as const,
  /** Dưới wk.project(pid) ⇒ project.updated (đổi cài đặt agent) làm tươi. */
  settings: (pid: number) => ['work', 'project', pid, 'agent-settings'] as const,
  /** Riêng — useProjectRealtime làm tươi khi có agentProgress (không kéo cả board). */
  leases: (pid: number) => ['work', 'agent-leases', pid] as const,
  /** Dưới wk.issue(pid) ⇒ mọi sự kiện thẻ làm tươi. */
  issueActivity: (pid: number, num: number) => ['work', 'issue', pid, num, 'agent-activity'] as const,
  needMe: ['work', 'agents-need-you'] as const,
  /** Dưới wk.reports(pid) ⇒ sự kiện thẻ làm tươi. */
  report: (pid: number, from?: string, to?: string) => ['work', 'reports', pid, 'agents', from ?? '', to ?? ''] as const,
};

/** Lệnh dán vào máy chạy Claude Code — token chỉ có trong biến, không ghi vào log. */
/** `origin` = publicOrigin() của ui.tsx (app desktop app:// ⇒ cuongthai.com). */
export function mcpAddCommand(token: string, origin: string) {
  return `claude mcp add --transport http ctwork ${origin}/api/v1/work/mcp \\\n  --header "Authorization: Bearer ${token}"`;
}

export const AGENT_MODELS = ['claude-sonnet-5', 'claude-opus-5', 'claude-opus-4-8', 'gpt-6-sol', 'gpt-5.4-mini', 'custom'];

export const INBOX_EVENT_LABEL: Record<string, string> = {
  get 'issue.assigned'() { return wt('agents.evAssigned'); },
  get 'comment.mention'() { return wt('agents.evMention'); },
  get 'comment.on_my_issue'() { return wt('agents.evComment'); },
  get 'issue.returned'() { return wt('agents.evReturned'); },
  get 'handoff.received'() { return wt('agents.evHandoff'); },
  get 'approval.decided'() { return wt('agents.evApproval'); },
  get 'issue.flag'() { return wt('agents.evFlag'); },
  get 'lease.expired'() { return wt('agents.evLease'); },
};
export const WEBHOOK_EVENT_OPTIONS = Object.keys(INBOX_EVENT_LABEL);
