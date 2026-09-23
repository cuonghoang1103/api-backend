'use client';

/**
 * Trang một test cycle: tổng quan + bảng lần chạy. `?run=<id>` mở ngăn kéo
 * thực thi, `?issue=N` mở thẻ (bug/test) trong IssueDrawer.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, MessageSquare, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type CycleState, type ProjectConfig, type RunStatus, type TestCycleDetail,
} from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import { AssigneePicker } from '@/components/work/fields';
import { useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import { Dialog, EmptyState, isTyping, Popover, PriorityIcon, Spinner, useToggle } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import RunPanel from '@/components/work/tests/RunPanel';
import TestPicker from '@/components/work/tests/TestPicker';
import {
  CYCLE_STATE_META, downloadCsv, formatDateTime, RUN_META, RUN_ORDER, RunStatusPill, safeFileName, StatusBar,
} from '@/components/work/tests/runStatus';

type Filter = RunStatus | 'ALL' | 'NOT_RUN';
const NOT_RUN: RunStatus[] = ['TODO', 'IN_PROGRESS', 'RETEST'];
const GRID = 'grid grid-cols-[minmax(260px,2.4fr)_70px_minmax(150px,1fr)_110px_minmax(150px,1fr)_minmax(110px,0.8fr)_36px] items-center gap-3';

function CycleView({ config, pid, cycleId }: { config: ProjectConfig; pid: number; cycleId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  const lk = useLookups(config);
  useProjectRealtime(pid);
  const cycleKey = useMemo(() => [...wk.tests(pid), 'cycle', cycleId], [pid, cycleId]);
  const cycle = useQuery({ queryKey: cycleKey, queryFn: () => workApi.testCycle(pid, cycleId), retry: 1 });
  const data = cycle.data;
  const canEdit = config.permissions.editIssues;
  const canExecute = config.permissions.transition;
  const listHref = `/work/${config.workspace.slug}/${config.key}/tests?tab=cycles`;

  const [filter, setFilter] = useState<Filter>('ALL');
  const [addOpen, setAddOpen] = useState(false);
  const [removeRun, setRemoveRun] = useState<{ id: number; label: string } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // ─── URL: ?run= và ?issue= ──────────────────────────────────────
  const runParam = Number(search?.get('run')) || null;
  const issueParam = Number(search?.get('issue')) || null;
  const setParam = useCallback((k: string, v: string | null, replace = false) => {
    const p = new URLSearchParams(search?.toString());
    if (v === null) p.delete(k); else p.set(k, v);
    const s = p.toString();
    const url = s ? `${pathname}?${s}` : pathname!;
    if (replace) router.replace(url, { scroll: false }); else router.push(url, { scroll: false });
  }, [router, pathname, search]);
  const openRun = useCallback((id: number) => setParam('run', String(id), !!runParam), [setParam, runParam]);
  const closeRun = useCallback(() => setParam('run', null), [setParam]);
  const openIssue = useCallback((n: number) => setParam('issue', String(n)), [setParam]);
  const closeIssue = useCallback(() => setParam('issue', null), [setParam]);

  const runs = useMemo(() => {
    const all = data?.runs ?? [];
    if (filter === 'ALL') return all;
    if (filter === 'NOT_RUN') return all.filter((r) => NOT_RUN.includes(r.status));
    return all.filter((r) => r.status === filter);
  }, [data?.runs, filter]);
  // Trước/Sau trong ngăn kéo đi theo bộ lọc đang xem; lần chạy vừa đổi trạng thái vẫn giữ chỗ.
  const navIds = useMemo(() => {
    const ids = runs.map((r) => r.id);
    if (runParam && !ids.includes(runParam) && data) return data.runs.map((r) => r.id);
    return ids;
  }, [runs, runParam, data]);

  // ─── Cập nhật ───────────────────────────────────────────────────
  const refresh = () => qc.invalidateQueries({ queryKey: wk.tests(pid) });
  const patchCycle = async (body: Parameters<typeof workApi.updateTestCycle>[2], msg = 'Could not update the cycle') => {
    qc.setQueryData<TestCycleDetail>(cycleKey, (old) => (old ? { ...old, ...(body.state ? { state: body.state } : {}), ...(body.name ? { name: body.name } : {}), ...('environment' in body ? { environment: body.environment ?? null } : {}), ...('build' in body ? { build: body.build ?? null } : {}) } : old));
    try {
      await workApi.updateTestCycle(pid, cycleId, body);
      return true;
    } catch (err) {
      toast.error(workError(err, msg));
      return false;
    } finally {
      refresh();
    }
  };
  const setAssignee = async (runId: number, assigneeId: number | null) => {
    qc.setQueryData<TestCycleDetail>(cycleKey, (old) => (old ? { ...old, runs: old.runs.map((r) => (r.id === runId ? { ...r, assigneeId } : r)) } : old));
    try {
      const res = await workApi.updateTestRun(pid, runId, { assigneeId });
      qc.setQueryData([...wk.tests(pid), 'run', runId], res);
    } catch (err) {
      toast.error(workError(err, 'Could not change the assignee'));
    }
    qc.invalidateQueries({ queryKey: cycleKey });
  };

  const exportCsv = () => {
    if (!data) return;
    downloadCsv(
      `${safeFileName(`${config.key}-${data.name}`)}.csv`,
      ['Test key', 'Title', 'Priority', 'Status', 'Assignee', 'Executed by', 'Executed at', 'Defects', 'Comment'],
      data.runs.map((r) => [
        lk.issueKey(r.test.number), r.test.title, r.test.priority, RUN_META[r.status].label,
        r.assigneeId ? userName(lk.members.get(r.assigneeId)) : '',
        r.executedBy ? userName(r.executedBy) : '', r.executedAt ? new Date(r.executedAt).toISOString() : '',
        r.defects.map((d) => lk.issueKey(d.number)).join(' '), r.comment ?? '',
      ]),
    );
  };

  // Phím tắt trang: j/k chọn dòng, Enter mở.
  const [cursor, setCursor] = useState(-1);
  useEffect(() => setCursor((c) => Math.min(c, runs.length - 1)), [runs.length]);
  useEffect(() => {
    if (runParam || issueParam) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('[role="dialog"]')) return;
      if (e.key === 'j') { e.preventDefault(); setCursor((c) => Math.min(c + 1, runs.length - 1)); }
      if (e.key === 'k') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      if (e.key === 'Enter' && runs[cursor] && !(e.target as HTMLElement | null)?.closest?.('button,a')) { e.preventDefault(); openRun(runs[cursor].id); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [runParam, issueParam, runs, cursor, openRun]);

  if (cycle.isLoading) {
    return <Shell config={config}><div className="flex flex-1 items-center justify-center"><Spinner size={20} /></div></Shell>;
  }
  if (cycle.error || !data) {
    return (
      <Shell config={config}>
        <EmptyState
          title="Could not load this test cycle"
          body={workError(cycle.error, 'It may have been deleted.')}
          action={<div className="flex gap-2"><Link href={listHref} className="w-btn">Back to cycles</Link><button type="button" className="w-btn" onClick={() => cycle.refetch()}>Try again</button></div>}
        />
      </Shell>
    );
  }

  const notRun = data.total - data.executed;
  const chips: Array<{ key: Filter; label: string; count: number; color?: string }> = [
    { key: 'ALL', label: 'All', count: data.total },
    { key: 'NOT_RUN', label: 'Not run', count: notRun },
    ...RUN_ORDER.filter((s) => data.counts[s] > 0).map((s) => ({ key: s as Filter, label: RUN_META[s].label, count: data.counts[s], color: RUN_META[s].color })),
  ];

  return (
    <Shell config={config}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Đầu trang */}
        <div className="border-b border-[var(--w-border)] px-4 pb-4 pt-3">
          <Link href={listHref} className="inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]"><ArrowLeft size={12} /> Test cycles</Link>
          <div className="mt-1 flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1 basis-[260px]">
              <InlineText
                value={data.name}
                disabled={!canEdit}
                required
                className="text-[20px] font-semibold"
                onSave={(v) => patchCycle({ name: v })}
              />
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                <label className="flex items-center gap-1">Environment
                  <InlineText value={data.environment ?? ''} placeholder="Not set" disabled={!canEdit} className="w-[180px] text-[12px] text-[var(--w-text)]" onSave={(v) => patchCycle({ environment: v || null })} />
                </label>
                <label className="flex items-center gap-1">Build
                  <InlineText value={data.build ?? ''} placeholder="Not set" disabled={!canEdit} className="w-[130px] text-[12px] text-[var(--w-text)]" onSave={(v) => patchCycle({ build: v || null })} />
                </label>
                {data.plan && <span>Plan: <span className="text-[var(--w-text-2)]">{data.plan.name}</span></span>}
                {data.startAt && <span>Started {formatDateTime(data.startAt)}</span>}
                {data.endAt && <span>Finished {formatDateTime(data.endAt)}</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StateControl value={data.state} disabled={!canEdit} onChange={(state) => patchCycle({ state }).then((ok) => ok && toast.success(`Cycle marked ${CYCLE_STATE_META[state].label.toLowerCase()}`))} />
              {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setAddOpen(true)}><Plus size={13} /> Add tests</button>}
              <MoreMenu onExport={exportCsv} onDelete={canEdit ? () => setDeleteOpen(true) : undefined} />
            </div>
          </div>

          {/* Thẻ tổng */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Stat label="Total" value={data.total} />
            <Stat label="Passed" value={data.counts.PASS} color="var(--w-green)" onClick={() => setFilter('PASS')} />
            <Stat label="Failed" value={data.counts.FAIL} color="var(--w-red)" onClick={() => setFilter('FAIL')} />
            <Stat label="Blocked" value={data.counts.BLOCKED} color="var(--w-orange)" onClick={() => setFilter('BLOCKED')} />
            <Stat label="Not run" value={notRun} onClick={() => setFilter('NOT_RUN')} />
            <Stat label="Pass rate" value={data.passRate === null ? '—' : `${data.passRate}%`} hint={`${data.executed} of ${data.total} executed`} />
          </div>
          <StatusBar counts={data.counts} total={data.total} height={8} className="mt-3" />
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--w-text-3)]">
            {RUN_ORDER.filter((s) => data.counts[s] > 0).map((s) => (
              <span key={s} className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-[2px]" style={{ background: s === 'TODO' ? 'var(--w-sunken)' : s === 'SKIP' ? 'var(--w-border-strong)' : RUN_META[s].color, border: s === 'TODO' ? '1px solid var(--w-border-strong)' : undefined }} />
                {RUN_META[s].label} {data.counts[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Chip lọc */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={cn('inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[12px]', filter === c.key ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {c.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />}
              {c.label}<span className="tabular text-[var(--w-text-3)]">{c.count}</span>
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] text-[var(--w-text-3)] lg:inline">
            <span className="w-kbd">J</span><span className="w-kbd">K</span> move · <span className="w-kbd">Enter</span> execute
          </span>
        </div>

        {/* Bảng lần chạy */}
        {!data.runs.length ? (
          <EmptyState
            title="This cycle has no tests"
            body="Add tests to start executing them."
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setAddOpen(true)}><Plus size={14} /> Add tests</button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="min-w-[900px]">
              <div className={cn(GRID, 'border-y border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]')}>
                <span>Test</span><span>Priority</span><span>Assignee</span><span>Status</span><span>Executed</span><span>Defects</span><span />
              </div>
              {!runs.length && <div className="px-4 py-8 text-center text-[13px] text-[var(--w-text-3)]">No runs match this filter.</div>}
              {runs.map((r, i) => (
                <div
                  key={r.id}
                  role="button"
                  tabIndex={-1}
                  onClick={() => openRun(r.id)}
                  className={cn(GRID, 'cursor-pointer border-b border-[var(--w-border)] px-4 py-2 text-[13px]', cursor === i ? 'bg-[var(--w-hover)]' : 'hover:bg-[var(--w-hover)]', runParam === r.id && 'bg-[var(--w-active)]')}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-[12px] font-medium text-[var(--w-text-2)]">{lk.issueKey(r.test.number)}</span>
                    <span className="min-w-0 truncate">{r.test.title}</span>
                    {r.comment && <span title={r.comment} className="shrink-0 text-[var(--w-text-3)]"><MessageSquare size={12} /></span>}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-[var(--w-text-2)]"><PriorityIcon priority={r.test.priority} size={14} /></div>
                  <div onClick={(e) => e.stopPropagation()} className="min-w-0">
                    <AssigneePicker config={config} value={r.assigneeId} bare disabled={!canExecute} onChange={(id) => setAssignee(r.id, id)} />
                  </div>
                  <div><RunStatusPill status={r.status} /></div>
                  <div className="min-w-0 text-[12px] leading-tight text-[var(--w-text-2)]">
                    {r.executedAt ? (
                      <>
                        <div className="truncate">{r.executedBy ? userName(r.executedBy) : '—'}</div>
                        <div className="truncate text-[11px] text-[var(--w-text-3)]">{formatDateTime(r.executedAt)}</div>
                      </>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-1">
                    {r.defects.length ? r.defects.map((d) => (
                      <button
                        key={d.number}
                        type="button"
                        title={d.title}
                        onClick={(e) => { e.stopPropagation(); openIssue(d.number); }}
                        className="rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1 text-[11px] font-medium text-[var(--w-red)] hover:bg-[var(--w-hover)]"
                      >
                        {lk.issueKey(d.number)}
                      </button>
                    )) : <span className="text-[12px] text-[var(--w-text-3)]">—</span>}
                  </div>
                  <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
                    {canEdit && (
                      <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" title="Remove from cycle" aria-label={`Remove ${lk.issueKey(r.test.number)} from cycle`} onClick={() => setRemoveRun({ id: r.id, label: `${lk.issueKey(r.test.number)} ${r.test.title}` })}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {addOpen && (
        <AddTestsDialog
          config={config}
          pid={pid}
          existing={data.runs.map((r) => r.test.number)}
          onClose={() => setAddOpen(false)}
          onAdd={async (numbers) => {
            const ok = await patchCycle({ addNumbers: numbers }, 'Could not add tests');
            if (ok) { toast.success(`${numbers.length} test${numbers.length === 1 ? '' : 's'} added`); setAddOpen(false); }
          }}
        />
      )}
      <ConfirmDialog
        open={!!removeRun}
        onClose={() => setRemoveRun(null)}
        title="Remove test from cycle?"
        body={<>The run of <b>{removeRun?.label}</b> and its step results will be deleted from this cycle. Linked bugs are not affected.</>}
        confirmLabel="Remove"
        pending={busy}
        onConfirm={async () => {
          if (!removeRun) return;
          setBusy(true);
          const ok = await patchCycle({ removeRunIds: [removeRun.id] }, 'Could not remove the test');
          setBusy(false);
          if (ok) { if (runParam === removeRun.id) closeRun(); setRemoveRun(null); }
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this test cycle?"
        body={<>“{data.name}” and all {data.total} of its runs and step results will be permanently deleted. Bugs created from it are kept.</>}
        confirmLabel="Delete cycle"
        pending={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await workApi.deleteTestCycle(pid, cycleId);
            toast.success('Test cycle deleted');
            qc.removeQueries({ queryKey: cycleKey });
            refresh();
            router.push(listHref);
          } catch (err) {
            toast.error(workError(err, 'Could not delete the cycle'));
            setBusy(false);
          }
        }}
      />

      {runParam && (
        <RunPanel
          key={runParam}
          config={config}
          pid={pid}
          runId={runParam}
          runIds={navIds}
          onNavigate={openRun}
          onClose={closeRun}
          onOpenIssue={openIssue}
          suspendKeys={!!issueParam}
        />
      )}
      <IssueDrawer pid={pid} num={issueParam} onClose={closeIssue} onOpenIssue={openIssue} />
    </Shell>
  );
}

function Shell({ config, children }: { config: ProjectConfig; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Test cycle" />
      {children}
    </div>
  );
}

function Stat({ label, value, color, hint, onClick }: { label: string; value: number | string; color?: string; hint?: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={hint}
      className={cn('rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left', onClick && 'hover:bg-[var(--w-hover)]')}
    >
      <div className="text-[11px] text-[var(--w-text-3)]">{label}</div>
      <div className="text-[18px] font-semibold tabular" style={color && value ? { color } : undefined}>{value}</div>
    </Tag>
  );
}

function StateControl({ value, onChange, disabled }: { value: CycleState; onChange: (s: CycleState) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Cycle state" className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]">
      {(['PLANNED', 'IN_PROGRESS', 'DONE'] as CycleState[]).map((s, i) => {
        const on = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            onClick={() => !on && onChange(s)}
            className={cn('h-[26px] px-2.5 text-[12px] font-medium', i > 0 && 'border-l border-[var(--w-border-strong)]', on ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]', disabled && !on && 'cursor-default hover:bg-transparent')}
          >
            {CYCLE_STATE_META[s].label}
          </button>
        );
      })}
    </div>
  );
}

function MoreMenu({ onExport, onDelete }: { onExport: () => void; onDelete?: () => void }) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-sm w-btn-icon" onClick={t.toggle} aria-label="More actions"><MoreHorizontal size={14} /></button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={180} align="end">
        <div className="p-1">
          <button type="button" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]" onClick={() => { t.close(); onExport(); }}>
            <Download size={13} /> Export CSV
          </button>
          {onDelete && (
            <button type="button" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[var(--w-red)] hover:bg-[var(--w-hover)]" onClick={() => { t.close(); onDelete(); }}>
              <Trash2 size={13} /> Delete cycle
            </button>
          )}
        </div>
      </Popover>
    </>
  );
}

/** Ô chữ sửa tại chỗ: Enter/blur lưu, Esc huỷ. */
function InlineText({ value, onSave, disabled, placeholder, className, required }: {
  value: string; onSave: (v: string) => void; disabled?: boolean; placeholder?: string; className?: string; required?: boolean;
}) {
  const [v, setV] = useState(value);
  const [editing, setEditing] = useState(false);
  useEffect(() => { if (!editing) setV(value); }, [value, editing]);
  const commit = () => {
    setEditing(false);
    const t = v.trim();
    if (required && !t) { setV(value); return; }
    if (t !== value.trim()) onSave(t);
  };
  return (
    <input
      value={v}
      disabled={disabled}
      placeholder={placeholder}
      onFocus={() => setEditing(true)}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        if (e.key === 'Escape') { setV(value); setEditing(false); requestAnimationFrame(() => (e.target as HTMLInputElement).blur()); }
      }}
      className={cn('w-input w-input-bare !h-auto min-w-0 px-1.5 py-0.5', !disabled && 'hover:bg-[var(--w-hover)]', 'max-w-full', className)}
    />
  );
}

function AddTestsDialog({ config, pid, existing, onClose, onAdd }: {
  config: ProjectConfig; pid: number; existing: number[]; onClose: () => void; onAdd: (numbers: number[]) => Promise<void>;
}) {
  const [picked, setPicked] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  return (
    <Dialog
      open
      onClose={onClose}
      title="Add tests to cycle"
      width={520}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="w-btn w-btn-primary"
            disabled={!picked.length || busy}
            onClick={async () => { setBusy(true); await onAdd(picked); setBusy(false); }}
          >
            {busy && <Spinner size={12} />} Add {picked.length || ''} test{picked.length === 1 ? '' : 's'}
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">Each test gets a fresh run with a snapshot of its current steps. Tests already in this cycle are hidden.</p>
      <TestPicker pid={pid} projectKey={config.key} value={picked} onChange={setPicked} exclude={existing} />
    </Dialog>
  );
}

export default function CyclePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string; cycleId: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  const cycleId = Number(params.cycleId);
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  if (!Number.isInteger(cycleId) || cycleId <= 0) return <EmptyState title="Test cycle not found" />;
  return <CycleView config={config} pid={pid} cycleId={cycleId} />;
}
