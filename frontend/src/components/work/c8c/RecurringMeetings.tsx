'use client';

/**
 * CTW đợt 8c — HỌP ĐỊNH KỲ (RRULE) + MẪU CHƯƠNG TRÌNH HỌP.
 *   SeriesTab        tab "Recurring" của trang Họp: danh sách chuỗi, tạo chuỗi, dừng chuỗi.
 *   NewSeriesDialog  hằng ngày / hằng tuần (chọn thứ, mỗi n tuần) / hằng tháng (ngày, ngày cuối tháng), giờ, từ–đến, mẫu.
 *   MeetingExtras    trong chi tiết một buổi: "Lặp: …" + sửa buổi này / từ buổi này về sau / cả chuỗi, dừng chuỗi, áp mẫu.
 * Backend: src/routes/work.ctw8c.routes.ts (meetingSeries.service.ts). Sửa MỘT buổi vẫn là PATCH /meetings/:num như cũ —
 * máy chủ tự đánh dấu buổi đó là ngoại lệ.
 */

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, LayoutTemplate, Pencil, Plus, Repeat, Square, Video } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { MEETING_TYPE_LABEL } from '@/lib/work-s3b-api';
import { c8cKeys, meetingSeriesApi, type Freq, type MeetingSeriesInfo, type MeetingTemplate, type SeriesRow } from '@/lib/work-c8c-api';
import { newJitsiUrl } from '@/lib/work-ctw-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { AttendeePicker } from '../governance/MeetingsView';
import { useGovInvalidate } from '../governance/shared';
import { currentWorkLocale, useWT } from '../i18n';

