'use client';

/**
 * Hộp thoại sprint: bắt đầu, kết thúc, sửa. Dùng ở Backlog và trên Board.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import {
  workApi, workError, type EstimationUnit, type SprintFull,
} from '@/lib/work-api';
import { wk } from './hooks';
import { Dialog, Field } from './ui';

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
