'use client';

/**
 * Đợt S4 — hai thẻ mới của trang Reports (mô-đun reports):
 *   - Client weekly: lịch gửi tự động (thứ, giờ, múi giờ, có nêu rủi ro/CR không), XEM TRƯỚC đúng bản khách
 *     nhận, "AI polish" (chỉ khi bấm — dùng weeklyReport audience client), gửi tay, lịch sử, in PDF.
 *   - Steering: báo cáo nội bộ (cùng nguồn + tài chính chỉ khi người xem thấy tiền + RAID + khối lượng việc).
 * In PDF = trang in được + window.print (khối `.w-cert` — work.css @media print), không thêm thư viện.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, History, Mail, Presentation, Printer, Send, Sparkles } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { errorCodeOf } from '@/lib/work-ctw-api';
import { addDays, s4Api, s4Keys, todayVn, type ReportData, type ReportSchedule } from '@/lib/work-s4-api';
import { wfmt, wt } from '@/components/work/i18n';

/** Tên thứ theo ngôn ngữ đang chọn (1/1/2024 là thứ Hai). */
const weekdays = () => Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(wfmt.intl(), { weekday: 'long' }));
import { Dialog, EmptyState, Field, PageLoading, Spinner, formatDate, relativeTime } from '../ui';
import { ConfirmDialog, Select, Switch } from '../settings/shared';
import { Pill } from '../studio/shared';
import ReportDocument from './ReportDocument';

/** In một báo cáo: dựng bản giấy ẩn (chỉ hiện khi in) rồi gọi window.print. */
export function usePrintReport() {
  const [job, setJob] = useState<{ data: ReportData; polished?: string | null; title?: string } | null>(null);
  useEffect(() => {
    if (!job) return;
    const t = setTimeout(() => { window.print(); setJob(null); }, 80);
    return () => clearTimeout(t);
  }, [job]);
  const node = job ? <div className="hidden print:block" aria-hidden="true"><ReportDocument data={job.data} polished={job.polished} title={job.title} paper /></div> : null;
  return { print: setJob, node };
}

function Period({ from, to, onChange }: { from: string; to: string; onChange: (p: { from: string; to: string }) => void }) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="text-[12px] text-[var(--w-text-3)]">{wt('agents.from')}<input type="date" className="w-input mt-0.5 block" value={from} max={to} onChange={(e) => onChange({ from: e.target.value, to })} /></label>
      <label className="text-[12px] text-[var(--w-text-3)]">{wt('agents.to')}<input type="date" className="w-input mt-0.5 block" value={to} min={from} onChange={(e) => onChange({ from, to: e.target.value })} /></label>
    </div>
  );
}

