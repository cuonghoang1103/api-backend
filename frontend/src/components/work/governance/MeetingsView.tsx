'use client';

/**
 * CUỘC HỌP của dự án — /work/<ws>/<KEY>/meetings (đợt S3b, mô-đun meetings).
 * Sắp tới / đã qua, nút "Schedule meeting" (mời nhân viên + khách nếu cổng khách bật,
 * link Meet/Zoom/Teams chỉ được LƯU, mẫu kick-off, email lời mời kèm .ics).
 */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, CalendarPlus, MapPin, Plus, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { MEETING_TYPES, MEETING_TYPE_LABEL, govApi, govKeys, type MeetingRow, type MeetingType } from '@/lib/work-s3b-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { newJitsiUrl } from '@/lib/work-ctw-api';
import { Pill } from '../studio/shared';
import { fmtMeetingTime, fromLocalInput, toLocalInput, useGovInvalidate } from './shared';

const PROVIDER: Record<string, string> = { MEET: 'Google Meet', ZOOM: 'Zoom', TEAMS: 'Microsoft Teams', JITSI: 'Jitsi Meet', OTHER: 'Video link' };
const COMMON_TZ = ['Asia/Ho_Chi_Minh', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'UTC'];

export function meetingStatusPill(status: string) {
  if (status === 'DONE') return <Pill tone="green">Done</Pill>;
  if (status === 'CANCELLED') return <Pill tone="neutral">Cancelled</Pill>;
  return <Pill tone="blue">Scheduled</Pill>;
}

/** Chọn người được mời: nhân viên + (khi cổng bật) khách. */
export function AttendeePicker({ config, value, onChange, portalOn }: { config: ProjectConfig; value: number[]; onChange: (ids: number[]) => void; portalOn: boolean }) {
  const people = config.members.filter((m) => m.role !== 'CLIENT' || portalOn);
  const set = new Set(value);
  return (
    <div className="max-h-[200px] overflow-y-auto rounded-[6px] border border-[var(--w-border)] p-1" role="group" aria-label="Attendees">
      {people.map((m) => (
        <label key={m.id} className="flex min-w-0 cursor-pointer items-center gap-2 rounded-[5px] px-2 py-1.5 text-[13px] hover:bg-[var(--w-hover)]">
          <input type="checkbox" checked={set.has(m.id)} onChange={(e) => onChange(e.target.checked ? [...value, m.id] : value.filter((x) => x !== m.id))} data-testid={`attendee-${m.username}`} />
          <UserAvatar user={m} size={18} />
          <span className="min-w-0 flex-1 truncate">{userName(m)}</span>
          {m.role === 'CLIENT' && <Pill tone="accent">Client</Pill>}
        </label>
      ))}
      {!people.length && <p className="px-2 py-1.5 text-[12.5px] text-[var(--w-text-3)]">Nobody to invite yet.</p>}
    </div>
  );
}

