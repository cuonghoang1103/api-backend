'use client';

/**
 * Hộp thoại sprint: bắt đầu, kết thúc, sửa, lập kế hoạch theo velocity.
 * Dùng ở Backlog và trên Board.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, CircleDashed, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isAiQuotaError, workApi, workError, type EstimationUnit, type SprintFull,
} from '@/lib/work-api';
import { wk } from './hooks';
import { Dialog, Field, Spinner } from './ui';
import AiMarkdown from './ai/AiMarkdown';
import UpgradeDialog from './ai/UpgradeDialog';

const DURATIONS = [
  { weeks: 1, label: '1 week' },
  { weeks: 2, label: '2 weeks' },
  { weeks: 3, label: '3 weeks' },
  { weeks: 4, label: '4 weeks' },
  { weeks: 0, label: 'Custom' },
];

/** yyyy-mm-ddThh:mm theo giờ máy — định dạng của <input type="datetime-local">. */
function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const unitLabel = (u: EstimationUnit) => (u === 'HOURS' ? 'h' : 'pts');

function invalidateAll(qc: ReturnType<typeof useQueryClient>, pid: number) {
  for (const k of [wk.backlog(pid), wk.board(pid), wk.sprints(pid), wk.project(pid), wk.issues(pid), wk.reports(pid)]) {
    qc.invalidateQueries({ queryKey: k });
  }
}

export function StartSprintDialog({ open, onClose, pid, sprint, issueCount, points, unit, defaultWeeks = 2 }: {
  open: boolean; onClose: () => void; pid: number; sprint: SprintFull; issueCount: number; points: number; unit: EstimationUnit; defaultWeeks?: number;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(sprint.name);
  const [goal, setGoal] = useState(sprint.goal ?? '');
  const [weeks, setWeeks] = useState(defaultWeeks);
  const [start, setStart] = useState(() => toLocalInput(new Date()));
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(sprint.name);
    setGoal(sprint.goal ?? '');
    setWeeks(defaultWeeks);
    const s = sprint.startAt ? new Date(sprint.startAt) : new Date();
    setStart(toLocalInput(s));
    setEnd(sprint.endAt ? toLocalInput(new Date(sprint.endAt)) : toLocalInput(new Date(s.getTime() + defaultWeeks * 7 * 86_400_000)));
  }, [open, sprint, defaultWeeks]);

  // Chọn thời lượng thì tự tính ngày kết thúc; "Custom" để người dùng tự đặt.
  useEffect(() => {
    if (!weeks || !start) return;
    setEnd(toLocalInput(new Date(new Date(start).getTime() + weeks * 7 * 86_400_000)));
  }, [weeks, start]);

  const valid = name.trim() && start && end && new Date(end) > new Date(start);
  const m = useMutation({
    mutationFn: () => workApi.startSprint(pid, sprint.id, {
      name: name.trim(), goal: goal.trim() || null, startAt: new Date(start).toISOString(), endAt: new Date(end).toISOString(),
    }),
    onSuccess: () => { toast.success(`${name.trim()} started`); invalidateAll(qc, pid); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not start the sprint')),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Start sprint"
      width={520}
      footer={(
        <>
          <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!valid || m.isPending} onClick={() => m.mutate()}>
            {m.isPending ? 'Starting…' : 'Start sprint'}
          </button>
        </>
      )}
    >
      <p className="mb-4 text-[13px] text-[var(--w-text-2)]">
        <span className="font-semibold text-[var(--w-text)]">{issueCount}</span> {issueCount === 1 ? 'issue' : 'issues'} ·{' '}
        <span className="font-semibold text-[var(--w-text)]">{points}</span> {unitLabel(unit)} will be committed to this sprint.
        {issueCount === 0 && <span className="mt-1 block text-[var(--w-orange)]">This sprint is empty. Drag issues into it from the backlog first.</span>}
      </p>
      <Field label="Sprint name"><input className="w-input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Duration">
          <select className="w-input" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>
            {DURATIONS.map((d) => <option key={d.weeks} value={d.weeks}>{d.label}</option>)}
          </select>
        </Field>
        <Field label="Start date"><input type="datetime-local" className="w-input" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="End date"><input type="datetime-local" className="w-input" value={end} disabled={weeks !== 0} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      <Field label="Sprint goal" hint="One sentence the whole team can remember. Shown on the board.">
        <textarea className="w-input" rows={2} value={goal} maxLength={5000} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Customers can pay by card" />
      </Field>
    </Dialog>
  );
}

