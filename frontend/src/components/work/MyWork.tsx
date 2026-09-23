'use client';

/**
 * "My work" — mọi việc đang mở giao cho tôi ở MỌI dự án, chia nhóm theo hạn:
 * quá hạn · hôm nay · sắp tới · sau này · không có hạn. Nhóm rỗng thì ẩn.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bell, CheckCircle2 } from 'lucide-react';
import { workApi, workError, type EmailMode, type MyWorkItem, type NotifySettings } from '@/lib/work-api';
import { Dialog, EmptyState, formatDate, IssueTypeIcon, PriorityIcon, Spinner, StatusBadge } from '@/components/work/ui';
import { wk } from '@/components/work/hooks';
import { Select, Switch } from '@/components/work/settings/shared';
import { cn } from '@/lib/utils';

const GROUPS: Array<{ id: MyWorkItem['bucket']; label: string; tone?: string }> = [
  { id: 'overdue', label: 'Overdue', tone: 'text-[var(--w-red)]' },
  { id: 'today', label: 'Due today', tone: 'text-[var(--w-orange)]' },
  { id: 'soon', label: 'Due soon' },
  { id: 'later', label: 'Later' },
  { id: 'none', label: 'No due date' },
];

function Counter({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="min-w-0 rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
      <div className="truncate text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div className={cn('mt-1 text-[18px] font-semibold tabular-nums', value > 0 && tone)}>{value}</div>
    </div>
  );
}

// ─── Cài đặt thông báo (email + giờ im lặng, giờ Việt Nam) ────────

const EMAIL_MODES: Array<{ id: EmailMode; label: string; help: string }> = [
  { id: 'INSTANT', label: 'Instantly', help: 'An email for each notification, as it happens.' },
  { id: 'DIGEST', label: 'Daily digest', help: 'One summary email every morning at 08:00.' },
  { id: 'OFF', label: 'Off', help: 'In-app notifications only.' },
];

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const fmtHour = (h: number) => `${String(h).padStart(2, '0')}:00`;

function NotifyForm({ initial, onClose }: { initial: NotifySettings; onClose: () => void }) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<EmailMode>(initial.emailMode);
  const [quiet, setQuiet] = useState(initial.quietStart !== null && initial.quietEnd !== null);
  const [start, setStart] = useState(initial.quietStart ?? 22);
  const [end, setEnd] = useState(initial.quietEnd ?? 7);
  const save = useMutation({
    mutationFn: () => workApi.setNotifySettings({ emailMode: mode, quietStart: quiet ? start : null, quietEnd: quiet ? end : null }),
    onSuccess: (data) => {
      qc.setQueryData(wk.notifySettings, data);
      toast.success('Notification settings saved');
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save notification settings')),
  });
  const same = quiet && start === end;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!save.isPending && !same) save.mutate(); }}>
      <fieldset className="mb-5">
        <legend className="w-label">Email notifications</legend>
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {EMAIL_MODES.map((m) => (
            <label key={m.id} className={cn('flex cursor-pointer items-start gap-2.5 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0', mode === m.id && 'bg-[var(--w-accent-soft)]')}>
              <input type="radio" name="w-email-mode" className="mt-0.5" checked={mode === m.id} onChange={() => setMode(m.id)} />
              <span className="min-w-0">
                <span className="block text-[13px] font-medium">{m.label}</span>
                <span className="block text-[12px] text-[var(--w-text-2)]">{m.help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={cn('mb-1', mode === 'OFF' && 'opacity-50')}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-medium">Quiet hours</div>
            <p className="text-[12px] text-[var(--w-text-2)]">Emails during these hours wait for the next digest. Vietnam time (UTC+7).</p>
          </div>
          <Switch checked={quiet} disabled={mode === 'OFF'} onChange={setQuiet} label="Quiet hours" />
        </div>
        {quiet && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-[var(--w-text-2)]">From</span>
            <Select aria-label="Quiet hours start" value={start} disabled={mode === 'OFF'} onChange={(e) => setStart(Number(e.target.value))} className="!w-auto">
              {HOURS.map((h) => <option key={h} value={h}>{fmtHour(h)}</option>)}
            </Select>
            <span className="text-[var(--w-text-2)]">to</span>
            <Select aria-label="Quiet hours end" value={end} disabled={mode === 'OFF'} onChange={(e) => setEnd(Number(e.target.value))} className="!w-auto">
              {HOURS.map((h) => <option key={h} value={h}>{fmtHour(h)}</option>)}
            </Select>
          </div>
        )}
        {same && <p className="mt-1.5 text-[12px] text-[var(--w-red)]">Start and end must be different.</p>}
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-[var(--w-border)] pt-3">
        <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
        <button type="submit" className="w-btn w-btn-primary" disabled={save.isPending || same}>
          {save.isPending && <Spinner size={12} />}
          Save
        </button>
      </div>
    </form>
  );
}

function NotifySettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const q = useQuery({ queryKey: wk.notifySettings, queryFn: workApi.notifySettings, enabled: open });
  return (
    <Dialog open={open} onClose={onClose} title="Notification settings" width={480}>
      {q.isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : q.error || !q.data ? (
        <EmptyState title="Could not load your settings" body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : (
        <NotifyForm key={q.dataUpdatedAt} initial={q.data} onClose={onClose} />
      )}
    </Dialog>
  );
}

function NotifyButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)}>
        <Bell size={12} /> Notification settings
      </button>
      <NotifySettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function MyWork() {
  const q = useQuery({ queryKey: ['work', 'my-work'], queryFn: workApi.myWork, staleTime: 30_000 });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error || !q.data) {
    return <EmptyState title="Couldn't load your work" body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  }
  const { items, counts } = q.data;

  return (
    <div className="space-y-5">
      <div className="-mb-2 flex justify-end">
        <NotifyButton />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Counter label="Overdue" value={counts.overdue} tone="text-[var(--w-red)]" />
        <Counter label="Due today" value={counts.dueToday} tone="text-[var(--w-orange)]" />
        <Counter label="In progress" value={counts.inProgress} tone="text-[var(--w-accent-text)]" />
        <Counter label="Open" value={counts.total} />
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <CheckCircle2 size={28} className="text-[var(--w-green)]" />
          <div className="mt-3 text-[15px] font-semibold">You&apos;re all caught up</div>
          <p className="mt-1.5 max-w-[420px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
            Nothing open is assigned to you across your projects. Issues assigned to you will show up here, grouped by due date.
          </p>
        </div>
      ) : (
        GROUPS.map((g) => {
          const rows = items.filter((i) => i.bucket === g.id);
          if (!rows.length) return null;
          return (
            <section key={g.id} aria-label={g.label}>
              <h2 className={cn('mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]', g.tone)}>
                {g.label}
                <span className="font-normal tabular-nums text-[var(--w-text-3)]">{rows.length}</span>
              </h2>
              <ul className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
                {rows.map((it) => (
                  <li key={it.key} className="border-b border-[var(--w-border)] last:border-b-0">
                    <Link href={it.url} className="flex min-w-0 items-start gap-3 px-3 py-2.5 hover:bg-[var(--w-hover)] md:items-center">
                      <span className="mt-0.5 md:mt-0"><IssueTypeIcon type={it.type} /></span>
                      <div className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
                        <div className="flex min-w-0 items-center gap-2 md:flex-1">
                          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{it.key}</span>
                          <span className="truncate text-[13px] font-medium">{it.title}</span>
                        </div>
                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-2)] md:mt-0 md:shrink-0 md:flex-nowrap">
                          <span className="max-w-[160px] truncate" title={`${it.workspace.name} / ${it.project.name}`}>{it.project.name}</span>
                          <PriorityIcon priority={it.priority} size={14} />
                          <StatusBadge status={it.status} className="max-w-[140px] truncate" />
                          {it.dueDate && (
                            <span className={cn('whitespace-nowrap tabular-nums', it.bucket === 'overdue' && 'font-medium text-[var(--w-red)]', it.bucket === 'today' && 'font-medium text-[var(--w-orange)]')}>
                              {it.bucket === 'today' ? 'Today' : formatDate(it.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
