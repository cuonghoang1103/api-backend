'use client';

/**
 * Capacity: giờ có thể làm của từng người (giờ/ngày × ngày làm việc − ngày
 * nghỉ) so với khối việc đang giao trong sprint / khoảng ngày. Ngày nghỉ
 * thuộc KHÔNG GIAN (một người nghỉ thì nghỉ ở mọi dự án).
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { userName, workApi, workError, type CapacityRow, type ProjectConfig, type TimeOffEntry } from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { EmptyState, Spinner, UserAvatar } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { addDays, vnToday } from './TimeTab';
import { Card, fmtDay, num, SectionTitle, StatCell, useAllSprints } from './shared';

/** "Sep 24" hoặc "Sep 24 – 26". */
function fmtSpan(start: string, end: string): string {
  const s = start.slice(0, 10);
  const e = end.slice(0, 10);
  return s === e ? fmtDay(s) : `${fmtDay(s)} – ${fmtDay(e)}`;
}

function utilTone(u: number) {
  return u > 100 ? 'var(--w-red)' : u >= 80 ? 'var(--w-orange)' : 'var(--w-green)';
}

function UtilBar({ row }: { row: CapacityRow }) {
  if (row.hoursPerDay === null) return <span className="text-[12px] text-[var(--w-text-3)]">Unset</span>;
  if (row.utilization === null) return <span className="text-[12px] text-[var(--w-text-3)]">No capacity</span>;
  const u = row.utilization;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full min-w-[60px] overflow-hidden rounded-full bg-[var(--w-sunken)]" role="img" aria-label={`${num(u)}% utilised`}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, u))}%`, background: utilTone(u) }} />
      </div>
      <span className="w-11 shrink-0 text-right text-[12px] font-medium tabular-nums" style={{ color: utilTone(u) }}>{num(u)}%</span>
    </div>
  );
}

/** Ô giờ/ngày: lưu khi rời ô / Enter; để trống = bỏ đặt. */
function HoursInput({ row, pid }: { row: CapacityRow; pid: number }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: (v: number | null) => workApi.setCapacity(pid, row.user.id, v),
    onSuccess: () => { setDraft(null); qc.invalidateQueries({ queryKey: wk.capacity(pid) }); },
    onError: (err) => { toast.error(workError(err, 'Could not save capacity')); setDraft(null); },
  });
  const commit = () => {
    if (draft === null) return;
    const t = draft.trim();
    const v = t === '' ? null : Number(t);
    if (v !== null && (!Number.isFinite(v) || v < 0 || v > 24)) { toast.error('Hours per day must be 0–24'); setDraft(null); return; }
    if (v === row.hoursPerDay) { setDraft(null); return; }
    save.mutate(v);
  };
  return (
    <input
      inputMode="decimal"
      aria-label={`Hours per day for ${userName(row.user)}`}
      placeholder="Unset"
      value={draft ?? (row.hoursPerDay === null ? '' : String(row.hoursPerDay))}
      disabled={save.isPending}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setDraft(null); (e.target as HTMLInputElement).blur(); } }}
      className="w-input w-input-bare !h-[28px] !w-[64px] text-right tabular-nums"
    />
  );
}

// ─── Ngày nghỉ ───────────────────────────────────────────────────