export function NewMeetingDialog({ config, open, onClose, portalOn }: { config: ProjectConfig; open: boolean; onClose: () => void; portalOn: boolean }) {
  const router = useRouter();
  const invalidate = useGovInvalidate(config.id);
  const browserTz = useMemo(() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh'; } catch { return 'Asia/Ho_Chi_Minh'; } }, []);
  const initStart = () => { const d = new Date(Date.now() + 86_400_000); d.setMinutes(0, 0, 0); d.setHours(9); return d.toISOString(); };
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingType>('WEEKLY');
  const [start, setStart] = useState(() => toLocalInput(initStart()));
  const [minutes, setMinutes] = useState(60);
  const [tz, setTz] = useState(browserTz);
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [ids, setIds] = useState<number[]>([]);
  const [template, setTemplate] = useState(true);
  const [invites, setInvites] = useState(true);
  useEffect(() => { if (open) { setTitle(''); setIds([]); setStart(toLocalInput(initStart())); } }, [open]);
  const create = useMutation({
    mutationFn: () => {
      const s = fromLocalInput(start);
      return govApi.createMeeting(config.id, {
        title: title.trim() || MEETING_TYPE_LABEL[type], type, startsAt: s, endsAt: new Date(new Date(s).getTime() + minutes * 60_000).toISOString(),
        timezone: tz, location: location.trim() || null, meetingUrl: url.trim() || null, attendeeIds: ids, useTemplate: type === 'KICKOFF' ? template : undefined, sendInvites: invites,
      });
    },
    onSuccess: (m) => {
      toast.success(`${m.key} scheduled${invites && m.attendees.length ? ' — invitations sent' : ''}`);
      invalidate();
      onClose();
      router.push(`/work/${config.workspace.slug}/${config.key}/meetings/${m.number}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not schedule the meeting')),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Schedule a meeting"
      width={600}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!start || create.isPending} onClick={() => create.mutate()} data-testid="meeting-create">{create.isPending ? <Spinner size={12} /> : <CalendarPlus size={13} />} Schedule</button>
      </>}
    >
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_180px]">
        <Field label="Title"><input className="w-input" value={title} maxLength={255} autoFocus onChange={(e) => setTitle(e.target.value)} placeholder={MEETING_TYPE_LABEL[type]} data-testid="meeting-title" /></Field>
        <Field label="Type">
          <Select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as MeetingType)} data-testid="meeting-type">
            {MEETING_TYPES.map((t) => <option key={t} value={t}>{MEETING_TYPE_LABEL[t]}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_120px_1fr]">
        <Field label="Starts"><input type="datetime-local" className="w-input" value={start} onChange={(e) => setStart(e.target.value)} data-testid="meeting-start" /></Field>
        <Field label="Length">
          <Select aria-label="Length" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
            {[15, 30, 45, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m < 60 ? `${m} min` : `${m / 60} h`}</option>)}
          </Select>
        </Field>
        <Field label="Time zone">
          <Select aria-label="Time zone" value={tz} onChange={(e) => setTz(e.target.value)}>
            {[...new Set([browserTz, ...COMMON_TZ])].map((z) => <option key={z} value={z}>{z}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <Field label="Location (optional)"><input className="w-input" value={location} maxLength={255} onChange={(e) => setLocation(e.target.value)} placeholder="Room, office…" /></Field>
        <Field label="Video link (optional)" hint="Paste a Google Meet, Zoom or Teams link — or create a free Jitsi room (no account needed)">
          {/* CTW-24 bậc 1: phòng Jitsi miễn phí, không khoá API. */}
          <div className="flex gap-1.5">
            <input className="w-input min-w-0 flex-1" value={url} maxLength={500} onChange={(e) => setUrl(e.target.value)} placeholder="https://meet.google.com/…" data-testid="meeting-url" />
            <button type="button" className="w-btn shrink-0" onClick={() => setUrl(newJitsiUrl())} title="Create a Jitsi Meet room link" data-testid="meeting-create-link"><Video size={13} /> Create link</button>
          </div>
        </Field>
      </div>
      <Field label="Invite" hint={portalOn ? 'Clients see only meetings they are invited to, in the client portal.' : 'Turn on the client portal to invite clients.'}>
        <AttendeePicker config={config} value={ids} onChange={setIds} portalOn={portalOn} />
      </Field>
      <div className="space-y-1.5 text-[13px]">
        {type === 'KICKOFF' && <label className="flex items-center gap-2"><input type="checkbox" checked={template} onChange={(e) => setTemplate(e.target.checked)} /> Start agenda and minutes from the kick-off template</label>}
        <label className="flex items-center gap-2"><input type="checkbox" checked={invites} onChange={(e) => setInvites(e.target.checked)} /> Email invitations with a calendar file (.ics)</label>
      </div>
    </Dialog>
  );
}

function MeetingItem({ m, base }: { m: MeetingRow; base: string }) {
  return (
    <li>
      <Link href={`${base}/${m.number}`} className={cn('flex min-w-0 items-start gap-3 px-3 py-3 hover:bg-[var(--w-hover)]', m.status === 'CANCELLED' && 'opacity-60')} data-testid={`meeting-row-${m.number}`}>
        <span className="flex w-[52px] shrink-0 flex-col items-center rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] py-1 text-center leading-tight">
          <span className="text-[11px] font-medium uppercase text-[var(--w-text-3)]">{new Intl.DateTimeFormat('en-US', { timeZone: m.timezone, month: 'short' }).format(new Date(m.startsAt))}</span>
          <span className="text-[18px] font-semibold tabular-nums">{new Intl.DateTimeFormat('en-US', { timeZone: m.timezone, day: 'numeric' }).format(new Date(m.startsAt))}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{m.key}</span>
            <span className="truncate text-[14px] font-medium">{m.title}</span>
          </span>
          <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)]">
            {meetingStatusPill(m.status)}
            <Pill tone="neutral">{m.typeLabel}</Pill>
            <span className="flex items-center gap-1"><CalendarClock size={12} />{fmtMeetingTime(m.startsAt, m.endsAt, m.timezone)}</span>
            {m.provider && <span className="flex items-center gap-1"><Video size={12} />{PROVIDER[m.provider]}</span>}
            {m.location && <span className="flex min-w-0 items-center gap-1"><MapPin size={12} /><span className="max-w-[160px] truncate">{m.location}</span></span>}
            {m.minutesShared && <Pill tone="accent">Notes shared</Pill>}
            {m.actionsOpen > 0 && <span>{m.actionsOpen} action{m.actionsOpen === 1 ? '' : 's'} without issue</span>}
          </span>
        </span>
        <span className="hidden shrink-0 -space-x-1 sm:flex">{m.attendees.slice(0, 5).map((a) => <UserAvatar key={a.id} user={a} size={20} className="ring-2 ring-[var(--w-panel)]" />)}</span>
      </Link>
    </li>
  );
}

export default function MeetingsView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming');
  const [creating, setCreating] = useState(false);
  const q = useQuery({ queryKey: govKeys.meetings(pid, scope), queryFn: () => govApi.meetings(pid, scope) });
  const base = `/work/${config.workspace.slug}/${config.key}/meetings`;
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-[960px] px-4 py-5 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-[7px] border border-[var(--w-border-strong)] p-0.5" role="tablist" aria-label="Meetings">
            {(['upcoming', 'past'] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={scope === k} onClick={() => setScope(k)} className={cn('flex h-7 items-center rounded-[5px] px-3 text-[13px] font-medium', scope === k ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
                {k === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
          </div>
          {q.data?.canEdit && <button type="button" className="w-btn w-btn-primary ml-auto" onClick={() => setCreating(true)} data-testid="meeting-new"><Plus size={14} /> Schedule meeting</button>}
        </div>
        {q.isLoading ? <PageLoading rows={4} /> : q.error || !q.data ? <EmptyState title="Could not load meetings" body={workError(q.error)} /> : q.data.items.length ? (
          <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden" data-testid="meeting-list">{q.data.items.map((m) => <MeetingItem key={m.id} m={m} base={base} />)}</ul>
        ) : (
          <EmptyState
            icon={<CalendarClock size={20} />}
            title={scope === 'upcoming' ? 'No upcoming meetings' : 'No past meetings'}
            body="Schedule kick-offs, weekly syncs, demos and steering meetings. Keep the agenda, minutes, decisions and action items in one place — and turn action items into issues."
          />
        )}
      </div>
      <NewMeetingDialog config={config} open={creating} onClose={() => setCreating(false)} portalOn={!!q.data?.portalOn} />
    </div>
  );
}
