'use client';

/**
 * CT Work đợt 7a — bấm giờ trên thẻ (C11). `IssueTimer` nằm trong khối Time tracking của thẻ; `TimerChip` trên thanh
 * trên (mọi trang CT Work) cho biết đồng hồ đang chạy ở đâu. Trạng thái nằm ở MÁY CHỦ (một đồng hồ mỗi người) ⇒ web và
 * app desktop thấy như nhau; `work:timer` + hỏi lại mỗi phút giữ đồng bộ.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Pause, Play, Square, Timer as TimerIcon, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { workError, type IssueDetail } from '@/lib/work-api';
import { agileApi, agileKeys, type RunningTimer } from '@/lib/work-agile-api';
import { TL_ACTIVITIES } from '@/lib/work-ctw4-api';
import { wk } from '../hooks';
import { Dialog, Field } from '../ui';
import { Select } from '../settings/shared';
import { wt } from '../i18n';
import { useTimerRealtime } from './realtime';

export function fmtClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
const fmtMin = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`);

export function useMyTimer() {
  const user = useAuthStore((s) => s.user);
  useTimerRealtime();
  const q = useQuery({ queryKey: agileKeys.timer, queryFn: agileApi.myTimer, enabled: !!user, refetchInterval: 60_000, staleTime: 15_000 });
  return { timer: q.data?.timer ?? null, fetchedAt: q.dataUpdatedAt, query: q };
}

/** Giây hiện tại — chạy tiếp ở trình duyệt từ số máy chủ trả (không tin đồng hồ máy khách cho mốc bắt đầu). */
export function useElapsed(t: RunningTimer | null, fetchedAt: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!t?.running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [t?.running]);
  if (!t) return 0;
  return t.running ? t.elapsedSec + Math.max(0, (now - fetchedAt) / 1000) : t.elapsedSec;
}

function useTimerActions() {
  const qc = useQueryClient();
  const refresh = (pid?: number, num?: number) => {
    qc.invalidateQueries({ queryKey: agileKeys.timer });
    if (pid && num) {
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      qc.invalidateQueries({ queryKey: wk.worklogs(pid, num) });
      qc.invalidateQueries({ queryKey: wk.history(pid, num) });
    }
  };
  return { refresh };
}