function ScheduleCard({ pid, s }: { pid: number; s: ReportSchedule }) {
  const qc = useQueryClient();
  const [f, setF] = useState(s);
  useEffect(() => setF(s), [s]);
  // CTW-3: bật LẦN ĐẦU ⇒ xem trước đúng bản khách nhận rồi mới xác nhận (backend trả 409 nếu thiếu confirm).
  const [confirmOpen, setConfirmOpen] = useState(false);
  const firstOn = f.enabled && !s.enabled && !!s.needsConfirmation;
  const firstPreview = useQuery({ queryKey: [...s4Keys.schedule(pid), 'confirm-preview'], queryFn: () => s4Api.preview(pid), enabled: confirmOpen });
  const save = useMutation({
    mutationFn: (confirm?: boolean) => s4Api.updateSchedule(pid, { enabled: f.enabled, weekday: f.weekday, hour: f.hour, timezone: f.timezone, includeRisks: f.includeRisks, includeChanges: f.includeChanges, ...(confirm ? { confirm: true } : {}) }),
    onSuccess: (r) => { setConfirmOpen(false); qc.setQueryData(s4Keys.schedule(pid), r); qc.invalidateQueries({ queryKey: s4Keys.all(pid) }); toast.success(r.enabled && !s.enabled ? wt('rep.schedOn') : wt('rep.schedSaved')); },
    onError: (e) => {
      if (errorCodeOf(e) === 'WORK_REPORT_CONFIRM_REQUIRED') { setConfirmOpen(true); return; }
      toast.error(workError(e));
    },
  });
  const onSave = () => (firstOn ? setConfirmOpen(true) : save.mutate(undefined));
  const ro = !s.canEdit;
  return (
    <div className="w-card p-4" data-testid="report-schedule">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CalendarClock size={15} className="text-[var(--w-text-3)]" />
        <h3 className="w-section-title">{wt('rep.autoWeekly')}</h3>
        <Pill tone={f.enabled ? 'green' : 'neutral'}>{f.enabled ? wt('common.on') : wt('common.off')}</Pill>
        <span className="ml-auto text-[12px] text-[var(--w-text-3)]">{s.clientPortal ? wt('rep.clientsReceive', { count: s.recipients }) : wt('rep.portalOff')}</span>
      </div>
      {s.enabled && s.clientPortal && s.recipients > 0 && (
        <p className="mb-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]" data-testid="sched-banner">
          <Mail size={12} className="mr-1 inline" />{wt('rep.goAuto', { c: s.cadence ?? wt('rep.everyWeek') })}
        </p>
      )}
      {!s.enabled && s.needsConfirmation && <p className="mb-3 text-[12.5px] text-[var(--w-text-3)]">{wt('rep.offDefault')}</p>}
      <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{wt('rep.builtFrom', { c: f.includeChanges ? wt('rep.bfChanges') : '', r: f.includeRisks ? wt('rep.bfRisks') : '' })}</p>
      <div className="grid gap-x-3 sm:grid-cols-[auto_150px_110px_minmax(0,1fr)]">
        <Field label={wt('rep.fSend')}><div className="flex h-9 items-center"><Switch checked={f.enabled} disabled={ro} onChange={(v) => setF({ ...f, enabled: v })} label={wt('rep.sendAuto')} /></div></Field>
        <Field label={wt('rep.fEvery')}><Select aria-label={wt('rep.weekday')} value={f.weekday} disabled={ro} onChange={(e) => setF({ ...f, weekday: Number(e.target.value) })} data-testid="sched-weekday">{weekdays().map((w, i) => <option key={w} value={i + 1}>{w}</option>)}</Select></Field>
        <Field label={wt('rep.fAt')}><Select aria-label={wt('rep.hour')} value={f.hour} disabled={ro} onChange={(e) => setF({ ...f, hour: Number(e.target.value) })}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>)}</Select></Field>
        <Field label={wt('rep.timeZone')}><input className="w-input" value={f.timezone} disabled={ro} onChange={(e) => setF({ ...f, timezone: e.target.value })} /></Field>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.includeChanges} disabled={ro} onChange={(e) => setF({ ...f, includeChanges: e.target.checked })} /> {wt('rep.inclChanges')}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.includeRisks} disabled={ro} onChange={(e) => setF({ ...f, includeRisks: e.target.checked })} data-testid="sched-risks" /> {wt('rep.inclRisks')}</label>
      </div>
      {!ro && <button type="button" className="w-btn w-btn-primary" disabled={save.isPending} onClick={onSave} data-testid="sched-save">{save.isPending && <Spinner size={12} />}{firstOn ? wt('rep.previewTurnOn') : wt('rep.saveSchedule')}</button>}
      {ro && <p className="text-[12px] text-[var(--w-text-3)]">{wt('rep.onlyAdminsSched')}</p>}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} width={860} title={wt('rep.turnOnQ')}
        footer={(
          <>
            <button type="button" className="w-btn" onClick={() => setConfirmOpen(false)}>{wt('common.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary" disabled={save.isPending || !firstPreview.data} onClick={() => save.mutate(true)} data-testid="sched-confirm">
              {save.isPending && <Spinner size={12} />}{wt('rep.looksRight')}
            </button>
          </>
        )}>
        <p className="mb-3 text-[13px]">
          {wt('rep.fromNow', { count: s.recipients, when: wt('rep.everyAt', { d: weekdays()[f.weekday - 1] ?? wt('rep.weekLc'), h: `${String(f.hour).padStart(2, '0')}:00`, tz: f.timezone }) })}
        </p>
        {firstPreview.isLoading ? <PageLoading rows={4} /> : !firstPreview.data ? <EmptyState title={wt('rep.previewFailed')} body={workError(firstPreview.error)} /> : (
          <div className="rounded-[10px] border border-[var(--w-border)] p-4"><ReportDocument data={firstPreview.data.data} /></div>
        )}
      </Dialog>
    </div>
  );
}

