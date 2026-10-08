'use client';

/**
 * Khối "Agent activity" trên thẻ (CTW-28 A14/A15, thiết kế §7): agent đang làm (lease + tiến độ + nhịp tim gần nhất),
 * các lần nhận thẻ trước, và CHI PHÍ của thẻ (token/$ theo agent, ghi rõ nguồn: tự khai vs CT Work đo).
 * Dữ liệu: GET /projects/:pid/issues/:num/agent-activity (A12-4, phiên BE). Tự ẩn khi thẻ chưa từng dính agent.
 * Khách cổng không bao giờ thấy (server 403 + không gọi).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, ChevronDown, ChevronRight, Coins, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type IssueDetail, type ProjectConfig } from '@/lib/work-api';
import { agentKeys, agentsApi, type IssueAgentActivity as Activity } from '@/lib/work-agents-api';
import { wk } from '../hooks';
import { Dialog, relativeTime, Spinner, UserAvatar } from '../ui';
import { tokensFmt, usd } from './AgentBits';
import { useAgentDirectory, useWorkspaceAgents } from './directory';
import { LeaseBadge, projectHasAgents } from './leases';

type LeaseRow = Activity['leases'][number];

function agentUser(a: LeaseRow['agent']) {
  return { id: a.userId, username: a.username, displayName: a.displayName, fullName: null, avatarUrl: null, kind: 'AGENT' as const };
}

function leaseLine(l: LeaseRow) {
  if (l.status === 'ACTIVE') return `heartbeat ${relativeTime(l.heartbeatAt)} · claimed ${relativeTime(l.claimedAt)}`;
  const mins = Math.max(1, Math.round((new Date(l.releasedAt ?? l.heartbeatAt).getTime() - new Date(l.claimedAt).getTime()) / 60_000));
  const dur = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  return `${l.status === 'EXPIRED' ? 'expired' : 'released'} ${relativeTime(l.releasedAt ?? l.expiresAt)} · worked ${dur}`;
}

/**
 * CTW-34 (GĐ1 cho agent EXTERNAL): "Assign to AI" = giao thẻ cho một agent ACTIVE của dự án — đó chính là hàng đợi của
 * agent (thẻ giao cho nó, chưa có lease; thiết kế §4.4). Inbox `issue.assigned` tự sinh ⇒ agent nhận qua SSE/webhook/
 * wait_events rồi claim. Lời dặn (tuỳ chọn) đi kèm thành bình luận INTERNAL @nhắc agent. Agent BUILTIN chạy hộ (GĐ2,
 * agent-runs) chưa có — nút này không giả vờ chạy gì.
 */
function AssignToAi({ config, issue }: { config: ProjectConfig; issue: IssueDetail }) {
  const qc = useQueryClient();
  const dir = useAgentDirectory((st) => st.byUser);
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const agents = config.members.filter((m) => m.kind === 'AGENT' && m.role === 'MEMBER' && dir[m.id]?.status === 'ACTIVE');
  const go = useMutation({
    mutationFn: async () => {
      const a = agents.find((m) => m.id === pick)!;
      await workApi.updateIssue(config.id, issue.number, { assigneeId: a.id, version: issue.version });
      if (note.trim()) {
        await workApi.addComment(config.id, issue.number, {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'mention', attrs: { id: String(a.id), label: userName(a) } }, { type: 'text', text: ` ${note.trim()}` }] }],
        }, 'INTERNAL');
      }
      return a;
    },
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: wk.issue(config.id) });
      qc.invalidateQueries({ queryKey: wk.board(config.id) });
      qc.invalidateQueries({ queryKey: wk.issues(config.id) });
      toast.success(`Assigned to ${userName(a)} — it will pick the issue up from its queue`);
      setOpen(false); setNote(''); setPick(null);
    },
    onError: (err) => toast.error(workError(err, 'Could not assign the issue')),
  });
  if (!agents.length || !config.permissions.editIssues) return null;
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => { setPick(agents[0]?.id ?? null); setOpen(true); }} data-testid="assign-to-ai">
        <Sparkles size={12} /> Assign to AI
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Assign to an AI agent" width={480}>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          The agent gets the issue in its queue and claims it when it starts. Its “Done” goes to review first; you stay in charge of closing it.
        </p>
        <div className="mb-3 space-y-1" role="radiogroup" aria-label="Agent">
          {agents.map((m) => (
            <label key={m.id} className={cn('flex cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2', pick === m.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
              <input type="radio" name="ai-agent" className="accent-[var(--w-accent)]" checked={pick === m.id} onChange={() => setPick(m.id)} />
              <UserAvatar user={m} size={22} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{userName(m)}</span>
              <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{dir[m.id]?.model}</span>
            </label>
          ))}
        </div>
        <label className="w-label" htmlFor="ai-note">Instructions (optional)</label>
        <textarea id="ai-note" className="w-input min-h-[72px] py-2" maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything it should know — posted as an internal comment that @mentions the agent." />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!pick || go.isPending} onClick={() => go.mutate()}>{go.isPending && <Spinner size={12} />} Assign</button>
        </div>
      </Dialog>
    </>
  );
}

