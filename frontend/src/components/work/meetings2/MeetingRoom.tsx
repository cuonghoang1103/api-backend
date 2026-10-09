'use client';

/**
 * CT Work K-2 — phần HỌP của trang một cuộc họp (gắn trong MeetingDetail):
 *   - MeetingK2Side: "Vào họp" (điểm danh AUTO) / rời, RSVP Có–Không–Có thể + lý do, bảng điểm danh (chủ trì đánh dấu tay).
 *   - MeetingK2Main: agenda có cấu trúc · ghi âm có ĐỒNG Ý (biểu tượng "đang ghi", đoạn 90 s tải dần) · tải tệp có sẵn ·
 *     tiến độ phiên âm + thử lại · transcript có mốc giờ (gán người nói) · AI đề xuất biên bản có bằng chứng ⇒ chủ trì
 *     duyệt ⇒ biên bản + việc ⇒ thẻ · xuất biên bản mẫu FPT (docx/pdf).
 * Mọi hook đặt TRƯỚC return sớm (rules-of-hooks — xem feedback #310).
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, CheckCircle2, Circle, Download, FileAudio, LogIn, LogOut, Mic, Pencil, Play, Plus, RefreshCw, Save, Sparkles, Square, Trash2, Upload, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isAiQuotaError, userName, workError, type ProjectConfig } from '@/lib/work-api';
import type { MeetingDetail as MD } from '@/lib/work-s3b-api';
import { k2Api, k2Keys, type AgendaItem, type Attendance, type Evidence, type MinutesDraft, type Room, type RoomRecording, type Rsvp } from '@/lib/work-k2-api';
import { Spinner, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { Section, useGovInvalidate } from '../governance/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import { splitAudioFile } from './splitAudioFile';
import { useMeetingRecorder } from './useMeetingRecorder';

/** Khoá động (`meeting2.att_PRESENT`…) — mọi giá trị đều có trong từ điển en/vi. */
const K = (s: string) => s as WKey;

const ACTIVE = new Set(['CONSENT', 'RECORDING']);

/** Một query cho cả hai cột (react-query gộp). Tự hỏi lại khi đang hỏi đồng ý / đang ghi / đang phiên âm. */
export function useRoom(pid: number, num: number) {
  return useQuery({
    queryKey: k2Keys.room(pid, num),
    queryFn: () => k2Api.room(pid, num),
    refetchInterval: (q) => {
      const r = q.state.data as Room | undefined;
      if (!r) return false;
      const busy = r.recordings.some((x) => ACTIVE.has(x.status) || x.progress.pending > 0);
      // Người đang ở phòng phải thấy lời xin đồng ý ghi âm ngay cả khi socket không tới (mạng chặn ws, app desktop ngủ).
      return busy ? 4000 : r.me?.present ? 5000 : false;
    },
  });
}