function StopDialog({ timer, elapsed, open, onClose }: { timer: RunningTimer; elapsed: number; open: boolean; onClose: () => void }) {
  const { refresh } = useTimerActions();
  const auto = Math.round(elapsed / 60);
  const [minutes, setMinutes] = useState<string>('');
  const [activity, setActivity] = useState<string>(timer.activity ?? '');
  const [note, setNote] = useState('');
  useEffect(() => { if (open) { setMinutes(String(Math.min(auto, 1440))); setActivity(timer.activity ?? ''); setNote(''); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const stop = useMutation({
    mutationFn: () => {
      const m = Number(minutes);
      return agileApi.timerStop({ activity: activity || null, note: note.trim() || null, minutes: Number.isInteger(m) && m >= 1 && m !== auto ? m : undefined });
    },
    onSuccess: (r) => {
      if (r.worklog) toast.success(wt('agile.timerLogged', { t: fmtMin(r.minutes), k: r.issueKey }));
      else toast.message(wt('agile.timerTooShort'));
      if (r.capped) toast.warning(wt('agile.timerCapped'));
      refresh(timer.projectId, timer.issueNumber);
      onClose();
    },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.timerStopTitle', { k: timer.issueKey })} width={440}
      footer={<>
        <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={stop.isPending} onClick={() => stop.mutate()} data-testid="timer-stop-confirm">{wt('agile.timerStop')}</button>
      </>}>
      <div className="space-y-3">
        <p className="text-[13px] tabular text-[var(--w-text-2)]">{fmtClock(elapsed)} · {timer.issueTitle}</p>
        <Field label={wt('agile.timerAdjust')}>
          <input className="w-input" type="number" min={1} max={1440} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </Field>
        <Field label={wt('agile.timerActivity')}>
          <Select value={activity} onChange={(e) => setActivity(e.target.value)} aria-label={wt('agile.timerActivity')}>
            <option value="">—</option>
            {TL_ACTIVITIES.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </Field>
        <Field label={wt('agile.note')}>
          <textarea className="w-input min-h-[64px]" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
    </Dialog>
  );
}

function Controls({ timer, elapsed, compact }: { timer: RunningTimer; elapsed: number; compact?: boolean }) {
  const { refresh } = useTimerActions();
  const [stopOpen, setStopOpen] = useState(false);
  const pause = useMutation({ mutationFn: () => (timer.running ? agileApi.timerPause() : agileApi.timerResume()), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e)) });
  const discard = useMutation({ mutationFn: agileApi.timerDiscard, onSuccess: () => refresh(), onError: (e) => toast.error(workError(e)) });
  return (
    <div className="flex items-center gap-1">
      <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" onClick={() => pause.mutate()} disabled={pause.isPending}
        aria-label={timer.running ? wt('agile.timerPause') : wt('agile.timerResume')} title={timer.running ? wt('agile.timerPause') : wt('agile.timerResume')} data-testid="timer-pause">
        {timer.running ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <button type="button" className={cn('w-btn w-btn-sm', compact ? 'w-btn-ghost w-btn-icon' : 'w-btn-primary')} onClick={() => setStopOpen(true)}
        aria-label={wt('agile.timerStop')} title={wt('agile.timerStop')} data-testid="timer-stop">
        <Square size={12} />{!compact && <span>{wt('agile.timerStop')}</span>}
      </button>
      {!compact && (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" onClick={() => discard.mutate()} aria-label={wt('agile.timerDiscard')} title={wt('agile.timerDiscard')}>
          <X size={13} />
        </button>
      )}
      <StopDialog timer={timer} elapsed={elapsed} open={stopOpen} onClose={() => setStopOpen(false)} />
    </div>
  );
}

/** Trong khối Time tracking của thẻ. */
export function IssueTimer({ pid, issue, canLog }: { pid: number; issue: IssueDetail; canLog: boolean }) {
  const { timer, fetchedAt } = useMyTimer();
  const { refresh } = useTimerActions();
  const elapsed = useElapsed(timer, fetchedAt);
  const here = !!timer && timer.projectId === pid && timer.issueNumber === issue.number;
  const start = useMutation({
    mutationFn: (sw: boolean) => agileApi.timerStart(pid, issue.number, { switch: sw }),
    onSuccess: (r) => {
      if (r.switched && r.switched.minutes) toast.success(wt('agile.timerLogged', { t: fmtMin(r.switched.minutes), k: r.switched.issueKey }));
      refresh(pid, issue.number);
    },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  if (!canLog) return null;
  if (here) {
    return (
      <div className={cn('mt-2 flex items-center gap-2 rounded-[6px] border px-2 py-1.5', timer.overdue ? 'border-[var(--w-orange)]' : 'border-[var(--w-border)]')} data-testid="issue-timer">
        <TimerIcon size={14} className={timer.running ? 'text-[var(--w-accent-text)]' : 'text-[var(--w-text-3)]'} />
        <span className="font-mono text-[13px] tabular" aria-live="off">{fmtClock(elapsed)}</span>
        <span className="min-w-0 truncate whitespace-nowrap text-[12px] text-[var(--w-text-3)]">{timer.running ? wt('agile.timerRunning') : wt('agile.timerPaused')}</span>
        <span className="ml-auto shrink-0"><Controls timer={timer} elapsed={elapsed} /></span>
        {timer.overdue && <span className="sr-only">{wt('agile.timerOverdue', { h: Math.round(timer.remindAfterMin / 6) / 10 })}</span>}
      </div>
    );
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {timer ? (
        <>
          <span className="text-[12px] text-[var(--w-text-3)]">{wt('agile.timerOnOther', { k: timer.issueKey })}</span>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={start.isPending}
            onClick={() => { if (window.confirm(wt('agile.timerSwitchConfirm', { k: timer.issueKey }))) start.mutate(true); }}>
            <Play size={12} /> {wt('agile.timerSwitch')}
          </button>
        </>
      ) : (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => start.mutate(false)} disabled={start.isPending} title={wt('agile.timerHint')} data-testid="timer-start">
          <Play size={12} /> {wt('agile.timerStart')}
        </button>
      )}
    </div>
  );
}

/** Thanh trên: đồng hồ đang chạy (nếu có) — bấm mở thẻ; nút dừng/tạm dừng gọn. */
export function TimerChip() {
  const { timer, fetchedAt } = useMyTimer();
  const elapsed = useElapsed(timer, fetchedAt);
  if (!timer) return null;
  const overdue = timer.overdue || elapsed >= timer.remindAfterMin * 60;
  return (
    <div className={cn('flex h-[30px] items-center gap-1 rounded-[6px] border pl-2 text-[12px]', overdue ? 'border-[var(--w-orange)]' : 'border-[var(--w-border)]')}
      data-testid="timer-chip">
      {overdue ? <AlertTriangle size={13} className="text-[var(--w-orange-text)]" /> : <TimerIcon size={13} className={timer.running ? 'text-[var(--w-accent-text)]' : 'text-[var(--w-text-3)]'} />}
      <Link href={timer.url} className="flex items-center gap-1.5 hover:underline" aria-label={wt('agile.timerChipAria', { k: timer.issueKey, t: fmtClock(elapsed) })}
        title={overdue ? wt('agile.timerOverdue', { h: Math.round(timer.remindAfterMin / 6) / 10 }) : timer.issueTitle}>
        <span className="font-medium max-2xl:hidden">{timer.issueKey}</span>
        <span className="font-mono tabular">{fmtClock(elapsed)}</span>
      </Link>
      <Controls timer={timer} elapsed={elapsed} compact />
    </div>
  );
}
