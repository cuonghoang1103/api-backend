'use client';

/**
 * Ngăn kéo THỰC THI một lần chạy test (kiểu Xray "Test Execution").
 *
 * Tốc độ là tất cả: đứng ở một bước bấm P/F/B/S, ↑/↓ để đi giữa các bước,
 * [ / ] sang test trước/sau. Mọi thay đổi được xếp HÀNG (tuần tự) lên server
 * để phản hồi không về lệch thứ tự; giao diện đổi ngay (lạc quan) và khi
 * hàng đợi trống thì lấy TestRunDetail server trả về làm sự thật.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Bug, ChevronDown, ChevronUp, CheckCheck, Link2, RotateCcw, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type ProjectConfig, type RunStatus, type StepStatus, type TestRunDetail,
} from '@/lib/work-api';
import { useLookups, wk } from '../hooks';
import { AssigneePicker, PriorityPicker } from '../fields';
import { Dialog, Field, isTyping, PriorityIcon, Spinner, StatusBadge, WorkPortal } from '../ui';
import { Select } from '../settings/shared';
import { formatDateTime, RUN_META, RunStatusPill, STEP_META } from './runStatus';

type Step = TestRunDetail['steps'][number];

const STEP_CHOICES: StepStatus[] = ['PASS', 'FAIL', 'BLOCKED', 'SKIP'];
const KEY_TO_STATUS: Record<string, StepStatus> = { p: 'PASS', f: 'FAIL', b: 'BLOCKED', s: 'SKIP' };

/** Cùng luật với backend (tests.service deriveRunStatus) — chỉ để hiện lạc quan. */
function derive(steps: Step[]): RunStatus {
  const s = steps.map((x) => x.status);
  if (!s.length) return 'TODO';
  if (s.includes('FAIL')) return 'FAIL';
  if (s.includes('BLOCKED')) return 'BLOCKED';
  if (s.every((x) => x === 'PASS' || x === 'SKIP')) return s.includes('PASS') ? 'PASS' : 'SKIP';
  if (s.some((x) => x !== 'TODO')) return 'IN_PROGRESS';
  return 'TODO';
}

