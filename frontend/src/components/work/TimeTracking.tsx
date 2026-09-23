'use client';

/**
 * Theo dõi thời gian của thẻ: thanh "đã ghi / còn lại / ước lượng gốc", hộp
 * "Log time" (nhận định dạng kiểu Jira: 1h 30m, 45m, 2h, 1d) và danh sách
 * worklog. Backend giữ timeSpentMin/remainingEstimateMin cùng transaction với
 * dòng worklog nên ở đây chỉ việc invalidate thẻ.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, type IssueDetail, type ProjectConfig, type Worklog } from '@/lib/work-api';
import { wk } from './hooks';
import { ConfirmDialog } from './settings/shared';
import { Dialog, Spinner, UserAvatar, relativeTime } from './ui';

// ─── Định dạng thời lượng ────────────────────────────────────────

/** 210 → "3h 30m", 45 → "45m", 120 → "2h", 0 → "0m". */
export function fmtMinutes(min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r}m`;
  return r ? `${h}h ${r}m` : `${h}h`;
}

/**
 * "1h 30m" / "45m" / "2h" / "1.5h" / "1d" (= 8h) / "1w" (= 5d) ⇒ phút.
 * Số trơn tính là giờ ("2" = 2h). Sai cú pháp ⇒ null.
 */
export function parseDuration(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s) * 60);
  const unit: Record<string, number> = { w: 5 * 8 * 60, d: 8 * 60, h: 60, m: 1 };
  let total = 0;
  let rest = s;
  const re = /^\s*(\d+(?:\.\d+)?)\s*([wdhm])\s*/;
  while (rest.length) {
    const m = re.exec(rest);
    if (!m) return null;
    total += Number(m[1]) * unit[m[2]];
    rest = rest.slice(m[0].length);
  }
  return Math.round(total);
}

/** Giờ địa phương hiện tại cho <input type="datetime-local">. */
function nowLocalInput(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Hộp ghi giờ ─────────────────────────────────────────────────

type RemainingMode = 'auto' | 'keep' | 'set';

export function LogTimeDialog({ open, onClose, pid, issue }: { open: boolean; onClose: () => void; pid: number; issue: IssueDetail }) {
  const qc = useQueryClient();
  const [spent, setSpent] = useState('');
  const [started, setStarted] = useState(nowLocalInput);
  const [note, setNote] = useState('');
  const [mode, setMode] = useState<RemainingMode>('auto');
  const [remainingText, setRemainingText] = useState('');

  useEffect(() => {
    if (!open) return;
    setSpent('');
    setStarted(nowLocalInput());
    setNote('');
    setMode('auto');
    setRemainingText('');
  }, [open]);

  const minutes = parseDuration(spent);
  const remainingMin = mode === 'set' ? parseDuration(remainingText) : null;
  const spentError = spent.trim() && minutes === null ? 'Use a format like 2h 30m, 45m or 1d' : minutes !== null && (minutes < 1 || minutes > 1440) ? 'Time spent must be between 1 minute and 24 hours' : null;
  const valid = minutes !== null && !spentError && (mode !== 'set' || remainingMin !== null) && !!started;

  const autoPreview = issue.remainingEstimateMin === null ? null : Math.max(0, issue.remainingEstimateMin - (minutes ?? 0));

  const save = useMutation({
    mutationFn: () => workApi.addWorklog(pid, issue.number, {
      minutes: minutes!,
      startedAt: new Date(started).toISOString(),
      note: note.trim() || null,
      remaining: mode === 'set' ? remainingMin! : mode,
    }),
    onSuccess: () => {
      toast.success(`Logged ${fmtMinutes(minutes)}`);
      qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });
      qc.invalidateQueries({ queryKey: wk.history(pid, issue.number) });
      qc.invalidateQueries({ queryKey: wk.reports(pid) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not log time')),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Log time"
      width={480}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="w-log-time" className="w-btn w-btn-primary" disabled={!valid || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            Save
          </button>
        </>
      }
    >
      <form id="w-log-time" onSubmit={(e) => { e.preventDefault(); if (valid && !save.isPending) save.mutate(); }} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="w-label" htmlFor="w-lt-spent">Time spent</label>
            <input
              id="w-lt-spent"
              autoFocus
              className={cn('w-input', spentError && '!border-[var(--w-red)]')}
              placeholder="e.g. 2h 30m"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
            />
            <p className={cn('mt-1 text-[12px]', spentError ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
              {spentError ?? (minutes !== null ? `= ${fmtMinutes(minutes)}` : 'w = 5d · d = 8h · h · m')}
            </p>
          </div>
          <div>
            <label className="w-label" htmlFor="w-lt-start">Date started</label>
            <input id="w-lt-start" type="datetime-local" className="w-input" value={started} onChange={(e) => setStarted(e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend className="w-label">Remaining estimate</legend>
          <div className="space-y-1.5 text-[13px]">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="w-lt-rem" checked={mode === 'auto'} onChange={() => setMode('auto')} />
              <span>Adjust automatically</span>
              <span className="text-[12px] text-[var(--w-text-3)]">
                {autoPreview === null ? '(no estimate set)' : `→ ${fmtMinutes(autoPreview)}`}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="w-lt-rem" checked={mode === 'keep'} onChange={() => setMode('keep')} />
              <span>Leave unchanged</span>
              {issue.remainingEstimateMin !== null && <span className="text-[12px] text-[var(--w-text-3)]">({fmtMinutes(issue.remainingEstimateMin)})</span>}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="w-lt-rem" checked={mode === 'set'} onChange={() => setMode('set')} />
                <span>Set to</span>
              </label>
              <input
                aria-label="New remaining estimate"
                className={cn('w-input !h-[28px] !w-[120px]', mode === 'set' && remainingText.trim() && remainingMin === null && '!border-[var(--w-red)]')}
                placeholder="e.g. 4h"
                value={remainingText}
                onFocus={() => setMode('set')}
                onChange={(e) => setRemainingText(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="w-label" htmlFor="w-lt-note">Work description</label>
          <textarea id="w-lt-note" rows={3} maxLength={1000} className="w-input !h-auto py-2" placeholder="What did you work on? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </form>
    </Dialog>
  );
}

// ─── Khối "Time tracking" trong cột thuộc tính ───────────────────

export function TimeTrackingBlock({ pid, issue, config }: { pid: number; issue: IssueDetail; config: ProjectConfig }) {
  const [open, setOpen] = useState(false);
  const spent = issue.timeSpentMin ?? 0;
  const remaining = issue.remainingEstimateMin;
  const original = issue.originalEstimateMin;
  // Thang của thanh: lớn nhất giữa ước lượng gốc và (đã ghi + còn lại) — ghi vượt thì thanh vẫn đúng tỉ lệ.
  const scale = Math.max(original ?? 0, spent + (remaining ?? 0), 1);
  const over = original !== null && spent > original;
  const canLog = config.permissions.editIssues;
  const empty = !spent && remaining === null && original === null;

  return (
    <div className="mt-4 border-t border-[var(--w-border)] pt-3">
      <div className="mb-2 flex items-center">
        <span className="text-[12px] font-medium text-[var(--w-text-2)]">Time tracking</span>
        {canLog && (
          <button type="button" onClick={() => setOpen(true)} className="w-btn w-btn-ghost w-btn-sm ml-auto">
            <Clock size={12} /> Log time
          </button>
        )}
      </div>
      {empty ? (
        <p className="text-[12px] text-[var(--w-text-3)]">No time logged.</p>
      ) : (
        <>
          <div
            className="flex h-1.5 overflow-hidden rounded-full bg-[var(--w-sunken)]"
            role="img"
            aria-label={`${fmtMinutes(spent)} logged, ${remaining === null ? 'no' : fmtMinutes(remaining)} remaining`}
          >
            <div className={cn('h-full', over ? 'bg-[var(--w-orange)]' : 'bg-[var(--w-accent)]')} style={{ width: `${(spent / scale) * 100}%` }} />
            {remaining !== null && remaining > 0 && (
              <div className="h-full bg-[var(--w-border-strong)]" style={{ width: `${(remaining / scale) * 100}%` }} />
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-[12px] tabular text-[var(--w-text-2)]">
            <span>{fmtMinutes(spent)} logged</span>
            <span>{remaining === null ? 'No estimate' : `${fmtMinutes(remaining)} remaining`}</span>
          </div>
          {original !== null && (
            <div className={cn('mt-0.5 text-[12px] tabular', over ? 'text-[var(--w-orange)]' : 'text-[var(--w-text-3)]')}>
              Original estimate {fmtMinutes(original)}{over ? ` · over by ${fmtMinutes(spent - original)}` : ''}
            </div>
          )}
        </>
      )}
      <LogTimeDialog open={open} onClose={() => setOpen(false)} pid={pid} issue={issue} />
    </div>
  );
}

// ─── Danh sách worklog (tab "Work log" trong phần hoạt động) ─────

function WorklogItem({ log, pid, num, canDelete }: { log: Worklog; pid: number; num: number; canDelete: boolean }) {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const del = useMutation({
    mutationFn: () => workApi.deleteWorklog(pid, num, log.id),
    onSuccess: () => {
      toast.success('Work log deleted');
      setConfirm(false);
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      qc.invalidateQueries({ queryKey: wk.history(pid, num) });
      qc.invalidateQueries({ queryKey: wk.reports(pid) });
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the work log')),
  });
  return (
    <li className="group flex gap-3 text-[13px]">
      <UserAvatar user={log.user} size={24} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-[12px]">
          <span className="font-semibold text-[var(--w-text)]">{userName(log.user)}</span>
          <span className="text-[var(--w-text-2)]">logged <span className="font-medium tabular text-[var(--w-text)]">{fmtMinutes(log.minutes)}</span></span>
          <span className="text-[var(--w-text-3)]" title={new Date(log.startedAt).toLocaleString('en-US')}>{relativeTime(log.startedAt)}</span>
          {canDelete && (
            <button
              type="button"
              title="Delete work log"
              aria-label="Delete work log"
              onClick={() => setConfirm(true)}
              className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        {log.note && <p className="mt-0.5 whitespace-pre-wrap break-words text-[13px] text-[var(--w-text-2)]">{log.note}</p>}
      </div>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => del.mutate()}
        title="Delete work log?"
        body={`${fmtMinutes(log.minutes)} will be removed from the time spent on this issue. The remaining estimate is not changed.`}
        confirmLabel="Delete"
        pending={del.isPending}
      />
    </li>
  );
}

export function WorklogList({ pid, num, config }: { pid: number; num: number; config: ProjectConfig }) {
  const meId = useAuthStore((s) => s.user?.id);
  const q = useQuery({ queryKey: wk.worklogs(pid, num), queryFn: () => workApi.worklogs(pid, num) });
  // Cùng khoá với IssueDetail ⇒ dùng lại bộ nhớ đệm, không tải thêm.
  const issue = useQuery({ queryKey: wk.issue(pid, num), queryFn: () => workApi.issue(pid, num) }).data;
  const [open, setOpen] = useState(false);
  const canLog = config.permissions.editIssues;

  if (q.isLoading) return <div className="py-4"><Spinner /></div>;
  const logs = q.data ?? [];
  const total = logs.reduce((s, l) => s + l.minutes, 0);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">
        {logs.length > 0 && <span className="tabular">{logs.length} {logs.length === 1 ? 'entry' : 'entries'} · {fmtMinutes(total)} total</span>}
        {canLog && issue && (
          <button type="button" onClick={() => setOpen(true)} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Plus size={12} /> Log time</button>
        )}
      </div>
      {q.error ? (
        <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, 'Could not load work logs')}</p>
      ) : !logs.length ? (
        <p className="text-[13px] text-[var(--w-text-3)]">No work logged yet.</p>
      ) : (
        <ol className="space-y-3">
          {logs.map((l) => (
            <WorklogItem key={l.id} log={l} pid={pid} num={num} canDelete={canLog && (l.userId === meId || config.role === 'ADMIN')} />
          ))}
        </ol>
      )}
      {issue && <LogTimeDialog open={open} onClose={() => setOpen(false)} pid={pid} issue={issue} />}
    </div>
  );
}
