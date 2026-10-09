'use client';

/**
 * CT Work — mảnh giao diện nhỏ của đợt nâng cấp CTW (06/10/2026):
 *   - FlagControl   (CTW-11): cắm / gỡ cờ "Blocked" kèm lý do — không đổi trạng thái, không đổi cột board.
 *   - FlagBadge     (CTW-11): huy hiệu đỏ trên thẻ board/backlog.
 *   - AddToCalendar (CTW-25): "Google Calendar" / "Outlook" (deep link, không OAuth) + tải .ics nếu có.
 *   - JoinMeetingButton (CTW-24): nút "Join" nổi bật cho link họp (Jitsi/Meet/Zoom/Teams).
 */

import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarPlus, Download, Flag, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { googleCalendarUrl, meetingProviderLabel, outlookCalendarUrl, workFlagApi, type CalendarEventInput } from '@/lib/work-ctw-api';
import { Popover, Spinner } from './ui';
import { wt } from '@/components/work/i18n';

// ─── CTW-11 ──────────────────────────────────────────────────────

export function FlagBadge({ reason, className }: { reason?: string | null; className?: string }) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center gap-0.5 rounded-[4px] bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] px-1 py-px text-[11px] font-medium text-[var(--w-red)]', className)}
      title={reason ? wt('board.blockedReason', { reason }) : wt('board.blocked')}
      aria-label={reason ? wt('board.blockedReason', { reason }) : wt('board.blocked')}
    >
      <Flag size={10} fill="currentColor" /> {wt('board.blocked')}
    </span>
  );
}

export function FlagControl({ pid, num, flaggedAt, reason, editable, onChanged }: {
  pid: number; num: number; flaggedAt?: string | null; reason?: string | null; editable: boolean; onChanged: () => void;
}) {
  const qc = useQueryClient();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const done = () => { setOpen(false); setText(''); onChanged(); void qc.invalidateQueries({ queryKey: ['work'] }); };
  const set = useMutation({ mutationFn: () => workFlagApi.set(pid, num, text.trim()), onSuccess: () => { toast.success(wt('board.markedBlocked')); done(); }, onError: (e) => toast.error(workError(e)) });
  const clear = useMutation({ mutationFn: () => workFlagApi.clear(pid, num), onSuccess: () => { toast.success(wt('board.noLongerBlocked')); done(); }, onError: (e) => toast.error(workError(e)) });
  if (flaggedAt) {
    return (
      <div className="flex min-w-0 flex-col gap-1 px-2 py-1" data-testid="issue-flag">
        <span className="flex min-w-0 items-center gap-1.5 text-[13px]"><FlagBadge reason={reason} /><span className="min-w-0 truncate text-[var(--w-text-2)]" title={reason ?? ''}>{reason}</span></span>
        {editable && <button type="button" className="self-start text-[12px] text-[var(--w-accent-text)] hover:underline" disabled={clear.isPending} onClick={() => clear.mutate()}>{clear.isPending ? wt('board.removing') : wt('board.removeFlag')}</button>}
      </div>
    );
  }
  if (!editable) return <span className="px-2 text-[13px] text-[var(--w-text-3)]">{wt('board.no')}</span>;
  return (
    <>
      <button ref={btnRef} type="button" className="px-2 text-left text-[13px] text-[var(--w-text-3)] hover:text-[var(--w-text)]" onClick={() => setOpen(true)} data-testid="issue-flag-add">
        <Flag size={12} className="mr-1 inline" />{wt('board.flagAsBlocked')}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={btnRef} width={300}>
        <form className="space-y-2 p-3" onSubmit={(e) => { e.preventDefault(); if (text.trim().length >= 2) set.mutate(); }}>
          <label className="block text-[12px] font-medium" htmlFor={`flag-${num}`}>{wt('board.whyBlocked')}</label>
          <textarea id={`flag-${num}`} className="w-input" rows={3} maxLength={450} value={text} onChange={(e) => setText(e.target.value)} placeholder={wt('board.whyBlockedPh')} autoFocus />
          <p className="text-[11.5px] text-[var(--w-text-3)]">{wt('board.flagHelp')} <code>flagged = true</code>.</p>
          <button type="submit" className="w-btn w-btn-primary w-btn-sm" disabled={text.trim().length < 2 || set.isPending}>{set.isPending && <Spinner size={11} />}{wt('board.flag')}</button>
        </form>
      </Popover>
    </>
  );
}

// ─── CTW-25 ──────────────────────────────────────────────────────

export function AddToCalendar({ event, icsHref, onIcs, label = wt('board.addToCalendar'), size = 'sm', className }: {
  event: CalendarEventInput; icsHref?: string; onIcs?: () => void; label?: string; size?: 'sm' | 'md'; className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const item = 'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]';
  return (
    <>
      <button ref={ref} type="button" className={cn('w-btn', size === 'sm' && 'w-btn-sm', className)} onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-label={label || wt('board.addToCalendar')} title={wt('board.addToCalendarTitle')} data-testid="add-to-calendar">
        <CalendarPlus size={size === 'sm' ? 12 : 14} /> {label}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={220} align="end">
        <div className="p-1" role="menu">
          <a role="menuitem" className={item} href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Google Calendar</a>
          <a role="menuitem" className={item} href={outlookCalendarUrl(event)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Outlook</a>
          {icsHref && <a role="menuitem" className={item} href={icsHref} onClick={() => setOpen(false)}><Download size={12} /> {wt('board.appleOther')}</a>}
          {!icsHref && onIcs && <button type="button" role="menuitem" className={item} onClick={() => { setOpen(false); onIcs(); }}><Download size={12} /> {wt('board.appleOther')}</button>}
        </div>
      </Popover>
    </>
  );
}

// ─── CTW-24 ──────────────────────────────────────────────────────

export function JoinMeetingButton({ url, startsAt, endsAt, className }: { url: string | null | undefined; startsAt?: string; endsAt?: string; className?: string }) {
  if (!url) return null;
  const now = Date.now();
  // Sắp diễn ra (≤ 10 phút) hoặc đang diễn ra ⇒ nút nổi bật hơn nữa.
  const live = !!startsAt && !!endsAt && now >= new Date(startsAt).getTime() - 10 * 60_000 && now <= new Date(endsAt).getTime();
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      className={cn('w-btn w-btn-primary', live && 'ring-2 ring-[var(--w-accent-border)] ring-offset-1', className)}
      data-testid="meeting-join"
      title={url}
    >
      <Video size={14} /> {wt('board.joinMeeting', { provider: meetingProviderLabel(url) === 'meeting' ? wt('board.meeting') : meetingProviderLabel(url) })}{live ? wt('board.now') : ''}
    </a>
  );
}