export function ClientWeeklyTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const [period, setPeriod] = useState(() => ({ from: addDays(todayVn(), -6), to: todayVn() }));
  const sched = useQuery({ queryKey: s4Keys.schedule(pid), queryFn: () => s4Api.schedule(pid) });
  const pv = useQuery({ queryKey: s4Keys.preview(pid, period.from, period.to), queryFn: () => s4Api.preview(pid, period.from, period.to) });
  const hist = useQuery({ queryKey: s4Keys.history(pid, 'CLIENT_WEEKLY'), queryFn: () => s4Api.history(pid, 'CLIENT_WEEKLY') });
  const [polished, setPolished] = useState<string | null>(null);
  // CTW-8: ngôn ngữ bản AI polish — Auto = theo ngôn ngữ dự án.
  const [polishLang, setPolishLang] = useState<'' | 'en' | 'vi'>('');
  const [confirm, setConfirm] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const one = useQuery({ queryKey: s4Keys.report(pid, openId ?? 0), queryFn: () => s4Api.report(pid, openId!), enabled: !!openId });
  const { print, node } = usePrintReport();
  const canSend = !!config.permissions.sendClientReports;
  const polish = useMutation({ mutationFn: () => s4Api.polish(pid, polishLang || undefined), onSuccess: (r) => setPolished(r.markdown), onError: (e) => toast.error(workError(e, wt('rep.polishFailed'))) });
  const send = useMutation({
    mutationFn: () => s4Api.send(pid, { ...period, bodyMarkdown: polished, aiPolished: !!polished }),
    onSuccess: (r) => { setConfirm(false); setPolished(null); qc.invalidateQueries({ queryKey: s4Keys.history(pid, 'CLIENT_WEEKLY') }); toast.success(wt('rep.sentTo', { count: r.recipientCount })); },
    onError: (e) => { setConfirm(false); toast.error(workError(e)); },
  });
  return (
    <div className="space-y-4">
      {sched.data && <ScheduleCard pid={pid} s={sched.data} />}
      <div className="w-card p-4">
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1"><h3 className="w-section-title">{wt('rep.previewExact')}</h3><p className="text-[12px] text-[var(--w-text-3)]">{wt('rep.onlyShared')}</p></div>
          <Period {...period} onChange={setPeriod} />
        </div>
        {pv.isLoading ? <PageLoading rows={4} /> : !pv.data ? <EmptyState title={wt('rep.buildFailed')} body={workError(pv.error)} /> : (
          <>
            <div className="rounded-[10px] border border-[var(--w-border)] p-4 md:p-6"><ReportDocument data={pv.data.data} polished={polished} /></div>
            {polished !== null && (
              <div className="mt-3">
                <Field label={wt('rep.polishedLabel')}>
                  <textarea className="w-input font-mono text-[12.5px]" rows={8} value={polished} onChange={(e) => setPolished(e.target.value)} data-testid="report-polished" />
                </Field>
                <button type="button" className="w-btn w-btn-sm" onClick={() => setPolished(null)}>{wt('rep.removeAiSummary')}</button>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="w-btn" onClick={() => print({ data: pv.data!.data, polished })} data-testid="report-print"><Printer size={14} />{wt('rep.printPdf')}</button>
              {canSend && config.permissions.useAi && (
                <Select aria-label={wt('rep.polishLang')} value={polishLang} onChange={(e) => setPolishLang(e.target.value as '' | 'en' | 'vi')} className="!w-auto" data-testid="report-polish-lang">
                  <option value="">{wt('rep.langAuto')}</option><option value="en">English</option><option value="vi">Tiếng Việt</option>
                </Select>
              )}
              {canSend && config.permissions.useAi && <button type="button" className="w-btn" disabled={polish.isPending} onClick={() => polish.mutate()} title={wt('rep.polishTitle')} data-testid="report-polish">{polish.isPending ? <Spinner size={12} /> : <Sparkles size={14} />}{wt('rep.aiPolish')}</button>}
              {canSend && <button type="button" className="w-btn w-btn-primary" disabled={!pv.data.clientPortal || !pv.data.recipients} onClick={() => setConfirm(true)} data-testid="report-send"><Send size={14} />{wt('rep.sendNow')}</button>}
              {!pv.data.recipients && <span className="self-center text-[12px] text-[var(--w-text-3)]">{wt('rep.inviteClient')}</span>}
            </div>
          </>
        )}
      </div>
      <div className="w-card p-4">
        <div className="mb-2 flex items-center gap-2"><History size={15} className="text-[var(--w-text-3)]" /><h3 className="w-section-title">{wt('rep.sentReports')}</h3></div>
        {!hist.data?.length ? <p className="text-[13px] text-[var(--w-text-3)]">{wt('rep.noReportsSent')}</p> : (
          <ul className="divide-y divide-[var(--w-border)]" data-testid="report-history">
            {hist.data.map((r) => (
              <li key={r.id}>
                <button type="button" className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 py-2 text-left hover:bg-[var(--w-hover)]" onClick={() => setOpenId(r.id)}>
                  <span className="tabular-nums text-[12px] text-[var(--w-text-3)]">#{r.number}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{r.title}</span>
                  <Pill tone={r.source === 'AUTO' ? 'blue' : 'neutral'}>{r.source === 'AUTO' ? wt('rep.automatic') : r.aiPolished ? wt('rep.manualAi') : wt('rep.manual')}</Pill>
                  <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><Mail size={12} />{r.recipientCount}</span>
                  <span className="text-[12px] text-[var(--w-text-3)]">{r.sentAt ? relativeTime(r.sentAt) : wt('rep.notSent')}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => send.mutate()} pending={send.isPending} danger={false} confirmLabel={wt('rep.sendReport')}
        title={wt('rep.sendQ')} body={<>{wt('rep.goesTo', { count: pv.data?.recipients ?? 0 })} {polished ? wt('rep.polishedIncl') : ''}</>} />
      <Dialog open={!!openId} onClose={() => setOpenId(null)} width={860} title={one.data ? wt('rep.reportN', { n: one.data.number }) : wt('rep.report')}
        footer={one.data && <button type="button" className="w-btn" onClick={() => print({ data: one.data!.data, polished: one.data!.aiPolished ? one.data!.bodyMarkdown : null })}><Printer size={14} />{wt('rep.printPdf')}</button>}>
        {!one.data ? <PageLoading rows={3} /> : <ReportDocument data={one.data.data} polished={one.data.aiPolished ? one.data.bodyMarkdown : null} />}
      </Dialog>
      {node}
    </div>
  );
}

export function SteeringTab({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const [period, setPeriod] = useState(() => ({ from: addDays(todayVn(), -13), to: todayVn() }));
  const q = useQuery({ queryKey: s4Keys.steering(pid, period.from, period.to), queryFn: () => s4Api.steering(pid, period.from, period.to) });
  const { print, node } = usePrintReport();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="w-section-title">{wt('rep.rdSteering')}</h3>
          <p className="text-[12px] text-[var(--w-text-3)]">{wt('rep.steeringDesc', { f: q.data?.financeIncluded ? wt('rep.andFinance') : '' })} {q.data && !q.data.financeIncluded && config.modules?.finance ? wt('rep.financeAdmins') : ''}</p>
        </div>
        <Period {...period} onChange={setPeriod} />
        <button type="button" className="w-btn" disabled={!q.data} onClick={() => q.data && print({ data: q.data.data })} data-testid="steering-print"><Printer size={14} />{wt('rep.printPdf')}</button>
        <Link href={`/work/${config.workspace.slug}/${config.key}/present`} className="w-btn w-btn-primary" data-testid="open-present"><Presentation size={14} />{wt('rep.present')}</Link>
      </div>
      {q.isLoading ? <PageLoading rows={4} /> : !q.data ? <EmptyState title={wt('rep.buildFailed')} body={workError(q.error)} /> : (
        <div className="w-card p-4 md:p-6"><ReportDocument data={q.data.data} /></div>
      )}
      <p className="text-[12px] text-[var(--w-text-3)]">{wt('rep.generatedNote', { d: formatDate(todayVn()) })}</p>
      {node}
    </div>
  );
}
