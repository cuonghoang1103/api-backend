'use client';

/**
 * Trang một test cycle: tổng quan + bảng lần chạy. `?run=<id>` mở ngăn kéo
 * thực thi, `?issue=N` mở thẻ (bug/test) trong IssueDrawer.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, Download, FileSpreadsheet, FileText, MessageSquare, MoreHorizontal, Plus, Sheet, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type CycleState, type ProjectConfig, type RunStatus, type TestCycleDetail,
} from '@/lib/work-api';
import IssueDrawer from '@/components/work/IssueDrawer';
import ProjectHeader from '@/components/work/ProjectHeader';
import { AssigneePicker } from '@/components/work/fields';
import { useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import { Dialog, EmptyState, isTyping, Popover, PriorityIcon, Spinner, useToggle, PageLoading } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { blobError, saveBlob } from '@/components/work/search/ExportMenu';
import RunPanel from '@/components/work/tests/RunPanel';
import TestPicker from '@/components/work/tests/TestPicker';
import {
  CYCLE_STATE_META, formatDateTime, RUN_META, RUN_ORDER, RunStatusPill, StatusBar,
} from '@/components/work/tests/runStatus';
import { wt } from '@/components/work/i18n';

type Filter = RunStatus | 'ALL' | 'NOT_RUN';
// "Not run" = chưa thực thi (khớp công thức executed của backend): To do + In progress + Retest.
const NOT_RUN: RunStatus[] = ['TODO', 'IN_PROGRESS', 'RETEST'];
/** Trạng thái đã thực thi — mỗi cái một chip; phần chưa chạy gộp thành một chip "Not run". */
const EXECUTED: RunStatus[] = ['PASS', 'FAIL', 'BLOCKED', 'SKIP'];
/** Nhãn riêng trang này: TODO gọi là "Not started" để không trùng nghĩa với chip "Not run". */
const legendLabel = (s: RunStatus) => (s === 'TODO' ? wt('tests.notStarted') : RUN_META[s].label);
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
  const patchCycle = async (body: Parameters<typeof workApi.updateTestCycle>[2], msg = wt('tests.cycleUpdateFailed')) => {
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
      toast.error(workError(err, wt('tests.assigneeFailed')));
    }
    qc.invalidateQueries({ queryKey: cycleKey });
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
          title={wt('tests.cycleLoadFailed')}
          body={workError(cycle.error, wt('releases.notFoundBody'))}
          action={<div className="flex gap-2"><Link href={listHref} className="w-btn">{wt('tests.backToCycles')}</Link><button type="button" className="w-btn" onClick={() => cycle.refetch()}>{wt('common.tryAgain')}</button></div>}
        />
      </Shell>
    );
  }

  const notRun = data.total - data.executed;
  const chips: Array<{ key: Filter; label: string; count: number; color?: string; hint?: string }> = [
    { key: 'ALL', label: wt('common.all'), count: data.total },
    ...EXECUTED.filter((s) => data.counts[s] > 0 || s !== 'SKIP').map((s) => ({ key: s as Filter, label: RUN_META[s].label, count: data.counts[s], color: RUN_META[s].color })),
    {
      key: 'NOT_RUN', label: wt('tests.rsNotRun'), count: notRun, color: 'var(--w-text-3)',
      hint: wt('tests.notRunHint', { a: data.counts.TODO, b: data.counts.IN_PROGRESS, c: data.counts.RETEST }),
    },
  ];
  const passRateHint = data.passRate === null
    ? wt('tests.passRateNone')
    : wt('tests.passRateHint', { pass: data.counts.PASS, exec: data.executed, count: notRun });

  return (
    <Shell config={config}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Đầu trang */}
        <div className="border-b border-[var(--w-border)] px-4 pb-4 pt-3">
          <Link href={listHref} className="inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]"><ArrowLeft size={12} /> {wt('tests.tabTestCycles')}</Link>
          <div className="mt-1 flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1 basis-[260px]">
              <InlineText
                value={data.name}
                disabled={!canEdit}
                required
                ariaLabel={wt('tests.cycleName')}
                className="text-[20px] font-semibold"
                onSave={(v) => patchCycle({ name: v })}
              />
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                <label className="flex items-center gap-1">{wt('tests.environment')}
                  <InlineText value={data.environment ?? ''} placeholder={wt('common.notSet')} disabled={!canEdit} className="w-[180px] text-[12px] text-[var(--w-text)]" onSave={(v) => patchCycle({ environment: v || null })} />
                </label>
                <label className="flex items-center gap-1">{wt('tests.build')}
                  <InlineText value={data.build ?? ''} placeholder={wt('common.notSet')} disabled={!canEdit} className="w-[130px] text-[12px] text-[var(--w-text)]" onSave={(v) => patchCycle({ build: v || null })} />
                </label>
                {data.plan && <span>{wt('tests.planLbl')} <span className="text-[var(--w-text-2)]">{data.plan.name}</span></span>}
                {data.startAt && <span>{wt('tests.startedOn', { date: formatDateTime(data.startAt) })}</span>}
                {data.endAt && <span>{wt('tests.finishedOn', { date: formatDateTime(data.endAt) })}</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StateControl value={data.state} disabled={!canEdit} onChange={(state) => patchCycle({ state }).then((ok) => ok && toast.success(wt('tests.cycleMarked', { s: CYCLE_STATE_META[state].label.toLowerCase() })))} />
              {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setAddOpen(true)}><Plus size={13} /> {wt('tests.addTests')}</button>}
              <ExportReportMenu pid={pid} cycleId={cycleId} />
              {canEdit && <MoreMenu onDelete={() => setDeleteOpen(true)} />}
            </div>
          </div>

          {/* Thẻ tổng */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Stat label={wt('common.total')} value={data.total} />
            <Stat label={wt('tests.rsPassed')} value={data.counts.PASS} color="var(--w-green)" onClick={() => setFilter('PASS')} />
            <Stat label={wt('tests.rsFailed')} value={data.counts.FAIL} color="var(--w-red)" onClick={() => setFilter('FAIL')} />
            <Stat label={wt('tests.rsBlocked')} value={data.counts.BLOCKED} color="var(--w-orange)" onClick={() => setFilter('BLOCKED')} />
            <Stat label={wt('tests.rsNotRun')} value={notRun} onClick={() => setFilter('NOT_RUN')} />
            <Stat label={wt('tests.passRate')} sub={wt('tests.ofExecuted')} value={data.passRate === null ? '—' : `${data.passRate}%`} hint={passRateHint} />
          </div>
          <StatusBar counts={data.counts} total={data.total} height={8} className="mt-3" />
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--w-text-3)]">
            {RUN_ORDER.filter((s) => data.counts[s] > 0).map((s) => (
              <span key={s} className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-[2px]" style={{ background: s === 'TODO' ? 'var(--w-sunken)' : s === 'SKIP' ? 'var(--w-border-strong)' : RUN_META[s].color, border: s === 'TODO' ? '1px solid var(--w-border-strong)' : undefined }} />
                {legendLabel(s)} {data.counts[s]}
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
              title={c.hint}
              aria-pressed={filter === c.key}
              className={cn('inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[12px]', filter === c.key ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {c.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />}
              {c.label}<span className="tabular text-[var(--w-text-3)]">{c.count}</span>
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] text-[var(--w-text-3)] lg:inline">
            <span className="w-kbd">J</span><span className="w-kbd">K</span> {wt('issues.kMove')} · <span className="w-kbd">Enter</span> {wt('tests.execute')}
          </span>
        </div>

        {/* Bảng lần chạy */}
        {!data.runs.length ? (
          <EmptyState
            title={wt('tests.cycleEmpty')}
            body={wt('tests.cycleEmptyBody')}
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setAddOpen(true)}><Plus size={14} /> {wt('tests.addTests')}</button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="sm:min-w-[900px]">
              <div className={cn(GRID, 'max-sm:!hidden border-y border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]')}>
                <span>{wt('tests.test')}</span><span>{wt('common.priority')}</span><span>{wt('common.assignee')}</span><span>{wt('common.status')}</span><span>{wt('tests.executed')}</span><span>{wt('tests.defectsH')}</span><span />
              </div>
              {!runs.length && <div className="px-4 py-8 text-center text-[13px] text-[var(--w-text-3)]">{wt('tests.noRunsMatch')}</div>}
              {runs.map((r, i) => (
                <div key={r.id} className="group">
                {/* Điện thoại (< 640px): dạng thẻ, vẫn giữ trạng thái + người + lỗi */}
                <div
                  tabIndex={-1}
                  onClick={() => openRun(r.id)}
                  className={cn('flex cursor-pointer flex-col gap-1.5 border-b border-[var(--w-border)] px-4 py-2.5 text-[13px] sm:hidden', runParam === r.id ? 'bg-[var(--w-active)]' : 'active:bg-[var(--w-hover)]')}
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="shrink-0 pt-px text-[12px] font-medium text-[var(--w-text-2)]">{lk.issueKey(r.test.number)}</span>
                    <span className="min-w-0 flex-1 leading-snug">{r.test.title}</span>
                    <RunStatusPill status={r.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                    <PriorityIcon priority={r.test.priority} size={13} />
                    <span className="min-w-0 max-w-[55%]" onClick={(e) => e.stopPropagation()}>
                      <AssigneePicker config={config} value={r.assigneeId} bare disabled={!canExecute} onChange={(id) => setAssignee(r.id, id)} />
                    </span>
                    {r.executedAt && <span className="truncate">{formatDateTime(r.executedAt)}</span>}
                    {r.defects.map((d) => (
                      <button
                        key={d.number}
                        type="button"
                        title={d.title}
                        onClick={(e) => { e.stopPropagation(); openIssue(d.number); }}
                        className="rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1 text-[11px] font-medium text-[var(--w-red)]"
                      >
                        {lk.issueKey(d.number)}
                      </button>
                    ))}
                    {r.comment && <MessageSquare size={12} aria-label={wt('tests.hasComment')} />}
                  </div>
                </div>
                <div
                  tabIndex={-1}
                  onClick={() => openRun(r.id)}
                  className={cn(GRID, 'max-sm:!hidden cursor-pointer border-b border-[var(--w-border)] px-4 py-2 text-[13px]', cursor === i ? 'bg-[var(--w-hover)]' : 'hover:bg-[var(--w-hover)]', runParam === r.id && 'bg-[var(--w-active)]')}
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
                      <button type="button" className={cn('w-btn w-btn-ghost w-btn-sm w-btn-icon', cursor !== i && runParam !== r.id && '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:focus-visible:opacity-100 [@media(hover:hover)]:group-hover:opacity-100')} title={wt('tests.removeFromCycle')} aria-label={wt('tests.removeKeyCycle', { key: lk.issueKey(r.test.number) })} onClick={() => setRemoveRun({ id: r.id, label: `${lk.issueKey(r.test.number)} ${r.test.title}` })}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
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
            const ok = await patchCycle({ addNumbers: numbers }, wt('tests.addTestsFailed'));
            if (ok) { toast.success(wt('tests.nAdded', { count: numbers.length })); setAddOpen(false); }
          }}
        />
      )}
      <ConfirmDialog
        open={!!removeRun}
        onClose={() => setRemoveRun(null)}
        title={wt('tests.removeTestQ')}
        body={wt('tests.removeTestBody', { label: removeRun?.label ?? '' })}
        confirmLabel={wt('common.remove')}
        pending={busy}
        onConfirm={async () => {
          if (!removeRun) return;
          setBusy(true);
          const ok = await patchCycle({ removeRunIds: [removeRun.id] }, wt('tests.removeTestFailed'));
          setBusy(false);
          if (ok) { if (runParam === removeRun.id) closeRun(); setRemoveRun(null); }
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={wt('tests.deleteCycleQ')}
        body={wt('tests.deleteCycleBody', { name: data.name, n: data.total })}
        confirmLabel={wt('tests.deleteCycle')}
        pending={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await workApi.deleteTestCycle(pid, cycleId);
            toast.success(wt('tests.cycleDeleted'));
            qc.removeQueries({ queryKey: cycleKey });
            refresh();
            router.push(listHref);
          } catch (err) {
            toast.error(workError(err, wt('tests.cycleDeleteFailed')));
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
      <ProjectHeader config={config} title={wt('tests.testCycle')} />
      {children}
    </div>
  );
}

function Stat({ label, value, color, hint, sub, onClick }: { label: string; value: number | string; color?: string; hint?: string; sub?: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={hint}
      className={cn('rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left', onClick && 'hover:bg-[var(--w-hover)]')}
    >
      <div className="flex items-center gap-1 text-[11px] text-[var(--w-text-3)]">{label}{hint && !onClick && <span aria-hidden className="cursor-help rounded-full border border-[var(--w-border-strong)] px-1 text-[9px] leading-[12px]">?</span>}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[18px] font-semibold tabular" style={color && value ? { color } : undefined}>{value}</span>
        {sub && <span className="text-[11px] text-[var(--w-text-3)]">{sub}</span>}
      </div>
    </Tag>
  );
}

function StateControl({ value, onChange, disabled }: { value: CycleState; onChange: (s: CycleState) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label={wt('tests.cycleState')} className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]">
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

type ReportFormat = 'xlsx' | 'pdf' | 'csv';
const REPORT_FORMATS: Array<{ key: ReportFormat; label: string; hint: string; Icon: typeof FileText }> = [
  { key: 'xlsx', label: 'Excel (.xlsx)', get hint() { return wt('tests.repXlsx'); }, Icon: FileSpreadsheet },
  { key: 'pdf', label: 'PDF', get hint() { return wt('tests.repPdf'); }, Icon: FileText },
  { key: 'csv', label: 'CSV', get hint() { return wt('tests.repCsv'); }, Icon: Sheet },
];

/** Báo cáo cycle tạo ở server (tổng quan + từng lần chạy); tải bằng object URL. */
function ExportReportMenu({ pid, cycleId }: { pid: number; cycleId: number }) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState<ReportFormat | null>(null);
  const run = async (format: ReportFormat) => {
    t.close();
    setBusy(format);
    try {
      const { blob, fileName } = await workApi.exportTestCycle(pid, cycleId, format);
      saveBlob(blob, fileName);
    } catch (err) {
      toast.error(await blobError(err, wt('tests.exportFailed')));
    } finally {
      setBusy(null);
    }
  };
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-sm gap-1" onClick={t.toggle} disabled={!!busy} aria-haspopup="menu" aria-expanded={t.on}>
        {busy ? <Spinner size={12} /> : <Download size={13} />}
        <span className="max-sm:!hidden">{busy ? wt('issues.exporting') : wt('tests.exportReport')}</span>
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={260} align="end">
        <div className="p-1" role="menu">
          <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{wt('tests.exportCycleReport')}</div>
          {REPORT_FORMATS.map(({ key, label, hint, Icon }) => (
            <button key={key} type="button" role="menuitem" onClick={() => void run(key)} className="flex w-full items-start gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]">
              <Icon size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
              <span className="min-w-0">
                <span className="block text-[13px]">{label}</span>
                <span className="block text-[11.5px] text-[var(--w-text-3)]">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

function MoreMenu({ onDelete }: { onDelete: () => void }) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={ref} type="button" className="w-btn w-btn-sm w-btn-icon" onClick={t.toggle} aria-label={wt('common.moreActions')}><MoreHorizontal size={14} /></button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={180} align="end">
        <div className="p-1">
          <button type="button" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[var(--w-red)] hover:bg-[var(--w-hover)]" onClick={() => { t.close(); onDelete(); }}>
            <Trash2 size={13} /> {wt('tests.deleteCycle')}
          </button>
        </div>
      </Popover>
    </>
  );
}

/** Ô chữ sửa tại chỗ: Enter/blur lưu, Esc huỷ. */
function InlineText({ value, onSave, disabled, placeholder, className, required, ariaLabel }: {
  value: string; onSave: (v: string) => void; disabled?: boolean; placeholder?: string; className?: string; required?: boolean; ariaLabel?: string;
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
      aria-label={ariaLabel}
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
      title={wt('tests.addToCycle')}
      width={520}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button
            type="button"
            className="w-btn w-btn-primary"
            disabled={!picked.length || busy}
            onClick={async () => { setBusy(true); await onAdd(picked); setBusy(false); }}
          >
            {busy && <Spinner size={12} />} {wt('tests.addNTests', { count: picked.length })}
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{wt('tests.addHelp')}</p>
      <TestPicker pid={pid} projectKey={config.key} value={picked} onChange={setPicked} exclude={existing} />
    </Dialog>
  );
}

export default function CyclePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string; cycleId: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  const cycleId = Number(params.cycleId);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (!Number.isInteger(cycleId) || cycleId <= 0) return <EmptyState title={wt('tests.cycleNotFound')} />;
  return <CycleView config={config} pid={pid} cycleId={cycleId} />;
}