export default function IssueAgentActivity({ config, issue, done }: { config: ProjectConfig; issue: IssueDetail; done: boolean }) {
  const issueNumber = issue.number;
  const assignee = issue.assignee ?? null;
  const on = projectHasAgents(config) && !config.clientView && config.role !== 'CLIENT';
  useWorkspaceAgents(config.workspace.id, on);
  const q = useQuery({
    queryKey: agentKeys.issueActivity(config.id, issueNumber),
    queryFn: () => agentsApi.issueActivity(config.id, issueNumber),
    enabled: on,
    retry: false,
    staleTime: 15_000,
  });
  const [more, setMore] = useState(false);
  if (!on || !q.data) return null;
  const { leases } = q.data;
  // Server có thể trả usage với tổng 0 dòng ⇒ coi như chưa có chi phí.
  const usage = q.data.usage && q.data.usage.totals.rows > 0 ? q.data.usage : null;
  const assignedToAgent = assignee?.kind === 'AGENT';
  if (!leases.length && !usage && !assignedToAgent) {
    // Chưa dính agent nào: chỉ còn nút "Assign to AI" (thẻ chưa xong, người xem sửa được thẻ).
    return done ? null : <div className="flex justify-end"><AssignToAi config={config} issue={issue} /></div>;
  }
  const active = leases.find((l) => l.status === 'ACTIVE');
  const past = leases.filter((l) => l !== active);
  const t = usage?.totals;

  return (
    <section data-testid="issue-agent-activity">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="w-section-title flex items-center gap-1.5"><Bot size={14} className="text-[var(--w-accent-text)]" /> Agent activity</h3>
        {!done && !active && !assignedToAgent && <span className="ml-auto"><AssignToAi config={config} issue={issue} /></span>}
      </div>
      <div className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
        {active ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5">
            <UserAvatar user={agentUser(active.agent)} size={22} />
            <span className="text-[13px] font-medium">{active.agent.displayName || active.agent.username}</span>
            <LeaseBadge lease={{ issueId: 0, leaseId: active.id, status: 'ACTIVE', progress: active.progress, progressPct: active.progressPct, heartbeatAt: active.heartbeatAt, expiresAt: active.expiresAt, agentUserId: active.agent.userId }} />
            <span className="text-[12px] text-[var(--w-text-3)]">{leaseLine(active)}</span>
            {active.progress && <p className="w-full pl-[34px] text-[12.5px] text-[var(--w-text-2)]">{active.progress}</p>}
          </div>
        ) : assignedToAgent ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[var(--w-text-2)]">
            <UserAvatar user={assignee} size={22} />
            <span>Assigned to <b className="font-medium text-[var(--w-text)]">{userName(assignee)}</b> — waiting for it to pick the issue up.</span>
          </div>
        ) : null}

        {past.length > 0 && (
          <div className="px-3 py-2">
            <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text-2)]">
              {more ? <ChevronDown size={12} /> : <ChevronRight size={12} />} {past.length} earlier {past.length === 1 ? 'session' : 'sessions'}
            </button>
            {more && (
              <ul className="mt-1.5 space-y-1">
                {past.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 text-[12px]">
                    <UserAvatar user={agentUser(l.agent)} size={16} />
                    <span className="font-medium">{l.agent.displayName || l.agent.username}</span>
                    <span className={cn(l.status === 'EXPIRED' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>{leaseLine(l)}</span>
                    {l.progress && <span className="min-w-0 truncate text-[var(--w-text-3)]" title={l.progress}>· {l.progress}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {t && (
          <div className="px-3 py-2.5" data-testid="issue-agent-cost">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-[13px] font-medium"><Coins size={13} className="text-[var(--w-text-3)]" /> {usd(t.costUsd)}</span>
              <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{tokensFmt(t.inputTokens)} in · {tokensFmt(t.outputTokens)} out{t.cacheReadTokens ? ` · ${tokensFmt(t.cacheReadTokens)} cached` : ''}</span>
              <span className="text-[11.5px] text-[var(--w-text-3)]" title="Reported = the agent declared it through report_usage. Measured = CT Work ran the model itself (phase 2).">
                {t.reported > 0 && t.gateway > 0 ? `${usd(t.reported)} self-reported · ${usd(t.gateway)} measured` : t.gateway > 0 ? 'measured by CT Work' : 'self-reported by the agent · estimate'}
              </span>
            </div>
            {usage!.byAgent.length > 1 && (
              <ul className="mt-1.5 space-y-0.5 text-[12px] text-[var(--w-text-2)]">
                {usage!.byAgent.map((b) => (
                  <li key={b.agentId} className="flex gap-2"><span className="min-w-0 flex-1 truncate">{b.displayName || b.username}</span><span className="tabular-nums">{usd(b.costUsd)}</span></li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
