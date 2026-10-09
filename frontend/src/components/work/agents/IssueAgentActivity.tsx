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
import { IssueBuiltinRuns, ProUpsell } from './BuiltinBits';
import { builtinApi, builtinKeys } from '@/lib/work-builtin-api';
import { wt } from '@/components/work/i18n';

type LeaseRow = Activity['leases'][number];

function agentUser(a: LeaseRow['agent']) {
  return { id: a.userId, username: a.username, displayName: a.displayName, fullName: null, avatarUrl: null, kind: 'AGENT' as const };
}

function leaseLine(l: LeaseRow) {
  if (l.status === 'ACTIVE') return wt('agents.leaseActive', { a: relativeTime(l.heartbeatAt), b: relativeTime(l.claimedAt) });
  const mins = Math.max(1, Math.round((new Date(l.releasedAt ?? l.heartbeatAt).getTime() - new Date(l.claimedAt).getTime()) / 60_000));
  const dur = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  return wt('agents.leaseDone', { st: l.status === 'EXPIRED' ? wt('agents.expiredLc') : wt('agents.releasedLc'), t: relativeTime(l.releasedAt ?? l.expiresAt), d: dur });
}

/**
 * CTW-34 (GĐ1 cho agent EXTERNAL): "Assign to AI" = giao thẻ cho một agent ACTIVE của dự án — đó chính là hàng đợi của
 * agent (thẻ giao cho nó, chưa có lease; thiết kế §4.4). Inbox `issue.assigned` tự sinh ⇒ agent nhận qua SSE/webhook/
 * wait_events rồi claim. Lời dặn (tuỳ chọn) đi kèm thành bình luận INTERNAL @nhắc agent.
 * Đợt 3C: agent BUILTIN ("Built-in") — CT Work chạy hộ: POST …/agent-runs (giao + xếp lượt, lời dặn đi vào lượt chạy).
 * Chỉ Pro/admin; tài khoản thường thấy nút nâng cấp thay cho nút giao.
 */
