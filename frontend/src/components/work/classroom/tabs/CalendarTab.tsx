'use client';

/**
 * CTW đợt 9a — tab CALENDAR của trang lớp: lịch gộp (buổi học định kỳ / lẻ + hạn bài 9b/9c) + điểm danh.
 *   GV/OWNER: tạo lịch định kỳ (thứ trong tuần + giờ theo múi giờ lớp) hoặc buổi lẻ, huỷ/xoá buổi, mở điểm danh (mã 6 số
 *             + QR, 5 phút mặc định, "Mã mới" đổi ngay), sửa tay P/L/E/A, thống kê vắng (cờ vượt ngưỡng), xuất xlsx.
 *   SV:       nhập mã (hoặc mở link QR — `&checkin=<mã>` điền sẵn), xem điểm danh CỦA MÌNH.
 *   Ai cũng xuất được .ics của lớp (SV chỉ có mục mình được thấy).
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  AlertTriangle, CalendarDays, CalendarPlus, CheckCircle2, ClipboardList, Clock, Download, MapPin, QrCode, RefreshCw, Repeat, Trash2, Undo2, Video, XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog, Select } from '@/components/work/settings/shared';
import DataTable, { type DataColumn } from '@/components/work/table/DataTable';
import { useWT, type WKey } from '@/components/work/i18n';
import { saveBlob } from '@/components/work/teaching/teachingApi';
import {
  ATTENDANCE_STATUSES, classroomApi, classroomKeys, type AttendanceStatus, type CalItem, type CalSession, type CalendarView, type StudentStat,
} from '../classroomApi';
import type { ClassSlotProps } from '../slots/types';

const STATUS_TONE: Record<AttendanceStatus, string> = {
  PRESENT: 'text-[var(--w-green-text)]', LATE: 'text-[var(--w-yellow-text,var(--w-orange-text))]', EXCUSED: 'text-[var(--w-blue-text,var(--w-accent))]', ABSENT: 'text-[var(--w-red-text)]',
};
const LETTER: Record<AttendanceStatus, string> = { PRESENT: 'P', LATE: 'L', EXCUSED: 'E', ABSENT: 'A' };

function StatusChip({ s }: { s: AttendanceStatus | null | undefined }) {
  const { t } = useWT();
  if (!s) return <span className="text-[12px] text-[var(--w-text-3)]">—</span>;
  return <span className={cn('inline-flex items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[11.5px] font-medium', STATUS_TONE[s])}>{t(`c9a.st_${s}` as WKey)}</span>;
}

const pad = (n: number) => String(n).padStart(2, '0');
const localDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// ─── Hộp thoại lịch ─────────────────────────────────────────────

function SeriesDialog({ classId, timezone, open, onClose }: { classId: number; timezone: string; open: boolean; onClose: () => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [days, setDays] = useState<number[]>([1]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [time, setTime] = useState('07:30');
  const [dur, setDur] = useState(90);
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  useEffect(() => { if (open) { setTitle(''); setDays([1]); setStart(localDate(new Date())); setEnd(''); setTime('07:30'); setDur(90); setLocation(''); setUrl(''); } }, [open]);
  const names = locale === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const save = useMutation({
    mutationFn: () => {
      const [h, m] = time.split(':').map(Number);
      return classroomApi.createSeries(classId, {
        title: title.trim() || t('c9a.defaultSessionTitle'), durationMin: dur, location: location.trim() || null, meetingUrl: url.trim() || null,
        recurrence: { freq: 'WEEKLY', interval: 1, byWeekday: days, hour: h || 0, minute: m || 0, startDate: start, endDate: end || null },
      });
    },
    onSuccess: (r) => { toast.success(t('c9a.seriesCreated', { count: r.sessions })); void qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('c9a.addSchedule')} width={560}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9a.cancel')}</button>
        <button type="button" data-testid="c9a-series-save" className="w-btn w-btn-primary" disabled={!start || !days.length || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('c9a.create')}</button>
      </>}>
      <Field label={t('c9a.sessionTitle')}><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('c9a.defaultSessionTitle')} maxLength={120} /></Field>
      <fieldset className="mb-3">
        <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c9a.repeatOn')}</legend>
        <div className="flex flex-wrap gap-1.5">
          {names.map((n, i) => (
            <button key={n} type="button" aria-pressed={days.includes(i)} onClick={() => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i].sort()))}
              className={cn('h-8 min-w-[40px] rounded-[6px] border px-2 text-[12.5px]', days.includes(i) ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft,var(--w-hover))] font-semibold' : 'border-[var(--w-border)] text-[var(--w-text-2)]')}>{n}</button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t('c9a.startDate')}><input className="w-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label={t('c9a.endDate')} hint={t('c9a.endDateHint')}><input className="w-input" type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} /></Field>
        <Field label={t('c9a.startTime')} hint={t('c9a.inTimezone', { tz: timezone })}><input className="w-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        <Field label={t('c9a.durationMin')}><input className="w-input" type="number" min={5} max={600} value={dur} onChange={(e) => setDur(Number(e.target.value) || 90)} /></Field>
        <Field label={t('c9a.location')}><input className="w-input" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={255} placeholder="BE-301" /></Field>
        <Field label={t('c9a.meetingUrl')}><input className="w-input" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={500} placeholder="https://meet.google.com/…" /></Field>
      </div>
    </Dialog>
  );
}

function SessionDialog({ classId, open, onClose }: { classId: number; open: boolean; onClose: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [at, setAt] = useState('');
  const [dur, setDur] = useState(90);
  const [location, setLocation] = useState('');
  useEffect(() => { if (open) { setTitle(''); setAt(''); setDur(90); setLocation(''); } }, [open]);
  const save = useMutation({
    mutationFn: () => classroomApi.createSession(classId, { title: title.trim() || t('c9a.defaultSessionTitle'), startsAt: new Date(at).toISOString(), durationMin: dur, location: location.trim() || null }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={t('c9a.addSession')} width={480}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9a.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!at || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('c9a.create')}</button>
      </>}>
      <Field label={t('c9a.sessionTitle')}><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('c9a.defaultSessionTitle')} maxLength={120} /></Field>
      <div className="grid gap-x-3 sm:grid-cols-[1fr_120px]">
        <Field label={t('c9a.startsAt')}><input className="w-input" type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} /></Field>
        <Field label={t('c9a.durationMin')}><input className="w-input" type="number" min={5} max={600} value={dur} onChange={(e) => setDur(Number(e.target.value) || 90)} /></Field>
      </div>
      <Field label={t('c9a.location')}><input className="w-input" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={255} /></Field>
    </Dialog>
  );
}

// ─── Bảng điểm danh của một buổi (GV) ───────────────────────────

function Countdown({ until }: { until: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const h = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(h); }, []);
  const left = Math.max(0, Math.round((new Date(until).getTime() - now) / 1000));
  return <span className="tabular-nums">{Math.floor(left / 60)}:{pad(left % 60)}</span>;
}

function SheetDialog({ classId, session, onClose }: { classId: number; session: CalSession | null; onClose: () => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const sid = session?.id ?? 0;
  const [minutes, setMinutes] = useState(5);
  const sheet = useQuery({ queryKey: classroomKeys.sheet(classId, sid), queryFn: () => classroomApi.sheet(classId, sid), enabled: !!session, refetchInterval: (q) => (q.state.data?.checkin ? 3000 : false) });
  const refresh = () => { void qc.invalidateQueries({ queryKey: classroomKeys.sheet(classId, sid) }); void qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) }); void qc.invalidateQueries({ queryKey: classroomKeys.stats(classId) }); };
  const open = useMutation({ mutationFn: () => classroomApi.openCheckin(classId, sid, minutes), onSuccess: refresh, onError: (err) => toast.error(workError(err)) });
  const close = useMutation({ mutationFn: () => classroomApi.closeCheckin(classId, sid), onSuccess: refresh, onError: (err) => toast.error(workError(err)) });
  const set = useMutation({
    mutationFn: (rows: Array<{ studentId: number; status: AttendanceStatus | null }>) => classroomApi.setAttendance(classId, sid, rows),
    onSuccess: refresh, onError: (err) => toast.error(workError(err)),
  });
  const d = sheet.data;
  const expired = d?.checkin && new Date(d.checkin.expiresAt).getTime() <= Date.now();
  const unmarked = d?.rows.filter((r) => !r.status) ?? [];
  const groupName = (id: number | null) => d?.groups.find((g) => g.id === id)?.name ?? '—';
  return (
    <Dialog open={!!session} onClose={onClose} title={session ? `${t('c9a.attendance')} — ${session.title}` : ''} width={860}>
      {session && <p className="-mt-1 mb-3 text-[13px] text-[var(--w-text-2)]">{fmtDateTime(session.startsAt)}{session.location ? ` · ${session.location}` : ''}</p>}
      {sheet.isLoading && <Spinner />}
      {d && (
        <div className="space-y-4">
          <section aria-label={t('c9a.checkin')} className="rounded-[10px] border border-[var(--w-border)] p-3">
            {d.checkin && !expired ? (
              <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
                <div className="mx-auto rounded-[8px] bg-white p-2"><QRCodeSVG value={d.checkin.url} size={148} level="M" aria-label={t('c9a.qrLabel')} /></div>
                <div className="min-w-0 space-y-2 text-center sm:text-left">
                  <div className="text-[12px] font-medium text-[var(--w-text-2)]">{t('c9a.checkinCode')}</div>
                  <div className="font-mono text-[40px] font-semibold leading-none tracking-[0.18em]" data-testid="c9a-checkin-code">{d.checkin.code}</div>
                  <div className="text-[13px] text-[var(--w-text-2)]"><Clock size={13} className="mr-1 inline" aria-hidden="true" />{t('c9a.expiresIn')} <Countdown until={d.checkin.expiresAt} /> · {t('c9a.checkedInN', { n: d.rows.filter((r) => r.source === 'CODE').length, total: d.rows.length })}</div>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <button type="button" className="w-btn w-btn-sm" disabled={open.isPending} onClick={() => open.mutate()}><RefreshCw size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.newCode')}</span></button>
                    <button type="button" className="w-btn w-btn-sm" disabled={close.isPending} onClick={() => close.mutate()}><XCircle size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.stopCheckin')}</span></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <QrCode size={18} className="text-[var(--w-accent)]" aria-hidden="true" />
                <p className="min-w-0 flex-1 text-[13px] text-[var(--w-text-2)]">{session?.status === 'CANCELLED' ? t('c9a.sessionCancelled') : t('c9a.checkinHint')}</p>
                <label className="flex items-center gap-1.5 text-[12.5px]">{t('c9a.validFor')}
                  <Select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="h-[28px] w-[86px]">
                    {[1, 2, 3, 5, 10, 15, 30].map((m) => <option key={m} value={m}>{t('c9a.minN', { n: m })}</option>)}
                  </Select>
                </label>
                <button type="button" data-testid="c9a-open-checkin" className="w-btn w-btn-sm w-btn-primary" disabled={open.isPending || session?.status === 'CANCELLED'} onClick={() => open.mutate()}>{open.isPending && <Spinner size={12} />}{t('c9a.startCheckin')}</button>
              </div>
            )}
          </section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-3 text-[12.5px]">
              {ATTENDANCE_STATUSES.map((s) => <span key={s} className={STATUS_TONE[s]}>{t(`c9a.st_${s}` as WKey)}: <b className="tabular-nums">{d.counts[s] ?? 0}</b></span>)}
              <span className="text-[var(--w-text-2)]">{t('c9a.unmarked')}: <b className="tabular-nums">{unmarked.length}</b></span>
            </div>
            <button type="button" className="w-btn w-btn-sm" disabled={!unmarked.length || set.isPending} onClick={() => set.mutate(unmarked.map((r) => ({ studentId: r.studentId, status: 'ABSENT' as const })))}>{t('c9a.markRestAbsent')}</button>
          </div>
          <div className="max-h-[48vh] overflow-auto rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full min-w-[640px] border-collapse text-[13px]">
              <thead className="sticky top-0 z-[1] bg-[var(--w-panel)]">
                <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-2)]">
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('classroom.studentCode')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('classroom.fullName')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('c9a.group')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('c9a.checkedIn')}</th>
                  <th scope="col" className="px-3 py-1.5 font-medium">{t('c9a.status')}</th>
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.studentId} className="border-b border-[var(--w-border)] last:border-0">
                    <td className="px-3 py-1.5 tabular-nums">{r.studentCode ?? '—'}</td>
                    <td className="px-3 py-1.5">{r.fullName ?? (r.user ? userName(r.user) : r.email ?? '—')}</td>
                    <td className="px-3 py-1.5 text-[var(--w-text-2)]">{groupName(r.groupId)}</td>
                    <td className="px-3 py-1.5 text-[12px] text-[var(--w-text-2)]">{r.checkedInAt ? fmtDateTime(r.checkedInAt) : '—'}</td>
                    <td className="px-3 py-1">
                      <div role="radiogroup" aria-label={`${t('c9a.status')} — ${r.fullName ?? ''}`} className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border)]">
                        {ATTENDANCE_STATUSES.map((s) => (
                          <button key={s} type="button" role="radio" aria-checked={r.status === s} title={t(`c9a.st_${s}` as WKey)} aria-label={t(`c9a.st_${s}` as WKey)}
                            onClick={() => set.mutate([{ studentId: r.studentId, status: r.status === s ? null : s }])}
                            className={cn('h-[26px] w-[30px] border-r border-[var(--w-border)] text-[12px] font-semibold last:border-r-0', r.status === s ? cn('bg-[var(--w-sunken)]', STATUS_TONE[s]) : 'text-[var(--w-text-3)] hover:bg-[var(--w-hover)]')}>
                            {LETTER[s]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// ─── SV điểm danh ───────────────────────────────────────────────

function CheckinCard({ classId, prefill, session }: { classId: number; prefill: string; session: CalSession | undefined }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [code, setCode] = useState(prefill);
  useEffect(() => { if (prefill) setCode(prefill); }, [prefill]);
  const go = useMutation({
    mutationFn: () => classroomApi.checkin(classId, code),
    onSuccess: (r) => {
      toast.success(t(r.status === 'LATE' ? 'c9a.checkedInLate' : 'c9a.checkedInOk', { title: r.title }));
      setCode('');
      void qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) });
      void qc.invalidateQueries({ queryKey: classroomKeys.mine(classId) });
    },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <section aria-labelledby="c9a-checkin-h" className="w-card border-[var(--w-accent)] p-4">
      <h3 id="c9a-checkin-h" className="flex items-center gap-2 text-[14px] font-semibold"><QrCode size={16} className="text-[var(--w-accent)]" aria-hidden="true" />{t('c9a.checkinTitle')}</h3>
      <p className="mb-3 mt-0.5 text-[12.5px] text-[var(--w-text-2)]">{session ? t('c9a.checkinOpenFor', { title: session.title }) : t('c9a.checkinBody')}{prefill ? ` ${t('c9a.fromQr')}` : ''}</p>
      <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (code.replace(/\D/g, '').length === 6) go.mutate(); }}>
        <input className="w-input h-[38px] w-[170px] text-center font-mono text-[20px] tracking-[0.25em]" inputMode="numeric" autoComplete="one-time-code" maxLength={7}
          value={code} onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))} placeholder="000000" aria-label={t('c9a.checkinCode')} data-testid="c9a-checkin-input" />
        <button type="submit" data-testid="c9a-checkin-submit" className="w-btn w-btn-primary h-[38px]" disabled={code.length !== 6 || go.isPending}>{go.isPending && <Spinner size={13} />}{t('c9a.checkInNow')}</button>
      </form>
    </section>
  );
}

// ─── Thống kê ───────────────────────────────────────────────────

function TeacherStats({ classId }: { classId: number }) {
  const { t, fmtNumber } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: classroomKeys.stats(classId), queryFn: () => classroomApi.stats(classId) });
  const settings = useQuery({ queryKey: classroomKeys.settings(classId), queryFn: () => classroomApi.settings(classId) });
  const [threshold, setThreshold] = useState('');
  const [late, setLate] = useState('');
  useEffect(() => { if (settings.data) { setThreshold(String(settings.data.absenceThreshold)); setLate(String(settings.data.lateAfterMin)); } }, [settings.data]);
  const save = useMutation({
    mutationFn: () => classroomApi.updateSettings(classId, { absenceThreshold: Number(threshold) || 20, lateAfterMin: Math.max(0, Number(late) || 0) }),
    onSuccess: () => { toast.success(t('c9a.saved')); void qc.invalidateQueries({ queryKey: classroomKeys.stats(classId) }); void qc.invalidateQueries({ queryKey: classroomKeys.settings(classId) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const xlsx = useMutation({ mutationFn: () => classroomApi.statsXlsx(classId), onSuccess: (b) => saveBlob(b, `attendance-${classId}.xlsx`), onError: (err) => toast.error(workError(err)) });
  const columns = useMemo<DataColumn<StudentStat>[]>(() => [
    { id: 'code', header: t('classroom.studentCode'), width: 110, value: (r) => r.studentCode },
    { id: 'name', header: t('classroom.fullName'), width: 200, grow: true, required: true, value: (r) => r.fullName ?? (r.user ? userName(r.user) : r.email) },
    { id: 'present', header: t('c9a.st_PRESENT'), width: 84, align: 'right', value: (r) => r.present },
    { id: 'late', header: t('c9a.st_LATE'), width: 70, align: 'right', value: (r) => r.late },
    { id: 'excused', header: t('c9a.st_EXCUSED'), width: 84, align: 'right', value: (r) => r.excused, hideBelow: 'sm' },
    { id: 'absent', header: t('c9a.st_ABSENT'), width: 76, align: 'right', value: (r) => r.absent },
    {
      id: 'pct', header: t('c9a.absentPct'), width: 110, align: 'right', value: (r) => r.absentPct,
      cell: (r) => (r.absentPct === null ? '—' : (
        <span className={cn('inline-flex items-center gap-1 tabular-nums', r.over && 'font-semibold text-[var(--w-red-text)]')}>
          {r.over && <AlertTriangle size={12} aria-hidden="true" />}{fmtNumber(r.absentPct)}%{r.over && <span className="sr-only"> {t('c9a.overThreshold')}</span>}
        </span>
      )),
    },
  ], [t, fmtNumber]);
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const d = q.data;
  return (
    <section aria-labelledby="c9a-stats-h" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="c9a-stats-h" className="text-[15px] font-semibold">{t('c9a.attendanceReport')}</h3>
          <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c9a.statsSub', { sessions: d.sessions.length, flagged: d.flagged, threshold: d.threshold })}</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-[12px] text-[var(--w-text-2)]"><span className="mb-1 block font-medium">{t('c9a.thresholdPct')}</span><input className="w-input h-[30px] w-[80px]" type="number" min={1} max={100} value={threshold} onChange={(e) => setThreshold(e.target.value)} /></label>
          <label className="text-[12px] text-[var(--w-text-2)]"><span className="mb-1 block font-medium">{t('c9a.lateAfter')}</span><input className="w-input h-[30px] w-[80px]" type="number" min={0} max={240} value={late} onChange={(e) => setLate(e.target.value)} /></label>
          <button type="button" className="w-btn w-btn-sm h-[30px]" disabled={save.isPending} onClick={() => save.mutate()}>{t('c9a.save')}</button>
          <button type="button" data-testid="c9a-attendance-xlsx" className="w-btn w-btn-sm h-[30px]" disabled={xlsx.isPending} onClick={() => xlsx.mutate()}>{xlsx.isPending ? <Spinner size={12} /> : <Download size={13} aria-hidden="true" />}<span className="ml-1">{t('c9a.exportXlsx')}</span></button>
        </div>
      </div>
      {!d.sessions.length ? <EmptyState icon={<ClipboardList size={20} />} title={t('c9a.noAttendanceYet')} body={t('c9a.noAttendanceYetBody')} /> : (
        <DataTable<StudentStat> id={`class-attendance-${classId}`} label={t('c9a.attendanceReport')} rows={d.students} columns={columns} rowKey={(r) => r.id}
          quickFilter filterPlaceholder={t('c9a.filterStudents')} height="auto" paging="none" defaultSort={{ col: 'pct', dir: 'desc' }}
          rowClassName={(r) => (r.over ? 'bg-[color-mix(in_srgb,var(--w-red-text)_6%,transparent)]' : undefined)} exportName={`attendance-${classId}`} />
      )}
    </section>
  );
}

function MyStats({ classId }: { classId: number }) {
  const { t, fmtDateTime, fmtNumber } = useWT();
  const q = useQuery({ queryKey: classroomKeys.mine(classId), queryFn: () => classroomApi.mine(classId) });
  if (q.isLoading) return <PageLoading rows={2} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const d = q.data;
  if (!d.summary || !d.sessions.length) return <EmptyState icon={<ClipboardList size={20} />} title={t('c9a.noAttendanceYet')} body={t('c9a.myNoAttendance')} />;
  const s = d.summary;
  return (
    <section aria-labelledby="c9a-my-h" className="space-y-3">
      <h3 id="c9a-my-h" className="text-[15px] font-semibold">{t('c9a.myAttendance')}</h3>
      {s.over && <p role="alert" className="flex items-center gap-2 rounded-[8px] border border-[var(--w-red-text)] px-3 py-2 text-[13px] text-[var(--w-red-text)]"><AlertTriangle size={14} aria-hidden="true" />{t('c9a.youAreOver', { pct: fmtNumber(s.absentPct ?? 0), threshold: d.threshold })}</p>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(['present', 'late', 'excused', 'absent'] as const).map((k) => (
          <div key={k} className="w-card p-3"><div className="text-[12px] text-[var(--w-text-2)]">{t(`c9a.st_${k.toUpperCase()}` as WKey)}</div><div className="text-[20px] font-semibold tabular-nums">{s[k]}</div></div>
        ))}
        <div className="w-card col-span-2 p-3 sm:col-span-1"><div className="text-[12px] text-[var(--w-text-2)]">{t('c9a.absentPct')}</div><div className={cn('text-[20px] font-semibold tabular-nums', s.over && 'text-[var(--w-red-text)]')}>{s.absentPct === null ? '—' : `${fmtNumber(s.absentPct)}%`}</div></div>
      </div>
      <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
        {d.sessions.slice().reverse().map((x) => (
          <li key={x.id} className="flex items-center gap-3 px-3 py-2 text-[13px]">
            <span className="min-w-0 flex-1 truncate">{x.title}</span>
            <span className="shrink-0 text-[12px] text-[var(--w-text-2)]">{fmtDateTime(x.startsAt)}</span>
            <StatusChip s={x.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Lịch (agenda theo tuần) ────────────────────────────────────

type Entry = { kind: 'session'; at: string; s: CalSession } | { kind: 'item'; at: string; i: CalItem };

function weekStart(iso: string) {
  const d = new Date(iso);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function Agenda({ data, manage, onSheet, classId }: { data: CalendarView; manage: boolean; onSheet: (s: CalSession) => void; classId: number }) {
  const { t, fmtDate, intl } = useWT();
  const qc = useQueryClient();
  const [past, setPast] = useState(false);
  const [confirm, setConfirm] = useState<CalSession | null>(null);
  const upd = useMutation({ mutationFn: (v: { s: CalSession; status: 'SCHEDULED' | 'CANCELLED' }) => classroomApi.updateSession(classId, v.s.id, { status: v.status }), onSuccess: () => qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) }), onError: (err) => toast.error(workError(err)) });
  const del = useMutation({ mutationFn: (s: CalSession) => classroomApi.deleteSession(classId, s.id), onSuccess: () => { setConfirm(null); void qc.invalidateQueries({ queryKey: classroomKeys.calendar(classId) }); }, onError: (err) => toast.error(workError(err)) });
  const weeks = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const entries: Entry[] = [
      ...data.sessions.map((s) => ({ kind: 'session' as const, at: s.startsAt, s })),
      ...data.items.map((i) => ({ kind: 'item' as const, at: i.startsAt, i })),
    ].filter((e) => past || new Date(e.at).getTime() >= today.getTime() - (manage ? 0 : 0))
      .sort((a, b) => a.at.localeCompare(b.at));
    const m = new Map<number, Entry[]>();
    for (const e of entries) { const k = weekStart(e.at).getTime(); m.set(k, [...(m.get(k) ?? []), e]); }
    return [...m.entries()].slice(0, past ? 60 : 8);
  }, [data, past, manage]);
  const hidden = useMemo(() => { const today = new Date(); today.setHours(0, 0, 0, 0); return data.sessions.filter((s) => new Date(s.startsAt) < today).length; }, [data]);
  const hm = (iso: string) => new Date(iso).toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit' });
  const dayFmt: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: undefined };
  return (
    <div className="space-y-4">
      {hidden > 0 && (
        <button type="button" className="text-[12.5px] text-[var(--w-accent-text,var(--w-accent))] hover:underline" onClick={() => setPast((p) => !p)}>
          {past ? t('c9a.hidePast') : t('c9a.showPast', { count: hidden })}
        </button>
      )}
      {!weeks.length && <EmptyState icon={<CalendarDays size={20} />} title={t('c9a.calendarEmpty')} body={manage ? t('c9a.calendarEmptyTeacher') : t('c9a.calendarEmptyStudent')} />}
      {weeks.map(([k, list]) => (
        <section key={k} aria-label={t('c9a.weekOf', { date: fmtDate(new Date(k), { day: 'numeric', month: 'short' }) })}>
          <h4 className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-2)]">{t('c9a.weekOf', { date: fmtDate(new Date(k), { day: 'numeric', month: 'short', year: 'numeric' }) })}</h4>
          <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
            {list.map((e) => e.kind === 'item' ? (
              <li key={`i${e.i.refType}${e.i.refId}`} className="flex items-center gap-3 px-3 py-2">
                <span className="w-[120px] shrink-0 text-[12px] text-[var(--w-text-2)]">{fmtDate(e.at, dayFmt)}<br />{hm(e.at)}</span>
                <ClipboardList size={15} className="shrink-0 text-[var(--w-orange-text,var(--w-accent))]" aria-hidden="true" />
                <span className="min-w-0 flex-1 text-[13.5px]">
                  <span className="mr-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c9a.due')}</span>
                  {e.i.url ? <Link href={e.i.url} className="font-medium hover:underline">{e.i.title}</Link> : <span className="font-medium">{e.i.title}</span>}
                </span>
              </li>
            ) : (
              <li key={`s${e.s.id}`} className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2', e.s.status === 'CANCELLED' && 'bg-[var(--w-sunken)]')}>
                <span className="w-[120px] shrink-0 text-[12px] text-[var(--w-text-2)]">{fmtDate(e.at, dayFmt)}<br />{hm(e.s.startsAt)}–{hm(e.s.endsAt)}</span>
                <CalendarDays size={15} className="shrink-0 text-[var(--w-accent)]" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className={cn('block truncate text-[13.5px] font-medium', e.s.status === 'CANCELLED' && 'line-through')}>{e.s.title}</span>
                  <span className="flex flex-wrap gap-x-2 text-[12px] text-[var(--w-text-2)]">
                    {e.s.status === 'CANCELLED' && <span>{t('c9a.cancelled')}</span>}
                    {e.s.location && <span><MapPin size={11} className="mr-0.5 inline" aria-hidden="true" />{e.s.location}</span>}
                    {e.s.meetingUrl && <a href={e.s.meetingUrl} target="_blank" rel="noopener noreferrer" className="hover:underline"><Video size={11} className="mr-0.5 inline" aria-hidden="true" />{t('c9a.joinOnline')}</a>}
                    {e.s.seriesId && <span><Repeat size={11} className="mr-0.5 inline" aria-hidden="true" />{t('c9a.recurring')}</span>}
                  </span>
                </span>
                {e.s.checkinOpen && <span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--w-green-text)]">{t('c9a.checkinLive')}</span>}
                {manage ? (
                  <span className="flex shrink-0 items-center gap-1">
                    {(e.s.marked ?? 0) > 0 && <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{t('c9a.markedN', { n: e.s.marked ?? 0, total: data.students })}</span>}
                    {e.s.status !== 'CANCELLED' && <button type="button" data-testid={`c9a-sheet-${e.s.id}`} className="w-btn w-btn-sm" onClick={() => onSheet(e.s)}><CheckCircle2 size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.takeAttendance')}</span></button>}
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={e.s.status === 'CANCELLED' ? t('c9a.restoreSession') : t('c9a.cancelSession')} title={e.s.status === 'CANCELLED' ? t('c9a.restoreSession') : t('c9a.cancelSession')}
                      onClick={() => upd.mutate({ s: e.s, status: e.s.status === 'CANCELLED' ? 'SCHEDULED' : 'CANCELLED' })}>{e.s.status === 'CANCELLED' ? <Undo2 size={13} /> : <XCircle size={13} />}</button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9a.deleteSession')} title={t('c9a.deleteSession')} onClick={() => setConfirm(e.s)}><Trash2 size={13} /></button>
                  </span>
                ) : <StatusChip s={e.s.myStatus} />}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} title={t('c9a.deleteSession')} body={t('c9a.deleteSessionBody')} confirmLabel={t('c9a.delete')} onConfirm={() => confirm && del.mutate(confirm)} pending={del.isPending} />
    </div>
  );
}

// ─── Tab ────────────────────────────────────────────────────────

export default function CalendarTab({ cls }: ClassSlotProps) {
  const { t } = useWT();
  const qc = useQueryClient();
  const search = useSearchParams();
  const prefill = (search?.get('checkin') ?? '').replace(/\D/g, '').slice(0, 6);
  const [view, setView] = useState<'schedule' | 'attendance'>('schedule');
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sheetFor, setSheetFor] = useState<CalSession | null>(null);
  const [delSeries, setDelSeries] = useState<number | null>(null);
  const q = useQuery({ queryKey: classroomKeys.calendar(cls.id), queryFn: () => classroomApi.calendar(cls.id), refetchInterval: 30_000 });
  const ics = useMutation({ mutationFn: () => classroomApi.icsBlob(cls.id), onSuccess: (b) => saveBlob(b, `${cls.classCode}-calendar.ics`), onError: (err) => toast.error(workError(err)) });
  const rmSeries = useMutation({ mutationFn: (sid: number) => classroomApi.deleteSeries(cls.id, sid), onSuccess: (r) => { setDelSeries(null); toast.success(t('c9a.seriesDeleted', { count: r.removedSessions })); void qc.invalidateQueries({ queryKey: classroomKeys.calendar(cls.id) }); }, onError: (err) => toast.error(workError(err)) });

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;
  const d = q.data;
  const manage = d.manage;
  const openForMe = d.sessions.find((s) => s.checkinOpen && !s.myStatus);
  return (
    <div className="space-y-4">
      {!manage && d.isStudent && (openForMe || prefill) && <CheckinCard classId={cls.id} prefill={prefill} session={openForMe} />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label={t('c9a.calendarViews')} className="inline-flex rounded-[8px] border border-[var(--w-border)] p-0.5">
          {(['schedule', 'attendance'] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={cn('rounded-[6px] px-3 py-1 text-[13px] font-medium', view === v ? 'bg-[var(--w-sunken)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t(v === 'schedule' ? 'c9a.viewSchedule' : manage ? 'c9a.viewAttendance' : 'c9a.myAttendance')}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {manage && view === 'schedule' && (
            <>
              <button type="button" data-testid="c9a-add-series" className="w-btn w-btn-sm w-btn-primary" onClick={() => setSeriesOpen(true)}><Repeat size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.addSchedule')}</span></button>
              <button type="button" className="w-btn w-btn-sm" onClick={() => setSessionOpen(true)}><CalendarPlus size={13} aria-hidden="true" /><span className="ml-1">{t('c9a.addSession')}</span></button>
            </>
          )}
          <button type="button" className="w-btn w-btn-sm" disabled={ics.isPending} onClick={() => ics.mutate()}>{ics.isPending ? <Spinner size={12} /> : <Download size={13} aria-hidden="true" />}<span className="ml-1">{t('c9a.exportIcs')}</span></button>
        </div>
      </div>
      {view === 'schedule' ? (
        <>
          {manage && d.series.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label={t('c9a.schedules')}>
              {d.series.map((s) => (
                <li key={s.id} className="flex items-center gap-1.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] py-1 pl-2.5 pr-1 text-[12.5px]">
                  <Repeat size={12} className="text-[var(--w-text-3)]" aria-hidden="true" />
                  <span className="font-medium">{s.title}</span><span className="text-[var(--w-text-2)]">· {t('c9a.sessionsN', { count: s.sessions })}</span>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('c9a.deleteSchedule')} ${s.title}`} onClick={() => setDelSeries(s.id)}><Trash2 size={12} /></button>
                </li>
              ))}
            </ul>
          )}
          <Agenda data={d} manage={manage} onSheet={setSheetFor} classId={cls.id} />
        </>
      ) : manage ? <TeacherStats classId={cls.id} /> : <MyStats classId={cls.id} />}
      {manage && (
        <>
          <SeriesDialog classId={cls.id} timezone={d.timezone} open={seriesOpen} onClose={() => setSeriesOpen(false)} />
          <SessionDialog classId={cls.id} open={sessionOpen} onClose={() => setSessionOpen(false)} />
          <SheetDialog classId={cls.id} session={sheetFor} onClose={() => setSheetFor(null)} />
          <ConfirmDialog open={delSeries !== null} onClose={() => setDelSeries(null)} title={t('c9a.deleteSchedule')} body={t('c9a.deleteScheduleBody')} confirmLabel={t('c9a.delete')} onConfirm={() => delSeries !== null && rmSeries.mutate(delSeries)} pending={rmSeries.isPending} />
        </>
      )}
    </div>
  );
}