function TimeOffSection({ config, meId }: { config: ProjectConfig; meId: number | undefined }) {
  const qc = useQueryClient();
  const wsId = config.workspace.id;
  const isAdmin = config.workspaceRole === 'OWNER' || config.workspaceRole === 'ADMIN';
  const today = vnToday();
  const [userId, setUserId] = useState<number | ''>('');
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [note, setNote] = useState('');
  const [removing, setRemoving] = useState<TimeOffEntry | null>(null);

  const q = useQuery({ queryKey: wk.timeOff(wsId), queryFn: () => workApi.timeOff(wsId) });
  const memberIds = useMemo(() => new Set(config.members.map((m) => m.id)), [config.members]);
  // Chỉ hiện ngày nghỉ của người trong dự án này (danh sách gốc là của cả không gian).
  const entries = (q.data ?? []).filter((t) => memberIds.has(t.userId));

  const refresh = () => {
    qc.invalidateQueries({ queryKey: wk.timeOff(wsId) });
    qc.invalidateQueries({ queryKey: wk.capacity(config.id) });
  };
  const add = useMutation({
    mutationFn: () => workApi.addTimeOff(wsId, { userId: isAdmin && userId ? userId : undefined, startDate: start, endDate: end, note: note.trim() || null }),
    onSuccess: () => { toast.success('Time off added'); setNote(''); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not add time off')),
  });
  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteTimeOff(wsId, id),
    onSuccess: () => { toast.success('Time off removed'); setRemoving(null); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not remove time off')),
  });
  const valid = !!start && !!end && start <= end;

  return (
    <Card>
      <SectionTitle>Time off</SectionTitle>
      <p className="mb-3 text-[12px] text-[var(--w-text-3)]">
        Time off applies across the whole workspace and is subtracted from working days. {isAdmin ? 'As a workspace admin you can add it for anyone.' : 'You can add and remove your own.'}
      </p>
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => { e.preventDefault(); if (valid && !add.isPending) add.mutate(); }}
      >
        {isAdmin && (
          <div className="min-w-0">
            <label className="w-label" htmlFor="w-to-user">Person</label>
            <select id="w-to-user" className="w-input !h-[30px] !w-auto max-w-full pr-7" value={userId} onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Me</option>
              {config.members.filter((m) => m.id !== meId).map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="w-label" htmlFor="w-to-start">From</label>
          <input id="w-to-start" type="date" className="w-input !h-[30px] !w-auto" value={start} onChange={(e) => { setStart(e.target.value); if (e.target.value > end) setEnd(e.target.value); }} />
        </div>
        <div>
          <label className="w-label" htmlFor="w-to-end">To</label>
          <input id="w-to-end" type="date" className="w-input !h-[30px] !w-auto" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="min-w-[140px] flex-1">
          <label className="w-label" htmlFor="w-to-note">Note</label>
          <input id="w-to-note" className="w-input !h-[30px]" maxLength={200} placeholder="Optional, e.g. Holiday" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <button type="submit" className="w-btn" disabled={!valid || add.isPending}>
          {add.isPending ? <Spinner size={12} /> : <Plus size={13} />} Add
        </button>
      </form>
      {q.isLoading ? (
        <Spinner />
      ) : !entries.length ? (
        <p className="text-[12px] text-[var(--w-text-3)]">No upcoming time off.</p>
      ) : (
        <ul className="divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]">
          {entries.map((t) => {
            const canRemove = t.userId === meId || isAdmin;
            return (
              <li key={t.id} className="flex min-w-0 items-center gap-2 px-2.5 py-1.5 text-[13px]">
                <UserAvatar user={t.user} size={18} />
                <span className="min-w-0 max-w-[40%] truncate font-medium">{userName(t.user)}</span>
                <span className="shrink-0 tabular-nums text-[var(--w-text-2)]">{fmtSpan(t.startDate, t.endDate)}</span>
                {t.note && <span className="min-w-0 flex-1 truncate text-[var(--w-text-3)]">{t.note}</span>}
                {canRemove && (
                  <button type="button" onClick={() => setRemoving(t)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto shrink-0" aria-label="Remove time off" title="Remove time off">
                    <X size={12} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove time off?"
        body={removing ? <>{userName(removing.user)} · {fmtSpan(removing.startDate, removing.endDate)} will count as working days again.</> : null}
        confirmLabel="Remove"
        pending={del.isPending}
        onConfirm={() => removing && del.mutate(removing.id)}
      />
    </Card>
  );
}

// ─── Tab ─────────────────────────────────────────────────────────

export default function CapacityTab({ pid, config }: { pid: number; config: ProjectConfig }) {
  const meId = useAuthStore((s) => s.user?.id);
  const sprintsQ = useAllSprints(pid);
  const sprints = useMemo(
    () => (sprintsQ.data ?? []).filter((s) => s.state !== 'CLOSED').sort((a, b) => (a.state === b.state ? a.position - b.position : a.state === 'ACTIVE' ? -1 : 1)),
    [sprintsQ.data],
  );
  // '' = chưa chọn (lấy sprint đang chạy), 'range' = khoảng ngày tự chọn, còn lại = id sprint.
  const [choice, setChoice] = useState<string>('');
  const [from, setFrom] = useState(() => vnToday());
  const [to, setTo] = useState(() => addDays(vnToday(), 13));
  const effective = choice || (sprints[0] ? String(sprints[0].id) : 'range');
  const sprintId = effective === 'range' ? undefined : Number(effective);
  const canManage = config.permissions.manageSprints;

  const validRange = sprintId !== undefined || (!!from && !!to && from <= to);
  const q = useQuery({
    queryKey: [...wk.capacity(pid), sprintId ?? `${from}:${to}`],
    queryFn: () => workApi.capacity(pid, sprintId ? { sprintId } : { from, to }),
    enabled: !sprintsQ.isLoading && validRange,
  });
  const data = q.data;
  const unit = data?.unit ?? 'POINTS';

  const totals = useMemo(() => {
    const m = data?.members ?? [];
    const cap = m.reduce((s, r) => s + (r.capacityHours ?? 0), 0);
    const loadH = m.reduce((s, r) => s + r.loadHours, 0);
    const loadP = m.reduce((s, r) => s + r.loadPoints, 0);
    const setRows = m.filter((r) => r.capacityHours !== null);
    const loadOfSet = setRows.reduce((s, r) => s + r.loadHours, 0);
    return { cap, loadH, loadP, util: cap > 0 ? (loadOfSet / cap) * 100 : null, unset: m.length - setRows.length };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Sprint or range" value={effective} onChange={(e) => setChoice(e.target.value)} className="w-input h-[28px] w-auto max-w-full py-0 pr-7 text-[12px]">
          {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}{s.state === 'ACTIVE' ? ' (active)' : ' (planned)'}</option>)}
          <option value="range">Custom date range</option>
        </select>
        {effective === 'range' && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <input type="date" aria-label="From" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
            <span>to</span>
            <input type="date" aria-label="To" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
          </div>
        )}
        {data && <span className="text-[12px] tabular-nums text-[var(--w-text-3)] sm:ml-auto">{fmtSpan(data.from, data.to)} · weekdays only</span>}
      </div>

      {sprintsQ.isLoading || q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load capacity" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !data || !data.members.length ? (
        <EmptyState title="No members to plan for" body="Capacity lists project admins and members." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCell label="Team capacity" value={`${num(totals.cap)} h`} hint={totals.unset ? `${totals.unset} ${totals.unset === 1 ? 'person' : 'people'} unset` : undefined} />
            <StatCell label="Load" value={unit === 'HOURS' ? `${num(totals.loadH)} h` : `${num(totals.loadP)} pts`} hint={unit === 'POINTS' && totals.loadH ? `${num(totals.loadH)} h estimated` : undefined} />
            <StatCell
              label="Utilization"
              value={totals.util === null ? '—' : `${num(totals.util)}%`}
              tone={totals.util === null ? undefined : totals.util > 100 ? 'red' : totals.util < 80 ? 'green' : undefined}
            />
            <StatCell label="Open issues" value={data.members.reduce((s, r) => s + r.issues, 0)} hint="Assigned, unresolved" />
          </div>

          <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                  <th className="px-3 py-2 font-medium">Member</th>
                  <th className="px-3 py-2 text-right font-medium">Hours / day</th>
                  <th className="px-3 py-2 text-right font-medium">Working days</th>
                  <th className="px-3 py-2 font-medium">Time off</th>
                  <th className="px-3 py-2 text-right font-medium">Capacity</th>
                  <th className="px-3 py-2 text-right font-medium">Load</th>
                  <th className="w-[180px] px-3 py-2 font-medium">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((r) => (
                  <tr key={r.user.id} className="border-b border-[var(--w-border)] last:border-0">
                    <td className="px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <UserAvatar user={r.user} size={22} />
                        <div className="min-w-0">
                          <div className="max-w-[180px] truncate font-medium">{userName(r.user)}</div>
                          <div className="text-[11px] text-[var(--w-text-3)]">{r.issues} {r.issues === 1 ? 'issue' : 'issues'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      {canManage ? <HoursInput row={r} pid={pid} /> : <span className={cn('tabular-nums', r.hoursPerDay === null && 'text-[var(--w-text-3)]')}>{r.hoursPerDay === null ? 'Unset' : `${num(r.hoursPerDay)} h`}</span>}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.workingDays}</td>
                    <td className="px-3 py-2">
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {r.timeOff.length ? r.timeOff.map((t) => (
                          <span key={t.id} title={t.note ?? undefined} className="inline-flex h-[20px] items-center whitespace-nowrap rounded-full border border-[var(--w-border-strong)] px-2 text-[11px] text-[var(--w-text-2)]">
                            {fmtSpan(t.start, t.end)}
                          </span>
                        )) : <span className="text-[var(--w-text-3)]">—</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.capacityHours === null ? <span className="text-[var(--w-text-3)]">—</span> : `${num(r.capacityHours)} h`}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {unit === 'HOURS' ? `${num(r.loadHours)} h` : `${num(r.loadPoints)} pts`}
                      {unit === 'POINTS' && r.loadHours > 0 && <div className="text-[11px] text-[var(--w-text-3)]">{num(r.loadHours)} h est.</div>}
                    </td>
                    <td className="px-3 py-2"><UtilBar row={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
            Load counts unresolved issues assigned in {sprintId ? 'this sprint' : 'the range (due in range or in the active sprint)'}. Utilization compares their remaining hour estimates with capacity
            {unit === 'POINTS' ? ' — this project estimates in story points, so add hour estimates to issues to see utilization.' : '.'}
            {canManage ? ' Set hours per day to include a person in capacity.' : ''}
          </p>
        </>
      )}

      <TimeOffSection config={config} meId={meId} />
    </div>
  );
}