function AssignToAi({ config, issue }: { config: ProjectConfig; issue: IssueDetail }) {
  const qc = useQueryClient();
  const dir = useAgentDirectory((st) => st.byUser);
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const agents = config.members.filter((m) => m.kind === 'AGENT' && m.role === 'MEMBER' && dir[m.id]?.status === 'ACTIVE');
  const anyBuiltin = agents.some((m) => dir[m.id]?.runtime === 'BUILTIN');
  const budget = useQuery({ queryKey: builtinKeys.budget(config.workspace.id), queryFn: () => builtinApi.budget(config.workspace.id), enabled: open && anyBuiltin, retry: false, staleTime: 30_000 });
  const pickedBuiltin = !!pick && dir[pick]?.runtime === 'BUILTIN';
  const go = useMutation({
    mutationFn: async () => {
      const a = agents.find((m) => m.id === pick)!;
      if (dir[a.id]?.runtime === 'BUILTIN') {
        await builtinApi.start(config.id, issue.number, { agentId: dir[a.id].agentId, note: note.trim() || null });
        return a;
      }
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
      qc.invalidateQueries({ queryKey: builtinKeys.issueRuns(config.id, issue.number) });
      qc.invalidateQueries({ queryKey: agentKeys.issueActivity(config.id, issue.number) });
      toast.success(dir[a.id]?.runtime === 'BUILTIN' ? wt('agents.startedRuns', { name: userName(a) }) : wt('agents.assignedQueue', { name: userName(a) }));
      setOpen(false); setNote(''); setPick(null);
    },
    onError: (err) => toast.error(workError(err, wt('agents.assignFailed'))),
  });
  if (!agents.length || !config.permissions.editIssues) return null;
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => { setPick(agents[0]?.id ?? null); setOpen(true); }} data-testid="assign-to-ai">
        <Sparkles size={12} /> {wt('agents.assignToAi')}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={wt('agents.assignToAgent')} width={480}>
        <p className="mb-3 text-[13px] leading-relaxed text-[var(--w-text-2)]">
          The agent gets the issue in its queue and claims it when it starts. Its “Done” goes to review first; you stay in charge of closing it.
        </p>
        <div className="mb-3 space-y-1" role="radiogroup" aria-label={wt('agents.agent')}>
          {agents.map((m) => (
            <label key={m.id} className={cn('flex cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2', pick === m.id ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
              <input type="radio" name="ai-agent" className="accent-[var(--w-accent)]" checked={pick === m.id} onChange={() => setPick(m.id)} />
              <UserAvatar user={m} size={22} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{userName(m)}</span>
              {dir[m.id]?.runtime === 'BUILTIN' && <span className="shrink-0 rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]">{wt('agents.builtin')}</span>}
              <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{dir[m.id]?.model}</span>
            </label>
          ))}
        </div>
        {pickedBuiltin && budget.data && !budget.data.canUse ? (
          <ProUpsell />
        ) : (
          <>
            {pickedBuiltin && (
              <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
                {wt('agents.builtinRunsNow', { steps: budget.data?.maxSteps ?? 12, cap: budget.data ? `$${budget.data.runCapUsd}` : wt('agents.theRunCap') })}
              </p>
            )}
            <label className="w-label" htmlFor="ai-note">{wt('agents.instructions')}</label>
            <textarea id="ai-note" className="w-input min-h-[72px] py-2" maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} placeholder={pickedBuiltin ? wt('agents.notePhBuiltin') : wt('agents.notePhExt')} />
          </>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={() => setOpen(false)}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!pick || go.isPending || (pickedBuiltin && budget.data?.canUse === false)} onClick={() => go.mutate()} data-testid="assign-to-ai-go">{go.isPending && <Spinner size={12} />} {pickedBuiltin ? wt('agents.assignStart') : wt('agents.assign')}</button>
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
  // Hook phải đứng TRƯỚC mọi return sớm (React #310).
  const dir = useAgentDirectory((st) => st.byUser);
  if (!on || !q.data) return null;
  const { leases } = q.data;
  // Server có thể trả usage với tổng 0 dòng ⇒ coi như chưa có chi phí.
  const usage = q.data.usage && q.data.usage.totals.rows > 0 ? q.data.usage : null;
  const assignedToAgent = assignee?.kind === 'AGENT';
  // Đợt 3C: thẻ giao cho agent DỰNG SẴN — trạng thái nằm ở lượt chạy (IssueBuiltinRuns), không "chờ nó nhận việc".
  const assignedBuiltin = assignedToAgent && dir[assignee!.id]?.runtime === 'BUILTIN';
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
        <h3 className="w-section-title flex items-center gap-1.5"><Bot size={14} className="text-[var(--w-accent-text)]" /> {wt('agents.activity')}</h3>
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
        ) : assignedToAgent && !assignedBuiltin ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[var(--w-text-2)]">
            <UserAvatar user={assignee} size={22} />
            <span>{wt('agents.assignedWaiting', { name: userName(assignee) })}</span>
          </div>
        ) : null}

        {(assignedToAgent || leases.length > 0) && (
          <IssueBuiltinRuns
            pid={config.id} num={issueNumber} canRun={!done && !!config.permissions.editIssues}
            builtinAgent={assignedBuiltin ? { agentId: dir[assignee!.id]!.agentId, name: userName(assignee) } : null}
          />
        )}

        {past.length > 0 && (
          <div className="px-3 py-2">
            <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text-2)]">
              {more ? <ChevronDown size={12} /> : <ChevronRight size={12} />} {wt('agents.earlierSessions', { count: past.length })}
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
              <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{wt('agents.tokLine', { a: tokensFmt(t.inputTokens), b: tokensFmt(t.outputTokens) })}{t.cacheReadTokens ? wt('agents.cached', { c: tokensFmt(t.cacheReadTokens) }) : ''}</span>
              <span className="text-[11.5px] text-[var(--w-text-3)]" title={wt('agents.reportedTip')}>
                {t.reported > 0 && t.gateway > 0 ? wt('agents.srcBoth', { a: usd(t.reported), b: usd(t.gateway) }) : t.gateway > 0 ? wt('agents.srcMeasured') : wt('agents.srcSelf1')}
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
