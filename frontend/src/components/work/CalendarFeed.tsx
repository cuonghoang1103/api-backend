'use client';

/**
 * "Add to calendar" — link lịch đăng ký (.ics) của chính mình (backend: calendar.service.ts).
 * Hạn thẻ được giao + sprint + mốc version hiện trong Google Calendar / Apple Calendar / Outlook.
 * Link chứa bí mật và chỉ hiện MỘT lần lúc tạo (backend chỉ giữ hash) — mất thì tạo link mới.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarPlus, Copy, ExternalLink } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import { Dialog, publicOrigin, relativeTime, Spinner } from '@/components/work/ui';
import { copyText } from '@/components/work/settings/ProjectShare';

const KEY = ['work', 'me', 'calendar-link'] as const;

function CalendarDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: KEY, queryFn: workApi.calendarLink, enabled: open });
  const [url, setUrl] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: workApi.createCalendarLink,
    onSuccess: (r) => { setUrl(`${publicOrigin()}/api/v1${r.path}`); qc.invalidateQueries({ queryKey: KEY }); },
    onError: (err) => toast.error(workError(err, 'Could not create the calendar link')),
  });
  const revoke = useMutation({
    mutationFn: workApi.revokeCalendarLink,
    onSuccess: () => { setUrl(null); toast.success('Calendar link turned off'); qc.invalidateQueries({ queryKey: KEY }); },
    onError: (err) => toast.error(workError(err, 'Could not turn off the calendar link')),
  });

  const close = () => { setUrl(null); onClose(); };
  const webcal = url?.replace(/^https?:\/\//, 'webcal://');
  const status = q.data;

  return (
    <Dialog open={open} onClose={close} title="Add CT Work to your calendar" width={560}>
      <div className="space-y-4 text-[13px] leading-relaxed text-[var(--w-text-2)]">
        <p>
          Due dates of issues assigned to you, your sprints and release dates appear in Google Calendar, Apple Calendar or
          Outlook — on your phone too. It is one-way (CT Work → calendar) and your calendar app refreshes it on its own
          schedule (Google: every few hours, up to a day).
        </p>

        {q.isLoading ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : url ? (
          <div className="space-y-3">
            <div className="rounded-[8px] border border-[var(--w-orange)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
              Copy it now — for your privacy it is shown only once. Anyone with this link can see your calendar; if it leaks,
              create a new link (the old one stops working).
            </div>
            <div className="flex gap-2">
              <input className="w-input min-w-0 flex-1 font-mono text-[12px]" readOnly value={url} onFocus={(e) => e.currentTarget.select()} aria-label="Calendar link" />
              <button type="button" className="w-btn w-btn-sm shrink-0" onClick={() => copyText(url, 'Calendar link')}><Copy size={13} /> Copy</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="w-btn w-btn-primary w-btn-sm" target="_blank" rel="noopener noreferrer" href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal!)}`}>
                <ExternalLink size={13} /> Open in Google Calendar
              </a>
              <a className="w-btn w-btn-sm" href={webcal}>Apple Calendar / Outlook</a>
            </div>
            <ol className="list-decimal space-y-1 pl-5 text-[12.5px]">
              <li><b>Google Calendar</b>: the button above, or Settings → Add calendar → <i>From URL</i> → paste the link.</li>
              <li><b>iPhone</b>: Settings → Calendar → Accounts → Add Account → Other → <i>Add Subscribed Calendar</i> → paste.</li>
              <li><b>Outlook</b>: Add calendar → <i>Subscribe from web</i> → paste.</li>
            </ol>
          </div>
        ) : status?.active ? (
          <div className="space-y-3">
            <p>
              Your calendar link is on — created {relativeTime(status.createdAt!)}
              {status.lastUsedAt ? <>, last fetched by a calendar app {relativeTime(status.lastUsedAt)}</> : ', not fetched by any calendar app yet'}.
              The link itself was shown only once. Lost it? Create a new one — the old link stops working.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={create.isPending} onClick={() => create.mutate()}>
                {create.isPending && <Spinner size={12} />} Create a new link
              </button>
              <button type="button" className="w-btn w-btn-sm" disabled={revoke.isPending} onClick={() => revoke.mutate()}>
                {revoke.isPending && <Spinner size={12} />} Turn off
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="w-btn w-btn-primary" disabled={create.isPending} onClick={() => create.mutate()}>
            {create.isPending && <Spinner size={12} />} <CalendarPlus size={14} /> Create my calendar link
          </button>
        )}
      </div>
    </Dialog>
  );
}

export function CalendarButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setOpen(true)}>
        <CalendarPlus size={13} /> Add to calendar
      </button>
      <CalendarDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