const fmtClock = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`;
};

function useK2Invalidate(pid: number) {
  const qc = useQueryClient();
  const gov = useGovInvalidate(pid);
  return (r?: Room) => {
    if (r) qc.setQueryData(k2Keys.room(pid, r.number), r);
    gov();
  };
}

// ═══ CỘT PHẢI: vào họp · RSVP · điểm danh ═════════════════════════

const RSVP_TONE: Record<Rsvp, 'green' | 'red' | 'orange'> = { YES: 'green', NO: 'red', MAYBE: 'orange' };
const ATT_TONE: Record<Attendance, 'green' | 'orange' | 'blue' | 'red'> = { PRESENT: 'green', LATE: 'orange', EXCUSED: 'blue', ABSENT: 'red' };
const ATTS: Attendance[] = ['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'];

export function MeetingK2Side({ config, m }: { config: ProjectConfig; m: MD }) {
  const { t, fmtDateTime } = useWT();
  const pid = config.id;
  const q = useRoom(pid, m.number);
  const done = useK2Invalidate(pid);
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState<Rsvp | null>(null);
  useEffect(() => { if (q.data?.me?.rsvpNote) setNote(q.data.me.rsvpNote); }, [q.data?.me?.rsvpNote]);
  const join = useMutation({
    mutationFn: () => k2Api.join(pid, m.number),
    onSuccess: (r) => {
      done(r.room);
      toast.success(r.attendance === 'LATE' ? t('meeting2.joinedLate') : t('meeting2.joined'));
      if (r.url) window.open(r.url, '_blank', 'noopener,noreferrer');
    },
    onError: (e) => toast.error(workError(e)),
  });
  const leave = useMutation({ mutationFn: () => k2Api.leave(pid, m.number), onSuccess: (r) => done(r), onError: (e) => toast.error(workError(e)) });
  const rsvp = useMutation({
    mutationFn: (v: { rsvp: Rsvp; note?: string | null }) => k2Api.rsvp(pid, m.number, v.rsvp, v.note),
    onSuccess: (r) => { done(r); setNoteOpen(null); toast.success(t('meeting2.rsvpSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  const mark = useMutation({
    mutationFn: (v: { userId: number; attendance: Attendance | null }) => k2Api.mark(pid, m.number, [v]),
    onSuccess: (r) => done(r),
    onError: (e) => toast.error(workError(e)),
  });

  if (!q.data) return q.isLoading ? <Section title={t('meeting2.attendance')}><Spinner size={14} /></Section> : null;
  const r = q.data;
  const me = r.me;
  const cancelled = m.status === 'CANCELLED';

  return (
    <>
      <Section title={t('meeting2.yourAttendance')}>
        <div className="flex flex-wrap items-center gap-2">
          {!me?.present ? (
            <button type="button" className="w-btn w-btn-primary" disabled={cancelled || join.isPending} onClick={() => join.mutate()} data-testid="k2-join" title={t('meeting2.joinTip')}>
              {join.isPending ? <Spinner size={12} /> : <LogIn size={14} />} {t('meeting2.join')}
            </button>
          ) : (
            <button type="button" className="w-btn" disabled={leave.isPending} onClick={() => leave.mutate()} data-testid="k2-leave"><LogOut size={14} /> {t('meeting2.leave')}</button>
          )}
          {me?.attendance && <Pill tone={ATT_TONE[me.attendance]}>{t(K(`meeting2.att_${me.attendance}`))}</Pill>}
        </div>
        {me?.joinedAt && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{t('meeting2.joinedAt', { t: fmtDateTime(me.joinedAt) })}{me.leftAt ? ` · ${t('meeting2.leftAt', { t: fmtDateTime(me.leftAt) })}` : ''}</p>}
        {me?.invited && !cancelled && (
          <div className="mt-3">
            <div className="mb-1.5 text-[12.5px] font-medium text-[var(--w-text-2)]" id="k2-rsvp-label">{t('meeting2.rsvpQ')}</div>
            <div className="inline-flex rounded-[7px] border border-[var(--w-border-strong)] p-0.5" role="group" aria-labelledby="k2-rsvp-label">
              {(['YES', 'MAYBE', 'NO'] as Rsvp[]).map((v) => (
                <button key={v} type="button" aria-pressed={me.rsvp === v} disabled={rsvp.isPending}
                  onClick={() => (v === 'YES' ? rsvp.mutate({ rsvp: v, note: null }) : setNoteOpen(v))}
                  className={cn('flex h-7 items-center rounded-[5px] px-3 text-[13px] font-medium', me.rsvp === v ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}
                  data-testid={`k2-rsvp-${v}`}>
                  {t(K(`meeting2.rsvp_${v}`))}
                </button>
              ))}
            </div>
            {noteOpen && (
              <div className="mt-2 flex gap-1.5">
                <input className="w-input min-w-0 flex-1" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder={t('meeting2.reasonPh')} aria-label={t('meeting2.reason')} autoFocus data-testid="k2-rsvp-note" />
                <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={rsvp.isPending} onClick={() => rsvp.mutate({ rsvp: noteOpen, note })} data-testid="k2-rsvp-save">{t('common.save')}</button>
              </div>
            )}
            {me.rsvp && me.rsvp !== 'YES' && me.rsvpNote && !noteOpen && <p className="mt-1.5 text-[12px] text-[var(--w-text-3)] [overflow-wrap:anywhere]">“{me.rsvpNote}”</p>}
          </div>
        )}
      </Section>

      <Section title={<span className="flex items-center gap-1.5">{t('meeting2.attendance')} <span className="w-count">{r.attendees.filter((a) => a.attendance === 'PRESENT' || a.attendance === 'LATE').length}/{r.attendees.length}</span></span>}>
        {r.attendees.length ? (
          <ul className="space-y-2" data-testid="k2-attendance">
            {r.attendees.map((a) => (
              <li key={a.userId} className="flex min-w-0 flex-wrap items-center gap-2 text-[13px]">
                <span className="relative">
                  <UserAvatar user={a.user} size={22} />
                  {a.present && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--w-panel)] bg-[var(--w-green)]" title={t('meeting2.inRoom')} />}
                </span>
                <span className="min-w-0 flex-1 truncate">{userName(a.user)}{!a.invited && <span className="ml-1 text-[11.5px] text-[var(--w-text-3)]">({t('meeting2.walkIn')})</span>}</span>
                {a.rsvp && <Pill tone={RSVP_TONE[a.rsvp]} title={a.rsvpNote ?? undefined}>{t(K(`meeting2.rsvp_${a.rsvp}`))}</Pill>}
                {r.can.chair ? (
                  <Select className="h-7 w-[124px] shrink-0 py-0 text-[12.5px]" aria-label={t('meeting2.markFor', { name: userName(a.user) })} value={a.attendance ?? ''} disabled={mark.isPending}
                    onChange={(e) => mark.mutate({ userId: a.userId, attendance: (e.target.value || null) as Attendance | null })} data-testid={`k2-mark-${a.user.username}`}>
                    <option value="">{t('meeting2.notMarked')}</option>
                    {ATTS.map((x) => <option key={x} value={x}>{t(K(`meeting2.att_${x}`))}</option>)}
                  </Select>
                ) : a.attendance ? <Pill tone={ATT_TONE[a.attendance]}>{t(K(`meeting2.att_${a.attendance}`))}</Pill> : null}
              </li>
            ))}
          </ul>
        ) : <p className="text-[13px] text-[var(--w-text-3)]">{t('meeting2.nobody')}</p>}
        <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{t('meeting2.attendanceHint')}</p>
      </Section>
    </>
  );
}

// ═══ CỘT CHÍNH ═════════════════════════════════════════════════════

export function MeetingK2Main({ config, m }: { config: ProjectConfig; m: MD }) {
  const q = useRoom(config.id, m.number);
  if (!q.data) return null;
  return (
    <>
      <RecordingBanner config={config} m={m} r={q.data} />
      <AgendaCard config={config} m={m} r={q.data} />
      <RecordingCard config={config} m={m} r={q.data} />
      <TranscriptCard config={config} m={m} r={q.data} />
      <MinutesAiCard config={config} m={m} r={q.data} />
    </>
  );
}

// ─── Banner "đang ghi" + hỏi đồng ý ──────────────────────────────

function RecordingBanner({ config, m, r }: { config: ProjectConfig; m: MD; r: Room }) {
  const { t } = useWT();
  const done = useK2Invalidate(config.id);
  const consent = useMutation({
    mutationFn: (v: { rid: number; agree: boolean }) => k2Api.consent(config.id, m.number, v.rid, v.agree),
    onSuccess: (x) => done(x),
    onError: (e) => toast.error(workError(e)),
  });
  const meId = r.meId;
  const live = r.recordings.filter((x) => ACTIVE.has(x.status));
  if (!live.length) return null;
  return (
    <div className="space-y-2" aria-live="polite">
      {live.map((rec) => {
        const mine = rec.mine;
        const decided = rec.consents.find((c) => c.userId === meId);
        const askMe = !mine && r.me?.present && !decided;
        const starter = r.attendees.find((a) => a.userId === rec.startedById)?.user;
        return (
          <div key={rec.id} role="status" data-testid="k2-rec-banner"
            className={cn('flex min-w-0 flex-wrap items-center gap-2 rounded-[8px] border px-3 py-2.5 text-[13px]',
              rec.status === 'RECORDING' ? 'border-[var(--w-red)] bg-[var(--w-sunken)]' : 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]')}>
            {rec.status === 'RECORDING'
              ? <span className="flex items-center gap-1.5 font-semibold text-[var(--w-red-text)]"><Circle size={10} className="animate-pulse fill-current" aria-hidden /> {t('meeting2.recNow')}</span>
              : <span className="flex items-center gap-1.5 font-semibold"><Mic size={14} aria-hidden /> {t('meeting2.consentAsk', { name: starter ? userName(starter) : '…' })}</span>}
            <span className="min-w-0 flex-1 text-[var(--w-text-2)]">{rec.status === 'RECORDING' ? t('meeting2.recNowBody') : t('meeting2.consentBody')}</span>
            {askMe && (
              <span className="flex gap-1.5">
                <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={consent.isPending} onClick={() => consent.mutate({ rid: rec.id, agree: true })} data-testid="k2-consent-yes">{t('meeting2.agree')}</button>
                <button type="button" className="w-btn w-btn-sm" disabled={consent.isPending} onClick={() => consent.mutate({ rid: rec.id, agree: false })} data-testid="k2-consent-no">{t('meeting2.decline')}</button>
              </span>
            )}
            {decided && !mine && <Pill tone={decided.decision === 'AGREED' ? 'green' : 'red'}>{decided.decision === 'AGREED' ? t('meeting2.youAgreed') : t('meeting2.youDeclined')}</Pill>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Agenda có cấu trúc ──────────────────────────────────────────

type ARow = { id?: string; title: string; presenterId: number | null; minutes: string; ref: string };

function AgendaCard({ config, m, r }: { config: ProjectConfig; m: MD; r: Room }) {
  const { t } = useWT();
  const done = useK2Invalidate(config.id);
  const [editing, setEditing] = useState(false);
  const toRows = (): ARow[] => r.agenda.map((a) => ({ id: a.id, title: a.title, presenterId: a.presenterId, minutes: a.minutes ? String(a.minutes) : '', ref: a.ref ?? '' }));
  const [rows, setRows] = useState<ARow[]>(toRows);
  const save = useMutation({
    mutationFn: () => k2Api.setAgenda(config.id, m.number, rows.filter((x) => x.title.trim()).map((x) => ({ id: x.id, title: x.title.trim(), presenterId: x.presenterId, minutes: x.minutes ? Number(x.minutes) : null, ref: x.ref.trim() || null }))),
    onSuccess: (x) => { done(x); setEditing(false); toast.success(t('meeting2.agendaSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const refLink = (a: AgendaItem) => {
    const i = a.refInfo;
    if (!i || !a.ref) return null;
    if (i.kind === 'issue') return <Link href={`${base}/issue/${i.number}`} className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{a.ref.toUpperCase()}</Link>;
    if (i.kind === 'page') return <Link href={`${base}/docs/${i.number}`} className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{a.ref.toUpperCase()}</Link>;
    if (i.kind === 'url') return <a href={i.url} target="_blank" rel="noopener noreferrer" className="max-w-[220px] truncate text-[12px] text-[var(--w-accent-text)] hover:underline">{a.ref}</a>;
    return <span className="text-[12px] text-[var(--w-text-3)]">{a.ref}</span>;
  };
  const presenter = (id: number | null) => (id ? config.members.find((x) => x.id === id) : null);
  return (
    <Section
      title={<span className="flex items-center gap-1.5">{t('meeting2.agendaItems')}{r.agendaMinutes > 0 && <span className="w-count">{t('meeting2.nMin', { n: r.agendaMinutes })}</span>}</span>}
      action={r.can.edit && (editing ? (
        <>
          <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(false)}>{t('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="k2-agenda-save">{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {t('common.save')}</button>
        </>
      ) : <button type="button" className="w-btn w-btn-sm" onClick={() => { setRows(r.agenda.length ? toRows() : [{ title: '', presenterId: null, minutes: '', ref: '' }]); setEditing(true); }} data-testid="k2-agenda-edit"><Pencil size={13} /> {t('common.edit')}</button>)}
    >
      {editing ? (
        <div className="space-y-2">
          {rows.map((x, i) => (
            <div key={x.id ?? `n${i}`} className="grid grid-cols-1 gap-2 rounded-[8px] border border-[var(--w-border)] p-2 md:grid-cols-[minmax(0,1fr)_150px_76px_130px_auto] md:items-center md:border-0 md:p-0">
              <input className="w-input min-w-0" value={x.title} maxLength={300} placeholder={t('meeting2.itemPh')} aria-label={t('meeting2.item')} onChange={(e) => setRows((a) => a.map((y, j) => (j === i ? { ...y, title: e.target.value } : y)))} />
              <Select aria-label={t('meeting2.presenter')} value={x.presenterId ?? ''} onChange={(e) => setRows((a) => a.map((y, j) => (j === i ? { ...y, presenterId: e.target.value ? Number(e.target.value) : null } : y)))}>
                <option value="">{t('meeting2.noPresenter')}</option>
                {config.members.filter((p) => p.role !== 'CLIENT').map((p) => <option key={p.id} value={p.id}>{userName(p)}</option>)}
              </Select>
              <input className="w-input" inputMode="numeric" value={x.minutes} placeholder={t('meeting2.minPh')} aria-label={t('meeting2.minutes')} onChange={(e) => setRows((a) => a.map((y, j) => (j === i ? { ...y, minutes: e.target.value.replace(/\D/g, '').slice(0, 3) } : y)))} />
              <input className="w-input min-w-0" value={x.ref} maxLength={500} placeholder={t('meeting2.refPh', { key: config.key })} aria-label={t('meeting2.ref')} onChange={(e) => setRows((a) => a.map((y, j) => (j === i ? { ...y, ref: e.target.value } : y)))} />
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm justify-self-end" aria-label={t('meeting2.removeItem')} onClick={() => setRows((a) => a.filter((_, j) => j !== i))}><X size={13} /></button>
            </div>
          ))}
          <button type="button" className="w-btn w-btn-sm" disabled={rows.length >= 50} onClick={() => setRows((a) => [...a, { title: '', presenterId: null, minutes: '', ref: '' }])}><Plus size={13} /> {t('meeting2.addItem')}</button>
        </div>
      ) : r.agenda.length ? (
        <ol className="space-y-1.5" data-testid="k2-agenda">
          {r.agenda.map((a, i) => (
            <li key={a.id} className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px]">
              <span className="w-5 shrink-0 text-right tabular-nums text-[var(--w-text-3)]">{i + 1}.</span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{a.title}</span>
              {presenter(a.presenterId) && <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-2)]"><UserAvatar user={presenter(a.presenterId)!} size={16} />{userName(presenter(a.presenterId)!)}</span>}
              {a.minutes ? <span className="text-[12px] tabular-nums text-[var(--w-text-3)]">{t('meeting2.nMin', { n: a.minutes })}</span> : null}
              {refLink(a)}
            </li>
          ))}
        </ol>
      ) : <p className="text-[13px] text-[var(--w-text-3)]">{t('meeting2.noAgendaItems')}</p>}
    </Section>
  );
}

// ─── Ghi âm ──────────────────────────────────────────────────────

const STATUS_TONE: Record<RoomRecording['status'], 'red' | 'accent' | 'green' | 'neutral'> = { RECORDING: 'red', CONSENT: 'accent', ENDED: 'green', STOPPED: 'neutral' };

function RecordingCard({ config, m, r }: { config: ProjectConfig; m: MD; r: Room }) {
  const { t, fmtDate } = useWT();
  const pid = config.id;
  const done = useK2Invalidate(pid);
  const myLive = r.recordings.find((x) => x.mine && x.source === 'LIVE' && ACTIVE.has(x.status)) ?? null;
  const [speakerId, setSpeakerId] = useState<number | null>(null);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploadState, setUploadState] = useState<{ done: number; total: number } | null>(null);
  const [link, setLink] = useState(r.recordingUrl ?? '');
  const fileRef = useRef<HTMLInputElement>(null);
  const ridRef = useRef<number | null>(myLive?.id ?? null);
  useEffect(() => { ridRef.current = myLive?.id ?? ridRef.current; }, [myLive?.id]);
  const recorder = useMeetingRecorder({
    speakerId,
    upload: (c) => k2Api.uploadChunk(pid, m.number, ridRef.current!, c.blob, { seq: c.seq, startMs: c.startMs, durationMs: c.durationMs, speakerId: c.speakerId, fileName: c.fileName }),
  });
  const ask = useMutation({
    mutationFn: () => k2Api.startRecording(pid, m.number, { source: 'LIVE' }),
    onSuccess: (x) => { ridRef.current = x.recordingId; done(x.room); },
    onError: (e) => toast.error(workError(e)),
  });
  const begin = useMutation({
    mutationFn: async (rid: number) => {
      const room = await k2Api.begin(pid, m.number, rid);
      ridRef.current = rid;
      const ok = await recorder.start();
      if (!ok) { await k2Api.end(pid, m.number, rid).catch(() => {}); throw new Error('mic'); }
      return room;
    },
    onSuccess: (x) => done(x),
    onError: (e) => { if ((e as Error).message !== 'mic') toast.error(workError(e)); },
  });
  const end = useMutation({
    mutationFn: async (rid: number) => { await recorder.stop(); return k2Api.end(pid, m.number, rid); },
    onSuccess: (x) => { done(x); toast.success(t('meeting2.recStopped')); },
    onError: (e) => toast.error(workError(e)),
  });
  const retry = useMutation({ mutationFn: (rid: number) => k2Api.retry(pid, m.number, rid), onSuccess: (x) => { done(); toast.success(t('meeting2.retryQueued', { count: x.queued })); }, onError: (e) => toast.error(workError(e)) });
  const del = useMutation({ mutationFn: (rid: number) => k2Api.deleteAudio(pid, m.number, rid), onSuccess: (x) => { done(x); toast.success(t('meeting2.audioDeleted')); }, onError: (e) => toast.error(workError(e)) });
  const saveLink = useMutation({ mutationFn: () => k2Api.setRecordingLink(pid, m.number, link.trim() || null), onSuccess: (x) => { done(x); toast.success(t('meeting2.linkSaved')); }, onError: (e) => toast.error(workError(e)) });

  // Máy ghi chết (tab bị đóng giữa chừng) mà lượt ghi vẫn RECORDING ⇒ cho người ghi tiếp tục / dừng.
  const stale = myLive?.status === 'RECORDING' && recorder.state === 'idle';

  async function onFile(f: File | undefined) {
    if (!f) return;
    if (!confirmUpload) { toast.error(t('meeting2.confirmFirst')); return; }
    try {
      setUploadState({ done: 0, total: 0 });
      const parts = await splitAudioFile(f);
      const { recordingId } = await k2Api.startRecording(pid, m.number, { source: 'UPLOAD', fileName: f.name, confirmConsent: true });
      setUploadState({ done: 0, total: parts.length });
      for (const [i, p] of parts.entries()) {
        for (let attempt = 0; ; attempt++) {
          try { await k2Api.uploadChunk(pid, m.number, recordingId, p.blob, { seq: i, startMs: p.startMs, durationMs: p.durationMs, fileName: p.fileName }); break; } catch (err) {
            if (attempt >= 4) throw err;
            await new Promise((res) => setTimeout(res, 2000 * (attempt + 1)));
          }
        }
        setUploadState({ done: i + 1, total: parts.length });
      }
      done(await k2Api.end(pid, m.number, recordingId));
      toast.success(t('meeting2.uploaded'));
    } catch (e) {
      toast.error((e as Error).message === 'decode' ? t('meeting2.decodeFail') : workError(e));
    } finally {
      setUploadState(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const people = r.attendees;
  const nameOf = (id: number) => { const a = people.find((x) => x.userId === id); return a ? userName(a.user) : `#${id}`; };
  const micErr = recorder.error ? t(K(`meeting2.mic_${recorder.error}`)) : null;

  return (
    <Section title={<span className="flex items-center gap-1.5"><Mic size={14} /> {t('meeting2.recording')}</span>}>
      {!r.sttConfigured && <p className="mb-3 flex items-start gap-1.5 rounded-[6px] bg-[var(--w-sunken)] px-2.5 py-2 text-[12.5px] text-[var(--w-text-2)]"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--w-orange-text)]" />{t('meeting2.noKey')}</p>}
      {micErr && <p className="mb-3 text-[12.5px] text-[var(--w-red-text)]" role="alert">{micErr}</p>}

      {r.can.record && m.status !== 'CANCELLED' && (
        <div className="space-y-3">
          {!myLive && (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="w-btn w-btn-primary" disabled={ask.isPending || r.recordings.some((x) => x.source === 'LIVE' && ACTIVE.has(x.status))} onClick={() => ask.mutate()} data-testid="k2-rec-ask">
                {ask.isPending ? <Spinner size={12} /> : <Mic size={14} />} {t('meeting2.recAsk')}
              </button>
              <span className="text-[12px] text-[var(--w-text-3)]">{t('meeting2.recAskHint')}</span>
            </div>
          )}
          {myLive?.status === 'CONSENT' && (
            <div className="rounded-[8px] border border-[var(--w-border)] p-3 text-[13px]" data-testid="k2-consent-panel">
              <div className="mb-2 font-medium">{t('meeting2.waitingConsent')}</div>
              <ul className="mb-2 flex flex-wrap gap-1.5">
                {myLive.consent.agreed.map((u) => <li key={`a${u}`}><Pill tone="green">{nameOf(u)}</Pill></li>)}
                {myLive.consent.waiting.map((u) => <li key={`w${u}`}><Pill tone="neutral">{nameOf(u)} · {t('meeting2.waiting')}</Pill></li>)}
                {myLive.consent.declined.map((u) => <li key={`d${u}`}><Pill tone="red">{nameOf(u)} · {t('meeting2.declined')}</Pill></li>)}
              </ul>
              <p className="mb-2 text-[12px] text-[var(--w-text-3)]">{t('meeting2.externalNote')}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="w-btn w-btn-primary" disabled={!myLive.consent.canBegin || begin.isPending} onClick={() => begin.mutate(myLive.id)} data-testid="k2-rec-begin">
                  {begin.isPending ? <Spinner size={12} /> : <Circle size={12} className="fill-current text-[var(--w-red-text)]" />} {t('meeting2.recBegin')}
                </button>
                <button type="button" className="w-btn" disabled={end.isPending} onClick={() => end.mutate(myLive.id)}>{t('common.cancel')}</button>
              </div>
            </div>
          )}
          {myLive?.status === 'RECORDING' && (
            <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-red)] p-3" data-testid="k2-rec-live">
              <span className="flex items-center gap-1.5 font-mono text-[14px] font-semibold text-[var(--w-red-text)]" aria-live="off"><Circle size={10} className="animate-pulse fill-current" aria-hidden /> REC {fmtClock(recorder.elapsed)}</span>
              <Select className="w-auto max-w-[200px]" aria-label={t('meeting2.speaking')} value={speakerId ?? ''} onChange={(e) => setSpeakerId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">{t('meeting2.speakerMe')}</option>
                {people.map((a) => <option key={a.userId} value={a.userId}>{userName(a.user)}</option>)}
              </Select>
              <span className="text-[12px] text-[var(--w-text-3)]">{recorder.pending ? t('meeting2.uploading', { n: recorder.pending }) : t('meeting2.uploadedN', { n: recorder.uploaded })}{recorder.retrying ? ` · ${t('meeting2.retrying')}` : ''}</span>
              {stale
                ? <button type="button" className="w-btn ml-auto" onClick={() => void recorder.start()}><Mic size={14} /> {t('meeting2.resume')}</button>
                : null}
              <button type="button" className={cn('w-btn w-btn-danger', !stale && 'ml-auto')} disabled={end.isPending} onClick={() => end.mutate(myLive.id)} data-testid="k2-rec-stop">{end.isPending ? <Spinner size={12} /> : <Square size={13} />} {t('meeting2.recStop')}</button>
            </div>
          )}
          <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] p-3">
            <label className="flex items-start gap-2 text-[12.5px]">
              <input type="checkbox" className="mt-0.5" checked={confirmUpload} onChange={(e) => setConfirmUpload(e.target.checked)} data-testid="k2-upload-confirm" />
              <span>{t('meeting2.uploadConfirm')}</span>
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input ref={fileRef} type="file" accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/m4a,audio/webm,audio/ogg,audio/wav,audio/x-wav,.mp3,.m4a,.webm,.wav,.ogg" className="sr-only" id="k2-upload" onChange={(e) => void onFile(e.target.files?.[0])} disabled={!confirmUpload || !!uploadState} data-testid="k2-upload-input" />
              <label htmlFor="k2-upload" className={cn('w-btn', (!confirmUpload || uploadState) && 'pointer-events-none opacity-50')} aria-disabled={!confirmUpload || !!uploadState}>
                {uploadState ? <Spinner size={12} /> : <Upload size={14} />} {t('meeting2.uploadFile')}
              </label>
              {uploadState && <span className="text-[12px] text-[var(--w-text-3)]">{uploadState.total ? t('meeting2.uploadProgress', { a: uploadState.done, b: uploadState.total }) : t('meeting2.preparing')}</span>}
            </div>
          </div>
        </div>
      )}

      {r.recordings.length > 0 && (
        <ul className="mt-4 space-y-2" data-testid="k2-recordings">
          {r.recordings.filter((x) => x.progress.total > 0 || ACTIVE.has(x.status)).map((x) => (
            <li key={x.id} className="rounded-[8px] border border-[var(--w-border)] p-2.5 text-[13px]">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <FileAudio size={14} className="shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 flex-1 truncate">{x.source === 'UPLOAD' ? (x.fileName ?? t('meeting2.uploadedFile')) : t('meeting2.liveRec', { t: fmtDate(x.startedAt ?? x.createdAt) })} · {fmtClock(x.durationMs)}</span>
                <Pill tone={STATUS_TONE[x.status]}>{t(K(`meeting2.rs_${x.status}`))}</Pill>
              </div>
              {x.progress.total > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-label={t('meeting2.transcribing')} aria-valuenow={x.progress.percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full bg-[var(--w-accent)]" style={{ width: `${x.progress.percent}%` }} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-3)]">
                    <span>{t('meeting2.progress', { a: x.progress.done, b: x.progress.total })}</span>
                    {x.progress.failed > 0 && <span className="text-[var(--w-red-text)]">{t('meeting2.nFailed', { n: x.progress.failed })}</span>}
                    {x.progress.noKey > 0 && <span>{t('meeting2.nNoKey', { n: x.progress.noKey })}</span>}
                    {x.progress.limit > 0 && <span>{t('meeting2.nLimit', { n: x.progress.limit })}</span>}
                    {x.audioDeleted ? <span>{t('meeting2.audioGone')}</span> : x.expiresAt ? <span>{t('meeting2.expires', { d: fmtDate(x.expiresAt) })}</span> : null}
                    <span className="ml-auto flex gap-1">
                      {r.can.edit && (x.progress.failed + x.progress.noKey + x.progress.limit) > 0 && !x.audioDeleted && <button type="button" className="w-btn w-btn-sm" disabled={retry.isPending} onClick={() => retry.mutate(x.id)}><RefreshCw size={12} /> {t('meeting2.retry')}</button>}
                      {(r.can.chair || x.mine) && !x.audioDeleted && !ACTIVE.has(x.status) && <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={del.isPending} onClick={() => { if (window.confirm(t('meeting2.deleteAudioQ'))) del.mutate(x.id); }} data-testid="k2-del-audio"><Trash2 size={12} /> {t('meeting2.deleteAudio')}</button>}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <label className="mb-1 block text-[12.5px] font-medium text-[var(--w-text-2)]" htmlFor="k2-link">{t('meeting2.extLink')}</label>
        {r.can.edit ? (
          <div className="flex gap-1.5">
            <input id="k2-link" className="w-input min-w-0 flex-1" value={link} maxLength={500} placeholder="https://drive.google.com/…" onChange={(e) => setLink(e.target.value)} />
            <button type="button" className="w-btn" disabled={saveLink.isPending || link.trim() === (r.recordingUrl ?? '')} onClick={() => saveLink.mutate()}>{t('common.save')}</button>
          </div>
        ) : r.recordingUrl ? <a id="k2-link" href={r.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--w-accent-text)] hover:underline [overflow-wrap:anywhere]">{r.recordingUrl}</a> : <p className="text-[13px] text-[var(--w-text-3)]">—</p>}
      </div>
      <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{t('meeting2.privacy', { d: r.settings.audioRetentionDays })}</p>
    </Section>
  );
}

// ─── Transcript ──────────────────────────────────────────────────

function TranscriptCard({ config, m, r }: { config: ProjectConfig; m: MD; r: Room }) {
  const { t } = useWT();
  const pid = config.id;
  const has = r.recordings.some((x) => x.progress.done > 0);
  const progressKey = r.recordings.map((x) => `${x.id}:${x.progress.done}`).join(',');
  const q = useQuery({ queryKey: [...k2Keys.transcript(pid, m.number), progressKey], queryFn: () => k2Api.transcript(pid, m.number), enabled: has });
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const assign = useMutation({
    mutationFn: (v: { rid: number; lineId: string; speakerId: number | null }) => k2Api.assignSpeakers(pid, m.number, v.rid, [{ lineId: v.lineId, speakerId: v.speakerId }]),
    onSuccess: (x) => qc.setQueryData([...k2Keys.transcript(pid, m.number), progressKey], x),
    onError: (e) => toast.error(workError(e)),
  });
  const people = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>();
    for (const a of r.attendees) map.set(a.userId, { id: a.userId, name: userName(a.user) });
    for (const s of q.data?.speakers ?? []) if (!map.has(s.id)) map.set(s.id, { id: s.id, name: userName(s) });
    return [...map.values()];
  }, [r.attendees, q.data?.speakers]);
  async function play(rid: number, seq: number, offsetMs: number, chunkStart: number) {
    try {
      const a = await k2Api.chunkAudio(pid, m.number, rid, seq);
      const el = audioRef.current ?? new Audio();
      audioRef.current = el;
      el.src = a.url;
      el.currentTime = Math.max(0, (offsetMs - chunkStart) / 1000);
      await el.play();
    } catch (e) {
      toast.error(workError(e, t('meeting2.playFail')));
    }
  }
  useEffect(() => () => { audioRef.current?.pause(); }, []);
  if (!has) return null;
  const f = filter.trim().toLowerCase();
  return (
    <Section
      title={<span className="flex items-center gap-1.5">{t('meeting2.transcript')}</span>}
      action={<>
        <input className="w-input h-7 w-[160px] text-[12.5px]" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t('meeting2.searchPh')} aria-label={t('meeting2.search')} />
        <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? t('meeting2.collapse') : t('meeting2.expand')}</button>
      </>}
    >
      {!open ? null : q.isLoading ? <Spinner size={14} /> : (
        <div className="max-h-[480px] space-y-4 overflow-y-auto pr-1" data-testid="k2-transcript">
          {q.data?.recordings.filter((x) => x.lines.length).map((rec) => {
            const chunkStart = (seq: number) => r.recordings.find((x) => x.id === rec.id)?.chunks.find((c) => c.seq === seq)?.startMs ?? 0;
            const canPlay = (seq: number) => !!r.recordings.find((x) => x.id === rec.id)?.chunks.find((c) => c.seq === seq)?.hasAudio;
            return (
              <ol key={rec.id} className="space-y-1.5">
                {rec.lines.filter((l) => !f || l.text.toLowerCase().includes(f)).map((l) => (
                  <li key={l.id} className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-2 text-[13px]">
                    <button type="button" className="mt-0.5 flex items-center gap-1 font-mono text-[11.5px] tabular-nums text-[var(--w-accent-text)] hover:underline disabled:text-[var(--w-text-3)] disabled:no-underline"
                      disabled={!canPlay(l.seq)} onClick={() => void play(rec.id, l.seq, l.startMs, chunkStart(l.seq))} aria-label={t('meeting2.playAt', { t: l.at })}>
                      <Play size={10} aria-hidden /> {l.at}
                    </button>
                    {r.can.edit ? (
                      <select className="h-6 max-w-[120px] truncate rounded-[5px] border border-[var(--w-border)] bg-[var(--w-panel)] px-1 text-[12px] text-[var(--w-text-2)]" value={l.speakerId ?? ''} aria-label={t('meeting2.speakerOf', { n: l.n })}
                        onChange={(e) => assign.mutate({ rid: rec.id, lineId: l.id, speakerId: e.target.value ? Number(e.target.value) : null })}>
                        <option value="">{t('meeting2.speakerUnknown')}</option>
                        {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ) : <span className="text-[12px] font-medium text-[var(--w-text-2)]">{people.find((p) => p.id === l.speakerId)?.name ?? t('meeting2.speakerUnknown')}</span>}
                    <span className="[overflow-wrap:anywhere]"><span className="mr-1 text-[11px] text-[var(--w-text-3)]">L{l.n}</span>{l.text}</span>
                  </li>
                ))}
              </ol>
            );
          })}
        </div>
      )}
      <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{t('meeting2.whisperNote')}</p>
    </Section>
  );
}

// ─── Biên bản AI ─────────────────────────────────────────────────

function MinutesAiCard({ config, m, r }: { config: ProjectConfig; m: MD; r: Room }) {
  const { t, locale, fmtDateTime } = useWT();
  const pid = config.id;
  const done = useK2Invalidate(pid);
  const [lang, setLang] = useState<'vi' | 'en'>(locale === 'en' ? 'en' : 'vi');
  const [exportLang, setExportLang] = useState<'vi' | 'en'>(locale === 'en' ? 'en' : 'vi');
  const has = r.recordings.some((x) => x.progress.done > 0);
  const propose = useMutation({
    mutationFn: () => k2Api.propose(pid, m.number, lang),
    onSuccess: (x) => { done(); toast.success(x.content.unsupportedCount ? t('meeting2.draftReadyWarn', { n: x.content.unsupportedCount }) : t('meeting2.draftReady')); },
    onError: (e) => toast.error(isAiQuotaError(e) ? t('meeting2.aiQuota') : workError(e)),
  });
  const exp = useMutation({ mutationFn: (f: 'docx' | 'pdf') => k2Api.exportMinutes(pid, m.number, f, exportLang), onError: (e) => toast.error(workError(e, t('meeting2.exportFail'))) });
  const proposed = r.drafts.filter((d) => d.status === 'PROPOSED');
  const history = r.drafts.filter((d) => d.status !== 'PROPOSED');
  return (
    <Section
      title={<span className="flex items-center gap-1.5"><Sparkles size={14} /> {t('meeting2.aiMinutes')}</span>}
      action={<>
        <Select className="h-7 w-auto py-0 text-[12.5px]" aria-label={t('meeting2.exportLang')} value={exportLang} onChange={(e) => setExportLang(e.target.value as 'vi' | 'en')}>
          <option value="vi">Tiếng Việt</option><option value="en">English</option>
        </Select>
        <button type="button" className="w-btn w-btn-sm" disabled={exp.isPending} onClick={() => exp.mutate('docx')} data-testid="k2-export-docx"><Download size={13} /> .docx</button>
        <button type="button" className="w-btn w-btn-sm" disabled={exp.isPending} onClick={() => exp.mutate('pdf')} data-testid="k2-export-pdf"><Download size={13} /> PDF</button>
      </>}
    >
      <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{t('meeting2.aiIntro')}</p>
      {r.can.ai && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select className="w-auto" aria-label={t('meeting2.minutesLang')} value={lang} onChange={(e) => setLang(e.target.value as 'vi' | 'en')}>
            <option value="vi">Tiếng Việt</option><option value="en">English</option>
          </Select>
          <button type="button" className="w-btn w-btn-primary" disabled={!has || propose.isPending} onClick={() => propose.mutate()} title={!has ? t('meeting2.needTranscript') : undefined} data-testid="k2-ai-propose">
            {propose.isPending ? <Spinner size={12} /> : <Sparkles size={14} />} {t('meeting2.aiPropose')}
          </button>
          {!has && <span className="text-[12px] text-[var(--w-text-3)]">{t('meeting2.needTranscript')}</span>}
        </div>
      )}
      {proposed.map((d) => <DraftView key={d.id} config={config} m={m} r={r} d={d} />)}
      {history.length > 0 && (
        <details className="mt-3 text-[12.5px] text-[var(--w-text-3)]">
          <summary className="cursor-pointer">{t('meeting2.history', { n: history.length })}</summary>
          <ul className="mt-1.5 space-y-1">{history.map((d) => <li key={d.id}>#{d.id} · {t(K(`meeting2.ds_${d.status}`))} · {fmtDateTime(d.decidedAt ?? d.createdAt)}</li>)}</ul>
        </details>
      )}
    </Section>
  );
}

function EvidenceList({ items, nameOf }: { items: Evidence[]; nameOf: (id: number | null) => string }) {
  const { t } = useWT();
  if (!items.length) return <span className="ml-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--w-orange-text)]"><AlertTriangle size={11} /> {t('meeting2.noEvidence')}</span>;
  return (
    <details className="mt-0.5">
      <summary className="cursor-pointer text-[11.5px] text-[var(--w-accent-text)]">{t('meeting2.evidenceN', { count: items.length })}</summary>
      <ul className="mt-1 space-y-0.5 border-l-2 border-[var(--w-border)] pl-2">
        {items.map((e) => <li key={e.lineId} className="text-[12px] text-[var(--w-text-2)]"><span className="font-mono text-[11px] text-[var(--w-text-3)]">L{e.n} {e.at} · {nameOf(e.speakerId)}</span> “{e.quote}”</li>)}
      </ul>
    </details>
  );
}

function DraftView({ config, m, r, d }: { config: ProjectConfig; m: MD; r: Room; d: MinutesDraft }) {
  const { t } = useWT();
  const pid = config.id;
  const done = useK2Invalidate(pid);
  const c = d.content;
  const [skipD, setSkipD] = useState<Set<number>>(() => new Set((c?.decisions ?? []).flatMap((x, i) => (x.unsupported ? [i] : []))));
  const [skipA, setSkipA] = useState<Set<number>>(() => new Set((c?.actions ?? []).flatMap((x, i) => (x.unsupported ? [i] : []))));
  const [createIssues, setCreateIssues] = useState(true);
  const apply = useMutation({
    mutationFn: () => k2Api.apply(pid, m.number, d.id, { skipDecisions: [...skipD], skipActions: [...skipA], createIssues }),
    onSuccess: (x) => { done(x.room); toast.success(x.created.length ? t('meeting2.appliedIssues', { keys: x.created.map((y) => y.key).join(', ') }) : t('meeting2.applied')); },
    onError: (e) => toast.error(workError(e)),
  });
  const dismiss = useMutation({ mutationFn: () => k2Api.dismiss(pid, m.number, d.id), onSuccess: (x) => done(x), onError: (e) => toast.error(workError(e)) });
  if (!c) return null;
  const nameOf = (id: number | null) => (id ? (r.attendees.find((a) => a.userId === id) ? userName(r.attendees.find((a) => a.userId === id)!.user) : `#${id}`) : t('meeting2.speakerUnknown'));
  const toggle = (set: Set<number>, i: number, fn: (s: Set<number>) => void) => { const n = new Set(set); if (n.has(i)) n.delete(i); else n.add(i); fn(n); };
  return (
    <div className="rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-3 text-[13px]" data-testid="k2-draft">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Pill tone="accent">{t('meeting2.proposal')}</Pill>
        <span className="text-[12px] text-[var(--w-text-3)]">{d.language === 'en' ? 'English' : 'Tiếng Việt'} · {t('meeting2.fromLines', { n: c.lineCount })}{c.truncated ? ` · ${t('meeting2.truncated')}` : ''}</span>
        {c.unsupportedCount > 0 && <Pill tone="orange">{t('meeting2.unsupportedN', { n: c.unsupportedCount })}</Pill>}
      </div>
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]">{t('meeting2.summary')}</h3>
      <p className="mb-3 whitespace-pre-wrap [overflow-wrap:anywhere]">{c.summary || '—'}</p>
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]">{t('meeting2.decisions')}</h3>
      {c.decisions.length ? (
        <ul className="mb-3 space-y-1.5">
          {c.decisions.map((x, i) => (
            <li key={i} className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" checked={!skipD.has(i)} disabled={!r.can.chair} onChange={() => toggle(skipD, i, setSkipD)} aria-label={x.text} />
              <div className="min-w-0 flex-1"><span className="[overflow-wrap:anywhere]">{x.text}</span><EvidenceList items={x.evidence} nameOf={nameOf} /></div>
            </li>
          ))}
        </ul>
      ) : <p className="mb-3 text-[var(--w-text-3)]">—</p>}
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]">{t('meeting2.actions')}</h3>
      {c.actions.length ? (
        <ul className="mb-3 space-y-1.5">
          {c.actions.map((x, i) => (
            <li key={i} className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" checked={!skipA.has(i)} disabled={!r.can.chair} onChange={() => toggle(skipA, i, setSkipA)} aria-label={x.text} />
              <div className="min-w-0 flex-1">
                <span className="[overflow-wrap:anywhere]">{x.text}</span>
                <span className="ml-2 text-[12px] text-[var(--w-text-3)]">{x.ownerName ? `@${x.ownerName}${x.ownerId ? '' : ` (${t('meeting2.notMember')})`}` : t('meeting2.noOwner')}{x.due ? ` · ${x.due}` : ''}</span>
                <EvidenceList items={x.evidence} nameOf={nameOf} />
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="mb-3 text-[var(--w-text-3)]">—</p>}
      <h3 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]">{t('meeting2.openIssues')}</h3>
      {c.openIssues.length ? (
        <ul className="mb-3 list-disc space-y-1 pl-5">{c.openIssues.map((x, i) => <li key={i}><span className="[overflow-wrap:anywhere]">{x.text}</span><EvidenceList items={x.evidence} nameOf={nameOf} /></li>)}</ul>
      ) : <p className="mb-3 text-[var(--w-text-3)]">—</p>}
      {r.can.chair ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-2.5">
          <label className="flex items-center gap-1.5 text-[12.5px]"><input type="checkbox" checked={createIssues} onChange={(e) => setCreateIssues(e.target.checked)} /> {t('meeting2.alsoIssues')}</label>
          <span className="ml-auto flex gap-1.5">
            <button type="button" className="w-btn w-btn-sm" disabled={dismiss.isPending} onClick={() => dismiss.mutate()}>{t('meeting2.dismiss')}</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={apply.isPending} onClick={() => apply.mutate()} data-testid="k2-draft-apply">{apply.isPending ? <Spinner size={12} /> : <CheckCircle2 size={13} />} {t('meeting2.apply')}</button>
          </span>
        </div>
      ) : <p className="border-t border-[var(--w-border)] pt-2 text-[12px] text-[var(--w-text-3)]">{t('meeting2.chairApproves')}</p>}
    </div>
  );
}
