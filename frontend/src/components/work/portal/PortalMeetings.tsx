'use client';

/**
 * Cổng khách — thẻ "Meetings" (đợt S3b). Khách thấy cuộc họp CÓ MỜI họ; chương trình,
 * biên bản, quyết định và việc cần làm chỉ hiện khi đội đã bấm "Share notes with client".
 * Server lọc hết (meetings.service portalMeetings) — giao diện chỉ hiển thị.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, Lock, MapPin } from 'lucide-react';
import { userName, workError } from '@/lib/work-api';
import { govApi, govKeys } from '@/lib/work-s3b-api';
import { RichView } from '../RichEditor';
import { Dialog, EmptyState, PageLoading, UserAvatar, formatDate } from '../ui';
import { Pill } from '../studio/shared';
import { fmtMeetingTime } from '../governance/shared';
import { AddToCalendar, JoinMeetingButton } from '../ctw';

export function MeetingsTab({ pid, asClient, openMeeting }: { pid: number; asClient: boolean; openMeeting: (n: number) => void }) {
  const q = useQuery({ queryKey: govKeys.portalMeetings(pid, asClient), queryFn: () => govApi.portalMeetings(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title="Could not load meetings" body={workError(q.error)} />;
  if (!q.data.items.length) {
    return <EmptyState icon={<CalendarClock size={20} />} title="No meetings yet" body={q.data.staffView ? 'Meetings that invite a client appear here.' : 'Meetings the team invites you to appear here, with notes once they are shared.'} />;
  }
  return (
    <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden" data-testid="portal-meetings">
      {q.data.items.map((m) => (
        <li key={m.id} className="flex min-w-0 items-center">
          <button type="button" onClick={() => openMeeting(m.number)} className="flex w-full min-w-0 flex-1 items-start gap-3 px-4 py-3 text-left hover:bg-[var(--w-hover)]">
            <CalendarClock size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium">{m.title}</span>
              <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                <span>{fmtMeetingTime(m.startsAt, m.endsAt, m.timezone)}</span>
                {m.status === 'CANCELLED' ? <Pill tone="neutral">Cancelled</Pill> : m.status === 'DONE' ? <Pill tone="green">Held</Pill> : <Pill tone="blue">Scheduled</Pill>}
                {m.minutesShared && <Pill tone="accent">Notes available</Pill>}
              </span>
            </span>
          </button>
          {/* CTW-24: vào phòng ngay từ danh sách (cuộc họp chưa qua). */}
          {m.meetingUrl && m.status === 'SCHEDULED' && new Date(m.endsAt).getTime() > Date.now() && (
            <span className="shrink-0 pr-3"><JoinMeetingButton url={m.meetingUrl} startsAt={m.startsAt} endsAt={m.endsAt} className="w-btn-sm" /></span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function PortalMeetingDialog({ pid, num, asClient, onClose }: { pid: number; num: number | null; asClient: boolean; onClose: () => void }) {
  const q = useQuery({ queryKey: govKeys.portalMeeting(pid, num ?? 0, asClient), queryFn: () => govApi.portalMeeting(pid, num!, asClient), enabled: !!num });
  const ics = useMutation({ mutationFn: () => govApi.downloadPortalIcs(pid, num!, asClient), onError: (err) => toast.error(workError(err, 'Could not download')) });
  const m = q.data;
  return (
    <Dialog open={!!num} onClose={onClose} width={720} title={m ? m.title : 'Loading…'}>
      {q.isLoading ? <PageLoading rows={3} /> : q.error || !m ? <EmptyState title="Not available" body={workError(q.error)} /> : (
        <div className="space-y-5" data-testid="portal-meeting">
          <div className="space-y-1.5 text-[13px] text-[var(--w-text-2)]">
            <div className="flex items-center gap-1.5"><CalendarClock size={14} />{fmtMeetingTime(m.startsAt, m.endsAt, m.timezone)} <span className="text-[var(--w-text-3)]">({m.timezone})</span></div>
            {m.location && <div className="flex items-center gap-1.5"><MapPin size={14} /><span className="[overflow-wrap:anywhere]">{m.location}</span></div>}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* CTW-24/25: Join nổi bật + Google Calendar / Outlook / .ics. */}
            {m.meetingUrl && m.status !== 'CANCELLED' && <JoinMeetingButton url={m.meetingUrl} startsAt={m.startsAt} endsAt={m.endsAt} />}
            <AddToCalendar
              size="md" onIcs={() => ics.mutate()}
              event={{ title: m.title, start: m.startsAt, end: m.endsAt, location: m.meetingUrl || m.location, details: m.meetingUrl ? `Join: ${m.meetingUrl}` : null }}
            />
          </div>
          <section>
            <h3 className="w-section-title mb-2">Attendees</h3>
            <ul className="flex flex-wrap gap-2">
              {m.attendees.map((a, i) => a && (
                <li key={`${a.id}-${i}`} className="flex items-center gap-1.5 rounded-full border border-[var(--w-border)] py-0.5 pl-0.5 pr-2.5 text-[12.5px]"><UserAvatar user={a} size={20} /> {userName(a)}</li>
              ))}
            </ul>
          </section>
          {m.shared ? (
            <>
              {m.agendaJson && <section><h3 className="w-section-title mb-2">Agenda</h3><div className="w-doc max-w-full overflow-x-auto"><RichView value={m.agendaJson} docs /></div></section>}
              {m.minutesJson && <section data-testid="portal-meeting-minutes"><h3 className="w-section-title mb-2">Minutes</h3><div className="w-doc max-w-full overflow-x-auto"><RichView value={m.minutesJson} docs /></div></section>}
              {!!m.decisions?.length && (
                <section><h3 className="w-section-title mb-2">Decisions</h3><ol className="list-decimal space-y-1 pl-5 text-[13.5px]">{m.decisions.map((d, i) => <li key={i} className="[overflow-wrap:anywhere]">{d}</li>)}</ol></section>
              )}
              {!!m.actions?.length && (
                <section>
                  <h3 className="w-section-title mb-2">Action items</h3>
                  <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
                    {m.actions.map((a) => (
                      <li key={a.id} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-[13px]">
                        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{a.text}</span>
                        {a.assignee && <span className="text-[12px] text-[var(--w-text-3)]">{userName(a.assignee)}</span>}
                        {a.dueDate && <span className="text-[12px] text-[var(--w-text-3)]">due {formatDate(a.dueDate)}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <p className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[12.5px] text-[var(--w-text-2)]"><Lock size={13} /> The agenda and notes appear here once the team shares them.</p>
          )}
        </div>
      )}
    </Dialog>
  );
}
