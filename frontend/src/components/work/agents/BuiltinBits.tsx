'use client';

/**
 * CT Work đợt 3C — mảnh giao diện cho agent DỰNG SẴN (runtime BUILTIN, CT Work chạy hộ bằng cổng LLM của web):
 *   BuiltinBudgetCard   trang AI agents: tiền đã dùng hôm nay / trần chung không gian, trần mỗi lượt, số bước (admin sửa)
 *   AgentRunsSection    trang một agent: tiền đã dùng (hôm nay/7 ngày/tổng — ĐO THẬT) + các lượt chạy + nút Dừng
 *   IssueBuiltinRuns    khối Agent activity trên thẻ: lượt đang chạy (bước, chi phí) + Dừng + Chạy lại
 *   ProUpsell           tài khoản thường: nút nâng cấp (agent dựng sẵn chỉ cho Pro/admin)
 * Chi phí ở đây là SỐ ĐO (token cổng trả × bảng giá) — khác số "self-reported" của agent ngoài; nhãn ghi rõ.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Ban, Bot, CircleDollarSign, Crown, Pencil, RotateCcw, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { builtinApi, builtinKeys, RUN_LABEL, TASK_LABEL, type AgentRun, type BuiltinTask, type RunStatus } from '@/lib/work-builtin-api';
import { agentKeys } from '@/lib/work-agents-api';
import { Dialog, Field, relativeTime, Spinner } from '../ui';
import { Section } from '../settings/shared';
import { Stat, usd } from './AgentBits';
import { wt, wfmt } from '@/components/work/i18n';

const ACTIVE: RunStatus[] = ['QUEUED', 'RUNNING'];

export function RunStatusPill({ status }: { status: RunStatus }) {
  const tone = status === 'DONE' ? 'text-[var(--w-green)] bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)]'
    : status === 'RUNNING' || status === 'QUEUED' ? 'text-[var(--w-accent-text)] bg-[var(--w-accent-soft)]'
      : status === 'CANCELLED' ? 'text-[var(--w-text-3)] bg-[var(--w-sunken)]'
        : 'text-[var(--w-red)] bg-[color-mix(in_srgb,var(--w-red)_12%,transparent)]';
  return (
    <span className={cn('inline-flex h-[20px] shrink-0 items-center gap-1 rounded-full px-2 text-[11.5px] font-medium', tone)} data-testid="run-status">
      {status === 'RUNNING' && <Spinner size={10} />}
      {RUN_LABEL[status]}
    </span>
  );
}

export function ProUpsell({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2.5 text-[13px]', compact && 'py-2')} data-testid="builtin-upsell">
      <Crown size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{wt('agents.proFeature')}</div>
        {!compact && <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{wt('agents.proFeatureBody')}</p>}
      </div>
      <Link href="/pro" className="w-btn w-btn-sm w-btn-primary shrink-0">{wt('agents.upgrade')}</Link>
    </div>
  );
}

// ─── Trần chung của không gian ───────────────────────────────────

export function BuiltinBudgetCard({ wsId }: { wsId: number }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: builtinKeys.budget(wsId), queryFn: () => builtinApi.budget(wsId), retry: false, staleTime: 30_000 });
  const [open, setOpen] = useState(false);
  const [daily, setDaily] = useState('');
  const [run, setRun] = useState('');
  const [steps, setSteps] = useState('');
  useEffect(() => {
    if (!open || !q.data) return;
    setDaily(String(q.data.dailyCapUsd)); setRun(String(q.data.runCapUsd)); setSteps(String(q.data.maxSteps));
  }, [open, q.data]);
  const save = useMutation({
    mutationFn: () => builtinApi.updateBudget(wsId, { dailyCapUsd: Number(daily), runCapUsd: Number(run), maxSteps: Number(steps) }),
    onSuccess: (b) => { qc.setQueryData(builtinKeys.budget(wsId), b); toast.success(wt('agents.budgetSaved')); setOpen(false); },
    onError: (err) => toast.error(workError(err, wt('agents.budgetFailed'))),
  });
  if (!q.data) return null;
  const b = q.data;
  const pct = b.dailyCapUsd > 0 ? Math.min(100, Math.round((b.spentTodayUsd / b.dailyCapUsd) * 100)) : 0;
  return (
    <div className="w-card mb-5 p-4" data-testid="builtin-budget">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Bot size={18} /></span>
        <div className="min-w-[240px] flex-1">
          <div className="text-[14px] font-semibold">{wt('agents.builtinAgents')}</div>
          <p className="mt-0.5 max-w-[620px] text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
            {wt('agents.runsOnOwnA')} <span className="font-mono">{b.model}</span>{wt('agents.runsOnOwnB')}
          </p>
        </div>
        {b.canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)}><Pencil size={12} /> {wt('agents.editCaps')}</button>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 border-t border-[var(--w-border)] pt-3 sm:grid-cols-4">
        <div className="min-w-0">
          <div className="text-[11.5px] font-medium text-[var(--w-text-3)]">{wt('agents.spentToday')}</div>
          <div className="mt-0.5 text-[14px] font-semibold tabular-nums">{usd(b.spentTodayUsd)} <span className="text-[12px] font-normal text-[var(--w-text-3)]">{wt('agents.ofX', { x: usd(b.dailyCapUsd) })}</span></div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={wt('agents.dailyBudgetUsed')}>
            <div className={cn('h-full rounded-full', pct >= 90 ? 'bg-[var(--w-red)]' : pct >= 60 ? 'bg-[var(--w-orange)]' : 'bg-[var(--w-accent)]')} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Stat label={wt('agents.capPerRun')} value={usd(b.runCapUsd)} hint={wt('agents.capPerRunHint')} />
        <Stat label={wt('agents.stepsPerRun')} value={b.maxSteps} hint={wt('agents.stepHint')} />
        <Stat label={wt('agents.builtinAgents')} value={`${b.builtinAgents} / ${b.defaults.perWorkspace}`} />
      </div>
      {!b.canUse && <div className="mt-3"><ProUpsell compact /></div>}
      <Dialog open={open} onClose={() => setOpen(false)} title={wt('agents.capsTitle')} width={460}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <Field label={wt('agents.wsCapDay')} hint={wt('agents.wsCapHint')}><input type="number" min={0} max={1000} step="0.5" className="w-input" value={daily} onChange={(e) => setDaily(e.target.value)} /></Field>
          <div className="grid gap-x-3 sm:grid-cols-2">
            <Field label={wt('agents.capRunUsd')}><input type="number" min={0.01} max={100} step="0.1" className="w-input" value={run} onChange={(e) => setRun(e.target.value)} /></Field>
            <Field label={wt('agents.stepsPerRun')} hint="2–30"><input type="number" min={2} max={30} className="w-input" value={steps} onChange={(e) => setSteps(e.target.value)} /></Field>
          </div>
          <p className="mb-3 text-[12px] text-[var(--w-text-3)]">{wt('agents.capsNote')}</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="w-btn" onClick={() => setOpen(false)}>{wt('common.cancel')}</button>
            <button type="submit" className="w-btn w-btn-primary" disabled={save.isPending}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

// ─── Trang một agent BUILTIN ─────────────────────────────────────

function lastStep(r: AgentRun) {
  return r.steps.length ? r.steps[r.steps.length - 1].text : r.status === 'QUEUED' ? wt('agents.waitingSlot') : '';
}

export function AgentRunsSection({ wsId, agentId, canManage }: { wsId: number; agentId: number; canManage: boolean }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: builtinKeys.agentRuns(wsId, agentId), queryFn: () => builtinApi.agentRuns(wsId, agentId),
    refetchInterval: (query) => (query.state.data?.runs.some((r) => ACTIVE.includes(r.status)) ? 3000 : false),
  });
  const stop = useMutation({
    mutationFn: (r: { projectId: number; id: number }) => builtinApi.cancel(r.projectId, r.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: builtinKeys.agentRuns(wsId, agentId) }); toast.success(wt('agents.stopping')); },
    onError: (err) => toast.error(workError(err, wt('agents.stopRunFailed'))),
  });
  if (!q.data) return q.isLoading ? <Spinner /> : null;
  const s = q.data.spend;
  return (
    <Section title={wt('agents.runsCost')} description={wt('agents.runsCostDesc')}>
      <div className="w-card mb-3 grid grid-cols-2 gap-4 p-4 sm:grid-cols-4" data-testid="builtin-spend">
        <Stat label={wt('common.today')} value={<>{usd(s.todayUsd)} <span className="text-[12px] font-normal text-[var(--w-text-3)]">/ {usd(s.agentDailyCapUsd)}</span></>} hint={wt('agents.thisDailyCap')} />
        <Stat label={wt('agents.last7')} value={usd(s.weekUsd)} />
        <Stat label={wt('agents.allTime')} value={usd(s.totalUsd)} hint={wt('agents.tokInOutT', { a: s.inputTokens.toLocaleString(wfmt.intl()), b: s.outputTokens.toLocaleString(wfmt.intl()) })} />
        <Stat label={wt('agents.wsToday')} value={<>{usd(s.workspaceTodayUsd)} <span className="text-[12px] font-normal text-[var(--w-text-3)]">/ {usd(s.workspaceDailyCapUsd)}</span></>} />
      </div>
      {!q.data.runs.length ? (
        <p className="text-[13px] text-[var(--w-text-3)]">{wt('agents.noRuns')}</p>
      ) : (
        <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden" data-testid="builtin-runs">
          {q.data.runs.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5 text-[13px]">
              <RunStatusPill status={r.status} />
              {r.issue ? (
                <Link href={r.issue.url} className="flex min-w-0 flex-1 items-center gap-2 hover:underline">
                  <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.issue.key}</span>
                  <span className="truncate">{r.issue.title}</span>
                </Link>
              ) : <span className="flex-1 text-[var(--w-text-3)]">{wt('agents.deletedIssue')}</span>}
              <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{wt('agents.nSteps', { count: r.steps.length })} · {usd(r.costUsd)}</span>
              <span className="text-[12px] text-[var(--w-text-3)]">{relativeTime(r.finishedAt ?? r.startedAt ?? r.createdAt)}</span>
              {canManage && r.canCancel && (
                <button type="button" className="w-btn w-btn-sm w-btn-danger" disabled={stop.isPending} onClick={() => stop.mutate(r)} data-testid="stop-run"><Square size={11} /> {wt('agents.stop')}</button>
              )}
              {(r.error || (ACTIVE.includes(r.status) && lastStep(r))) && (
                <p className="w-full truncate pl-1 text-[12px] text-[var(--w-text-3)]" title={r.error ?? lastStep(r)}>{r.error ?? lastStep(r)}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// ─── Khối trên thẻ ───────────────────────────────────────────────

export function IssueBuiltinRuns({ pid, num, canRun, builtinAgent }: { pid: number; num: number; canRun: boolean; builtinAgent?: { agentId: number; name: string } | null }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: builtinKeys.issueRuns(pid, num), queryFn: () => builtinApi.issueRuns(pid, num), retry: false,
    refetchInterval: (query) => (query.state.data?.some((r) => ACTIVE.includes(r.status)) ? 3000 : false),
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: builtinKeys.issueRuns(pid, num) });
    qc.invalidateQueries({ queryKey: agentKeys.issueActivity(pid, num) });
    qc.invalidateQueries({ predicate: (x) => x.queryKey[0] === 'work' && x.queryKey[2] === pid });
  };
  const stop = useMutation({ mutationFn: (id: number) => builtinApi.cancel(pid, id), onSuccess: () => { refresh(); toast.success(wt('agents.stoppingAfter')); }, onError: (err) => toast.error(workError(err, wt('agents.stopFailed'))) });
  const again = useMutation({
    mutationFn: (r: Pick<AgentRun, 'agentId'> & { task?: string }) => builtinApi.start(pid, num, { agentId: r.agentId, ...(r.task ? { task: r.task as BuiltinTask } : {}) }),
    onSuccess: () => { refresh(); toast.success(wt('agents.startedAgain')); },
    onError: (err) => toast.error(workError(err, wt('agents.startFailed'))),
  });
  const last = q.data?.[0];
  // Lượt "đang chạy" xong thì làm mới thẻ (trạng thái Review, bình luận, cờ) một lần.
  const lastStatus = last?.status;
  useEffect(() => { if (lastStatus && !ACTIVE.includes(lastStatus)) refresh(); }, [lastStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!last) {
    // Thẻ đã giao cho agent dựng sẵn nhưng chưa có lượt nào (vd giao trước khi có tính năng, hoặc người giao không phải Pro).
    if (!builtinAgent || !q.data) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 text-[13px] text-[var(--w-text-2)]" data-testid="issue-builtin-run">
        <span>{wt('agents.assignedNotStarted', { name: builtinAgent.name })}</span>
        {canRun && (
          <button type="button" className="w-btn w-btn-sm ml-auto" disabled={again.isPending} onClick={() => again.mutate({ agentId: builtinAgent.agentId })} data-testid="issue-run-start">
            {again.isPending ? <Spinner size={11} /> : <RotateCcw size={11} />} {wt('agents.runNow')}
          </button>
        )}
      </div>
    );
  }
  const active = ACTIVE.includes(last.status);
  return (
    <div className="px-3 py-2.5" data-testid="issue-builtin-run">
      <div className="flex flex-wrap items-center gap-2">
        <RunStatusPill status={last.status} />
        <span className="text-[12.5px] font-medium">{last.agent?.name ?? wt('agents.builtinAgent')}</span>
        <span className="text-[12px] text-[var(--w-text-3)]">{TASK_LABEL[last.task as BuiltinTask] ?? last.task}</span>
        <span className="ml-auto flex items-center gap-1 text-[12px] tabular-nums text-[var(--w-text-2)]" title={wt('agents.measuredCtw')}>
          <CircleDollarSign size={12} className="text-[var(--w-text-3)]" /> {usd(last.costUsd)} · {wt('agents.nSteps', { count: last.steps.length })}
        </span>
        {active && last.canCancel && (
          <button type="button" className="w-btn w-btn-sm w-btn-danger" disabled={stop.isPending} onClick={() => stop.mutate(last.id)} data-testid="issue-stop-run"><Square size={11} /> {wt('agents.stop')}</button>
        )}
        {!active && canRun && (
          <button type="button" className="w-btn w-btn-sm" disabled={again.isPending} onClick={() => again.mutate(last)} data-testid="issue-run-again">{again.isPending ? <Spinner size={11} /> : <RotateCcw size={11} />} {wt('agents.runAgain')}</button>
        )}
      </div>
      {active && last.steps.length > 0 && (
        <ol className="mt-1.5 space-y-0.5 pl-1 text-[12px] text-[var(--w-text-2)]">
          {last.steps.slice(-4).map((s) => <li key={s.step} className="truncate"><span className="tabular-nums text-[var(--w-text-3)]">{s.step}.</span> {s.text}</li>)}
        </ol>
      )}
      {last.error && !active && (
        <p className="mt-1.5 flex items-start gap-1.5 text-[12px] text-[var(--w-red)]"><Ban size={12} className="mt-0.5 shrink-0" /> <span className="min-w-0">{last.error}</span></p>
      )}
    </div>
  );
}