export default function RunPanel({ config, pid, runId, runIds, onNavigate, onClose, onOpenIssue, suspendKeys }: {
  config: ProjectConfig;
  pid: number;
  runId: number;
  /** Thứ tự các lần chạy (theo bộ lọc đang xem) để đi Trước / Sau. */
  runIds: number[];
  onNavigate: (runId: number) => void;
  onClose: () => void;
  onOpenIssue: (num: number) => void;
  /** Đang có lớp khác đè lên (vd ngăn kéo bug) ⇒ nhường phím tắt. */
  suspendKeys?: boolean;
}) {
  const qc = useQueryClient();
  const lk = useLookups(config);
  const runKey = useMemo(() => [...wk.tests(pid), 'run', runId], [pid, runId]);
  const run = useQuery({ queryKey: runKey, queryFn: () => workApi.testRun(pid, runId) });
  const data = run.data;
  const canExecute = config.permissions.transition;
  const canEdit = config.permissions.editIssues;
  const canCreateBug = config.permissions.createIssues;

  // ─── Hàng đợi ghi tuần tự ───────────────────────────────────────
  const chain = useRef<Promise<unknown>>(Promise.resolve());
  const pending = useRef(0);
  const [saving, setSaving] = useState(false);

  /** Mọi dữ liệu kiểm thử khác (cycle, danh sách cycle, truy vết) tải lại — trừ chính lần chạy này. */
  const refreshOthers = useCallback(() => {
    qc.invalidateQueries({
      queryKey: wk.tests(pid),
      predicate: (q) => !(q.queryKey[3] === 'run' && q.queryKey[4] === runId),
    });
  }, [qc, pid, runId]);

  const enqueue = useCallback((job: () => Promise<TestRunDetail | void>, failMsg: string) => {
    pending.current += 1;
    setSaving(true);
    const p = chain.current.then(async () => {
      try {
        const res = await job();
        pending.current -= 1;
        if (pending.current === 0) {
          if (res) qc.setQueryData(runKey, res);
          else await qc.invalidateQueries({ queryKey: runKey });
          refreshOthers();
          setSaving(false);
        }
      } catch (err) {
        pending.current -= 1;
        toast.error(workError(err, failMsg));
        // Lạc quan đã sai ⇒ lấy lại sự thật từ server.
        await qc.invalidateQueries({ queryKey: runKey });
        if (pending.current === 0) setSaving(false);
      }
    });
    chain.current = p;
    return p;
  }, [qc, runKey, refreshOthers]);

  const patchLocal = useCallback((fn: (r: TestRunDetail) => TestRunDetail) => {
    qc.setQueryData<TestRunDetail>(runKey, (old) => (old ? fn(old) : old));
  }, [qc, runKey]);

  const setStep = useCallback((stepId: number, status: StepStatus) => {
    if (!canExecute) return;
    patchLocal((r) => {
      const steps = r.steps.map((s) => (s.id === stepId ? { ...s, status } : s));
      return { ...r, steps, status: derive(steps) };
    });
    enqueue(() => workApi.updateStepResult(pid, runId, stepId, { status }), 'Could not save the step result');
  }, [canExecute, patchLocal, enqueue, pid, runId]);

  const setActual = useCallback((stepId: number, actual: string) => {
    patchLocal((r) => ({ ...r, steps: r.steps.map((s) => (s.id === stepId ? { ...s, actual } : s)) }));
    return enqueue(() => workApi.updateStepResult(pid, runId, stepId, { actual: actual || null }), 'Could not save the actual result');
  }, [patchLocal, enqueue, pid, runId]);

  const setRun = useCallback((body: { status?: RunStatus; comment?: string | null; reset?: boolean }, msg: string) => {
    patchLocal((r) => {
      if (body.reset) return { ...r, status: 'TODO', steps: r.steps.map((s) => ({ ...s, status: 'TODO', actual: null })) };
      return { ...r, ...(body.status ? { status: body.status } : {}), ...(body.comment !== undefined ? { comment: body.comment } : {}) };
    });
    return enqueue(() => workApi.updateTestRun(pid, runId, body), msg);
  }, [patchLocal, enqueue, pid, runId]);

  const passRemaining = () => {
    if (!data) return;
    const todo = data.steps.filter((s) => s.status === 'TODO');
    if (!todo.length) return;
    patchLocal((r) => {
      const steps = r.steps.map((s) => (s.status === 'TODO' ? { ...s, status: 'PASS' as const } : s));
      return { ...r, steps, status: derive(steps) };
    });
    for (const s of todo) enqueue(() => workApi.updateStepResult(pid, runId, s.id, { status: 'PASS' }), 'Could not save the step result');
  };

  // ─── Điều hướng & phím tắt ──────────────────────────────────────
  const idx = runIds.indexOf(runId);
  const prevId = idx > 0 ? runIds[idx - 1] : null;
  const nextId = idx >= 0 && idx < runIds.length - 1 ? runIds[idx + 1] : null;

  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const actualRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const focusStep = (i: number) => stepRefs.current[i]?.focus();

  // Mở một lần chạy ⇒ con trỏ đứng sẵn ở bước chưa chạy đầu tiên.
  const focusedFor = useRef<number | null>(null);
  useEffect(() => {
    if (!data || data.id !== runId || focusedFor.current === runId) return;
    focusedFor.current = runId;
    const i = Math.max(0, data.steps.findIndex((s) => s.status === 'TODO'));
    requestAnimationFrame(() => stepRefs.current[i]?.focus({ preventScroll: false }));
  }, [data, runId]);

  useEffect(() => {
    if (suspendKeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target) || document.querySelector('[role="dialog"]')) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === ']' && nextId) { e.preventDefault(); onNavigate(nextId); }
      else if (e.key === '[' && prevId) { e.preventDefault(); onNavigate(prevId); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [suspendKeys, onClose, onNavigate, nextId, prevId]);

  const onStepKey = (e: React.KeyboardEvent<HTMLDivElement>, i: number, step: Step) => {
    if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (KEY_TO_STATUS[k] && canExecute) {
      e.preventDefault();
      const st = KEY_TO_STATUS[k];
      setStep(step.id, step.status === st ? 'TODO' : st);
      if (st === 'FAIL' || st === 'BLOCKED') {
        if (step.status !== st) requestAnimationFrame(() => actualRefs.current[i]?.focus());
      } else if (i < (data?.steps.length ?? 0) - 1) focusStep(i + 1);
    } else if (e.key === 'ArrowDown' || k === 'j') { e.preventDefault(); focusStep(Math.min(i + 1, (data?.steps.length ?? 1) - 1)); }
    else if (e.key === 'ArrowUp' || k === 'k') { e.preventDefault(); focusStep(Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' || k === 'a') { e.preventDefault(); actualRefs.current[i]?.focus(); }
  };

  // ─── Bug ────────────────────────────────────────────────────────
  const [bugOpen, setBugOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linking, setLinking] = useState(false);
  const failedStep = data?.steps.find((s) => s.status === 'FAIL') ?? data?.steps.find((s) => s.status === 'BLOCKED');

  const link = async () => {
    const t = linkText.trim().toUpperCase();
    const m = /^(?:([A-Z][A-Z0-9_]*)-)?(\d+)$/.exec(t);
    if (!m) { toast.error(`Enter an issue key like ${config.key}-12`); return; }
    if (m[1] && m[1] !== config.key.toUpperCase()) { toast.error(`Only issues from ${config.key} can be linked`); return; }
    setLinking(true);
    try {
      await workApi.linkDefect(pid, runId, Number(m[2]));
      setLinkText('');
      toast.success(`${lk.issueKey(Number(m[2]))} linked`);
      await qc.invalidateQueries({ queryKey: runKey });
      refreshOthers();
    } catch (err) {
      toast.error(workError(err, 'Could not link the issue'));
    } finally {
      setLinking(false);
    }
  };
  const unlink = async (num: number) => {
    patchLocal((r) => ({ ...r, defects: r.defects.filter((d) => d.number !== num) }));
    try {
      await workApi.unlinkDefect(pid, runId, num);
      refreshOthers();
    } catch (err) {
      toast.error(workError(err, 'Could not unlink the issue'));
    }
    qc.invalidateQueries({ queryKey: runKey });
  };

  // ─── Giao diện ──────────────────────────────────────────────────
  const status = data?.status;
  const testKey = data ? lk.issueKey(data.testCase.issue.number) : '';
  const todoCount = data?.steps.filter((s) => s.status === 'TODO').length ?? 0;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[60] bg-black/20 md:bg-black/10" onMouseDown={onClose} />
      <div
        role="complementary"
        aria-label="Test execution"
        className="fixed inset-y-0 right-0 z-[61] flex w-full flex-col border-l border-[var(--w-border)] bg-[var(--w-panel)] sm:w-[min(780px,94vw)]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        {/* Thanh trên */}
        <div className="flex h-12 shrink-0 items-center gap-1.5 border-b border-[var(--w-border)] px-3">
          <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" disabled={!prevId} onClick={() => prevId && onNavigate(prevId)} title="Previous test ( [ )" aria-label="Previous test"><ChevronUp size={15} /></button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" disabled={!nextId} onClick={() => nextId && onNavigate(nextId)} title="Next test ( ] )" aria-label="Next test"><ChevronDown size={15} /></button>
          {idx >= 0 && <span className="text-[12px] tabular text-[var(--w-text-3)]">{idx + 1} of {runIds.length}</span>}
          {saving && <span className="ml-2 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><Spinner size={11} /> Saving…</span>}
          <div className="ml-auto flex items-center gap-1.5">
            {nextId && (
              <button type="button" className="w-btn w-btn-sm" onClick={() => onNavigate(nextId)} title="Next test ( ] )">Next test</button>
            )}
            <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" onClick={onClose} aria-label="Close" title="Close (Esc)"><X size={15} /></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {run.isLoading || (!data && !run.error) ? (
            <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>
          ) : run.error || !data ? (
            <div className="px-6 py-16 text-center">
              <div className="text-[15px] font-semibold">Could not load this test run</div>
              <p className="mt-1.5 text-[13px] text-[var(--w-text-2)]">{workError(run.error)}</p>
              <button type="button" className="w-btn mt-4" onClick={() => run.refetch()}>Try again</button>
            </div>
          ) : (
            <div className="px-4 pb-10 pt-4 sm:px-6">
              {/* Tiêu đề */}
              <div className="flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">
                <PriorityIcon priority={data.testCase.issue.priority} size={14} />
                <button type="button" onClick={() => onOpenIssue(data.testCase.issue.number)} className="font-medium text-[var(--w-text-2)] hover:text-[var(--w-accent-text)] hover:underline">{testKey}</button>
                <span>·</span>
                <span className="truncate">{data.cycle.name}</span>
                {data.cycle.environment && <><span>·</span><span className="truncate">{data.cycle.environment}</span></>}
                {data.cycle.build && <><span>·</span><span className="truncate">Build {data.cycle.build}</span></>}
              </div>
              <h2 className="mt-1 text-[18px] font-semibold leading-snug">{data.testCase.issue.title}</h2>

              {/* Trạng thái tổng */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RunStatusPill status={status} className="!h-[24px] !text-[12px]" />
                {canExecute && (
                  <Select
                    aria-label="Override run status"
                    value={status}
                    onChange={(e) => setRun({ status: e.target.value as RunStatus }, 'Could not update the run status')}
                    className="!h-[28px] !w-auto text-[12px]"
                  >
                    {(Object.keys(RUN_META) as RunStatus[]).map((s) => <option key={s} value={s}>{s === status ? `Status: ${RUN_META[s].label}` : `Set to ${RUN_META[s].label}`}</option>)}
                  </Select>
                )}
                <span className="text-[12px] text-[var(--w-text-3)]">
                  {data.executedAt
                    ? <>Executed by <span className="text-[var(--w-text-2)]">{data.executedBy ? userName(data.executedBy) : 'someone'}</span> · {formatDateTime(data.executedAt)}</>
                    : 'Not executed yet'}
                </span>
                {canExecute && status !== 'TODO' && status !== 'RETEST' && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setRun({ reset: true }, 'Could not reset the run')} title="Clear every step result (linked bugs are kept)">
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>

              {status === 'RETEST' && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-2.5">
                  <RotateCcw size={15} className="shrink-0 text-[var(--w-accent-text)]" />
                  <span className="min-w-0 flex-1 text-[13px]">A linked bug was moved to Retest — run this test again.</span>
                  {canExecute && (
                    <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setRun({ reset: true }, 'Could not start the re-run').then(() => requestAnimationFrame(() => focusStep(0)))}>
                      Start re-run
                    </button>
                  )}
                </div>
              )}

              {(status === 'FAIL' || status === 'BLOCKED') && canCreateBug && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[8px] border px-3 py-2.5" style={{ borderColor: 'color-mix(in srgb, var(--w-red) 40%, transparent)', background: 'color-mix(in srgb, var(--w-red) 8%, transparent)' }}>
                  <AlertTriangle size={15} className="shrink-0 text-[var(--w-red)]" />
                  <span className="min-w-0 flex-1 text-[13px]">
                    {status === 'FAIL' ? 'This test failed.' : 'This test is blocked.'}{' '}
                    {data.defects.length ? `${data.defects.length} bug${data.defects.length === 1 ? '' : 's'} linked.` : 'Record a bug so the team can fix it.'}
                  </span>
                  <button type="button" className="w-btn w-btn-danger-solid w-btn-sm" onClick={() => setBugOpen(true)}><Bug size={13} /> Create bug</button>
                </div>
              )}

              {data.testCase.preconditions && (
                <section className="mt-5">
                  <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Preconditions</h3>
                  <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{data.testCase.preconditions}</p>
                </section>
              )}

              {data.gherkin && (
                <section className="mt-5">
                  <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Scenario</h3>
                  <pre className="overflow-x-auto whitespace-pre rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 font-mono text-[12.5px] leading-relaxed">{data.gherkin}</pre>
                </section>
              )}

              {/* Các bước */}
              <section className="mt-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
                    Steps {data.steps.length > 0 && <span className="tabular normal-case">({data.steps.length - todoCount}/{data.steps.length})</span>}
                  </h3>
                  <span className="hidden text-[11px] text-[var(--w-text-3)] md:inline">
                    <span className="w-kbd">P</span> pass · <span className="w-kbd">F</span> fail · <span className="w-kbd">B</span> blocked · <span className="w-kbd">S</span> skip · <span className="w-kbd">↑</span><span className="w-kbd">↓</span> move · <span className="w-kbd">Enter</span> actual result
                  </span>
                  {canExecute && todoCount > 0 && (
                    <button type="button" className="w-btn w-btn-sm ml-auto" onClick={passRemaining}><CheckCheck size={13} /> Pass all remaining ({todoCount})</button>
                  )}
                </div>

                {!data.steps.length ? (
                  <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-5 text-center text-[13px] text-[var(--w-text-2)]">
                    {data.gherkin ? 'This scenario has no manual steps. Run it, then record the result:' : 'This test has no steps. Record the overall result:'}
                    {canExecute && (
                      <div className="mt-3 flex justify-center">
                        <Segmented value={(['PASS', 'FAIL', 'BLOCKED', 'SKIP'] as StepStatus[]).includes(status as StepStatus) ? (status as StepStatus) : 'TODO'} onChange={(s) => setRun({ status: s === 'TODO' ? 'TODO' : s }, 'Could not update the run status')} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.steps.map((s, i) => (
                      <StepRow
                        key={s.id}
                        step={s}
                        index={i}
                        canExecute={canExecute}
                        rowRef={(el) => { stepRefs.current[i] = el; }}
                        actualRef={(el) => { actualRefs.current[i] = el; }}
                        onKeyDown={(e) => onStepKey(e, i, s)}
                        onStatus={(st) => setStep(s.id, s.status === st ? 'TODO' : st)}
                        onActual={(t) => setActual(s.id, t)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Ghi chú */}
              <section className="mt-6">
                <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Comment</h3>
                <AutoText
                  key={`c-${data.id}`}
                  value={data.comment ?? ''}
                  disabled={!canExecute}
                  placeholder={canExecute ? 'Notes about this run — observations, logs, evidence links…' : 'No comment'}
                  rows={3}
                  onSave={(t) => setRun({ comment: t || null }, 'Could not save the comment')}
                />
              </section>

              {/* Bug */}
              <section className="mt-6">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Defects</h3>
                  {canCreateBug && status !== 'FAIL' && status !== 'BLOCKED' && (
                    <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setBugOpen(true)}><Bug size={13} /> Create bug</button>
                  )}
                </div>
                {data.defects.length ? (
                  <div className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
                    {data.defects.map((d) => (
                      <div key={d.number} className="flex items-center gap-2 px-3 py-2">
                        <button type="button" onClick={() => onOpenIssue(d.number)} className="flex min-w-0 flex-1 items-center gap-2 text-left hover:text-[var(--w-accent-text)]">
                          <Bug size={13} className="shrink-0 text-[var(--w-red)]" />
                          <span className="shrink-0 text-[12px] font-medium text-[var(--w-text-2)]">{lk.issueKey(d.number)}</span>
                          <span className="min-w-0 flex-1 truncate text-[13px]">{d.title}</span>
                        </button>
                        {d.statusId !== undefined && <StatusBadge status={lk.statuses.get(d.statusId)} />}
                        {canEdit && (
                          <button type="button" onClick={() => unlink(d.number)} className="w-btn w-btn-ghost w-btn-sm w-btn-icon" title="Unlink from this run" aria-label={`Unlink ${lk.issueKey(d.number)}`}><X size={13} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[var(--w-text-3)]">No bugs linked to this run.</p>
                )}
                {canEdit && (
                  <form className="mt-2 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); link(); }}>
                    <div className="relative flex-1 sm:max-w-[260px]">
                      <Link2 size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
                      <input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder={`Link existing bug, e.g. ${config.key}-12`} className="w-input !h-[28px] pl-7 text-[12px]" />
                    </div>
                    <button type="submit" className="w-btn w-btn-sm" disabled={!linkText.trim() || linking}>{linking && <Spinner size={11} />} Link</button>
                  </form>
                )}
              </section>

              {nextId && (
                <div className="mt-8 flex justify-end">
                  <button type="button" className="w-btn w-btn-primary" onClick={() => onNavigate(nextId)}>Next test <ChevronDown size={14} className="-rotate-90" /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {bugOpen && data && (
        <CreateBugDialog
          config={config}
          pid={pid}
          run={data}
          failedStep={failedStep}
          onClose={() => setBugOpen(false)}
          onCreated={(num) => {
            setBugOpen(false);
            qc.invalidateQueries({ queryKey: runKey });
            refreshOthers();
            toast.success(`Bug ${lk.issueKey(num)} created and linked`, { action: { label: 'Open', onClick: () => onOpenIssue(num) } });
          }}
        />
      )}
    </WorkPortal>
  );
}

// ─── Một bước ────────────────────────────────────────────────────

function StepRow({ step, index, canExecute, rowRef, actualRef, onKeyDown, onStatus, onActual }: {
  step: Step; index: number; canExecute: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
  actualRef: (el: HTMLTextAreaElement | null) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onStatus: (s: StepStatus) => void;
  onActual: (text: string) => Promise<unknown>;
}) {
  const color = STEP_META[step.status].color;
  const done = step.status !== 'TODO';
  const [showActual, setShowActual] = useState(!!step.actual);
  const wantActual = showActual || !!step.actual || step.status === 'FAIL' || step.status === 'BLOCKED';
  const localRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={(el) => { localRef.current = el; rowRef(el); }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Step ${index + 1}: ${STEP_META[step.status].label}`}
      className="group rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] outline-none transition-shadow focus-within:border-[var(--w-accent-border)] focus:shadow-[0_0_0_3px_var(--w-accent-soft)]"
      style={done ? { borderLeft: `3px solid ${step.status === 'SKIP' ? 'var(--w-border-strong)' : color}` } : undefined}
    >
      <div className="flex gap-3 px-3 py-2.5">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[11px] font-semibold tabular text-[var(--w-text-2)]">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <div className="grid gap-x-4 gap-y-1.5 md:grid-cols-[1.3fr_1fr_1.3fr]">
            <StepCell label="Action" text={step.action} />
            <StepCell label="Test data" text={step.data} mono />
            <StepCell label="Expected result" text={step.expected} />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {canExecute ? (
              <Segmented value={step.status} onChange={(s) => { onStatus(s); if (s === 'FAIL' || s === 'BLOCKED') setShowActual(true); }} />
            ) : (
              <span className="text-[12px] font-medium" style={{ color }}>{STEP_META[step.status].label}</span>
            )}
            {canExecute && !wantActual && (
              <button type="button" tabIndex={-1} className="w-btn w-btn-ghost w-btn-sm" onClick={() => setShowActual(true)}>Add actual result</button>
            )}
          </div>
          {wantActual && (
            <div className="mt-2">
              <AutoText
                value={step.actual ?? ''}
                disabled={!canExecute}
                placeholder="Actual result — what really happened?"
                rows={2}
                inputRef={actualRef}
                onEscape={() => localRef.current?.focus()}
                onSave={onActual}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCell({ label, text, mono }: { label: string; text: string | null; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div className={cn('whitespace-pre-wrap break-words text-[13px] leading-relaxed', mono && text && 'font-mono text-[12.5px]', !text && 'text-[var(--w-text-3)]')}>{text || '—'}</div>
    </div>
  );
}

function Segmented({ value, onChange }: { value: StepStatus; onChange: (s: StepStatus) => void }) {
  return (
    <div role="radiogroup" aria-label="Step result" className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]">
      {STEP_CHOICES.map((s, i) => {
        const m = STEP_META[s];
        const on = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={-1}
            title={`${m.label} (${m.key})`}
            onClick={() => onChange(on ? 'TODO' : s)}
            className={cn('h-[26px] px-2.5 text-[12px] font-medium transition-colors', i > 0 && 'border-l border-[var(--w-border-strong)]', !on && 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            style={on ? { background: s === 'SKIP' ? 'var(--w-text-3)' : m.color, color: '#fff' } : undefined}
          >
            {m.short}
          </button>
        );
      })}
    </div>
  );
}

/** Ô chữ tự lưu: sau 900ms ngừng gõ và khi rời ô. Không ghi đè lúc đang gõ. */
function AutoText({ value, onSave, disabled, placeholder, rows, inputRef, onEscape }: {
  value: string; onSave: (text: string) => Promise<unknown> | void; disabled?: boolean; placeholder?: string; rows?: number;
  inputRef?: (el: HTMLTextAreaElement | null) => void; onEscape?: () => void;
}) {
  const [text, setText] = useState(value);
  const focused = useRef(false);
  const saved = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!focused.current && !timer.current) { setText(value); saved.current = value; }
  }, [value]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flush = (t: string) => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    if (t.trim() === saved.current.trim()) return;
    saved.current = t;
    onSave(t.trim());
  };

  return (
    <textarea
      ref={inputRef}
      value={text}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      onFocus={() => { focused.current = true; }}
      onChange={(e) => {
        const t = e.target.value;
        setText(t);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => { timer.current = null; flush(t); }, 900);
      }}
      onBlur={(e) => { focused.current = false; flush(e.target.value); }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onEscape) { e.preventDefault(); onEscape(); }
      }}
      className="w-input text-[13px] disabled:opacity-70"
    />
  );
}

// ─── Tạo bug từ lần chạy ─────────────────────────────────────────

function CreateBugDialog({ config, pid, run, failedStep, onClose, onCreated }: {
  config: ProjectConfig; pid: number; run: TestRunDetail; failedStep: Step | undefined;
  onClose: () => void; onCreated: (num: number) => void;
}) {
  const [title, setTitle] = useState(
    failedStep ? `${run.testCase.issue.title} — step ${failedStep.position + 1} fails` : `${run.testCase.issue.title} fails`,
  );
  const [priority, setPriority] = useState(2);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const res = await workApi.createDefect(pid, run.id, { title: title.trim(), stepResultId: failedStep?.id ?? null, priority, assigneeId });
      onCreated(res.number);
    } catch (err) {
      toast.error(workError(err, 'Could not create the bug'));
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title="Create bug from this run"
      width={500}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={busy || !title.trim()} onClick={submit}>{busy && <Spinner size={12} />} Create bug</button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Field label="Summary">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} className="w-input" />
        </Field>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Priority"><PriorityPicker value={priority} onChange={setPriority} /></Field>
          <Field label="Assignee"><AssigneePicker config={config} value={assigneeId} onChange={setAssigneeId} /></Field>
        </div>
        <div className="rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12px] leading-relaxed text-[var(--w-text-2)]">
          The description is filled in for you: preconditions, steps to reproduce
          {failedStep ? ` (up to step ${failedStep.position + 1})` : ''}, expected and actual result
          {run.cycle.environment || run.cycle.build ? ', and the environment' : ''}. The bug is linked to this run and to the test.
        </div>
        <button type="submit" hidden />
      </form>
    </Dialog>
  );
}

