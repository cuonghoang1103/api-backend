'use client';

/**
 * Một CUỘC HỌP — /work/<ws>/<KEY>/meetings/<n> (đợt S3b).
 * Chương trình + biên bản (TipTap, chế độ tài liệu: có bảng — mẫu kick-off có bảng), quyết định,
 * việc cần làm (người + hạn ⇒ "Create issues"), gợi ý AI (`meeting_notes` có sẵn) chỉ là ĐỀ
 * XUẤT — chọn rồi "Add to action items" mới lưu. Tải .ics / gửi lại lời mời / nhân bản tuần
 * sau / chia sẻ biên bản với khách (cổng khách bật).
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CalendarClock, CalendarDays, CheckCircle2, Copy, Eye, EyeOff, ListPlus, Mail, MapPin, Plus, Save, Sparkles, Trash2, Users, Video, X, XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isAiQuotaError, userName, workError, type ProjectConfig, type TiptapDoc } from '@/lib/work-api';
import { MEETING_TYPE_LABEL, govApi, govKeys, type MeetingDetail as MD } from '@/lib/work-s3b-api';
import RichEditor, { RichView } from '../RichEditor';
import { EmptyState, PageLoading, Spinner, StatusBadge, UserAvatar } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { Pill } from '../studio/shared';
import { AttendeePicker, meetingStatusPill } from './MeetingsView';
import { PersonSelect, Section, fmtMeetingTime, useGovInvalidate } from './shared';
import { AddToCalendar, JoinMeetingButton } from '../ctw';
import { usePanes } from '../shell/panes';
import { wt, wfmt } from '@/components/work/i18n';

function RichBlock({ config, m, field, title, empty }: { config: ProjectConfig; m: MD; field: 'agendaJson' | 'minutesJson'; title: string; empty: string }) {
  const invalidate = useGovInvalidate(config.id);
  const [editing, setEditing] = useState(false);
  const [doc, setDoc] = useState<TiptapDoc | null>(m[field]);
  const save = useMutation({
    mutationFn: () => govApi.updateMeeting(config.id, m.number, { [field]: doc, version: m.version }),
    onSuccess: () => { toast.success(wt('gov.xSaved', { x: title })); setEditing(false); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  return (
    <Section
      title={title}
      action={m.canEdit && (editing ? (
        <>
          <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(false)}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid={`meeting-save-${field}`}>{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('common.save')}</button>
        </>
      ) : <button type="button" className="w-btn w-btn-sm" onClick={() => { setDoc(m[field]); setEditing(true); }} data-testid={`meeting-edit-${field}`}>{wt('common.edit')}</button>)}
    >
      {editing ? (
        <div className="w-doc" data-testid={`meeting-editor-${field}`}><RichEditor value={doc} onChange={(d) => setDoc(d)} docs toolbar minHeight={160} members={config.members} projectId={config.id} /></div>
      ) : m[field] ? <div className="w-doc max-w-full overflow-x-auto"><RichView value={m[field]} docs /></div> : <p className="text-[13px] text-[var(--w-text-3)]">{empty}</p>}
    </Section>
  );
}

function Decisions({ config, m }: { config: ProjectConfig; m: MD }) {
  const invalidate = useGovInvalidate(config.id);
  const [list, setList] = useState<string[]>(m.decisions);
  const [text, setText] = useState('');
  useEffect(() => setList(m.decisions), [m.decisions]);
  const save = useMutation({
    mutationFn: (next: string[]) => govApi.updateMeeting(config.id, m.number, { decisions: next }),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err, wt('gov.saveDecisionsFailed'))),
  });
  const add = () => { const t = text.trim(); if (!t) return; const next = [...list, t]; setList(next); setText(''); save.mutate(next); };
  return (
    <Section title={wt('gov.decisions')}>
      {list.length ? (
        <ol className="mb-3 list-decimal space-y-1 pl-5 text-[13.5px]" data-testid="meeting-decisions">
          {list.map((d, i) => (
            <li key={i} className="group">
              <span className="[overflow-wrap:anywhere]">{d}</span>
              {m.canEdit && <button type="button" className="ml-1.5 align-middle text-[var(--w-text-3)] opacity-60 hover:opacity-100" aria-label={wt('gov.removeDecision')} onClick={() => { const next = list.filter((_, j) => j !== i); setList(next); save.mutate(next); }}><X size={12} /></button>}
            </li>
          ))}
        </ol>
      ) : <p className="mb-3 text-[13px] text-[var(--w-text-3)]">{wt('gov.noDecisions')}</p>}
      {m.canEdit && (
        <div className="flex gap-2">
          <input className="w-input min-w-0 flex-1" value={text} maxLength={500} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); add(); } }} placeholder={wt('gov.decidedPh')} data-testid="meeting-decision-input" />
          <button type="button" className="w-btn" disabled={!text.trim()} onClick={add}><Plus size={13} /> {wt('common.add')}</button>
        </div>
      )}
    </Section>
  );
}

type Row = { id?: number; text: string; assigneeId: number | null; dueDate: string };

function Actions({ config, m }: { config: ProjectConfig; m: MD }) {
  const invalidate = useGovInvalidate(config.id);
  const fromM = (): Row[] => m.actions.map((a) => ({ id: a.id, text: a.text, assigneeId: a.assignee?.id ?? null, dueDate: a.dueDate ?? '' }));
  const [rows, setRows] = useState<Row[]>(fromM);
  useEffect(() => setRows(fromM()), [m.actions]); // eslint-disable-line react-hooks/exhaustive-deps
  const [proposals, setProposals] = useState<Array<{ text: string; assigneeId: number | null; on: boolean }> | null>(null);
  const dirty = JSON.stringify(rows) !== JSON.stringify(fromM());
  const save = useMutation({
    mutationFn: (r: Row[]) => govApi.setActions(config.id, m.number, r.filter((x) => x.text.trim()).map((x) => ({ id: x.id, text: x.text.trim(), assigneeId: x.assigneeId, dueDate: x.dueDate || null }))),
    onSuccess: () => { toast.success(wt('gov.actionsSaved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.saveActionsFailed'))),
  });
  const create = useMutation({
    mutationFn: () => govApi.createIssues(config.id, m.number),
    onSuccess: (r) => { toast.success(wt('gov.createdKeys', { keys: r.created.map((c) => c.key).join(', ') })); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.createIssuesFailed'))),
  });
  const suggest = useMutation({
    mutationFn: () => govApi.suggestActions(config.id, m.number),
    onSuccess: (r) => {
      if (!r.proposals.length) toast.message(wt('gov.aiNoActions'));
      setProposals(r.proposals.map((p) => ({ text: p.text, assigneeId: p.assigneeId, on: true })));
    },
    onError: (err) => toast.error(isAiQuotaError(err) ? wt('gov.aiQuota') : workError(err, wt('gov.aiReadFailed'))),
  });
  const issueByAction = new Map(m.actions.map((a) => [a.id, a.issue]));
  const open = m.actions.filter((a) => !a.issue).length;
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <Section
      title={wt('gov.actionItems')}
      action={<>
        {m.canEdit && m.canUseAi && <button type="button" className="w-btn w-btn-sm" disabled={suggest.isPending} onClick={() => suggest.mutate()} title={wt('gov.suggestTip')}>{suggest.isPending ? <Spinner size={12} /> : <Sparkles size={13} />} {wt('gov.suggestFromMinutes')}</button>}
        {m.canCreateIssues && <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!open || dirty || create.isPending} onClick={() => create.mutate()} title={dirty ? wt('gov.saveActionsFirst') : undefined} data-testid="meeting-create-issues">{create.isPending ? <Spinner size={12} /> : <ListPlus size={13} />} {wt('gov.createIssues')}{open ? ` (${open})` : ''}</button>}
      </>}
    >
      {proposals && (
        <div className="mb-3 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-3" data-testid="meeting-ai-proposals">
          <div className="mb-2 flex items-center gap-2 text-[12.5px] font-medium"><Sparkles size={13} /> {wt('gov.aiSuggestions')}</div>
          <ul className="space-y-1">
            {proposals.map((p, i) => (
              <li key={i} className="flex min-w-0 items-center gap-2 text-[13px]">
                <input type="checkbox" checked={p.on} onChange={(e) => setProposals((a) => a!.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)))} aria-label={p.text} />
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{p.text}</span>
                {p.assigneeId && <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{userName(config.members.find((x) => x.id === p.assigneeId))}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={() => setProposals(null)}>{wt('gov.dismiss')}</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!proposals.some((p) => p.on)} onClick={() => { setRows((r) => [...r, ...proposals.filter((p) => p.on).map((p) => ({ text: p.text, assigneeId: p.assigneeId, dueDate: '' }))]); setProposals(null); }}>{wt('gov.addToActions')}</button>
          </div>
        </div>
      )}
      {rows.length ? (
        <ul className="space-y-2" data-testid="meeting-actions">
          {rows.map((r, i) => {
            const issue = r.id ? issueByAction.get(r.id) : null;
            return (
              <li key={r.id ?? `n${i}`} className="grid grid-cols-1 gap-2 rounded-[8px] border border-[var(--w-border)] p-2 md:grid-cols-[minmax(0,1fr)_170px_150px_auto] md:items-center md:border-0 md:p-0">
                <input className="w-input min-w-0" value={r.text} maxLength={500} disabled={!m.canEdit || !!issue} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} aria-label={wt('gov.actionItem')} placeholder={wt('gov.whatNeedsDoing')} />
                <PersonSelect config={config} value={r.assigneeId} onChange={(v) => setRows((a) => a.map((x, j) => (j === i ? { ...x, assigneeId: v } : x)))} label={wt('gov.ownerLbl')} empty={wt('gov.noOwner')} disabled={!m.canEdit || !!issue} />
                <input type="date" className="w-input" value={r.dueDate} disabled={!m.canEdit || !!issue} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, dueDate: e.target.value } : x)))} aria-label={wt('common.dueDate')} />
                <span className="flex items-center justify-end gap-1.5">
                  {issue ? (
                    <Link href={`${base}/issue/${issue.number}`} className="flex items-center gap-1.5 text-[12px]"><span className="font-mono text-[var(--w-accent-text)] hover:underline">{issue.key}</span><StatusBadge status={issue.status} /></Link>
                  ) : m.canEdit ? (
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('gov.removeAction')} onClick={() => setRows((a) => a.filter((_, j) => j !== i))}><X size={13} /></button>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('gov.noActions')}</p>}
      {m.canEdit && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-sm" disabled={rows.length >= 100} onClick={() => setRows((a) => [...a, { text: '', assigneeId: null, dueDate: '' }])} data-testid="meeting-add-action"><Plus size={13} /> {wt('gov.addAction')}</button>
          {dirty && <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate(rows)} data-testid="meeting-save-actions">{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('gov.saveActions')}</button>}
        </div>
      )}
    </Section>
  );
}

function Attendees({ config, m }: { config: ProjectConfig; m: MD }) {
  const invalidate = useGovInvalidate(config.id);
  const [editing, setEditing] = useState(false);
  const [ids, setIds] = useState<number[]>(m.attendees.map((a) => a.id));
  const save = useMutation({
    mutationFn: () => govApi.setAttendees(config.id, m.number, ids),
    onSuccess: () => { toast.success(wt('gov.attendeesUpdated')); setEditing(false); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('gov.updAttendeesFailed'))),
  });
  return (
    <Section title={<span className="flex items-center gap-1.5"><Users size={14} /> {wt('gov.attendees')} <span className="w-count">{m.attendees.length}</span></span>}
      action={m.canEdit && (editing
        ? <><button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(false)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()}>{wt('common.save')}</button></>
        : <button type="button" className="w-btn w-btn-sm" onClick={() => { setIds(m.attendees.map((a) => a.id)); setEditing(true); }}>{wt('common.edit')}</button>)}
    >
      {editing ? <AttendeePicker config={config} value={ids} onChange={setIds} portalOn={m.portalOn} /> : m.attendees.length ? (
        <ul className="flex flex-wrap gap-2" data-testid="meeting-attendees">
          {m.attendees.map((a) => (
            <li key={a.id} className="flex items-center gap-1.5 rounded-full border border-[var(--w-border)] py-0.5 pl-0.5 pr-2.5 text-[12.5px]">
              <UserAvatar user={a} size={20} /> {userName(a)} {a.isClient && <span className="text-[11px] text-[var(--w-accent-text)]">{wt('gov.clientLc')}</span>}
            </li>
          ))}
        </ul>
      ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('gov.nobodyInvited')}</p>}
      {m.organizer && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('gov.organisedBy', { name: userName(m.organizer) })}</p>}
    </Section>
  );
}

export default function MeetingDetail({ config, num }: { config: ProjectConfig; num: number }) {
  const router = useRouter();
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const q = useQuery({ queryKey: govKeys.meeting(pid, num), queryFn: () => govApi.meeting(pid, num) });
  const [confirmDel, setConfirmDel] = useState(false);
  // UX-E: hai cột (biên bản | người dự) chỉ khi biên bản còn ≥ 600px — đo khung thật, không theo
  // breakpoint (app desktop 1180 từng ép biên bản còn ~540px). Hẹp hơn ⇒ một cột, người dự xuống dưới.
  const panes = usePanes('meeting', { right: { width: 316 }, minMain: 664 });
  const twoCol = panes.right.mode === 'inline';
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const status = useMutation({
    mutationFn: (s: 'DONE' | 'CANCELLED' | 'SCHEDULED') => govApi.updateMeeting(pid, num, { status: s }),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err)),
  });
  const share = useMutation({
    mutationFn: (v: boolean) => govApi.shareMinutes(pid, num, v),
    onSuccess: (m) => { toast.success(m.minutesShared ? wt('gov.notesSharedClients') : wt('gov.notesUnshared')); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });
  const invites = useMutation({
    mutationFn: () => govApi.sendInvites(pid, num),
    onSuccess: (r) => toast.success(wt('gov.invitesSent', { count: r.sent })),
    onError: (err) => toast.error(workError(err)),
  });
  const dup = useMutation({
    mutationFn: () => govApi.duplicateMeeting(pid, num, 1),
    onSuccess: (m) => { toast.success(wt('gov.scheduledNext', { key: m.key })); invalidate(); router.push(`${base}/meetings/${m.number}`); },
    onError: (err) => toast.error(workError(err)),
  });
  const del = useMutation({
    mutationFn: () => govApi.deleteMeeting(pid, num),
    onSuccess: () => { toast.success(wt('gov.meetingDeleted')); invalidate(); router.push(`${base}/meetings`); },
    onError: (err) => toast.error(workError(err)),
  });
  const ics = useMutation({ mutationFn: () => govApi.downloadIcs(pid, num), onError: (err) => toast.error(workError(err, wt('gov.downloadFailed'))) });
  // CTW-24: máy chủ sinh phòng Jitsi (meetingUrl "jitsi").
  const room = useMutation({
    mutationFn: () => govApi.updateMeeting(pid, num, { meetingUrl: 'jitsi' }),
    onSuccess: () => { toast.success(wt('gov.linkCreated')); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !q.data) return <EmptyState title={wt('gov.meetingNotFound')} body={workError(q.error)} />;
  const m = q.data;

  return (
    <div ref={panes.ref} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className={cn('mx-auto w-full space-y-4 px-4 py-5 md:px-6', twoCol ? 'max-w-[1040px]' : 'max-w-[900px]')}>
        <div>
          <Link href={`${base}/meetings`} className="text-[12.5px] text-[var(--w-text-3)] hover:text-[var(--w-text)]">{wt('gov.backMeetings')}</Link>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] text-[var(--w-accent-text)]">{m.key}</span>
            {meetingStatusPill(m.status)}
            <Pill tone="neutral">{MEETING_TYPE_LABEL[m.type]}</Pill>
            {m.minutesShared && <Pill tone="accent">{wt('gov.notesSharedClient')}</Pill>}
          </div>
          <h1 className="mt-1.5 text-[20px] font-semibold tracking-[-0.015em] [overflow-wrap:anywhere] md:text-[24px]" data-testid="meeting-heading">{m.title}</h1>
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[var(--w-text-2)]">
            <span className="flex items-center gap-1.5"><CalendarClock size={14} />{fmtMeetingTime(m.startsAt, m.endsAt, m.timezone)} <span className="text-[var(--w-text-3)]">({m.timezone})</span></span>
            {m.location && <span className="flex min-w-0 items-center gap-1.5"><MapPin size={14} /><span className="[overflow-wrap:anywhere]">{m.location}</span></span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" data-testid="meeting-actions-bar">
          {/* CTW-24: nút Join nổi bật; chưa có link ⇒ tạo phòng Jitsi một chạm. CTW-25: Google/Outlook/.ics. */}
          {m.meetingUrl && m.status !== 'CANCELLED' && <JoinMeetingButton url={m.meetingUrl} startsAt={m.startsAt} endsAt={m.endsAt} />}
          {!m.meetingUrl && m.canEdit && m.status === 'SCHEDULED' && (
            <button type="button" className="w-btn w-btn-primary" disabled={room.isPending} onClick={() => room.mutate()} data-testid="meeting-create-link">{room.isPending ? <Spinner size={12} /> : <Video size={14} />} {wt('gov.createMeetingLink')}</button>
          )}
          <AddToCalendar
            size="md" onIcs={() => ics.mutate()}
            event={{ title: `${config.key} · ${m.title}`, start: m.startsAt, end: m.endsAt, location: m.meetingUrl || m.location, details: [m.meetingUrl ? `Join: ${m.meetingUrl}` : '', config.name].filter(Boolean).join('\n') }}
          />
          {m.canEdit && <button type="button" className="w-btn" disabled={invites.isPending || !m.attendees.length} onClick={() => invites.mutate()}><Mail size={14} /> {wt('gov.emailInvitations')}</button>}
          {m.canEdit && <button type="button" className="w-btn" disabled={dup.isPending} onClick={() => dup.mutate()} title={wt('gov.dupTip')}><Copy size={14} /> {wt('gov.dupNext')}</button>}
          {m.canEdit && m.status === 'SCHEDULED' && <button type="button" className="w-btn" onClick={() => status.mutate('DONE')} data-testid="meeting-done"><CheckCircle2 size={14} /> {wt('gov.markDone')}</button>}
          {m.canEdit && m.status === 'SCHEDULED' && <button type="button" className="w-btn w-btn-ghost" onClick={() => status.mutate('CANCELLED')}><XCircle size={14} /> {wt('gov.cancelMeeting')}</button>}
          {m.canEdit && m.status !== 'SCHEDULED' && <button type="button" className="w-btn w-btn-ghost" onClick={() => status.mutate('SCHEDULED')}><CalendarDays size={14} /> {wt('gov.reopen')}</button>}
          {m.canEdit && m.portalOn && m.hasClients && (
            <button type="button" className={cn('w-btn', m.minutesShared && 'w-btn-on')} disabled={share.isPending} onClick={() => share.mutate(!m.minutesShared)} data-testid="meeting-share" title={wt('gov.shareNotesTip')}>
              {m.minutesShared ? <EyeOff size={14} /> : <Eye size={14} />} {m.minutesShared ? wt('gov.stopSharing') : wt('gov.shareNotes')}
            </button>
          )}
          {m.canDelete && <button type="button" className="w-btn w-btn-ghost w-btn-danger ml-auto" onClick={() => setConfirmDel(true)}><Trash2 size={14} /> {wt('common.delete')}</button>}
        </div>

        <div className={cn('grid grid-cols-1 gap-4', twoCol && 'grid-cols-[minmax(0,1fr)_300px]')}>
          <div className="min-w-0 space-y-4">
            <RichBlock config={config} m={m} field="agendaJson" title={wt('gov.agenda')} empty={wt('gov.noAgenda')} />
            <RichBlock config={config} m={m} field="minutesJson" title={wt('gov.minutes')} empty={wt('gov.noMinutes')} />
            <Decisions config={config} m={m} />
            <Actions config={config} m={m} />
          </div>
          <div className="min-w-0 space-y-4">
            <Attendees config={config} m={m} />
            {(m.previous || m.next.length > 0) && (
              <Section title={wt('gov.series')}>
                <ul className="space-y-1.5 text-[13px]">
                  {m.previous && <li>← <Link href={`${base}/meetings/${m.previous.number}`} className="text-[var(--w-accent-text)] hover:underline">M-{m.previous.number}</Link> {new Date(m.previous.startsAt).toLocaleDateString(wfmt.intl())}</li>}
                  {m.next.map((n) => <li key={n.number}>→ <Link href={`${base}/meetings/${n.number}`} className="text-[var(--w-accent-text)] hover:underline">M-{n.number}</Link> {new Date(n.startsAt).toLocaleDateString(wfmt.intl())}</li>)}
                </ul>
              </Section>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} title={wt('gov.deleteKeyQ', { key: m.key })} body={wt('gov.meetingDelBody')} confirmLabel={wt('common.delete')} pending={del.isPending} onConfirm={() => del.mutate()} />
    </div>
  );
}