const COMMON_TZ = ['Asia/Ho_Chi_Minh', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'America/New_York', 'UTC'];
const WEEKDAY_KEYS = ['c8c.wdSun', 'c8c.wdMon', 'c8c.wdTue', 'c8c.wdWed', 'c8c.wdThu', 'c8c.wdFri', 'c8c.wdSat'] as const;
const pad = (n: number) => String(n).padStart(2, '0');
const todayPlus = (n: number) => { const d = new Date(Date.now() + n * 86_400_000); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const summaryOf = (s: { summary: string; summaryVi: string }) => (currentWorkLocale() === 'vi' ? s.summaryVi : s.summary);

export function useMeetingTemplates(pid: number) {
  return useQuery({ queryKey: c8cKeys.templates(pid), queryFn: () => meetingSeriesApi.templates(pid), staleTime: 3_600_000 });
}

/** Ô chọn mẫu chương trình (dùng chung: tạo họp, tạo chuỗi, áp mẫu). */
export function TemplateSelect({ pid, value, onChange, allowNone = true, testId }: { pid: number; value: string; onChange: (key: string, t: MeetingTemplate | null) => void; allowNone?: boolean; testId?: string }) {
  const { t } = useWT();
  const q = useMeetingTemplates(pid);
  return (
    <Select aria-label={t('c8c.template')} value={value} onChange={(e) => onChange(e.target.value, q.data?.find((x) => x.key === e.target.value) ?? null)} data-testid={testId}>
      {allowNone && <option value="">{t('c8c.noTemplate')}</option>}
      {(q.data ?? []).map((x) => <option key={x.key} value={x.key}>{t(`c8c.tpl_${x.key.replace(/-/g, '_')}` as never)}</option>)}
    </Select>
  );
}

// ─── Tạo chuỗi ───────────────────────────────────────────────────

export function NewSeriesDialog({ config, open, onClose, portalOn }: { config: ProjectConfig; open: boolean; onClose: () => void; portalOn: boolean }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const invalidate = useGovInvalidate(config.id);
  const browserTz = useMemo(() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh'; } catch { return 'Asia/Ho_Chi_Minh'; } }, []);
  const [tpl, setTpl] = useState('');
  const [title, setTitle] = useState('');
  const [freq, setFreq] = useState<Freq>('WEEKLY');
  const [interval, setInterval] = useState(1);
  const [days, setDays] = useState<number[]>([1]);
  const [monthDay, setMonthDay] = useState(1);
  const [time, setTime] = useState('09:00');
  const [startDate, setStartDate] = useState(todayPlus(1));
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [tz, setTz] = useState(browserTz);
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [ids, setIds] = useState<number[]>([]);
  const [invites, setInvites] = useState(true);
  useEffect(() => { if (open) { setTpl(''); setTitle(''); setIds([]); setStartDate(todayPlus(1)); setEndDate(''); } }, [open]);
  const pickTemplate = (key: string, x: MeetingTemplate | null) => {
    setTpl(key);
    if (!x) return;
    if (!title.trim()) setTitle(t(`c8c.tpl_${x.key.replace(/-/g, '_')}` as never));
    setDuration(x.durationMin);
    setFreq(x.suggest.freq);
    setInterval(x.suggest.interval);
    if (x.suggest.byWeekday?.length) setDays(x.suggest.byWeekday);
  };
  const create = useMutation({
    mutationFn: () => {
      const [h, m] = time.split(':').map(Number);
      return meetingSeriesApi.create(config.id, {
        title: title.trim() || t('c8c.recurringMeeting'), templateKey: tpl || null,
        recurrence: { freq, interval, byWeekday: freq === 'WEEKLY' ? days : [], byMonthDay: freq === 'MONTHLY' ? monthDay : null, hour: h || 0, minute: m || 0, startDate, endDate: endDate || null },
        durationMin: duration, timezone: tz, location: location.trim() || null, meetingUrl: url.trim() || null, attendeeIds: ids, sendInvites: invites,
      });
    },
    onSuccess: (s) => {
      toast.success(t('c8c.seriesCreated', { n: s.upcoming.length }));
      invalidate();
      qc.invalidateQueries({ queryKey: c8cKeys.series(config.id) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, t('c8c.seriesFailed'))),
  });
  const toggleDay = (d: number) => setDays((v) => (v.includes(d) ? (v.length > 1 ? v.filter((x) => x !== d) : v) : [...v, d].sort()));
  return (
    <Dialog
      open={open} onClose={onClose} title={t('c8c.newSeries')} width={640}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!startDate || create.isPending} onClick={() => create.mutate()} data-testid="series-create">{create.isPending ? <Spinner size={12} /> : <Repeat size={13} />} {t('c8c.createSeries')}</button>
      </>}
    >
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_220px]">
        <Field label={t('common.title')}><input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} placeholder={t('c8c.recurringMeeting')} data-testid="series-title" /></Field>
        <Field label={t('c8c.template')} hint={tpl ? t(`c8c.tplDesc_${tpl.replace(/-/g, '_')}` as never) : undefined}><TemplateSelect pid={config.id} value={tpl} onChange={pickTemplate} testId="series-template" /></Field>
      </div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_120px_1fr]">
        <Field label={t('c8c.repeat')}>
          <Select aria-label={t('c8c.repeat')} value={freq} onChange={(e) => setFreq(e.target.value as Freq)} data-testid="series-freq">
            <option value="DAILY">{t('c8c.daily')}</option><option value="WEEKLY">{t('c8c.weekly')}</option><option value="MONTHLY">{t('c8c.monthly')}</option>
          </Select>
        </Field>
        <Field label={t('c8c.every')}>
          <Select aria-label={t('c8c.every')} value={interval} onChange={(e) => setInterval(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </Field>
        <Field label={t('c8c.at')}><input type="time" className="w-input" value={time} onChange={(e) => setTime(e.target.value)} data-testid="series-time" /></Field>
      </div>
      {freq === 'WEEKLY' && (
        <Field label={t('c8c.onDays')}>
          <div className="flex flex-wrap gap-1" role="group" aria-label={t('c8c.onDays')}>
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <button key={d} type="button" aria-pressed={days.includes(d)} onClick={() => toggleDay(d)} className={`h-7 min-w-[40px] rounded-[6px] border px-2 text-[12.5px] ${days.includes(d) ? 'border-[var(--w-accent)] bg-[var(--w-accent-tint,var(--w-active))] font-medium' : 'border-[var(--w-border)] text-[var(--w-text-2)]'}`}>{t(WEEKDAY_KEYS[d])}</button>
            ))}
          </div>
        </Field>
      )}
      {freq === 'MONTHLY' && (
        <Field label={t('c8c.dayOfMonth')}>
          <Select aria-label={t('c8c.dayOfMonth')} value={monthDay} onChange={(e) => setMonthDay(Number(e.target.value))}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            <option value={-1}>{t('c8c.lastDay')}</option>
          </Select>
        </Field>
      )}
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-4">
        <Field label={t('c8c.from')}><input type="date" className="w-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
        <Field label={t('c8c.until')} hint={t('c8c.untilHint')}><input type="date" className="w-input" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
        <Field label={t('gov.length')}>
          <Select aria-label={t('gov.length')} value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {[15, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m < 60 ? t('gov.minH', { m }) : t('gov.hrH', { h: m / 60 })}</option>)}
          </Select>
        </Field>
        <Field label={t('gov.timeZone')}>
          <Select aria-label={t('gov.timeZone')} value={tz} onChange={(e) => setTz(e.target.value)}>{[...new Set([browserTz, ...COMMON_TZ])].map((z) => <option key={z} value={z}>{z}</option>)}</Select>
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <Field label={t('gov.locationOpt')}><input className="w-input" value={location} maxLength={255} onChange={(e) => setLocation(e.target.value)} /></Field>
        <Field label={t('gov.videoOpt')}>
          <div className="flex gap-1.5">
            <input className="w-input min-w-0 flex-1" value={url} maxLength={500} onChange={(e) => setUrl(e.target.value)} placeholder="https://meet.google.com/…" />
            <button type="button" className="w-btn shrink-0" onClick={() => setUrl(newJitsiUrl())}><Video size={13} /> {t('gov.createLink')}</button>
          </div>
        </Field>
      </div>
      <Field label={t('gov.invite')} hint={t('c8c.inviteOnce')}><AttendeePicker config={config} value={ids} onChange={setIds} portalOn={portalOn} /></Field>
      <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={invites} onChange={(e) => setInvites(e.target.checked)} /> {t('gov.emailInvites')}</label>
    </Dialog>
  );
}

