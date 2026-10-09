'use client';

/**
 * CT Work K-2 — tab "Chuyên cần" của trang Họp: tỉ lệ chuyên cần theo người trong một kỳ (mặc định 30 ngày) + ma trận
 * người × cuộc họp, và (ADMIN dự án) cấu hình họp: hạn lưu audio, trần phiên âm/ngày, nhắc trước giờ họp.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { k2Api, k2Keys, type Attendance } from '@/lib/work-k2-api';
import { EmptyState, PageLoading, Spinner, UserAvatar } from '../ui';
import { Section } from '../governance/shared';
import { useWT, type WKey } from '@/components/work/i18n';

const day = (d: Date) => d.toISOString().slice(0, 10);
const SHORT: Record<Attendance, string> = { PRESENT: '✓', LATE: 'L', EXCUSED: 'E', ABSENT: '✗' };
const COLOR: Record<Attendance, string> = { PRESENT: 'text-[var(--w-green-text)]', LATE: 'text-[var(--w-orange-text)]', EXCUSED: 'text-[var(--w-accent-text)]', ABSENT: 'text-[var(--w-red-text)]' };

function SettingsCard({ pid }: { pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: k2Keys.settings(pid), queryFn: () => k2Api.settings(pid) });
  const [f, setF] = useState({ retention: '30', limit: '', reminder: '10', chat: true });
  useEffect(() => {
    if (q.data) setF({ retention: String(q.data.audioRetentionDays), limit: q.data.sttDailyLimit === null ? '' : String(q.data.sttDailyLimit), reminder: String(q.data.reminderMinutes), chat: q.data.remindInChat });
  }, [q.data]);
  const save = useMutation({
    mutationFn: () => k2Api.saveSettings(pid, {
      audioRetentionDays: Math.min(365, Math.max(1, Number(f.retention) || 30)),
      sttDailyLimit: f.limit.trim() === '' ? null : Math.max(0, Number(f.limit) || 0),
      reminderMinutes: Math.min(1440, Math.max(0, Number(f.reminder) || 0)),
      remindInChat: f.chat,
    }),
    onSuccess: (d) => { qc.setQueryData(k2Keys.settings(pid), d); toast.success(t('meeting2.settingsSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  if (!q.data) return null;
  const can = !!q.data.canManage;
  return (
    <Section title={t('meeting2.settings')} action={can && <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {t('common.save')}</button>}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="text-[12.5px]"><span className="mb-1 block font-medium text-[var(--w-text-2)]">{t('meeting2.retentionDays')}</span>
          <input className="w-input w-full" inputMode="numeric" disabled={!can} value={f.retention} onChange={(e) => setF({ ...f, retention: e.target.value.replace(/\D/g, '').slice(0, 3) })} /></label>
        <label className="text-[12.5px]"><span className="mb-1 block font-medium text-[var(--w-text-2)]">{t('meeting2.sttLimit')}</span>
          <input className="w-input w-full" inputMode="numeric" disabled={!can} value={f.limit} placeholder={t('meeting2.defaultN', { n: q.data.effectiveSttDailyLimit })} onChange={(e) => setF({ ...f, limit: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></label>
        <label className="text-[12.5px]"><span className="mb-1 block font-medium text-[var(--w-text-2)]">{t('meeting2.reminderMin')}</span>
          <input className="w-input w-full" inputMode="numeric" disabled={!can} value={f.reminder} onChange={(e) => setF({ ...f, reminder: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-[13px]"><input type="checkbox" disabled={!can} checked={f.chat} onChange={(e) => setF({ ...f, chat: e.target.checked })} /> {t('meeting2.remindChat')}</label>
      <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{q.data.sttConfigured ? t('meeting2.settingsHint') : t('meeting2.noKey')}</p>
    </Section>
  );
}

export default function AttendanceReport({ config }: { config: ProjectConfig }) {
  const { t, fmtShortDate } = useWT();
  const pid = config.id;
  const [from, setFrom] = useState(() => day(new Date(Date.now() - 30 * 86_400_000)));
  const [to, setTo] = useState(() => day(new Date(Date.now() + 86_400_000)));
  const q = useQuery({ queryKey: k2Keys.attendance(pid, from, to), queryFn: () => k2Api.attendance(pid, `${from}T00:00:00.000Z`, `${to}T23:59:59.999Z`) });
  const base = `/work/${config.workspace.slug}/${config.key}/meetings`;
  return (
    <div className="space-y-4">
      <Section title={t('meeting2.attendanceReport')} action={<>
        <label className="flex items-center gap-1 text-[12.5px] text-[var(--w-text-2)]">{t('meeting2.from')} <input type="date" className="w-input h-7" value={from} onChange={(e) => e.target.value && setFrom(e.target.value)} /></label>
        <label className="flex items-center gap-1 text-[12.5px] text-[var(--w-text-2)]">{t('meeting2.to')} <input type="date" className="w-input h-7" value={to} onChange={(e) => e.target.value && setTo(e.target.value)} /></label>
      </>}>
        {q.isLoading ? <PageLoading rows={3} /> : !q.data ? <EmptyState title={t('meeting2.loadFail')} body={workError(q.error)} /> : !q.data.people.length ? (
          <p className="text-[13px] text-[var(--w-text-3)]">{t('meeting2.noMeetingsPeriod')}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-[13px]" data-testid="k2-attendance-report">
                <thead>
                  <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-3)]">
                    <th className="py-2 pr-3 font-medium">{t('meeting2.person')}</th>
                    <th className="px-2 py-2 text-right font-medium">{t('meeting2.rate')}</th>
                    {(['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as Attendance[]).map((a) => <th key={a} className="px-2 py-2 text-right font-medium">{t(`meeting2.att_${a}` as WKey)}</th>)}
                    <th className="px-2 py-2 text-right font-medium">{t('meeting2.invitedCol')}</th>
                    <th className="px-2 py-2 text-right font-medium">RSVP ✓/?/✗</th>
                  </tr>
                </thead>
                <tbody>
                  {q.data.people.map((p) => (
                    <tr key={p.userId} className="border-b border-[var(--w-border)] last:border-0">
                      <td className="py-2 pr-3"><span className="flex min-w-0 items-center gap-2">{p.user && <UserAvatar user={p.user} size={20} />}<span className="truncate">{p.user ? userName(p.user) : `#${p.userId}`}</span></span></td>
                      <td className="px-2 py-2 text-right font-semibold tabular-nums">{p.rate === null ? '—' : `${p.rate}%`}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.present}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.late}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.excused}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.absent}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.invited}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{p.rsvpYes}/{p.rsvpMaybe}/{p.rsvpNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{t('meeting2.rateHint')}</p>
            {q.data.meetings.some((m) => m.tracked) && (
              <div className="mt-4 overflow-x-auto">
                <table className="text-[12.5px]" aria-label={t('meeting2.matrix')}>
                  <thead>
                    <tr>
                      <th className="py-1 pr-3 text-left font-medium text-[var(--w-text-3)]">{t('meeting2.person')}</th>
                      {q.data.meetings.filter((m) => m.tracked).map((m) => (
                        <th key={m.number} className="px-1.5 py-1 font-medium"><Link href={`${base}/${m.number}`} className="font-mono text-[11.5px] text-[var(--w-accent-text)] hover:underline" title={`${m.title} · ${fmtShortDate(m.startsAt)}`}>M-{m.number}</Link></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {q.data.people.map((p) => (
                      <tr key={p.userId}>
                        <td className="max-w-[180px] truncate py-1 pr-3">{p.user ? userName(p.user) : `#${p.userId}`}</td>
                        {q.data!.meetings.filter((m) => m.tracked).map((m) => {
                          const a = m.cells[String(p.userId)];
                          return <td key={m.number} className={`px-1.5 py-1 text-center font-semibold ${a ? COLOR[a] : 'text-[var(--w-text-3)]'}`} title={a ? t(`meeting2.att_${a}` as WKey) : t('meeting2.notInvited')}>{a ? SHORT[a] : String(p.userId) in m.cells ? '·' : ''}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('meeting2.legend')}</p>
              </div>
            )}
          </>
        )}
      </Section>
      <SettingsCard pid={pid} />
    </div>
  );
}