export function CompleteSprintDialog({ open, onClose, pid, sprint, plannedSprints }: {
  open: boolean; onClose: () => void; pid: number; sprint: SprintFull; plannedSprints: SprintFull[];
}) {
  const qc = useQueryClient();
  const report = useQuery({
    queryKey: [...wk.reports(pid), 'sprint', sprint.id],
    queryFn: () => workApi.sprintReport(pid, sprint.id),
    enabled: open,
  });
  const [moveTo, setMoveTo] = useState<string>('new');
  useEffect(() => {
    if (open) setMoveTo(plannedSprints[0] ? String(plannedSprints[0].id) : 'new');
  }, [open, plannedSprints]);

  const r = report.data?.report;
  const m = useMutation({
    mutationFn: () => workApi.completeSprint(pid, sprint.id, moveTo === 'new' || moveTo === 'backlog' ? moveTo : Number(moveTo)),
    onSuccess: (res) => {
      toast.success(`${sprint.name} completed — ${res.report.completed.length} of ${res.report.completed.length + res.report.incomplete.length} issues done`);
      invalidateAll(qc, pid);
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not complete the sprint')),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Complete ${sprint.name}`}
      width={480}
      footer={(
        <>
          <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!r || m.isPending} onClick={() => m.mutate()}>
            {m.isPending ? 'Completing…' : 'Complete sprint'}
          </button>
        </>
      )}
    >
      {!r ? (
        <p className="text-[13px] text-[var(--w-text-3)]">Loading sprint summary…</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="rounded-[8px] border border-[var(--w-border)] p-3">
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><CheckCircle2 size={13} className="text-[var(--w-green)]" /> Completed</div>
              <div className="mt-1 text-[20px] font-semibold tabular">{r.completed.length}</div>
              <div className="text-[12px] text-[var(--w-text-3)] tabular">{r.completedPoints} {unitLabel(r.unit)}</div>
            </div>
            <div className="rounded-[8px] border border-[var(--w-border)] p-3">
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><CircleDashed size={13} /> Open</div>
              <div className="mt-1 text-[20px] font-semibold tabular">{r.incomplete.length}</div>
              <div className="text-[12px] text-[var(--w-text-3)] tabular">{Math.round(r.incomplete.reduce((s, i) => s + i.points, 0) * 10) / 10} {unitLabel(r.unit)}</div>
            </div>
          </div>
          {r.incomplete.length > 0 ? (
            <Field label="Move open issues to" hint="Their sub-tasks that are not done move with them.">
              <select className="w-input" value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
                {plannedSprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                <option value="new">New sprint</option>
                <option value="backlog">Backlog</option>
              </select>
            </Field>
          ) : (
            <p className="text-[13px] text-[var(--w-green)]">Every issue in this sprint is done. Nice work.</p>
          )}
          {(r.added.length > 0 || r.removed.length > 0) && (
            <p className="text-[12px] text-[var(--w-text-3)]">
              Scope changed during the sprint: {r.added.length} added, {r.removed.length} removed.
            </p>
          )}
        </>
      )}
    </Dialog>
  );
}

export function EditSprintDialog({ open, onClose, pid, sprint }: { open: boolean; onClose: () => void; pid: number; sprint: SprintFull }) {
  const qc = useQueryClient();
  const [name, setName] = useState(sprint.name);
  const [goal, setGoal] = useState(sprint.goal ?? '');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  useEffect(() => {
    if (!open) return;
    setName(sprint.name);
    setGoal(sprint.goal ?? '');
    setStart(sprint.startAt ? toLocalInput(new Date(sprint.startAt)) : '');
    setEnd(sprint.endAt ? toLocalInput(new Date(sprint.endAt)) : '');
  }, [open, sprint]);
  const datesOk = !start || !end || new Date(end) > new Date(start);
  const m = useMutation({
    mutationFn: () => workApi.updateSprint(pid, sprint.id, {
      name: name.trim(), goal: goal.trim() || null,
      startAt: start ? new Date(start).toISOString() : null,
      endAt: end ? new Date(end).toISOString() : null,
    }),
    onSuccess: () => { invalidateAll(qc, pid); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not save the sprint')),
  });
  const running = sprint.state === 'ACTIVE';
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit sprint"
      width={480}
      footer={(
        <>
          <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!name.trim() || !datesOk || m.isPending} onClick={() => m.mutate()}>Save</button>
        </>
      )}
    >
      <Field label="Sprint name"><input className="w-input" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Start date"><input type="datetime-local" className="w-input" value={start} onChange={(e) => setStart(e.target.value)} disabled={running} /></Field>
        <Field label="End date"><input type="datetime-local" className="w-input" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      {!datesOk && <p className="-mt-2 mb-3 text-[12px] text-[var(--w-red)]">The end date must be after the start date.</p>}
      <Field label="Sprint goal"><textarea className="w-input" rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} /></Field>
    </Dialog>
  );
}

