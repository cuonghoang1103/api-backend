'use client';

/**
 * CTW đợt 5 (C12) — Cài đặt dự án › Việc định kỳ. RRULE đơn giản (hằng ngày / tuần + thứ / tháng + ngày, cách n, giờ) theo
 * MÚI GIỜ DỰ ÁN; máy chủ (recurring.service.ts) tạo thẻ mỗi lần lặp đúng một lần nhờ khoá `dedup_key`. Ba mẫu nhanh cho
 * đồ án: Báo cáo tuần thứ Sáu 16:00, họp mentor hằng tuần, daily stand-up ngày làm việc. Chỉ ADMIN dự án sửa được.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, PRIORITIES, Spinner } from '../ui';
import { ConfirmDialog, ReadOnlyNotice, Section, Select, Switch } from './shared';
import { useWT, wt, type WKey } from '../i18n';
import { teachingApi, teachingKeys, type Recurrence, type RecurringIssue, type RecurringRule } from '../teaching/teachingApi';

const todayIso = () => new Date().toISOString().slice(0, 10);
const TIMEZONES = ['Asia/Ho_Chi_Minh', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'UTC'];

interface Form { name: string; enabled: boolean; recurrence: Recurrence; issue: RecurringIssue }

function presetOf(kind: 'weekly' | 'mentor' | 'standup', typeId: number): Form {
  const base: Recurrence = { freq: 'WEEKLY', interval: 1, byWeekday: [5], byMonthDay: null, hour: 16, minute: 0, startDate: todayIso(), endDate: null };
  if (kind === 'weekly') return { name: wt('classroom.preset_weekly'), enabled: true, recurrence: base, issue: { title: wt('classroom.presetTitle_weekly'), typeId, dueInDays: 0, priority: 2 } };
  if (kind === 'mentor') return { name: wt('classroom.preset_mentor'), enabled: true, recurrence: { ...base, byWeekday: [2], hour: 9 }, issue: { title: wt('classroom.presetTitle_mentor'), typeId, dueInDays: 0, priority: 3 } };
  return { name: wt('classroom.preset_standup'), enabled: true, recurrence: { ...base, byWeekday: [1, 2, 3, 4, 5], hour: 8, minute: 30 }, issue: { title: wt('classroom.presetTitle_standup'), typeId, dueInDays: 0, priority: 3 } };
}

function RuleDialog({ config, open, onClose, start }: { config: ProjectConfig; open: boolean; onClose: () => void; start: { id: number | null; form: Form } | null }) {
  const { t, fmtShortDate } = useWT();
  const qc = useQueryClient();
  const pid = config.id;
  const types = config.issueTypes.filter((x) => x.level >= 0);
  const team = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const [f, setF] = useState<Form | null>(null);
  useEffect(() => { if (open) setF(start?.form ?? presetOf('weekly', types[0]?.id ?? 0)); }, [open, start]); // eslint-disable-line react-hooks/exhaustive-deps
  const rec = f?.recurrence;
  const pv = useQuery({
    queryKey: [...teachingKeys.recurring(pid), 'preview', rec, f?.issue.title],
    queryFn: () => teachingApi.previewRecurring(pid, rec!, f!.issue.title),
    enabled: open && !!rec?.startDate,
    retry: false,
  });
  const save = useMutation({
    mutationFn: () => {
      const body = { name: f!.name.trim(), enabled: f!.enabled, recurrence: f!.recurrence, issue: { ...f!.issue, title: f!.issue.title.trim() } };
      return start?.id ? teachingApi.updateRecurring(pid, start.id, body) : teachingApi.createRecurring(pid, body);
    },
    onSuccess: () => { toast.success(t('classroom.recSaved')); qc.invalidateQueries({ queryKey: teachingKeys.recurring(pid) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  if (!open || !f || !rec) return null;
  const setR = (p: Partial<Recurrence>) => setF({ ...f, recurrence: { ...rec, ...p } });
  const setI = (p: Partial<RecurringIssue>) => setF({ ...f, issue: { ...f.issue, ...p } });
  const time = `${String(rec.hour).padStart(2, '0')}:${String(rec.minute).padStart(2, '0')}`;
  const valid = f.name.trim() && f.issue.title.trim() && f.issue.typeId && !pv.error;
  return (
    <Dialog open={open} onClose={onClose} title={start?.id ? t('classroom.recEdit') : t('classroom.recNew')} width={640}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('classroom.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!valid || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('classroom.save')}</button>
      </>}>
      {!start?.id && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] text-[var(--w-text-2)]">{t('classroom.recPresets')}:</span>
          {(['weekly', 'mentor', 'standup'] as const).map((k) => <button key={k} type="button" className="w-btn w-btn-sm" onClick={() => setF(presetOf(k, f.issue.typeId || types[0]?.id || 0))}>{t(`classroom.preset_${k}` as WKey)}</button>)}
        </div>
      )}
      <Field label={t('classroom.recName')}><input className="w-input" value={f.name} maxLength={100} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <div className="grid gap-x-3 sm:grid-cols-3">
        <Field label={t('classroom.freq')}>
          <Select value={rec.freq} onChange={(e) => setR({ freq: e.target.value as Recurrence['freq'], byWeekday: e.target.value === 'WEEKLY' ? (rec.byWeekday.length ? rec.byWeekday : [5]) : [], byMonthDay: e.target.value === 'MONTHLY' ? rec.byMonthDay ?? 1 : null })}>
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((x) => <option key={x} value={x}>{t(`classroom.freq_${x}` as WKey)}</option>)}
          </Select>
        </Field>
        <Field label={`${t('classroom.every')} (${t(`classroom.unit_${rec.freq}` as WKey)})`}><input className="w-input" type="number" min={1} max={12} value={rec.interval} onChange={(e) => setR({ interval: Math.min(12, Math.max(1, Number(e.target.value) || 1)) })} /></Field>
        <Field label={t('classroom.time')}><input className="w-input" type="time" value={time} onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); setR({ hour: h || 0, minute: m || 0 }); }} /></Field>
      </div>
      {rec.freq === 'WEEKLY' && (
        <fieldset className="mb-4">
          <legend className="w-label">{t('classroom.onDays')}</legend>
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => {
              const on = rec.byWeekday.includes(d);
              return <button key={d} type="button" aria-pressed={on} className={cn('w-btn w-btn-sm min-w-[44px]', on && 'w-btn-on')} onClick={() => setR({ byWeekday: on ? rec.byWeekday.filter((x) => x !== d) : [...rec.byWeekday, d].sort() })}>{t(`classroom.wd_${d}` as WKey)}</button>;
            })}
          </div>
        </fieldset>
      )}
      {rec.freq === 'MONTHLY' && (
        <Field label={t('classroom.monthDay')}>
          <Select value={rec.byMonthDay ?? 1} onChange={(e) => setR({ byMonthDay: Number(e.target.value) })}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            <option value={-1}>{t('classroom.lastDay')}</option>
          </Select>
        </Field>
      )}
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t('classroom.starts')}><input className="w-input" type="date" value={rec.startDate} onChange={(e) => setR({ startDate: e.target.value })} /></Field>
        <Field label={t('classroom.ends')}><input className="w-input" type="date" value={rec.endDate ?? ''} onChange={(e) => setR({ endDate: e.target.value || null })} /></Field>
      </div>
      <p className="mb-4 text-[12.5px] text-[var(--w-text-2)]" aria-live="polite">
        {pv.data ? <>{t('classroom.nextList', { list: pv.data.next.slice(0, 4).map((n) => fmtShortDate(n.day)).join(' · ') || '—' })} <span className="text-[var(--w-text-3)]">({pv.data.timezone} · {pv.data.rrule})</span></> : pv.error ? <span className="text-[var(--w-red-text)]">{workError(pv.error)}</span> : null}
      </p>
      <Field label={t('classroom.recTitleTpl')} hint={t('classroom.recTitleHint')}><input className="w-input" value={f.issue.title} maxLength={255} onChange={(e) => setI({ title: e.target.value })} /></Field>
      {pv.data?.next[0]?.title && <p className="-mt-2 mb-4 truncate text-[12.5px] text-[var(--w-text-2)]">→ {pv.data.next[0].title}</p>}
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t('classroom.recType')}>
          <Select value={f.issue.typeId} onChange={(e) => setI({ typeId: Number(e.target.value) })}>
            {types.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </Select>
        </Field>
        <Field label={t('classroom.recAssignee')}>
          <Select value={f.issue.assigneeId ?? ''} onChange={(e) => setI({ assigneeId: e.target.value ? Number(e.target.value) : null })}>
            <option value="">{t('classroom.nobody')}</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.displayName || m.fullName || m.username}</option>)}
          </Select>
        </Field>
        <Field label={t('classroom.recPriority')}>
          <Select value={f.issue.priority ?? 3} onChange={(e) => setI({ priority: Number(e.target.value) })}>
            {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
        </Field>
        <Field label={t('classroom.recDue')}>
          <Select value={f.issue.dueInDays ?? ''} onChange={(e) => setI({ dueInDays: e.target.value === '' ? null : Number(e.target.value) })}>
            <option value="">{t('classroom.recDueNone')}</option>
            <option value={0}>{t('classroom.recDueSame')}</option>
            {[1, 2, 3, 5, 7].map((n) => <option key={n} value={n}>{t('classroom.recDueN', { count: n })}</option>)}
          </Select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={!!f.issue.addToActiveSprint} onChange={(e) => setI({ addToActiveSprint: e.target.checked })} />
        {t('classroom.recSprint')}
      </label>
    </Dialog>
  );
}

export default function ProjectRecurring({ config }: { config: ProjectConfig }) {
  const { t, fmtShortDate } = useWT();
  const qc = useQueryClient();
  const pid = config.id;
  const q = useQuery({ queryKey: teachingKeys.recurring(pid), queryFn: () => teachingApi.recurring(pid) });
  const [dialog, setDialog] = useState<{ open: boolean; start: { id: number | null; form: Form } | null }>({ open: false, start: null });
  const [deleting, setDeleting] = useState<RecurringRule | null>(null);
  const [tz, setTz] = useState('');
  useEffect(() => { if (q.data) setTz(q.data.timezone); }, [q.data]);
  const tzOptions = useMemo(() => [...new Set([...(q.data ? [q.data.timezone] : []), ...TIMEZONES])], [q.data]);
  const toggle = useMutation({
    mutationFn: (r: RecurringRule) => teachingApi.updateRecurring(pid, r.id, { name: r.name, enabled: !r.enabled, recurrence: r.recurrence, issue: r.issue }),
    onSuccess: () => qc.invalidateQueries({ queryKey: teachingKeys.recurring(pid) }),
    onError: (err) => toast.error(workError(err)),
  });
  const del = useMutation({
    mutationFn: (id: number) => teachingApi.deleteRecurring(pid, id),
    onSuccess: () => { toast.success(t('classroom.recDeleted')); setDeleting(null); qc.invalidateQueries({ queryKey: teachingKeys.recurring(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const saveTz = useMutation({
    mutationFn: () => teachingApi.setTimezone(pid, tz),
    onSuccess: () => { toast.success(t('classroom.tzSaved')); qc.invalidateQueries({ queryKey: teachingKeys.recurring(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });

  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const d = q.data;
  return (
    <div className="space-y-6">
      <Section
        title={t('classroom.recTitle')}
        description={t('classroom.recSub')}
        action={d.canEdit ? <button type="button" data-testid="ctw5-add-recurring" className="w-btn w-btn-primary w-btn-sm" onClick={() => setDialog({ open: true, start: null })}><Plus size={14} aria-hidden="true" /><span className="ml-1">{t('classroom.recNew')}</span></button> : undefined}
      >
        {!d.canEdit && <ReadOnlyNotice>{t('classroom.readOnly')}</ReadOnlyNotice>}
        {!d.rules.length ? (
          <EmptyState icon={<CalendarClock size={20} />} title={t('classroom.recEmpty')} body={t('classroom.recEmptyBody')} />
        ) : (
          <ul className="divide-y divide-[var(--w-border)] rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
            {d.rules.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
                <Switch checked={r.enabled} disabled={!d.canEdit || toggle.isPending} onChange={() => toggle.mutate(r)} label={t('classroom.recToggle', { name: r.name })} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{r.name}</div>
                  <div className="truncate text-[12.5px] text-[var(--w-text-2)]">{r.issue.title} · <span className="font-mono text-[11.5px]">{r.rrule}</span></div>
                  <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">
                    {r.enabled && r.next.length > 0 && t('classroom.nextList', { list: r.next.slice(0, 3).map((x) => fmtShortDate(x)).join(' · ') })}
                    {r.runCount > 0 && <> · {t('classroom.recRuns', { count: r.runCount })}</>}
                  </div>
                  {r.recent.length > 0 && (
                    <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">{t('classroom.recRecent')}: {r.recent.map((x) => (x.issueNumber ? `${config.key}-${x.issueNumber}` : x.occurrence)).join(', ')}</div>
                  )}
                </div>
                {d.canEdit && (
                  <div className="flex gap-1">
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('classroom.edit')} ${r.name}`} onClick={() => setDialog({ open: true, start: { id: r.id, form: { name: r.name, enabled: r.enabled, recurrence: r.recurrence, issue: r.issue } } })}><Pencil size={14} /></button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('classroom.delete')} ${r.name}`} onClick={() => setDeleting(r)}><Trash2 size={14} /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title={t('classroom.timezone')} description={t('classroom.tzHint')}>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={tz} disabled={!d.canEdit} onChange={(e) => setTz(e.target.value)} className="max-w-[260px]" aria-label={t('classroom.timezone')}>
            {tzOptions.map((z) => <option key={z} value={z}>{z}</option>)}
          </Select>
          {d.canEdit && <button type="button" className="w-btn w-btn-sm" disabled={tz === d.timezone || saveTz.isPending} onClick={() => saveTz.mutate()}>{t('classroom.tzSave')}</button>}
        </div>
      </Section>
      <RuleDialog config={config} open={dialog.open} start={dialog.start} onClose={() => setDialog({ open: false, start: null })} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} title={t('classroom.delete')} body={deleting ? t('classroom.recDeleteConfirm', { name: deleting.name }) : ''} confirmLabel={t('classroom.delete')} onConfirm={() => deleting && del.mutate(deleting.id)} pending={del.isPending} />
    </div>
  );
}