// ─── Tab chuỗi ───────────────────────────────────────────────────

export function SeriesTab({ config, portalOn }: { config: ProjectConfig; portalOn: boolean }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const invalidate = useGovInvalidate(config.id);
  const q = useQuery({ queryKey: c8cKeys.series(config.id), queryFn: () => meetingSeriesApi.list(config.id) });
  const [creating, setCreating] = useState(false);
  const [stopping, setStopping] = useState<SeriesRow | null>(null);
  const stop = useMutation({
    mutationFn: (s: SeriesRow) => meetingSeriesApi.remove(config.id, s.id, 'all'),
    onSuccess: (r) => { toast.success(t('c8c.stopped', { n: r.removed, k: r.kept })); setStopping(null); invalidate(); qc.invalidateQueries({ queryKey: c8cKeys.series(config.id) }); },
    onError: (e) => toast.error(workError(e)),
  });
  const base = `/work/${config.workspace.slug}/${config.key}/meetings`;
  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={t('c8c.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3" data-testid="series-tab">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-[12.5px] text-[var(--w-text-3)]">{t('c8c.seriesIntro')}</p>
        {q.data.canEdit && <button type="button" className="w-btn w-btn-primary" onClick={() => setCreating(true)} data-testid="series-new"><Plus size={14} /> {t('c8c.newSeries')}</button>}
      </div>
      {!q.data.items.length ? <EmptyState icon={<Repeat size={20} />} title={t('c8c.noSeries')} body={t('c8c.noSeriesBody')} /> : (
        <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden">
          {q.data.items.map((s) => (
            <li key={s.id} className={`flex min-w-0 flex-wrap items-start gap-3 px-3 py-3 ${s.endedAt ? 'opacity-60' : ''}`}>
              <Repeat size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="truncate text-[14px] font-medium">{s.title}</span>
                  <Pill tone="neutral">{MEETING_TYPE_LABEL[s.type] ?? s.typeLabel}</Pill>
                  {s.templateKey && <Pill tone="accent">{t(`c8c.tpl_${s.templateKey.replace(/-/g, '_')}` as never)}</Pill>}
                  {s.endedAt && <Pill tone="neutral">{t('c8c.ended')}</Pill>}
                </div>
                <p className="mt-0.5 text-[12.5px] text-[var(--w-text-2)]">{summaryOf(s)} · {s.timezone} · <span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{s.rrule}</span></p>
                {!!s.upcoming.length && (
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                    <span className="text-[var(--w-text-3)]">{t('c8c.next')}</span>
                    {s.upcoming.map((m) => <Link key={m.number} href={`${base}/${m.number}`} className="flex items-center gap-1 text-[var(--w-accent-text)] hover:underline"><CalendarClock size={11} />{m.key} · {fmtDateTime(m.startsAt)}{m.detached ? ' *' : ''}</Link>)}
                  </p>
                )}
              </div>
              {q.data.canEdit && !s.endedAt && <button type="button" className="w-btn w-btn-sm" onClick={() => setStopping(s)}><Square size={12} /> {t('c8c.stop')}</button>}
            </li>
          ))}
        </ul>
      )}
      <NewSeriesDialog config={config} open={creating} onClose={() => setCreating(false)} portalOn={portalOn} />
      <Dialog
        open={!!stopping} onClose={() => setStopping(null)} title={t('c8c.stopTitle')} width={460}
        footer={<><button type="button" className="w-btn" onClick={() => setStopping(null)}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-danger" disabled={stop.isPending} onClick={() => stopping && stop.mutate(stopping)}>{stop.isPending ? <Spinner size={12} /> : <Square size={12} />} {t('c8c.stop')}</button></>}
      >
        <p className="text-[13px] text-[var(--w-text-2)]">{t('c8c.stopBody')}</p>
      </Dialog>
    </div>
  );
}

// ─── Trong chi tiết một buổi ─────────────────────────────────────

export function MeetingExtras({ config, meeting, canEdit, onChanged }: { config: ProjectConfig; meeting: { number: number; title: string; startsAt: string; endsAt: string; timezone: string; location: string | null; meetingUrl: string | null; templateKey?: string | null; series?: MeetingSeriesInfo | null }; canEdit: boolean; onChanged: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const invalidate = useGovInvalidate(config.id);
  const s = meeting.series ?? null;
  const [editing, setEditing] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [scope, setScope] = useState<'following' | 'all'>('following');
  const [title, setTitle] = useState(meeting.title);
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState(meeting.location ?? '');
  const [url, setUrl] = useState(meeting.meetingUrl ?? '');
  const [tpl, setTpl] = useState('');
  useEffect(() => {
    if (!editing) return;
    setTitle(meeting.title); setLocation(meeting.location ?? ''); setUrl(meeting.meetingUrl ?? '');
    try {
      const p = new Intl.DateTimeFormat('en-GB', { timeZone: meeting.timezone, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(meeting.startsAt));
      setTime(`${p.find((x) => x.type === 'hour')?.value ?? '09'}:${p.find((x) => x.type === 'minute')?.value ?? '00'}`);
    } catch { /* giữ mặc định */ }
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = () => { invalidate(); qc.invalidateQueries({ queryKey: c8cKeys.series(config.id) }); onChanged(); };
  const save = useMutation({
    mutationFn: async () => {
      const cur = await meetingSeriesApi.get(config.id, s!.id);
      const [h, m] = time.split(':').map(Number);
      const timeChanged = h !== cur.recurrence.hour || m !== cur.recurrence.minute;
      return meetingSeriesApi.update(config.id, s!.id, {
        scope, fromMeeting: scope === 'following' ? meeting.number : undefined, title: title.trim() || cur.title, location: location.trim() || null, meetingUrl: url.trim() || null,
        ...(timeChanged ? { recurrence: { ...cur.recurrence, hour: h || 0, minute: m || 0 } } : {}),
      });
    },
    onSuccess: (r) => { toast.success(r.removed ? t('c8c.seriesRebuilt', { n: r.removed, k: r.kept ?? 0 }) : t('c8c.seriesSaved')); setEditing(false); done(); },
    onError: (e) => toast.error(workError(e)),
  });
  const stop = useMutation({
    mutationFn: () => meetingSeriesApi.remove(config.id, s!.id, scope, scope === 'following' ? meeting.number : undefined),
    onSuccess: (r) => { toast.success(t('c8c.stopped', { n: r.removed, k: r.kept })); setStopping(false); done(); },
    onError: (e) => toast.error(workError(e)),
  });
  const apply = useMutation({
    mutationFn: (key: string) => meetingSeriesApi.applyTemplate(config.id, meeting.number, key, true),
    onSuccess: () => { toast.success(t('c8c.templateApplied')); setTpl(''); done(); },
    onError: (e) => toast.error(workError(e)),
  });
  if (!s && !canEdit) return null;
  const scopePicker = (
    <fieldset className="space-y-1.5 text-[13px]">
      <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c8c.applyTo')}</legend>
      <label className="flex items-center gap-2"><input type="radio" name="series-scope" checked={scope === 'following'} onChange={() => setScope('following')} /> {t('c8c.scopeFollowing')}</label>
      <label className="flex items-center gap-2"><input type="radio" name="series-scope" checked={scope === 'all'} onChange={() => setScope('all')} /> {t('c8c.scopeAll')}</label>
      <p className="text-[12px] text-[var(--w-text-3)]">{t('c8c.scopeOneHint')}</p>
    </fieldset>
  );
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]" data-testid="meeting-extras">
      {s ? (
        <>
          <Repeat size={14} className="shrink-0 text-[var(--w-text-3)]" />
          <span className="min-w-0 flex-1">{t('c8c.repeats', { s: currentWorkLocale() === 'vi' ? s.summaryVi : s.summary })}{s.detached && <> · <Pill tone="orange">{t('c8c.exception')}</Pill></>}{s.ended && <> · <Pill tone="neutral">{t('c8c.ended')}</Pill></>}</span>
          {canEdit && !s.ended && <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(true)}><Pencil size={12} /> {t('c8c.editSeries')}</button>}
          {canEdit && !s.ended && <button type="button" className="w-btn w-btn-sm" onClick={() => setStopping(true)}><Square size={12} /> {t('c8c.stop')}</button>}
        </>
      ) : <span className="min-w-0 flex-1 text-[var(--w-text-3)]">{meeting.templateKey ? t('c8c.usesTemplate', { t: t(`c8c.tpl_${meeting.templateKey.replace(/-/g, '_')}` as never) }) : t('c8c.oneOff')}</span>}
      {canEdit && (
        <span className="flex items-center gap-1.5">
          <LayoutTemplate size={13} className="text-[var(--w-text-3)]" aria-hidden />
          <span className="w-[170px]"><TemplateSelect pid={config.id} value={tpl} onChange={(k) => { setTpl(k); if (k) apply.mutate(k); }} testId="meeting-apply-template" /></span>
        </span>
      )}
      <Dialog
        open={editing} onClose={() => setEditing(false)} title={t('c8c.editSeries')} width={520}
        footer={<><button type="button" className="w-btn" onClick={() => setEditing(false)}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner size={12} /> : null} {t('common.save')}</button></>}
      >
        <Field label={t('common.title')}><input className="w-input" value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} /></Field>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[140px_1fr]">
          <Field label={t('c8c.at')} hint={t('c8c.timeHint')}><input type="time" className="w-input" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
          <Field label={t('gov.locationOpt')}><input className="w-input" value={location} maxLength={255} onChange={(e) => setLocation(e.target.value)} /></Field>
        </div>
        <Field label={t('gov.videoOpt')}><input className="w-input" value={url} maxLength={500} onChange={(e) => setUrl(e.target.value)} /></Field>
        {scopePicker}
      </Dialog>
      <Dialog
        open={stopping} onClose={() => setStopping(false)} title={t('c8c.stopTitle')} width={460}
        footer={<><button type="button" className="w-btn" onClick={() => setStopping(false)}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-danger" disabled={stop.isPending} onClick={() => stop.mutate()}>{stop.isPending ? <Spinner size={12} /> : <Square size={12} />} {t('c8c.stop')}</button></>}
      >
        <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('c8c.stopBody')}</p>
        {scopePicker}
      </Dialog>
    </div>
  );
}