// ─── Lập kế hoạch sprint theo velocity ───────────────────────────

/**
 * Danh sách đề xuất do MÃ tính (không tốn lượt AI). "Explain this plan" mới
 * gọi AI (tốn 1 lượt) và chỉ lấy phần lời giải thích — danh sách người dùng
 * đã bỏ chọn giữ nguyên. Áp dụng bằng bulkUpdate { sprintId } như Backlog.
 */
export function PlanSprintDialog({ open, onClose, pid, sprint, issueKey }: {
  open: boolean; onClose: () => void; pid: number; sprint: SprintFull; issueKey: (n: number) => string;
}) {
  const qc = useQueryClient();
  const plan = useQuery({
    queryKey: wk.aiPlan(pid, sprint.id),
    queryFn: () => workApi.aiPlanSprint(pid, { sprintId: sprint.id }),
    enabled: open,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const p = plan.data;
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [rationale, setRationale] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);

  // Kế hoạch mới về ⇒ chọn sẵn tất cả.
  useEffect(() => {
    if (p) setChecked(new Set(p.selected.map((i) => i.number)));
  }, [p]);
  useEffect(() => { if (open) setRationale(null); }, [open, sprint.id]);

  const explain = useMutation({
    mutationFn: () => workApi.aiPlanSprint(pid, { sprintId: sprint.id, explain: true }),
    onSuccess: (r) => setRationale(r.rationale ?? 'No explanation was returned.'),
    onError: (err) => {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, 'Could not explain this plan'));
    },
  });

  const picked = p ? p.selected.filter((i) => checked.has(i.number)) : [];
  const apply = useMutation({
    mutationFn: () => workApi.bulkUpdate(pid, picked.map((i) => i.number), { sprintId: sprint.id }),
    onSuccess: (r) => {
      if (r.updated.length) toast.success(`${r.updated.length} ${r.updated.length === 1 ? 'issue' : 'issues'} added to ${sprint.name}`);
      if (r.failed.length) toast.error(`${r.failed.length} could not be moved: ${r.failed.slice(0, 3).map((f) => `${issueKey(f.number)} (${f.error})`).join(', ')}`);
      invalidateAll(qc, pid);
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not add the issues to the sprint')),
  });

  const u = p ? unitLabel(p.unit) : 'pts';
  const r1 = (n: number) => Math.round(n * 10) / 10;
  const pickedPts = r1(picked.reduce((s, i) => s + i.points, 0));
  const total = p ? r1(p.alreadyPlanned + pickedPts) : 0;
  const scale = p ? Math.max(p.target, total, 1) : 1;
  const over = !!p && total > p.target;
  const allOn = !!p && p.selected.length > 0 && picked.length === p.selected.length;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        width={600}
        title={<span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-[var(--w-accent-text)]" />Plan {sprint.name}</span>}
        footer={(
          <>
            <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="w-btn w-btn-primary" disabled={!picked.length || apply.isPending} onClick={() => apply.mutate()}>
              {apply.isPending && <Spinner size={12} />} Add {picked.length || ''} {picked.length === 1 ? 'issue' : 'issues'} to sprint
            </button>
          </>
        )}
      >
        {plan.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-[var(--w-text-2)]"><Spinner size={16} /> Calculating velocity…</div>
        ) : plan.error || !p ? (
          <div className="py-8 text-center">
            <div className="text-[14px] font-semibold">Could not build a plan</div>
            <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{workError(plan.error)}</p>
            <button type="button" className="w-btn mt-3" onClick={() => plan.refetch()}>Try again</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
              Proposed from your backlog order and the team&apos;s recent velocity. The numbers are calculated from project data — no AI request is used.
            </p>

            {/* Velocity */}
            <div className="grid grid-cols-3 gap-2">
              <PlanStat label="Velocity" value={p.velocity === null ? '—' : `${r1(p.velocity)} ${u}`} hint={p.history.length ? `Avg of last ${p.history.length}` : 'No history yet'} />
              <PlanStat label="Target" value={`${r1(p.target)} ${u}`} hint={p.velocity === null ? 'Default capacity' : 'Based on velocity'} />
              <PlanStat label="Already planned" value={`${r1(p.alreadyPlanned)} ${u}`} hint="Open work in sprint" />
            </div>
            {p.history.length > 0 && (
              <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
                <div className="grid grid-cols-[minmax(0,1fr)_84px_84px] gap-2 bg-[var(--w-sunken)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
                  <span>Recent sprint</span><span className="text-right">Committed</span><span className="text-right">Completed</span>
                </div>
                {p.history.map((h, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_84px_84px] gap-2 border-t border-[var(--w-border)] px-3 py-1.5 text-[12.5px]">
                    <span className="truncate">{h.name}</span>
                    <span className="text-right tabular text-[var(--w-text-2)]">{h.committedPoints ?? '—'}</span>
                    <span className="text-right font-medium tabular">{h.completedPoints ?? '—'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tổng so với mục tiêu */}
            <div>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="text-[var(--w-text-2)]">Planned total</span>
                <span className={cn('font-semibold tabular', over ? 'text-[var(--w-red)]' : 'text-[var(--w-text)]')}>{total} / {r1(p.target)} {u}</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="img" aria-label={`${total} of ${r1(p.target)} ${u} planned`}>
                <div className="absolute inset-y-0 left-0 bg-[var(--w-text-3)] opacity-50" style={{ width: `${(p.alreadyPlanned / scale) * 100}%` }} />
                <div className="absolute inset-y-0" style={{ left: `${(p.alreadyPlanned / scale) * 100}%`, width: `${(pickedPts / scale) * 100}%`, background: over ? 'var(--w-red)' : 'var(--w-accent)' }} />
                {total > p.target && <div className="absolute inset-y-0 w-px bg-[var(--w-text)]" style={{ left: `${(p.target / scale) * 100}%` }} />}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-[var(--w-text-3)]">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-[var(--w-text-3)] opacity-50" /> Already in sprint {r1(p.alreadyPlanned)}</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-[2px] bg-[var(--w-accent)]" /> Selected {pickedPts}</span>
              </div>
            </div>

            {/* Đề xuất */}
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <h3 className="text-[12px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Proposed issues <span className="tabular normal-case">({p.selected.length})</span></h3>
                {p.selected.length > 1 && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setChecked(allOn ? new Set() : new Set(p.selected.map((i) => i.number)))}>
                    {allOn ? 'Clear all' : 'Select all'}
                  </button>
                )}
              </div>
              {p.selected.length ? (
                <div className="max-h-[260px] overflow-y-auto rounded-[8px] border border-[var(--w-border)]">
                  {p.selected.map((i) => {
                    const on = checked.has(i.number);
                    return (
                      <label key={i.number} className="flex cursor-pointer items-center gap-2.5 border-b border-[var(--w-border)] px-3 py-2 text-[13px] last:border-b-0 hover:bg-[var(--w-hover)]">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setChecked((c) => { const n = new Set(c); if (n.has(i.number)) n.delete(i.number); else n.add(i.number); return n; })}
                          className="shrink-0 accent-[var(--w-accent)]"
                        />
                        <span className="w-[64px] shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{issueKey(i.number)}</span>
                        <span className={cn('min-w-0 flex-1 truncate', !on && 'text-[var(--w-text-3)]')}>{i.title}</span>
                        <span className="inline-flex h-5 min-w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium tabular text-[var(--w-text-2)]">{i.points}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-4 text-center text-[12.5px] text-[var(--w-text-2)]">
                  Nothing else fits. The sprint is already at capacity, or the backlog has no estimated issues.
                </div>
              )}
            </div>

            {p.warnings.length > 0 && (
              <ul className="space-y-1.5 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2.5">
                {p.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
                    <span className="min-w-0 break-words">{w}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Giải thích bằng AI (tuỳ chọn) */}
            <div className="rounded-[8px] border border-[var(--w-border)]">
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="min-w-0 flex-1 text-[12.5px] text-[var(--w-text-2)]">
                  {rationale ? 'AI coach notes' : 'Get a short explanation of the risks and what to clarify before starting. Uses 1 AI request.'}
                </span>
                <button type="button" className="w-btn w-btn-sm" disabled={explain.isPending} onClick={() => explain.mutate()}>
                  {explain.isPending ? <Spinner size={12} /> : <Sparkles size={13} />}
                  {explain.isPending ? 'Explaining…' : rationale ? 'Explain again' : 'Explain this plan'}
                </button>
              </div>
              {rationale && <AiMarkdown text={rationale} className="border-t border-[var(--w-border)] px-3 py-3" />}
            </div>
          </div>
        )}
      </Dialog>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </>
  );
}

function PlanStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[var(--w-border)] px-3 py-2">
      <div className="truncate text-[11px] text-[var(--w-text-3)]">{label}</div>
      <div className="truncate text-[16px] font-semibold tabular">{value}</div>
      <div className="truncate text-[11px] text-[var(--w-text-3)]">{hint}</div>
    </div>
  );
}

/** "Sep 23 – Oct 7" */
export function sprintRange(s: { startAt: string | null; endAt: string | null }): string | null {
  if (!s.startAt && !s.endAt) return null;
  const f = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${s.startAt ? f(s.startAt) : '…'} – ${s.endAt ? f(s.endAt) : '…'}`;
}

export function useSprintTotals(issues: Array<{ sprintId: number | null; estimate: number; statusId: number }>, category: (statusId: number) => string | undefined) {
  return useMemo(() => {
    const m = new Map<number | null, { count: number; points: number; todo: number; progress: number; done: number }>();
    for (const i of issues) {
      const t = m.get(i.sprintId) ?? { count: 0, points: 0, todo: 0, progress: 0, done: 0 };
      t.count += 1;
      t.points = Math.round((t.points + i.estimate) * 10) / 10;
      const c = category(i.statusId);
      if (c === 'DONE') t.done += i.estimate;
      else if (c === 'IN_PROGRESS') t.progress += i.estimate;
      else t.todo += i.estimate;
      m.set(i.sprintId, t);
    }
    return m;
  }, [issues, category]);
}
